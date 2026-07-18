from pydantic import BaseModel
from typing import List, Optional

class RouteSegmentDTO(BaseModel):
    instruction: str
    distance_meters: float
    duration_seconds: float

# Venue Navigation (NAV-001)
class VenueNavigationRequest(BaseModel):
    origin: str
    destination_category: Optional[str] = None
    destination_name: Optional[str] = None
    # Either destination_category or destination_name should be provided.

class VenueNavigationResponse(BaseModel):
    origin: str
    destination: str
    segments: List[RouteSegmentDTO]
    total_duration_seconds: float

# Transportation (NAV-002)
class TransportationRequest(BaseModel):
    origin: str
    destination: str
    context: Optional[str] = None # e.g. "I have a lot of luggage"

class TransportationResponse(BaseModel):
    origin: str
    destination: str
    recommended_mode: str
    explanation: str
