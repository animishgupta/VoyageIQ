from typing import List, Dict, Any
from pydantic import BaseModel, Field

class RecommendationQuery(BaseModel):
    questionnaire: Dict[str, Any] = Field(
        ..., 
        description="User questionnaire answers (e.g. activity preferences, landscape tastes)"
    )
    budget: str = Field(..., description="Budget range (e.g. Budget, Mid-range, Luxury)")
    duration: int = Field(..., description="Duration of travel in days", ge=1)
    travel_history: List[str] = Field(
        default=[], 
        description="List of cities/countries previously visited by the user"
    )

class RecommendationResponse(BaseModel):
    match_scores: Dict[str, int] = Field(
        ..., 
        description="Match score out of 100 for each suggested destination"
    )
    top_recommendations: List[Dict[str, str]] = Field(
        ..., 
        description="Top recommended destinations with short reasons why they match"
    )
    alternative_destinations: List[str] = Field(
        ..., 
        description="Alternative destinations suitable for the user profile"
    )
    personalized_insights: List[str] = Field(
        ..., 
        description="Personalized travel planning tips based on history and inputs"
    )

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's chat query")
    destination: str = Field(default=None, description="The user's currently selected trip destination")
    budget: str = Field(default=None, description="The itemized budget breakdown or details")
    itinerary: List[Dict[str, Any]] = Field(default=None, description="Day-by-day itinerary plans")

class ChatResponse(BaseModel):
    response: str = Field(..., description="The conversational response from the AI Travel Advisor")
