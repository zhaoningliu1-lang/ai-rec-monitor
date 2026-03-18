"""Authentication — register / login / me / password reset / API keys."""
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.emails import notify_admin_new_user, send_password_reset, send_welcome
from app.models import APIKey, SubscriptionStatus, SubscriptionTier, User

router = APIRouter(prefix="/auth", tags=["auth"])

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer = HTTPBearer(auto_error=False)


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    company_name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str | None
    company_name: str | None
    subscription_tier: str
    subscription_status: str
    subscription_current_period_end: datetime | None
    credit_balance: int


# ── Helpers ───────────────────────────────────────────────────────────────────

def _hash(password: str) -> str:
    return _pwd.hash(password)


def _verify(password: str, hashed: str) -> bool:
    return _pwd.verify(password, hashed)


def _create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    return jwt.encode(
        {"sub": user_id, "exp": expire},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


async def get_current_user_optional(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> "User | None":
    """Like get_current_user but returns None instead of raising 401."""
    if not creds:
        return None
    try:
        payload = jwt.decode(creds.credentials, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id: str = payload["sub"]
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user if user and user.is_active else None
    except Exception:
        return None


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id: str = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def _hash_api_key(raw_key: str) -> str:
    """SHA-256 hash for fast API key lookup."""
    return hashlib.sha256(raw_key.encode()).hexdigest()


async def _resolve_api_key(raw_key: str, db: AsyncSession) -> User | None:
    """Look up an API key, return its owning User, update last_used_at."""
    key_hash = _hash_api_key(raw_key)
    result = await db.execute(
        select(APIKey).where(APIKey.key_hash == key_hash, APIKey.is_active == True)  # noqa: E712
    )
    api_key = result.scalar_one_or_none()
    if not api_key:
        return None
    api_key.last_used_at = datetime.now(timezone.utc)
    await db.commit()
    user_result = await db.execute(select(User).where(User.id == api_key.user_id))
    user = user_result.scalar_one_or_none()
    return user if user and user.is_active else None


async def get_current_user_flexible(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Authenticate via JWT OR API key. Used by /api/v1 routes.
    Priority: 1) X-API-Key header, 2) Bearer avanti_... , 3) Bearer JWT.
    """
    if x_api_key:
        user = await _resolve_api_key(x_api_key, db)
        if user:
            return user
        raise HTTPException(status_code=401, detail="Invalid API key")

    if creds:
        token = creds.credentials
        if token.startswith("avanti_"):
            user = await _resolve_api_key(token, db)
            if user:
                return user
            raise HTTPException(status_code=401, detail="Invalid API key")
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            user_id: str = payload["sub"]
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user and user.is_active:
                return user
        except JWTError:
            pass

    raise HTTPException(status_code=401, detail="Not authenticated. Provide X-API-Key header or Bearer token.")


async def get_current_user_flexible_optional(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Like get_current_user_flexible but returns None instead of 401."""
    try:
        return await get_current_user_flexible(creds=creds, x_api_key=x_api_key, db=db)
    except HTTPException:
        return None


def _user_out(u: User) -> UserOut:
    return UserOut(
        id=str(u.id),
        email=u.email,
        full_name=u.full_name,
        company_name=u.company_name,
        subscription_tier=u.subscription_tier.value,
        subscription_status=u.subscription_status.value,
        subscription_current_period_end=u.subscription_current_period_end,
        credit_balance=u.credit_balance,
    )


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenOut, status_code=201)
async def register(body: RegisterIn, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=body.email,
        hashed_password=_hash(body.password),
        full_name=body.full_name,
        company_name=body.company_name,
        subscription_tier=SubscriptionTier.free,
        subscription_status=SubscriptionStatus.none,
        credit_balance=40,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    bg.add_task(send_welcome, body.email, body.full_name)
    bg.add_task(notify_admin_new_user, body.email, body.full_name, body.company_name)
    return TokenOut(access_token=_create_token(str(user.id)))


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not _verify(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenOut(access_token=_create_token(str(user.id)))


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return _user_out(user)


# ── Credits ───────────────────────────────────────────────────────────────────

class CreditUseIn(BaseModel):
    amount: int = Field(..., ge=1, le=100)
    reason: str = Field(default="manual", max_length=100)


@router.get("/credits")
async def get_credits(user: User = Depends(get_current_user)):
    return {
        "balance": user.credit_balance,
        "tier": user.subscription_tier.value,
        "is_paid": user.subscription_tier.value in ("growth", "scale", "enterprise"),
    }


@router.post("/credits/use")
async def use_credits(body: CreditUseIn, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Deduct credits for any feature. Returns updated balance."""
    if user.subscription_tier.value in ("growth", "scale", "enterprise"):
        return {"balance": user.credit_balance, "deducted": 0, "message": "Paid plans have unlimited usage."}
    if user.credit_balance < body.amount:
        raise HTTPException(
            status_code=429,
            detail={
                "code": "credits_exhausted",
                "balance": user.credit_balance,
                "required": body.amount,
                "message": "Not enough credits. Upgrade to continue.",
            },
        )
    user.credit_balance -= body.amount
    await db.commit()
    return {"balance": user.credit_balance, "deducted": body.amount}


# ── Password reset ─────────────────────────────────────────────────────────────

class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str
    new_password: str


_RESET_TOKEN_EXPIRE_HOURS = 1


@router.post("/forgot-password", status_code=200)
async def forgot_password(body: ForgotPasswordIn, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Generate a one-time reset token and email it. Always returns 200 to avoid email enumeration."""
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if user and user.is_active:
        token = secrets.token_urlsafe(32)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=_RESET_TOKEN_EXPIRE_HOURS)
        await db.commit()
        reset_url = f"{settings.site_url}/reset-password?token={token}"
        bg.add_task(send_password_reset, user.email, reset_url, user.full_name)
    return {"detail": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password", status_code=200)
async def reset_password(body: ResetPasswordIn, db: AsyncSession = Depends(get_db)):
    """Validate token and set a new password."""
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    result = await db.execute(select(User).where(User.password_reset_token == body.token))
    user = result.scalar_one_or_none()
    if not user or not user.password_reset_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    if user.password_reset_expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token has expired")
    user.hashed_password = _hash(body.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    await db.commit()
    return {"detail": "Password updated. You can now sign in."}


# ── API Key Management ────────────────────────────────────────────────────────

class APIKeyCreateIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class APIKeyOut(BaseModel):
    id: str
    name: str
    key_prefix: str
    is_active: bool
    last_used_at: datetime | None
    created_at: datetime


class APIKeyCreatedOut(APIKeyOut):
    raw_key: str


@router.post("/api-keys", response_model=APIKeyCreatedOut, status_code=201)
async def create_api_key(
    body: APIKeyCreateIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a new API key. The raw key is shown only once."""
    count = await db.scalar(
        select(func.count(APIKey.id)).where(APIKey.user_id == user.id, APIKey.is_active == True)  # noqa: E712
    )
    if (count or 0) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 active API keys per account.")

    raw_key = f"avanti_{secrets.token_hex(20)}"
    key_prefix = raw_key[:12]
    key_hash = _hash_api_key(raw_key)

    api_key = APIKey(
        user_id=user.id,
        name=body.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)

    return APIKeyCreatedOut(
        id=str(api_key.id),
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        is_active=api_key.is_active,
        last_used_at=api_key.last_used_at,
        created_at=api_key.created_at,
        raw_key=raw_key,
    )


@router.get("/api-keys", response_model=list[APIKeyOut])
async def list_api_keys(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all API keys for current user."""
    result = await db.execute(
        select(APIKey).where(APIKey.user_id == user.id).order_by(APIKey.created_at.desc())
    )
    keys = result.scalars().all()
    return [
        APIKeyOut(
            id=str(k.id),
            name=k.name,
            key_prefix=k.key_prefix,
            is_active=k.is_active,
            last_used_at=k.last_used_at,
            created_at=k.created_at,
        )
        for k in keys
    ]


@router.delete("/api-keys/{key_id}", status_code=204)
async def revoke_api_key(
    key_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke an API key."""
    result = await db.execute(
        select(APIKey).where(APIKey.id == key_id, APIKey.user_id == user.id)
    )
    api_key = result.scalar_one_or_none()
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    api_key.is_active = False
    await db.commit()
