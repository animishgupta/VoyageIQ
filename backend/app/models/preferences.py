from typing import List, Optional
from sqlalchemy import String, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base

class TravelPreference(Base):
    __tablename__ = "travel_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False
    )

    source_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    budget_range: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    travel_companions: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # JSON column for lists of destination preferences
    destination_preferences: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    
    weather_preference: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    crowd_preference: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    transport_preference: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    route_flexibility: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # One-to-one relationship back to the User
    user = relationship("User", back_populates="preferences", uselist=False)
