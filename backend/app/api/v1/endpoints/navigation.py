from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session

router = APIRouter(tags=["Smart Navigation"])


@router.get(
    "/",
    response_model=APIResponse,
    summary="Smart Navigation Placeholder",
    description="Placeholder endpoint for Smart Navigation features.",
)
async def navigation_root(session: Session = Depends(get_session)) -> APIResponse:
    return APIResponse(success=True, message="Feature endpoint scaffolded.", data=None)
