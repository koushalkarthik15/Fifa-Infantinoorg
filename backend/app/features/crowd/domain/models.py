from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime


class CrowdDensityNode(SQLModel, table=True):
    """
    Represents a physical location grid point inside the stadium
    and its associated crowd density level.
    """

    __tablename__ = "crowd_density_node"

    id: Optional[int] = Field(default=None, primary_key=True)
    zone_name: str = Field(index=True)
    latitude: float
    longitude: float
    density_level: int = Field(
        default=0, description="Density scale from 0 (empty) to 100 (packed)"
    )
    last_updated: datetime = Field(default_factory=datetime.utcnow)
