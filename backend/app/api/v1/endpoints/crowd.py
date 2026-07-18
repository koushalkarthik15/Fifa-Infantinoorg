from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session

router = APIRouter(
    tags=["Crowd AI"]
)

@router.get(
    "/",
    response_model=APIResponse,
    summary="Crowd AI Placeholder",
    description="Placeholder endpoint for Crowd AI features."
)
async def crowd_root(session: Session = Depends(get_session)) -> APIResponse:
    return APIResponse(
        success=True,
        message="Feature endpoint scaffolded.",
        data=None
    )
