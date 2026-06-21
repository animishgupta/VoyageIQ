from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.preferences import TravelPreference
from app.schemas.preferences import TravelPreferenceCreate, TravelPreferenceUpdate

async def get_user_preferences(
    db: AsyncSession, 
    user_id: int
) -> Optional[TravelPreference]:
    """Retrieve the travel preferences for a given user."""
    result = await db.execute(
        select(TravelPreference).where(TravelPreference.user_id == user_id)
    )
    return result.scalars().first()

async def create_user_preferences(
    db: AsyncSession, 
    user_id: int, 
    pref_in: TravelPreferenceCreate
) -> TravelPreference:
    """Create a new set of travel preferences for a user."""
    db_pref = TravelPreference(
        user_id=user_id,
        source_city=pref_in.source_city,
        budget_range=pref_in.budget_range,
        duration=pref_in.duration,
        travel_companions=pref_in.travel_companions,
        destination_preferences=pref_in.destination_preferences,
        weather_preference=pref_in.weather_preference,
        crowd_preference=pref_in.crowd_preference,
        transport_preference=pref_in.transport_preference,
        route_flexibility=pref_in.route_flexibility
    )
    db.add(db_pref)
    await db.commit()
    await db.refresh(db_pref)
    return db_pref

async def update_user_preferences(
    db: AsyncSession, 
    db_pref: TravelPreference, 
    pref_in: TravelPreferenceUpdate
) -> TravelPreference:
    """Update existing travel preferences dynamically with partial changes."""
    update_data = pref_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_pref, field, value)
    db.add(db_pref)
    await db.commit()
    await db.refresh(db_pref)
    return db_pref
