from pydantic import BaseModel, Field
from typing import List, Optional


# ACC-001 Voice Assistant
class AssistantRequest(BaseModel):
    query: str = Field(..., max_length=500)
    context: Optional[str] = None


class AssistantResponse(BaseModel):
    response: str
    suggested_actions: List[str] = []


# ACC-002 Accessible Navigation
class RouteSegmentDTO(BaseModel):
    instruction: str
    distance_meters: float
    duration_seconds: float


class AccessibleRouteRequest(BaseModel):
    origin: str
    destination: str
    needs_wheelchair: bool = Field(True, alias="needsWheelchair")


class AccessibleRouteResponse(BaseModel):
    origin: str
    destination: str
    segments: List[RouteSegmentDTO]
    total_duration_seconds: float
    accessibility_context: str


# ACC-003 Vision Assistance (Request uses multipart/form-data, so only response needed)
class VisionResponse(BaseModel):
    description: str
    obstacles_identified: List[str] = []


# ACC-004 Live Translation
class TranslationRequest(BaseModel):
    text: str = Field(..., max_length=2000)
    target_language: str = Field(
        ..., description="Must be English, Spanish, or French", alias="targetLanguage"
    )


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str
