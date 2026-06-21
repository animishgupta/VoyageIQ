from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class TravelPreferenceBase(BaseModel):
    source_city: Optional[str] = None
    budget_range: Optional[str] = None
    duration: Optional[int] = None
    travel_companions: Optional[str] = None
    destination_preferences: Optional[List[str]] = None
    weather_preference: Optional[str] = None
    crowd_preference: Optional[str] = None
    transport_preference: Optional[str] = None
    route_flexibility: Optional[str] = None

class TravelPreferenceCreate(TravelPreferenceBase):
    pass

class TravelPreferenceUpdate(TravelPreferenceBase):
    pass

class TravelPreferenceResponse(TravelPreferenceBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
