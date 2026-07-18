import json
import logging
from app.features.navigation.repositories.navigation_repository import (
    NavigationRepository,
)
from app.features.navigation.schemas.navigation import (
    VenueNavigationRequest,
    VenueNavigationResponse,
    RouteSegmentDTO,
    TransportationRequest,
    TransportationResponse,
)
from app.features.navigation.prompts.navigation import (
    TRANSPORTATION_RECOMMENDATION_PROMPT_TEMPLATE,
)
from app.shared.dependencies.providers import get_ai_provider, get_maps_provider
from app.shared.utils.json import clean_json

logger = logging.getLogger(__name__)


class NavigationService:
    def __init__(self, repository: NavigationRepository):
        self.repository = repository
        self.ai_provider = get_ai_provider()
        self.maps_provider = get_maps_provider()

    async def get_venue_route(
        self, request: VenueNavigationRequest
    ) -> VenueNavigationResponse:
        destination_name = request.destination_name

        # If category is provided without a name, pick the first available one
        if request.destination_category and not destination_name:
            locations = self.repository.get_locations_by_category(
                request.destination_category
            )
            if locations:
                destination_name = locations[0].name
            else:
                destination_name = f"Nearest {request.destination_category}"

        if not destination_name:
            destination_name = "Unknown Destination"

        try:
            maps_result = self.maps_provider.get_directions(
                request.origin, destination_name
            )
            segments = maps_result.get("segments", [])
            total_duration = maps_result.get("total_duration_seconds", 0)
        except Exception as e:
            logger.error(f"Maps provider failed: {str(e)}")
            segments = [
                {
                    "instruction": f"Head towards {destination_name}",
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

        return VenueNavigationResponse(
            origin=request.origin,
            destination=destination_name,
            segments=segment_dtos,
            total_duration_seconds=total_duration,
        )

    async def get_transportation_recommendation(
        self, request: TransportationRequest
    ) -> TransportationResponse:
        try:
            # Let's get walking directions distance/time as a baseline
            maps_result = self.maps_provider.get_directions(
                request.origin, request.destination
            )
            walking_duration = maps_result.get("total_duration_seconds", 600)
            maps_context = f"- Walking: {walking_duration // 60} minutes\n- Shuttle: {walking_duration // 120} minutes\n- Metro: {walking_duration // 180} minutes"
        except Exception as e:
            logger.error(f"Maps provider failed for transit: {str(e)}")
            maps_context = "- Maps data unavailable."

        prompt = TRANSPORTATION_RECOMMENDATION_PROMPT_TEMPLATE.format(
            origin=request.origin,
            destination=request.destination,
            context=request.context or "None",
            maps_context=maps_context,
        )

        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))
            recommended_mode = result.get("recommended_mode", "Walking")
            explanation = result.get("explanation", "Standard transit recommendation.")
        except Exception as e:
            logger.error(f"Gemini provider failed: {str(e)}")
            recommended_mode = "Walking"
            explanation = "AI recommendation unavailable. Walking is generally the most reliable method."

        return TransportationResponse(
            origin=request.origin,
            destination=request.destination,
            recommended_mode=recommended_mode,
            explanation=explanation,
        )
