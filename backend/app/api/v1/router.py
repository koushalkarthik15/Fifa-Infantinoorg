from fastapi import APIRouter, Depends
from sqlmodel import Session, text
from app.database.core import get_session
from app.shared.api.models import HealthResponse, ReadinessResponse
from app.shared.dependencies.providers import (
    get_ai_provider,
    get_maps_provider,
    get_firebase_provider,
)

from app.features.crowd import routes as crowd
from app.features.navigation import routes as navigation
from app.features.accessibility import routes as accessibility
from app.features.volunteer import routes as volunteer
from app.features.sustainability import routes as sustainability

# Create the main v1 router
api_v1_router = APIRouter(prefix="/api/v1")

# Register Feature Routers
api_v1_router.include_router(crowd.router, prefix="/crowd")
api_v1_router.include_router(navigation.router, prefix="/navigation")
api_v1_router.include_router(accessibility.router, prefix="/accessibility")
api_v1_router.include_router(volunteer.router, prefix="/volunteer")
api_v1_router.include_router(sustainability.router, prefix="/sustainability")


@api_v1_router.get(
    "/health",
    response_model=HealthResponse,
    tags=["Infrastructure"],
    summary="Liveness Check",
)
async def health_check() -> HealthResponse:
    """
    Lightweight endpoint to verify application is running.
    """
    return HealthResponse(
        status="ok", service="InfantinoOrg Backend API", version="0.1.0"
    )


@api_v1_router.get(
    "/readiness",
    response_model=ReadinessResponse,
    tags=["Infrastructure"],
    summary="Readiness Check",
)
async def readiness_check(session: Session = Depends(get_session)) -> ReadinessResponse:
    """
    Endpoint to verify backend dependencies (Database, external providers) are ready.
    """
    db_status = "error"
    try:
        session.exec(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass

    ai = get_ai_provider()
    maps = get_maps_provider()
    firebase = get_firebase_provider()

    return ReadinessResponse(
        status="ok" if db_status == "connected" else "error",
        database=db_status,
        services={
            "gemini": ai.check_health(),
            "maps": maps.check_health(),
            "firebase": firebase.check_health(),
        },
    )
