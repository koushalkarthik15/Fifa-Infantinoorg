import json
import logging
from app.features.volunteer.schemas.volunteer import IncidentRequest, IncidentResponse
from app.features.volunteer.prompts.volunteer import (
    INCIDENT_CLASSIFICATION_PROMPT_TEMPLATE,
)
from app.features.volunteer.data.mock_volunteers import get_volunteer_for_category
from app.shared.dependencies.providers import get_ai_provider
from app.shared.utils.json import clean_json

logger = logging.getLogger(__name__)


class VolunteerService:
    def __init__(self):
        self.ai_provider = get_ai_provider()
        self.valid_categories = {"Medical", "Lost Child", "Lost Item", "Safety Concern"}
        self.valid_priorities = {"Low", "Medium", "High", "Critical"}

    def _normalize_category(self, category: str) -> str:
        if category in self.valid_categories:
            return category
        # Attempt to map common misclassifications
        cat_lower = category.lower()
        if "medical" in cat_lower or "health" in cat_lower:
            return "Medical"
        if "lost" in cat_lower and ("child" in cat_lower or "kid" in cat_lower):
            return "Lost Child"
        if "lost" in cat_lower and "item" in cat_lower:
            return "Lost Item"
        return "Safety Concern"

    def _normalize_priority(self, priority: str) -> str:
        if priority in self.valid_priorities:
            return priority
        pri_lower = priority.lower()
        if "crit" in pri_lower or "sever" in pri_lower:
            return "Critical"
        if "high" in pri_lower:
            return "High"
        if "med" in pri_lower:
            return "Medium"
        if "low" in pri_lower:
            return "Low"
        return "Medium"  # Default

    async def report_incident(self, request: IncidentRequest) -> IncidentResponse:
        prompt = INCIDENT_CLASSIFICATION_PROMPT_TEMPLATE.format(
            description=request.description, location=request.location
        )

        try:
            ai_response = self.ai_provider.generate_content(prompt)
            result = json.loads(clean_json(ai_response))

            raw_category = result.get("category", "Safety Concern")
            raw_priority = result.get("priority", "Medium")
            suggested_actions = result.get("suggested_actions", [])

            category = self._normalize_category(raw_category)
            priority = self._normalize_priority(raw_priority)

        except Exception as e:
            logger.error(f"Incident classification failed: {str(e)}")
            # Fallback handling
            category = "Safety Concern"
            priority = "High"
            suggested_actions = [
                "Dispatch nearest available staff immediately to assess the situation."
            ]

        assigned_volunteer = get_volunteer_for_category(category)

        # Log metadata only, never verbatim description
        logger.info(
            f"Incident processed: Category={category}, Priority={priority}, Assigned={assigned_volunteer}"
        )

        return IncidentResponse(
            category=category,
            priority=priority,
            suggested_actions=suggested_actions,
            assigned_volunteer=assigned_volunteer,
        )
