import os
from datetime import datetime
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DB_ID = os.getenv("NOTION_DATABASE_ID")

assert NOTION_TOKEN, "Missing NOTION_TOKEN in .env"
assert DB_ID, "Missing NOTION_DATABASE_ID in .env"

notion = Client(auth=NOTION_TOKEN)

resp = notion.pages.create(
    parent={"database_id": DB_ID},
    properties={
        "Brand": {  # 如果你的 Title 字段不叫 Brand，改成你的字段名
            "title": [{"text": {"content": f"Avanti Smoke Test {datetime.utcnow().isoformat()}"}}]
        }
    }
)

print("Created page:", resp["id"])
