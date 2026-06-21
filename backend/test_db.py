import asyncio
import sys
import os
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import get_db

async def main():
    print("Testing DB connection...")
    try:
        async for session in get_db():
            result = await session.execute(text("SELECT 1"))
            print("DB query result:", result.scalar())
            print("Connection successful!")
            break
    except Exception as e:
        print("DB CONNECTION FAILED:", e)

if __name__ == "__main__":
    asyncio.run(main())
