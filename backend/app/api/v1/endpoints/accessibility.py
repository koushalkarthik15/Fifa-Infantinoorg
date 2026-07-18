from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.shared.api.models import APIResponse
from app.database.core import get_session

router = APIRouter(tags=["Accessibility & Multilingual Assistant"])


@router.get(
    "/",
    response_model=APIResponse,
    summary="Accessibility Placeholder",
    description="Placeholder endpoint for Accessibility & Multilingual features.",
)
async def accessibility_root(session: Session = Depends(get_session)) -> APIResponse:
    return APIResponse(success=True, message="Feature endpoint scaffolded.", data=None)
