"""Transactional email helpers via Resend.

All sends are best-effort (no exception propagation) — email failures
must never break the main request flow.
"""
import asyncio
import logging
from datetime import datetime, timezone

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

TIER_LABEL = {"growth": "Monitor ($99/mo)", "scale": "Scale ($199/mo)"}


def _send(params: dict) -> None:
    """Synchronous Resend send. Call via asyncio.to_thread() from async code."""
    if not settings.resend_api_key:
        logger.debug("Resend not configured — skipping email to %s", params.get("to"))
        return
    import resend
    resend.api_key = settings.resend_api_key
    try:
        resend.Emails.send(params)
    except Exception:
        logger.exception("Failed to send email to %s", params.get("to"))


async def send_welcome(to_email: str, name: str | None = None) -> None:
    """Welcome email on new user registration."""
    display = name or to_email.split("@")[0]
    audit_url = f"{settings.site_url}/audit"
    html = f"""
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0f0f8;background:#09090f;padding:32px 24px;border-radius:12px">
  <div style="font-size:22px;font-weight:900;color:#ff6b35;margin-bottom:8px">AVANTI</div>
  <h1 style="font-size:24px;font-weight:800;margin:0 0 12px">Welcome, {display}.</h1>
  <p style="color:#a0a0c0;font-size:15px;line-height:1.6;margin:0 0 24px">
    You've joined the platform that shows you exactly where your brand stands in
    AI recommendations — and how to climb higher.
  </p>
  <a href="{audit_url}" style="display:inline-block;background:#ff6b35;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px">
    Run your first free audit →
  </a>
  <hr style="border:none;border-top:1px solid #25253f;margin:32px 0"/>
  <p style="color:#7070a0;font-size:12px;line-height:1.5">
    Avanti · AI Brand Visibility Platform<br/>
    <a href="{settings.site_url}/account" style="color:#7070a0">Manage account</a>
  </p>
</div>
"""
    await asyncio.to_thread(_send, {
        "from": settings.from_email,
        "to": [to_email],
        "subject": "Welcome to Avanti — run your first AI audit",
        "html": html,
    })


async def send_subscription_upgraded(to_email: str, tier: str, name: str | None = None) -> None:
    """Confirmation email when a subscription is activated."""
    display = name or to_email.split("@")[0]
    tier_label = TIER_LABEL.get(tier, tier.capitalize())
    account_url = f"{settings.site_url}/account"
    html = f"""
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0f0f8;background:#09090f;padding:32px 24px;border-radius:12px">
  <div style="font-size:22px;font-weight:900;color:#ff6b35;margin-bottom:8px">AVANTI</div>
  <h1 style="font-size:24px;font-weight:800;margin:0 0 12px">You're now on {tier_label}</h1>
  <p style="color:#a0a0c0;font-size:15px;line-height:1.6;margin:0 0 24px">
    Hi {display}, your subscription is active. Weekly monitoring runs will
    start automatically every Monday morning.
  </p>
  <a href="{account_url}" style="display:inline-block;background:#ff6b35;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px">
    Go to your account →
  </a>
  <hr style="border:none;border-top:1px solid #25253f;margin:32px 0"/>
  <p style="color:#7070a0;font-size:12px;line-height:1.5">
    Need to manage your billing? <a href="{account_url}" style="color:#7070a0">Visit your account</a>.<br/>
    Avanti · AI Brand Visibility Platform
  </p>
</div>
"""
    await asyncio.to_thread(_send, {
        "from": settings.from_email,
        "to": [to_email],
        "subject": f"Avanti {tier_label} — subscription confirmed",
        "html": html,
    })


async def send_password_reset(to_email: str, reset_url: str, name: str | None = None) -> None:
    """Password reset email with a one-hour expiry link."""
    display = name or to_email.split("@")[0]
    html = f"""
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0f0f8;background:#09090f;padding:32px 24px;border-radius:12px">
  <div style="font-size:22px;font-weight:900;color:#ff6b35;margin-bottom:8px">AVANTI</div>
  <h1 style="font-size:24px;font-weight:800;margin:0 0 12px">Reset your password</h1>
  <p style="color:#a0a0c0;font-size:15px;line-height:1.6;margin:0 0 24px">
    Hi {display}, click the button below to set a new password. This link expires in 1 hour.
  </p>
  <a href="{reset_url}" style="display:inline-block;background:#ff6b35;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px">
    Reset password →
  </a>
  <p style="color:#7070a0;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
</div>
"""
    await asyncio.to_thread(_send, {
        "from": settings.from_email,
        "to": [to_email],
        "subject": "Reset your Avanti password",
        "html": html,
    })


# ── Admin notifications ────────────────────────────────────────────────────────

def _slack(text: str) -> None:
    """Post a plain-text message to the admin Slack webhook (best-effort)."""
    if not settings.slack_webhook_url:
        return
    try:
        httpx.post(settings.slack_webhook_url, json={"text": text}, timeout=5)
    except Exception:
        logger.exception("Failed to post Slack notification")


async def notify_admin_new_user(email: str, name: str | None, company: str | None) -> None:
    """Notify admin (email + Slack) when a new user registers."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    display = name or "—"
    co = company or "—"

    # Slack
    await asyncio.to_thread(
        _slack,
        f"🆕 *New signup* — {email}\nName: {display} | Company: {co}\n{now}",
    )

    # Email
    html = f"""
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0f0f8;background:#09090f;padding:32px 24px;border-radius:12px">
  <div style="font-size:22px;font-weight:900;color:#ff6b35;margin-bottom:16px">AVANTI — New Signup</div>
  <table style="width:100%;font-size:14px;border-collapse:collapse">
    <tr><td style="color:#7070a0;padding:6px 0">Email</td><td style="font-weight:600">{email}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Name</td><td>{display}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Company</td><td>{co}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Time</td><td>{now}</td></tr>
  </table>
</div>
"""
    await asyncio.to_thread(_send, {
        "from": settings.from_email,
        "to": [settings.admin_email],
        "subject": f"[Avanti] New signup: {email}",
        "html": html,
    })


async def notify_admin_new_payment(email: str, name: str | None, tier: str) -> None:
    """Notify admin (email + Slack) when a user activates a paid subscription."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    tier_label = TIER_LABEL.get(tier, tier.capitalize())
    display = name or "—"

    # Slack
    await asyncio.to_thread(
        _slack,
        f"💰 *New payment* — {email} subscribed to *{tier_label}*\nName: {display}\n{now}",
    )

    # Email
    html = f"""
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0f0f8;background:#09090f;padding:32px 24px;border-radius:12px">
  <div style="font-size:22px;font-weight:900;color:#ff6b35;margin-bottom:16px">AVANTI — New Payment</div>
  <table style="width:100%;font-size:14px;border-collapse:collapse">
    <tr><td style="color:#7070a0;padding:6px 0">Email</td><td style="font-weight:600">{email}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Name</td><td>{display}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Plan</td><td style="color:#ff6b35;font-weight:700">{tier_label}</td></tr>
    <tr><td style="color:#7070a0;padding:6px 0">Time</td><td>{now}</td></tr>
  </table>
</div>
"""
    await asyncio.to_thread(_send, {
        "from": settings.from_email,
        "to": [settings.admin_email],
        "subject": f"[Avanti] 💰 New payment: {email} → {tier_label}",
        "html": html,
    })
