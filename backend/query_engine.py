"""query_engine.py — AI 引擎查询执行器
支持 OpenAI GPT-4o-mini + Perplexity
"""
import asyncio
import os
from typing import List, Optional

import httpx
from openai import AsyncOpenAI
from dotenv import load_dotenv

from query_templates import BASE_TEMPLATES, QueryTemplate
from scorer import MentionResult, extract_brand_position, extract_competitors

load_dotenv()


class QueryEngine:
    def __init__(self):
        self.openai = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.perplexity_key = os.getenv("PERPLEXITY_API_KEY")
        self.concurrency = 5  # 同时请求数（防止 rate limit）

    def _build_queries(self, brand: str, category: str, usecase: str, competitor: str) -> List[QueryTemplate]:
        """将模板变量替换为实际查询"""
        filled = []
        for t in BASE_TEMPLATES:
            q = t.pattern
            q = q.replace("{brand}", brand)
            q = q.replace("{category}", category)
            q = q.replace("{usecase}", usecase)
            q = q.replace("{competitor}", competitor)
            filled.append(QueryTemplate(pattern=q, intent=t.intent, weight=t.weight))
        return filled

    async def _query_openai(self, question: str) -> str:
        """调用 GPT-4o-mini（快且便宜）"""
        try:
            resp = await self.openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful shopping assistant. Answer concisely with specific brand recommendations."},
                    {"role": "user", "content": question}
                ],
                max_tokens=300,
                temperature=0.3,
            )
            return resp.choices[0].message.content or ""
        except Exception as e:
            return f"ERROR: {e}"

    async def _query_perplexity(self, question: str) -> str:
        """调用 Perplexity API（实时网络搜索）"""
        if not self.perplexity_key:
            return ""
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={"Authorization": f"Bearer {self.perplexity_key}"},
                    json={
                        "model": "llama-3.1-sonar-small-128k-online",
                        "messages": [
                            {"role": "system", "content": "Answer with specific brand recommendations."},
                            {"role": "user", "content": question}
                        ],
                        "max_tokens": 300,
                    }
                )
                return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"ERROR: {e}"

    async def _run_single_query(self, template: QueryTemplate, brand: str, known_competitors: List[str]) -> List[MentionResult]:
        """对一条查询运行两个引擎并收集结果"""
        results = []

        # 并发调两个引擎
        gpt_resp, pplx_resp = await asyncio.gather(
            self._query_openai(template.pattern),
            self._query_perplexity(template.pattern),
        )

        for engine, response in [("openai", gpt_resp), ("perplexity", pplx_resp)]:
            if not response or response.startswith("ERROR"):
                continue
            position = extract_brand_position(response, brand)
            competitors = extract_competitors(response, brand, known_competitors)
            results.append(MentionResult(
                query=template.pattern,
                intent=template.intent,
                weight=template.weight,
                brand_position=position,
                competitors_mentioned=competitors,
                raw_response=response,
            ))

        return results

    async def run_audit(
        self,
        brand: str,
        category: str,
        usecase: str = "everyday use",
        competitor: str = "competing brands",
        known_competitors: Optional[List[str]] = None,
        max_queries: int = 50,
    ) -> List[MentionResult]:
        """
        执行完整审计：运行 max_queries 条查询，返回所有结果。
        免费版：max_queries=50，付费版：max_queries=200
        """
        templates = self._build_queries(brand, category, usecase, competitor)[:max_queries]
        known_competitors = known_competitors or []

        all_results: List[MentionResult] = []
        semaphore = asyncio.Semaphore(self.concurrency)

        async def bounded_query(t):
            async with semaphore:
                return await self._run_single_query(t, brand, known_competitors)

        # 并发运行全部查询
        batches = await asyncio.gather(*[bounded_query(t) for t in templates])
        for batch in batches:
            all_results.extend(batch)

        return all_results
