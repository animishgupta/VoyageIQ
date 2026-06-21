from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.services.auth import get_current_user
from app.services.preferences import get_user_preferences
from app.agents.graph import journey_graph
from app.agents.state import AgentState

router = APIRouter()

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_journey(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger the LangGraph Multi-Agent travel planning pipeline.
    It reads preferences stored in the database for the active user,
    feeds them into the LangGraph state machine, executes the stubs,
    and returns the compiled itinerary details and execution logs.
    """
    # Fetch user preferences
    prefs = await get_user_preferences(db, current_user.id)
    if not prefs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel preferences not found. Please create preferences via POST /api/v1/preferences first."
        )
        
    # Populate initial state fields
    initial_state: AgentState = {
        "source_city": prefs.source_city or "Unknown Source",
        "budget_range": prefs.budget_range or "Mid-range",
        "duration": prefs.duration or 3,
        "travel_companions": prefs.travel_companions or "Solo",
        "destination_preferences": prefs.destination_preferences or [],
        "weather_preference": prefs.weather_preference or "Temperate",
        "crowd_preference": prefs.crowd_preference or "Medium",
        "transport_preference": prefs.transport_preference or "Flight",
        "route_flexibility": prefs.route_flexibility or "Flexible",
        # Outputs
        "travel_personality": None,
        "destinations": None,
        "weather_info": None,
        "routes": None,
        "budget_estimate": None,
        "itinerary": None,
        # Log init
        "logs": ["Workflow Initialized: Retained preferences from database"]
    }
    
    # Run the compiled LangGraph workflow asynchronously
    try:
        final_state = await journey_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LangGraph execution failed: {str(e)}"
        )
        
    return {
        "user_id": current_user.id,
        "travel_personality": final_state.get("travel_personality"),
        "destinations": final_state.get("destinations"),
        "weather_info": final_state.get("weather_info"),
        "routes": final_state.get("routes"),
        "budget_estimate": final_state.get("budget_estimate"),
        "itinerary": final_state.get("itinerary"),
        "workflow_logs": final_state.get("logs")
    }
