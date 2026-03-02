# AI Recommendation Monitor

Track how often AI assistants (GPT-4o-mini) mention your brand when answering buyer-intent questions — and how you compare against competitors.

## Quick Start (local)

```bash
# 1. Clone and enter the project
cd ai-rec-monitor

# 2. Set up environment
cp .env.example .env
# Edit .env: add your OPENAI_API_KEY

# 3. Start Postgres
docker compose up -d db

# 4. Install deps and run
pip install -r requirements.txt
uvicorn app.main:app --port 8001 --reload
```

Tables are created automatically on first startup.

## Quick Start (Docker, full stack)

```bash
cp .env.example .env   # add OPENAI_API_KEY
docker compose up --build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| POST | `/runs` | Create a new test run |
| GET | `/runs/{id}` | Poll run status |
| GET | `/runs/{id}/report` | View HTML report |

## Example curl Commands

```bash
# Health check
curl http://localhost:8001/health

# Create a test run (20 prompts for speed)
curl -X POST http://localhost:8001/runs \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Anker",
    "competitor_names": ["Belkin", "Ugreen", "Baseus"],
    "category": "USB-C chargers",
    "region": "US",
    "num_prompts": 20
  }'

# Poll until status = "done"
curl http://localhost:8001/runs/<run-id>

# View HTML report in browser
open http://localhost:8001/runs/<run-id>/report
```

## Supported Regions

| Code | Language | Notes |
|------|----------|-------|
| US | English | American buyer prompts |
| UK | English | British buyer prompts |
| DE | German + English | DACH market prompts |

## Architecture

```
POST /runs
  └─> Creates Run row (status=pending)
  └─> Fires BackgroundTask: run_job()
        └─> Generates N buyer-intent prompts
        └─> asyncio.gather() — up to 5 concurrent OpenAI calls
              └─> Each prompt: query → parse → INSERT prompt_results
        └─> Updates Run status to done/failed

GET /runs/{id}/report
  └─> Aggregates prompt_results
  └─> Renders Jinja2 HTML with metrics + competitor table
```

## Configuration

All settings via `.env`:

```
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_rec_monitor
OPENAI_MODEL=gpt-4o-mini          # default
OPENAI_MAX_CONCURRENCY=5          # default — concurrent API calls
OPENAI_TIMEOUT=30                 # seconds per call
OPENAI_MAX_RETRIES=3              # tenacity retries with exp backoff
```

## DB Schema

```sql
-- runs
id UUID PK, brand_name, competitor_names JSON, category, region,
num_prompts, status ENUM(pending/running/done/failed),
created_at, completed_at, error_msg

-- prompt_results
id UUID PK, run_id FK, prompt_text, raw_response,
brand_mentioned BOOL, brand_mention_position INT,
competitors_data JSON, brand_sentiment ENUM(positive/neutral/negative),
processed_at
```
