"""main.py — FastAPI 入口
商业逻辑：两个核心接口
  POST /audit   — 免费审计（50 条查询，得出 GEO Score）
  POST /monitor — 付费监控（200 条查询，每周自动运行）
"""
import asyncio
import os
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from query_engine import QueryEngine
from scorer import calculate_geo_score, GEOReport

load_dotenv()

app = FastAPI(title="Avanti GEO API", version="1.0.0")

# CORS — 允许 Next.js 前端调用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://avantia2a.com", "https://www.avantia2a.com", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = QueryEngine()


# ── Request / Response 模型 ──────────────────────────────────────────
class AuditRequest(BaseModel):
    brand: str              # 品牌名称，如 "NOCO"
    category: str           # 类目，如 "car jump starters"
    usecase: str = "everyday use"
    known_competitors: List[str] = []
    email: Optional[str] = None  # 可选，用于发送报告


class AuditResponse(BaseModel):
    run_id: str
    brand: str
    category: str
    geo_score: float
    sov: float
    total_queries: int
    brand_mentions: int
    avg_position: float
    top_competitors: list
    strengths: List[str]
    gaps: List[str]
    action_plan: List[str]
    intent_breakdown: dict
    completed_at: str


# ── 健康检查 ──
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


# ── 免费审计（50 条查询）──
@app.post("/audit", response_model=AuditResponse)
async def run_audit(req: AuditRequest):
    """
    免费审计接口。
    商业逻辑：尽快返回真实数据，不展示 mock，
    让客户亲眼看到自己尅岕的得分，然后付费升级监控。
    """
    if not req.brand.strip() or not req.category.strip():
        raise HTTPException(status_code=400, detail="brand and category are required")

    # 运行查询（50 条）
    results = await engine.run_audit(
        brand=req.brand,
        category=req.category,
        usecase=req.usecase,
        known_competitors=req.known_competitors,
        max_queries=50,
    )

    if not results:
        raise HTTPException(status_code=500, detail="Query engine returned no results")

    # 计算 GEO Score
    report: GEOReport = calculate_geo_score(results, req.brand)

    # 生成 run_id
    import hashlib, time
    run_id = hashlib.md5(f"{req.brand}{req.category}{time.time()}".encode()).hexdigest()[:12]

    # TODO: 存入 Supabase—加入 Supabase 公口单元后启用
    # await supabase.table("runs").insert({...}).execute()

    return AuditResponse(
        run_id=run_id,
        brand=report.brand,
        category=report.category,
        geo_score=report.geo_score,
        sov=report.sov,
        total_queries=report.total_queries,
        brand_mentions=report.brand_mentions,
        avg_position=report.avg_position,
        top_competitors=report.top_competitors,
        strengths=report.strengths,
        gaps=report.gaps,
        action_plan=report.action_plan,
        intent_breakdown=report.intent_breakdown,
        completed_at=datetime.utcnow().isoformat(),
    )


# ── 入口点（本地调试用）──
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
