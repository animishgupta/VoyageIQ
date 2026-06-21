from typing import Any, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from app.schemas.routes import RouteQuery
from app.services.auth import get_current_user
from app.services.route_intelligence import get_dynamic_routes

router = APIRouter()

@router.post("/query", status_code=status.HTTP_200_OK)
async def query_routes(
    query: RouteQuery,
    x_groq_api_key: Optional[str] = Header(None),
    current_user: Any = Depends(get_current_user)
):
    """
    Search and rank the top 3 routes between cities.
    Queries Groq API dynamically to retrieve visual map nodes, edges, and paths.
    """
    try:
        # Dynamically evaluate routes via Groq API (or mock fallback)
        result = await get_dynamic_routes(
            start=query.start_city,
            end=query.end_city,
            cost_weight=query.cost_weight,
            time_weight=query.time_weight,
            scenic_weight=query.scenic_weight,
            api_key=x_groq_api_key
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate dynamic routes: {str(e)}"
        )
