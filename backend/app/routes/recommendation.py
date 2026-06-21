from typing import Any, Optional
from fastapi import APIRouter, Depends, Header, status
from app.schemas.recommendation import RecommendationQuery, RecommendationResponse, ChatRequest, ChatResponse
from app.services.auth import get_current_user
from app.services.recommendation import generate_recommendations, chat_with_advisor

router = APIRouter()

@router.post("/generate", response_model=RecommendationResponse, status_code=status.HTTP_200_OK)
async def generate_travel_recommendations(
    query: RecommendationQuery,
    x_groq_api_key: Optional[str] = Header(None),
    current_user: Any = Depends(get_current_user)
):
    """
    Generate AI-powered travel recommendations.
    Uses the Groq API for inference or falls back to mock recommendations.
    """
    result = await generate_recommendations(
        questionnaire=query.questionnaire,
        budget=query.budget,
        duration=query.duration,
        travel_history=query.travel_history,
        api_key=x_groq_api_key
    )
    return result

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_travel_advisor(
    query: ChatRequest,
    x_groq_api_key: Optional[str] = Header(None),
    current_user: Any = Depends(get_current_user)
):
    """
    Exposes conversational travel advice using live Groq API calls.
    """
    response_text = await chat_with_advisor(
        message=query.message,
        destination=query.destination,
        budget=query.budget,
        itinerary=query.itinerary,
        api_key=x_groq_api_key
    )
    return ChatResponse(response=response_text)
