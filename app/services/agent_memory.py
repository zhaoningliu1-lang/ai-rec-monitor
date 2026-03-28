"""Agent Memory Service — persistent memory for Seller Agent.

Abstraction layer designed for EverMemOS integration.
Currently uses in-memory store; swap to EverMemOS REST API when available.

EverMemOS API (when deployed):
  POST /api/v1/memories  — store a memory
  GET  /api/v1/memories/search  — recall memories by query

Reference: https://github.com/EverMind-AI/EverMemOS
"""

import hashlib
import json
import logging
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# ── In-memory store (replace with EverMemOS REST API) ──────────────────────

_memory_store: dict[str, list[dict]] = defaultdict(list)

# EverMemOS config (for future integration)
EVERMEMOS_BASE = "http://localhost:1995/api/v1"
EVERMEMOS_ENABLED = False  # Set True when EverMemOS is deployed


def _agent_id(brand: str) -> str:
    return f"seller-agent-{brand.lower().replace(' ', '-')}"


async def store_memory(brand: str, memory_type: str, content: dict) -> dict:
    """Store a memory for a brand's seller agent.

    memory_type: "scan_result" | "client_preference" | "trend_tracked" | "action_taken" | "opportunity_seen"
    """
    agent_id = _agent_id(brand)
    memory = {
        "agent_id": agent_id,
        "memory_type": memory_type,
        "content": content,
        "stored_at": datetime.now(timezone.utc).isoformat(),
        "memory_id": hashlib.md5(f"{agent_id}:{memory_type}:{json.dumps(content, default=str)[:200]}".encode()).hexdigest()[:12],
    }

    if EVERMEMOS_ENABLED:
        # Future: POST to EverMemOS
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     await client.post(f"{EVERMEMOS_BASE}/memories", json={
        #         "message_id": memory["memory_id"],
        #         "create_time": memory["stored_at"],
        #         "sender": agent_id,
        #         "content": json.dumps(content, default=str),
        #     })
        pass

    _memory_store[agent_id].append(memory)
    # Keep last 100 memories per agent
    if len(_memory_store[agent_id]) > 100:
        _memory_store[agent_id] = _memory_store[agent_id][-100:]

    logger.info("Stored memory for %s: type=%s", agent_id, memory_type)
    return memory


async def recall_memories(brand: str, query: str | None = None,
                          memory_type: str | None = None, limit: int = 10) -> list[dict]:
    """Recall memories for a brand's seller agent.

    If EverMemOS is enabled, uses semantic search. Otherwise, returns recent memories.
    """
    agent_id = _agent_id(brand)

    if EVERMEMOS_ENABLED:
        # Future: GET from EverMemOS with semantic search
        # import httpx
        # async with httpx.AsyncClient() as client:
        #     resp = await client.get(f"{EVERMEMOS_BASE}/memories/search", json={
        #         "query": query or f"Recent activity for {brand}",
        #         "user_id": agent_id,
        #         "memory_types": ["episodic_memory"],
        #         "retrieve_method": "hybrid",
        #     })
        #     return resp.json().get("result", {}).get("memories", [])
        pass

    memories = _memory_store.get(agent_id, [])

    if memory_type:
        memories = [m for m in memories if m.get("memory_type") == memory_type]

    if query:
        # Simple keyword matching (EverMemOS would do semantic search)
        query_lower = query.lower()
        memories = [m for m in memories
                    if query_lower in json.dumps(m.get("content", {}), default=str).lower()]

    return memories[-limit:]


async def get_agent_context(brand: str) -> dict:
    """Get a full context summary for a brand's seller agent.

    Returns structured memory that can be injected into Claude's prompt.
    """
    agent_id = _agent_id(brand)
    all_memories = _memory_store.get(agent_id, [])

    if not all_memories:
        return {"agent_id": agent_id, "has_memory": False, "memory_count": 0}

    # Categorize memories
    scans = [m for m in all_memories if m["memory_type"] == "scan_result"]
    preferences = [m for m in all_memories if m["memory_type"] == "client_preference"]
    trends = [m for m in all_memories if m["memory_type"] == "trend_tracked"]
    actions = [m for m in all_memories if m["memory_type"] == "action_taken"]

    # Find persistent trends (appeared in multiple scans)
    trend_counts: dict[str, int] = defaultdict(int)
    for scan in scans:
        for product in scan.get("content", {}).get("opportunities", []):
            name = product.get("product_name", "")
            if name:
                trend_counts[name] += 1
    persistent_trends = [{"product": k, "seen_count": v} for k, v in trend_counts.items() if v >= 2]

    return {
        "agent_id": agent_id,
        "has_memory": True,
        "memory_count": len(all_memories),
        "total_scans": len(scans),
        "last_scan": scans[-1]["stored_at"] if scans else None,
        "client_preferences": [p["content"] for p in preferences[-3:]],
        "persistent_trends": persistent_trends,
        "recent_actions": [a["content"] for a in actions[-5:]],
        "memory_backend": "evermemos" if EVERMEMOS_ENABLED else "in_memory",
    }


async def clear_memories(brand: str) -> dict:
    """Clear all memories for a brand's seller agent."""
    agent_id = _agent_id(brand)
    count = len(_memory_store.get(agent_id, []))
    _memory_store[agent_id] = []
    return {"agent_id": agent_id, "cleared": count}
