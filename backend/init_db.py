import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import engine
from app.database.base_class import Base
# Import all models to register them on Base.metadata
from app.models.user import User
from app.models.preferences import TravelPreference

async def main():
    print("Initializing database tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database tables initialized successfully!")
    except Exception as e:
        print("FAILED TO INITIALIZE TABLES:", e)

if __name__ == "__main__":
    asyncio.run(main())
