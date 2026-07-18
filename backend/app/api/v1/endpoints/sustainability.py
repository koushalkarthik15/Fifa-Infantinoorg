from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session

router = APIRouter(
    tags=["Sustainability Assistant"]
)

@router.get(
    "/",
    response_model=APIResponse,
    summary="Sustainability Placeholder",
    description="Placeholder endpoint for Sustainability Assistant features."
)
async def sustainability_root(session: Session = Depends(get_session)) -> APIResponse:
    return APIResponse(
        success=True,
        message="Feature endpoint scaffolded.",
        data=None
    )
