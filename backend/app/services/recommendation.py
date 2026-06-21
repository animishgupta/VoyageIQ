import json
import logging
from typing import Dict, List, Any
from groq import Groq

from app.config import settings

logger = logging.getLogger("uvicorn.error")

def get_mock_recommendations(
    questionnaire: Dict[str, Any],
    budget: str,
    duration: int,
    travel_history: List[str]
) -> Dict[str, Any]:
    """Fallback generator providing structured mock travel recommendations."""
    pref_activities = questionnaire.get("activities", ["sightseeing"])
    pref_weather = questionnaire.get("weather", "temperate")
    
    # Check budget tiers
    is_low_budget = any(b in budget.lower() for b in ["₹0", "₹5", "₹10", "₹15", "budget"])
    is_medium_budget = any(b in budget.lower() for b in ["₹25", "₹50", "mid-range"])

    if is_low_budget:
        # Budget tier (under ₹15k) - Domestic Indian options
        if "beach" in [a.lower() for a in pref_activities]:
            primary = "Goa, India"
            alt = "Gokarna, India"
        elif pref_weather.lower() in ["cold", "snow"]:
            primary = "Dehradun / Mussoorie, India"
            alt = "Nainital, India"
        else:
            primary = "Agra, India"
            alt = "Jaipur, India"
    elif is_medium_budget:
        # Mid tier (₹25k - ₹50k) - Premium domestic options
        if "beach" in [a.lower() for a in pref_activities]:
            primary = "Andaman Islands, India"
            alt = "Varkala, India"
        elif pref_weather.lower() in ["cold", "snow"]:
            primary = "Srinagar, Kashmir"
            alt = "Manali, Himachal Pradesh"
        else:
            primary = "Udaipur, India"
            alt = "Gangtok, Sikkim"
    else:
        # Premium/Luxury (₹50k+) - Premium Indian destinations
        if "beach" in [a.lower() for a in pref_activities]:
            primary = "Lakshadweep Islands, India"
            alt = "Andaman & Nicobar Islands, India"
        elif pref_weather.lower() in ["cold", "snow"]:
            primary = "Gulmarg, Kashmir"
            alt = "Leh Ladakh, India"
        else:
            primary = "Munnar, Kerala"
            alt = "Udaipur, India"

    # Estimate cost multiplier based on budget tier
    daily_cost = 1500 if is_low_budget else 6000 if is_medium_budget else 18000
    est_total = daily_cost * duration

    return {
        "match_scores": {
            primary: 95,
            alt: 88,
            "Rishikesh, India" if is_low_budget else "Sikkim, India" if is_medium_budget else "Coorg, India": 81
        },
        "top_recommendations": [
            {
                "destination": primary,
                "reason": f"Perfect match for your interest in {', '.join(pref_activities)} and {pref_weather} climate within a budget of {budget}."
            },
            {
                "destination": alt,
                "reason": f"Excellent {budget} option for a {duration}-day trip from your starting point."
            }
        ],
        "alternative_destinations": [alt, "Coorg, India" if is_low_budget else "Pondicherry, India" if is_medium_budget else "Wayanad, India"],
        "personalized_insights": [
            f"Since you have visited {', '.join(travel_history) if travel_history else 'historic spots'}, you might appreciate {primary}.",
            f"Given your budget constraint of {budget}, we selected destinations where local transport and activities cost under {est_total} INR total."
        ]
    }

async def generate_recommendations(
    questionnaire: Dict[str, Any],
    budget: str,
    duration: int,
    travel_history: List[str],
    api_key: str = None
) -> Dict[str, Any]:
    """
    Generate travel recommendations by calling Groq API.
    Falls back to mock recommendations if API key is missing or calls fail.
    """
    active_key = api_key or settings.GROQ_API_KEY
    if not active_key:
        logger.warning("GROQ_API_KEY not configured. Falling back to mock recommendation engine.")
        return get_mock_recommendations(questionnaire, budget, duration, travel_history)

    try:
        # Initialize Groq client
        client = Groq(api_key=active_key)
        
        prompt = f"""
        You are a travel recommendation expert for VoyageIQ.
        Generate structured travel options based on this user profile:
        - Questionnaire preferences: {json.dumps(questionnaire)}
        - Budget tier: {budget}
        - Trip duration: {duration} days
        - Past travels: {json.dumps(travel_history)}

        IMPORTANT: You MUST strongly prioritize and prefer domestic Indian travel destinations (e.g., Srinagar, Leh Ladakh, Goa, Munnar, Manali, Udaipur, Andaman & Nicobar Islands, Darjeeling, Gokarna, Varkala, Ooty, Alleppey) in all recommendations. Do NOT suggest international/foreign destinations unless the user has an extremely high budget and explicitly requests international/foreign travel.

        Respond ONLY in raw JSON format with the following fields:
        1. "match_scores": A dictionary mapping recommended destinations to compatibility scores (0-100).
        2. "top_recommendations": A list of dictionaries containing "destination" and "reason" (reasons must match profile).
        3. "alternative_destinations": A list of 2 alternative destinations.
        4. "personalized_insights": A list of 2-3 customized travel tips.

        Do not enclose in markdown blocks. Output valid JSON only.
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a travel database assistant that outputs structured travel JSON."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        raw_response = chat_completion.choices[0].message.content
        return json.loads(raw_response)
        
    except Exception as e:
        logger.error(f"Groq API call failed: {str(e)}. Falling back to mock recommendation engine.")
        return get_mock_recommendations(questionnaire, budget, duration, travel_history)

async def chat_with_advisor(
    message: str,
    destination: str = None,
    budget: str = None,
    itinerary: List[Dict[str, Any]] = None,
    api_key: str = None
) -> str:
    """
    Query Groq live using the user's travel destination, budget breakdown, and current question.
    """
    active_key = api_key or settings.GROQ_API_KEY
    if not active_key:
        logger.warning("GROQ_API_KEY not configured. Falling back to static chat responses.")
        return "I am running in offline mode. I can tell you that VoyageIQ prioritizes premium domestic Indian travel options to keep your stay, transit, food, and activities within easy reach."

    try:
        client = Groq(api_key=active_key)
        
        context = ""
        if destination:
            context += f"The user is looking at a trip to: {destination}. "
        if budget:
            context += f"The estimated budget breakdown is: {budget}. "
        if itinerary:
            context += f"The day-by-day itinerary is: {itinerary}. "

        system_prompt = (
          "You are the VoyageIQ AI Travel Advisor, a warm, professional, and multilingual AI concierge. "
          "The user may describe their dream destination or ask travel questions in English, Hindi, or a mix of both (Hinglish). "
          "Identify their preferences (weather, activities, vibes) and provide personalized destination recommendations "
          "and structured travel plans (including stays, estimated cost, and transit routes) matching their input. "
          "Prioritize domestic Indian travel options (like Srinagar, Goa, Ladakh, Munnar, etc.). "
          "Respond in the same language or style the user uses. Be engaging, helpful, and concise."
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"Context: {context}\n\nUser Question: {message}"
                }
            ],
            model="llama-3.3-70b-versatile",
            max_tokens=800
        )
        
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Groq chat completion failed: {str(e)}")
        return f"I had trouble connecting to the live AI engine ({str(e)}). However, we can see from your profile details that your route parameters are active!"
