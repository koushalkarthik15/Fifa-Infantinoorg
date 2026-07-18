from pydantic import Field
from typing import List
from datetime import datetime
from app.shared.api.models import BaseCamelModel

# ==========================================
# Heatmap DTOs
# ==========================================

class DensityNodeDTO(BaseCamelModel):
    zone_name: str
    latitude: float
    longitude: float
    density_level: int
    last_updated: datetime

class HeatmapResponse(BaseCamelModel):
    nodes: List[DensityNodeDTO]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==========================================
# Prediction DTOs
# ==========================================

class PredictionRequest(BaseCamelModel):
    current_zone: str = Field(description="The zone the user is currently in.")
    target_zone: str = Field(description="The zone the user wants to go to.")
    time_offset_minutes: int = Field(default=0, description="Minutes from now to predict.")

class PredictionResponse(BaseCamelModel):
    prediction_text: str = Field(description="Natural language explanation of crowd prediction.")
    recommended_action: str = Field(description="Suggested action for the user based on crowd prediction.")

# ==========================================
# Route Recommendation DTOs
# ==========================================

class RouteRequest(BaseCamelModel):
    origin: str = Field(description="Starting location.")
    destination: str = Field(description="Target destination.")

class RouteSegmentDTO(BaseCamelModel):
    instruction: str
    distance_meters: int
    duration_seconds: int

class RouteResponse(BaseCamelModel):
    origin: str
    destination: str
    segments: List[RouteSegmentDTO]
    total_duration_seconds: int
    crowd_context: str = Field(description="Gemini-generated context explaining route adjustments for crowd avoidance.")
