import json
import logging
from app.features.accessibility.schemas.accessibility import (
    AssistantRequest,
    AssistantResponse,
    AccessibleRouteRequest,
    AccessibleRouteResponse,
    RouteSegmentDTO,
    TranslationRequest,
    TranslationResponse,
    VisionResponse,
)
from app.features.accessibility.prompts.accessibility import (
    ASSISTANT_PROMPT_TEMPLATE,
    ACCESSIBLE_ROUTE_PROMPT_TEMPLATE,
    VISION_ANALYSIS_PROMPT_TEMPLATE,
    TRANSLATION_PROMPT_TEMPLATE,
)
from app.shared.dependencies.providers import get_ai_provider, get_maps_provider
from app.shared.utils.json import clean_json

logger = logging.getLogger(__name__)


class AccessibilityService:
    def __init__(self):
        self.ai_provider = get_ai_provider()
        self.maps_provider = get_maps_provider()

    async def get_assistant_response(
        self, request: AssistantRequest
    ) -> AssistantResponse:
        prompt = ASSISTANT_PROMPT_TEMPLATE.format(
            query=request.query, context=request.context or "None"
        )
        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))
            return AssistantResponse(
                response=result.get("response", "I am here to help."),
                suggested_actions=result.get("suggested_actions", []),
            )
        except Exception as e:
            logger.error(f"Assistant generation failed: {str(e)}")
            return AssistantResponse(
                response="I'm sorry, I'm currently unable to process your request. Please seek assistance from a nearby staff member.",
                suggested_actions=[],
            )

    async def get_accessible_route(
        self, request: AccessibleRouteRequest
    ) -> AccessibleRouteResponse:
        try:
            # Get standard maps routing
            maps_result = self.maps_provider.get_directions(
                request.origin, request.destination
            )
            segments = maps_result.get("segments", [])
            total_duration = maps_result.get("total_duration_seconds", 0)
        except Exception as e:
            logger.error(f"Maps provider failed: {str(e)}")
            segments = [
                {
                    "instruction": f"Head directly to {request.destination}",
                    "distance_meters": 0,
                    "duration_seconds": 0,
                }
            ]
            total_duration = 0

        segment_dtos = [
            RouteSegmentDTO(
                instruction=seg.get("instruction", ""),
                distance_meters=seg.get("distance_meters", 0),
                duration_seconds=seg.get("duration_seconds", 0),
            )
            for seg in segments
        ]

        route_context = "\n".join([f"- {s.instruction}" for s in segment_dtos])

        # Only use Gemini if wheelchair route is requested
        if request.needs_wheelchair:
            prompt = ACCESSIBLE_ROUTE_PROMPT_TEMPLATE.format(
                origin=request.origin,
                destination=request.destination,
                maps_context=route_context,
            )
            try:
                ai_response = self.ai_provider.generate_content(prompt)
                result = json.loads(clean_json(ai_response))
                accessibility_context = result.get(
                    "accessibility_context", "Proceed with standard accessible routing."
                )
            except Exception as e:
                logger.error(f"Accessible route context failed: {str(e)}")
                accessibility_context = "Accessibility analysis unavailable. Please follow signs for elevators and ramps."
        else:
            accessibility_context = "Standard route."

        return AccessibleRouteResponse(
            origin=request.origin,
            destination=request.destination,
            segments=segment_dtos,
            total_duration_seconds=total_duration,
            accessibility_context=accessibility_context,
        )

    async def translate_text(self, request: TranslationRequest) -> TranslationResponse:
        prompt = TRANSLATION_PROMPT_TEMPLATE.format(
            target_language=request.target_language, text=request.text
        )
        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))
            translated = result.get("translated_text", "")
            if not translated:
                raise ValueError("Empty translation")
        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            translated = "Translation service temporarily unavailable."

        return TranslationResponse(
            original_text=request.text,
            translated_text=translated,
            target_language=request.target_language,
        )

    async def analyze_vision(
        self, image_bytes: bytes, mime_type: str
    ) -> VisionResponse:
        prompt = VISION_ANALYSIS_PROMPT_TEMPLATE
        try:
            ai_response = self.ai_provider.generate_content(
                prompt, image_bytes=image_bytes, mime_type=mime_type
            )
            result = json.loads(clean_json(ai_response))
            return VisionResponse(
                description=result.get("description", "Image analyzed."),
                obstacles_identified=result.get("obstacles_identified", []),
            )
        except Exception as e:
            logger.error(f"Vision analysis failed: {str(e)}")
            return VisionResponse(
                description="Unable to analyze the image at this time.",
                obstacles_identified=[],
            )
