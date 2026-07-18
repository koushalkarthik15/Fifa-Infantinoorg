from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session
from app.features.crowd.repositories.crowd_repository import CrowdRepository
from app.features.crowd.services.crowd_service import CrowdService
from app.features.crowd.schemas.crowd import (
    HeatmapResponse, PredictionRequest, PredictionResponse,
    RouteRequest, RouteResponse
)

router = APIRouter(
    tags=["Crowd AI"]
)

def get_crowd_service(session: Session = Depends(get_session)) -> CrowdService:
    repo = CrowdRepository(session)
    return CrowdService(repo)

@router.get(
    "/heatmap",
    response_model=APIResponse[HeatmapResponse],
    summary="Crowd Heatmap",
    description="Returns the current crowd density heatmap for the venue."
)
async def get_heatmap(service: CrowdService = Depends(get_crowd_service)) -> APIResponse[HeatmapResponse]:
    data = service.get_heatmap()
    return APIResponse(
        success=True,
        message="Heatmap retrieved successfully.",
        data=data
    )

@router.post(
    "/prediction",
    response_model=APIResponse[PredictionResponse],
    summary="Crowd Prediction",
    description="Returns Gemini natural language prediction for crowd movement."
)
async def predict_crowd(
    request: PredictionRequest,
    service: CrowdService = Depends(get_crowd_service)
) -> APIResponse[PredictionResponse]:
    data = await service.get_prediction(request)
    return APIResponse(
        success=True,
        message="Prediction retrieved successfully.",
        data=data
    )

@router.post(
    "/route",
    response_model=APIResponse[RouteResponse],
    summary="Route Recommendation",
    description="Returns a recommended route utilizing Maps and Gemini."
)
async def recommend_route(
    request: RouteRequest,
    service: CrowdService = Depends(get_crowd_service)
) -> APIResponse[RouteResponse]:
    data = await service.get_route(request)
    return APIResponse(
        success=True,
        message="Route augmented successfully.",
        data=data
    )
