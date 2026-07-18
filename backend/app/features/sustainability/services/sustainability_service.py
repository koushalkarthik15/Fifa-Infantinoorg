import json
import logging
from app.features.sustainability.schemas.sustainability import (
    GreenRouteRequest,
    GreenRouteResponse,
    RouteSegmentDTO,
    FacilityRequest,
    FacilityResponse,
)
from app.features.sustainability.prompts.sustainability import ECO_SCORE_PROMPT_TEMPLATE
from app.features.sustainability.data.mock_facilities import get_nearest_facilities
from app.shared.dependencies.providers import get_ai_provider, get_maps_provider
from app.shared.utils.json import clean_json

logger = logging.getLogger(__name__)


class SustainabilityService:
    def __init__(self):
        self.ai_provider = get_ai_provider()
        self.maps_provider = get_maps_provider()

    async def get_green_route(self, request: GreenRouteRequest) -> GreenRouteResponse:
        try:
            # Force transit/walking mode for green routes via maps provider (simulated by passing mode if provider supported it, default is transit/walking for our venue)
            maps_result = self.maps_provider.get_directions(
                request.origin, request.destination
            )
            segments = maps_result.get("segments", [])
            total_duration = maps_result.get("total_duration_seconds", 0)
        except Exception as e:
            logger.error(f"Maps provider failed: {str(e)}")
            segments = [
                {
                    "instruction": f"Head towards {request.destination}",
                    "distance_meters": 500,
                    "duration_seconds": 300,
                }
            ]
            total_duration = 300

        total_distance = sum([s.get("distance_meters", 0) for s in segments])

        segment_dtos = [
            RouteSegmentDTO(
                instruction=seg.get("instruction", ""),
                distance_meters=seg.get("distance_meters", 0),
                duration_seconds=seg.get("duration_seconds", 0),
            )
            for seg in segments
        ]

        prompt = ECO_SCORE_PROMPT_TEMPLATE.format(
            origin=request.origin,
            destination=request.destination,
            distance=total_distance,
            duration=total_duration,
        )

        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))
            eco_score = result.get("eco_score", "Estimated 0.5kg CO2 saved.")
            recommendation = result.get(
                "recommendation", "Thank you for choosing green transportation!"
            )
        except Exception as e:
            logger.error(f"Eco score generation failed: {str(e)}")
            eco_score = "CO2 savings calculation unavailable."
            recommendation = "Choosing walking or transit always helps the environment!"

        logger.info(f"Green route generated: {request.origin} -> {request.destination}")

        return GreenRouteResponse(
            origin=request.origin,
            destination=request.destination,
            segments=segment_dtos,
            total_duration_seconds=total_duration,
            eco_score=eco_score,
            recommendation=recommendation,
        )

    async def get_facilities(self, request: FacilityRequest) -> FacilityResponse:
        # Stateless deterministic facility lookup
        facilities = get_nearest_facilities(request.location)

        logger.info(f"Facilities requested for location: {request.location}")

        return FacilityResponse(
            water_stations=facilities["water_stations"],
            recycling_bins=facilities["recycling_bins"],
        )
