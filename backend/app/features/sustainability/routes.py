from fastapi import APIRouter, Depends
from app.shared.api.models import APIResponse
from app.features.sustainability.services.sustainability_service import (
    SustainabilityService,
)
from app.features.sustainability.schemas.sustainability import (
    GreenRouteRequest,
    GreenRouteResponse,
    FacilityRequest,
    FacilityResponse,
)

router = APIRouter(tags=["Sustainability Assistant"])


def get_sustainability_service() -> SustainabilityService:
    return SustainabilityService()


@router.post("/route", response_model=APIResponse[GreenRouteResponse])
async def get_green_route(
    request: GreenRouteRequest,
    service: SustainabilityService = Depends(get_sustainability_service),
) -> APIResponse[GreenRouteResponse]:
    result = await service.get_green_route(request)
    return APIResponse(success=True, message="Green route generated.", data=result)


@router.post("/facilities", response_model=APIResponse[FacilityResponse])
async def get_facilities(
    request: FacilityRequest,
    service: SustainabilityService = Depends(get_sustainability_service),
) -> APIResponse[FacilityResponse]:
    result = await service.get_facilities(request)
    return APIResponse(success=True, message="Facilities found.", data=result)
