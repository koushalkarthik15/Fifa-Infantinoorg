from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session
from app.features.navigation.repositories.navigation_repository import (
    NavigationRepository,
)
from app.features.navigation.services.navigation_service import NavigationService
from app.features.navigation.schemas.navigation import (
    VenueNavigationRequest,
    VenueNavigationResponse,
    TransportationRequest,
    TransportationResponse,
)

router = APIRouter(tags=["Smart Navigation"])


def get_navigation_service(
    session: Session = Depends(get_session),
) -> NavigationService:
    repository = NavigationRepository(session)
    return NavigationService(repository)


@router.post(
    "/venue",
    response_model=APIResponse[VenueNavigationResponse],
    summary="Venue Navigation",
)
async def get_venue_navigation(
    request: VenueNavigationRequest,
    service: NavigationService = Depends(get_navigation_service),
) -> APIResponse[VenueNavigationResponse]:
    result = await service.get_venue_route(request)
    return APIResponse(
        success=True, message="Route calculated successfully.", data=result
    )


@router.post(
    "/transportation",
    response_model=APIResponse[TransportationResponse],
    summary="Transportation Recommendation",
)
async def get_transportation_recommendation(
    request: TransportationRequest,
    service: NavigationService = Depends(get_navigation_service),
) -> APIResponse[TransportationResponse]:
    result = await service.get_transportation_recommendation(request)
    return APIResponse(
        success=True, message="Recommendation generated successfully.", data=result
    )
