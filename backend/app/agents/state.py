import operator
from typing import TypedDict, List, Dict, Any, Optional, Annotated

class AgentState(TypedDict):
    # Questionnaire Input Fields
    source_city: str
    budget_range: str
    duration: int
    travel_companions: str
    destination_preferences: List[str]
    weather_preference: str
    crowd_preference: str
    transport_preference: str
    route_flexibility: str

    # Pipeline Outputs
    travel_personality: Optional[str]
    destinations: Optional[List[str]]
    weather_info: Optional[Dict[str, Any]]
    routes: Optional[List[Dict[str, Any]]]
    budget_estimate: Optional[Dict[str, Any]]
    itinerary: Optional[Dict[str, Any]]
    
    # Workflow Execution Log (appends updates automatically using operator.add)
    logs: Annotated[List[str], operator.add]
