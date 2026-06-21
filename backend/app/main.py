from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.preferences import router as preferences_router
from app.routes.journey import router as journey_router
from app.routes.routes import router as routes_router
from app.routes.recommendation import router as recommendation_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="VoyageIQ - Production Ready Modular FastAPI Backend"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers under /api/v1 prefix
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(preferences_router, prefix=f"{settings.API_V1_STR}/preferences", tags=["preferences"])
app.include_router(journey_router, prefix=f"{settings.API_V1_STR}/journey", tags=["journey"])
app.include_router(routes_router, prefix=f"{settings.API_V1_STR}/routes", tags=["routes"])
app.include_router(recommendation_router, prefix=f"{settings.API_V1_STR}/recommendation", tags=["recommendations"])

@app.on_event("startup")
async def on_startup():
    from app.database.session import engine
    from app.database.base_class import Base
    # Import models to register them on Base.metadata
    from app.models.user import User
    from app.models.preferences import TravelPreference
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/", tags=["health"])
async def health_check():
    """
    Health check endpoint for container environments or load balancers.
    """
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }
