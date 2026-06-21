from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth import get_current_user, get_current_active_superuser
from app.utils.security import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get current logged in user profile.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update profile details of the current logged in user.
    """
    if user_in.email is not None and user_in.email != current_user.email:
        # Check if email is already taken
        result = await db.execute(select(User).where(User.email == user_in.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists."
            )
        current_user.email = user_in.email
        
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
        
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)
        
    if user_in.is_active is not None:
        current_user.is_active = user_in.is_active
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all users (Admin only).
    """
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users
