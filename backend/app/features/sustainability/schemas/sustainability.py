from pydantic import BaseModel
from typing import List

class RouteSegmentDTO(BaseModel):
    instruction: str
    distance_meters: int
    duration_seconds: int

class GreenRouteRequest(BaseModel):
    origin: str
    destination: str

class GreenRouteResponse(BaseModel):
    origin: str
    destination: str
    segments: List[RouteSegmentDTO]
    total_duration_seconds: int
    eco_score: str
    recommendation: str

class FacilityRequest(BaseModel):
    location: str

class FacilityResponse(BaseModel):
    water_stations: List[str]
    recycling_bins: List[str]
