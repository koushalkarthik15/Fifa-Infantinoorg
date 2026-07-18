from pydantic import BaseModel, Field
from typing import List


class IncidentRequest(BaseModel):
    description: str = Field(..., max_length=1000)
    location: str = Field(..., max_length=100)


class IncidentResponse(BaseModel):
    category: str
    priority: str
    suggested_actions: List[str]
    assigned_volunteer: str
