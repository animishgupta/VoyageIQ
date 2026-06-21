from typing import Dict, Any
from app.agents.state import AgentState

async def preference_agent_node(state: AgentState) -> Dict[str, Any]:
    """Preference Agent determines user travel personality based on budget and companions."""
    budget = state.get("budget_range") or "Mid-range"
    companions = state.get("travel_companions") or "Solo"
    
    if budget.lower() == "budget":
        personality = "Thrifty Backpacker" if companions.lower() == "solo" else "Budget Social Group"
    elif budget.lower() == "luxury":
        personality = "Luxe Connoisseur"
    else:
        personality = "Balanced Explorer"
        
    return {
        "travel_personality": personality,
        "logs": [f"Preference Agent: Mapped personality as '{personality}'"]
    }

async def destination_agent_node(state: AgentState) -> Dict[str, Any]:
    """Destination Discovery Agent resolves target travel locations."""
    personality = state.get("travel_personality") or "Explorer"
    prefs = state.get("destination_preferences") or []
    
    suggestions = []
    if prefs:
        suggestions = [f"Explore {city}" for city in prefs[:3]]
    else:
        suggestions = ["Munnar, Kerala", "Leh Ladakh, India", "Goa, India"]
        
    return {
        "destinations": suggestions,
        "logs": [f"Destination Discovery Agent: Discovered locations: {', '.join(suggestions)}"]
    }

async def weather_agent_node(state: AgentState) -> Dict[str, Any]:
    """Weather Agent evaluates forecasts and suitability metrics."""
    destinations = state.get("destinations") or []
    weather_pref = state.get("weather_preference") or "Temperate"
    
    weather_forecast = {}
    for dest in destinations:
        weather_forecast[dest] = {
            "condition": "Pleasant & Sunny" if weather_pref.lower() == "warm" else "Temperate Breeze",
            "suitability": "Excellent Match"
        }
        
    return {
        "weather_info": weather_forecast,
        "logs": [f"Weather Agent: Checked forecast suitability for {len(destinations)} destinations"]
    }

async def route_agent_node(state: AgentState) -> Dict[str, Any]:
    """Route Agent tracks distance, duration, and transport logs from source city."""
    source = state.get("source_city") or "New York"
    destinations = state.get("destinations") or []
    transport = state.get("transport_preference") or "Flight"
    
    routes = []
    for dest in destinations:
        routes.append({
            "from": source,
            "to": dest,
            "mode": transport,
            "est_duration": "5h 15m" if transport.lower() == "flight" else "12h 00m",
            "flexibility": state.get("route_flexibility") or "Flexible"
        })
        
    return {
        "routes": routes,
        "logs": [f"Route Agent: Calculated transit routes from {source}"]
    }

async def budget_agent_node(state: AgentState) -> Dict[str, Any]:
    """Budget Agent provides estimated itemized travel expenses."""
    budget_range = state.get("budget_range") or "Mid-range"
    duration = state.get("duration") or 5
    
    multiplier = 50 if budget_range.lower() == "budget" else 350 if budget_range.lower() == "luxury" else 150
    accom = multiplier * duration
    activities = (multiplier // 2) * duration
    total = accom + activities
    
    estimate = {
        "tier": budget_range,
        "accommodation_est": accom,
        "activities_est": activities,
        "total_est": total,
        "currency": "USD"
    }
    
    return {
        "budget_estimate": estimate,
        "logs": [f"Budget Agent: Estimated itinerary cost at {total} USD"]
    }

async def itinerary_agent_node(state: AgentState) -> Dict[str, Any]:
    """Itinerary Agent compiles all metadata (weather, routes, budget) into day-by-day plans."""
    personality = state.get("travel_personality") or "Explorer"
    destinations = state.get("destinations") or []
    weather = state.get("weather_info") or {}
    routes = state.get("routes") or []
    budget = state.get("budget_estimate") or {}
    duration = state.get("duration") or 3
    
    days = []
    for day in range(1, duration + 1):
        if day == 1:
            desc = f"Transit to {destinations[0] if destinations else 'destination'}. Check-in & dinner."
        elif day == duration:
            desc = "Last minute sightseeing, packaging, and return transit."
        else:
            desc = f"Day dedicated to {personality} activities (sightseeing & walking)."
            
        days.append({
            "day": day,
            "plan": desc,
            "weather_snippet": weather.get(destinations[0], {}).get("condition", "Clear sky") if destinations else "Clear"
        })
        
    itinerary = {
        "title": f"{duration}-Day Trip plan: {personality}",
        "days": days,
        "cost_summary": budget,
        "transit_options": routes
    }
    
    return {
        "itinerary": itinerary,
        "logs": [f"Itinerary Agent: Generated final {duration}-day travel itinerary schedule"]
    }
