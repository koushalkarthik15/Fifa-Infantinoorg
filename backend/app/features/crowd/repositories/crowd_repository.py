from typing import List
from sqlmodel import Session, select
from app.features.crowd.domain.models import CrowdDensityNode

class CrowdRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all_nodes(self) -> List[CrowdDensityNode]:
        """
        Retrieves all crowd density nodes representing the current heatmap state.
        """
        statement = select(CrowdDensityNode)
        results = self.session.exec(statement).all()
        return list(results)
