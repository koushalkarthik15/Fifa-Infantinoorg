from sqlmodel import SQLModel, Field
from typing import Optional


class VenueLocation(SQLModel, table=True):
    __tablename__ = "venue_locations"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    category: str = Field(index=True)  # Gate, Restroom, Medical, Food, Exit, Seat
    latitude: float
    longitude: float
    description: Optional[str] = Field(default=None)
    is_accessible: bool = Field(default=True)
