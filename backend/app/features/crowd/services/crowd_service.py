import json
import logging
from app.features.crowd.repositories.crowd_repository import CrowdRepository
from app.features.crowd.schemas.crowd import (
    HeatmapResponse,
    DensityNodeDTO,
    PredictionRequest,
    PredictionResponse,
    RouteRequest,
    RouteResponse,
    RouteSegmentDTO,
)
from app.features.crowd.prompts.crowd import (
    CROWD_PREDICTION_PROMPT_TEMPLATE,
    ROUTE_AUGMENTATION_PROMPT_TEMPLATE,
)
from app.shared.dependencies.providers import get_ai_provider, get_maps_provider
from app.shared.utils.json import clean_json

logger = logging.getLogger(__name__)


class CrowdService:
    def __init__(self, repository: CrowdRepository):
        self.repository = repository
        self.ai_provider = get_ai_provider()
        self.maps_provider = get_maps_provider()

    def _build_heatmap_context(self) -> str:
        nodes = self.repository.get_all_nodes()
        if not nodes:
            return "No crowd data available."

        context_lines = []
        for node in nodes:
            context_lines.append(f"- {node.zone_name}: {node.density_level}% capacity")
        return "\n".join(context_lines)

    def get_heatmap(self) -> HeatmapResponse:
        """
        Retrieves the current crowd density heatmap.
        """
        nodes = self.repository.get_all_nodes()
        dtos = [
            DensityNodeDTO(
                zone_name=n.zone_name,
                latitude=n.latitude,
                longitude=n.longitude,
                density_level=n.density_level,
                last_updated=n.last_updated,
            )
            for n in nodes
        ]
        return HeatmapResponse(nodes=dtos)

    async def get_prediction(self, request: PredictionRequest) -> PredictionResponse:
        """
        Retrieves an AI-generated crowd movement prediction based on current density.
        """
        heatmap_context = self._build_heatmap_context()

        prompt = CROWD_PREDICTION_PROMPT_TEMPLATE.format(
            current_zone=request.current_zone,
            target_zone=request.target_zone,
            time_offset_minutes=request.time_offset_minutes,
            heatmap_context=heatmap_context,
        )

        try:
            ai_response = self.ai_provider.generate_content(prompt)
            # Parse the JSON response requested in the prompt
            result = json.loads(clean_json(ai_response))
            return PredictionResponse(
                prediction_text=result.get(
                    "prediction_text", "Prediction unavailable."
                ),
                recommended_action=result.get(
                    "recommended_action", "Proceed with caution."
                ),
            )
        except Exception as e:
            logger.error(f"Failed to generate crowd prediction: {str(e)}")
            return PredictionResponse(
                prediction_text="Unable to generate prediction at this time due to AI provider degradation.",
                recommended_action="Please follow standard venue signage.",
            )

    async def get_route(self, request: RouteRequest) -> RouteResponse:
        """
        Retrieves a route from the Maps provider and augments it with AI crowd context.
        """
        # 1. Authoritative Routing Engine (Maps)
        try:
            maps_result = self.maps_provider.get_directions(
                request.origin, request.destination
            )
            segments = maps_result.get("segments", [])
            total_duration = maps_result.get("total_duration_seconds", 0)
        except Exception as e:
            logger.error(f"Maps provider failed: {str(e)}")
            # Fallback to a direct path if Maps fails, to maintain service gracefully
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

        # 2. AI Augmentation Context
        heatmap_context = self._build_heatmap_context()
        route_segments_context = "\n".join([f"- {s.instruction}" for s in segment_dtos])

        prompt = ROUTE_AUGMENTATION_PROMPT_TEMPLATE.format(
            origin=request.origin,
            destination=request.destination,
            route_segments_context=route_segments_context,
            heatmap_context=heatmap_context,
        )

        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))
            crowd_context = result.get("crowd_context", "Standard route.")
        except Exception as e:
            logger.error(f"Failed to generate route crowd context: {str(e)}")
            crowd_context = "AI crowd context currently unavailable."

        return RouteResponse(
            origin=request.origin,
            destination=request.destination,
            segments=segment_dtos,
            total_duration_seconds=total_duration,
            crowd_context=crowd_context,
        )
