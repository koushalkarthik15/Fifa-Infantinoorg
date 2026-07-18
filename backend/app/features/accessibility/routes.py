from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.shared.api.models import APIResponse
from app.features.accessibility.services.accessibility_service import (
    AccessibilityService,
)
from app.features.accessibility.schemas.accessibility import (
    AssistantRequest,
    AssistantResponse,
    AccessibleRouteRequest,
    AccessibleRouteResponse,
    TranslationRequest,
    TranslationResponse,
    VisionResponse,
)

router = APIRouter(tags=["Accessibility"])


def get_accessibility_service() -> AccessibilityService:
    return AccessibilityService()


@router.post("/assistant", response_model=APIResponse[AssistantResponse])
async def get_assistant(
    request: AssistantRequest,
    service: AccessibilityService = Depends(get_accessibility_service),
) -> APIResponse[AssistantResponse]:
    result = await service.get_assistant_response(request)
    return APIResponse(
        success=True, message="Assistant response generated.", data=result
    )


@router.post("/route", response_model=APIResponse[AccessibleRouteResponse])
async def get_route(
    request: AccessibleRouteRequest,
    service: AccessibilityService = Depends(get_accessibility_service),
) -> APIResponse[AccessibleRouteResponse]:
    result = await service.get_accessible_route(request)
    return APIResponse(success=True, message="Accessible route generated.", data=result)


@router.post("/translate", response_model=APIResponse[TranslationResponse])
async def translate_text(
    request: TranslationRequest,
    service: AccessibilityService = Depends(get_accessibility_service),
) -> APIResponse[TranslationResponse]:
    if request.target_language not in ["English", "Spanish", "French"]:
        raise HTTPException(status_code=400, detail="Unsupported language")
    result = await service.translate_text(request)
    return APIResponse(success=True, message="Translation complete.", data=result)


@router.post("/vision", response_model=APIResponse[VisionResponse])
async def analyze_vision(
    file: UploadFile = File(...),
    service: AccessibilityService = Depends(get_accessibility_service),
) -> APIResponse[VisionResponse]:
    raise HTTPException(
        status_code=503,
        detail="Vision Assistance is currently upcoming and unavailable.",
    )

    image_bytes = await file.read()
    if len(image_bytes) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=413, detail="Image size exceeds 5MB limit.")

    result = await service.analyze_vision(image_bytes, file.content_type)
    return APIResponse(success=True, message="Vision analysis complete.", data=result)
