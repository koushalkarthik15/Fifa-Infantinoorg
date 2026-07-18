from sqlmodel import Session, select
from typing import List, Optional
from app.features.navigation.domain.models import VenueLocation


class NavigationRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_location_by_name(self, name: str) -> Optional[VenueLocation]:
        statement = select(VenueLocation).where(VenueLocation.name == name)
        return self.session.exec(statement).first()

    def get_locations_by_category(self, category: str) -> List[VenueLocation]:
        statement = select(VenueLocation).where(VenueLocation.category == category)
        return list(self.session.exec(statement).all())
