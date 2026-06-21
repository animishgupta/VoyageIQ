import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash
from sqlalchemy import select

async def seed():
    print("Connecting to database session...")
    async with SessionLocal() as db:
        # Check if traveler already exists
        email = "traveler@voyageiq.ai"
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalars().first()
        
        if existing_user:
            print(f"User {email} already exists in the database!")
            return
            
        print("Creating default user traveler@voyageiq.ai...")
        hashed_password = get_password_hash("password123")
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name="Aditya Sharma",
            is_active=True,
            is_superuser=False
        )
        db.add(user)
        await db.commit()
        print("Default user Aditya Sharma (traveler@voyageiq.ai) seeded successfully with password 'password123'!")

if __name__ == "__main__":
    asyncio.run(seed())
