from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session

router = APIRouter(
    tags=["Volunteer AI"]
)

@router.get(
    "/",
    response_model=APIResponse,
    summary="Volunteer AI Placeholder",
    description="Placeholder endpoint for Volunteer AI features."
)
async def volunteer_root(session: Session = Depends(get_session)) -> APIResponse:
    return APIResponse(
        success=True,
        message="Feature endpoint scaffolded.",
        data=None
    )
