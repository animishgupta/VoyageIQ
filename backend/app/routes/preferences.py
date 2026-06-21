from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.models.user import User
from app.schemas.preferences import TravelPreferenceCreate, TravelPreferenceUpdate, TravelPreferenceResponse
from app.services.auth import get_current_user
from app.services.preferences import (
    get_user_preferences,
    create_user_preferences,
    update_user_preferences,
)

router = APIRouter()

@router.get("/me", response_model=TravelPreferenceResponse)
async def read_my_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get the travel preferences of the current logged-in user.
    """
    pref = await get_user_preferences(db, current_user.id)
    if not pref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel preferences not found. Create preferences using POST /."
        )
    return pref

@router.post("/", response_model=TravelPreferenceResponse, status_code=status.HTTP_201_CREATED)
async def create_my_preferences(
    pref_in: TravelPreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new travel preferences for the current user.
    """
    existing_pref = await get_user_preferences(db, current_user.id)
    if existing_pref:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Travel preferences already exist for this user. Use PUT /me to update."
        )
    pref = await create_user_preferences(db, current_user.id, pref_in)
    return pref

@router.put("/me", response_model=TravelPreferenceResponse)
async def update_my_preferences(
    pref_in: TravelPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update travel preferences for the current user.
    """
    db_pref = await get_user_preferences(db, current_user.id)
    if not db_pref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel preferences not found. Create preferences using POST /."
        )
    pref = await update_user_preferences(db, db_pref, pref_in)
    return pref
