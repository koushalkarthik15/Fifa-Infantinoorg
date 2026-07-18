from abc import abstractmethod
from app.shared.providers.base import BaseProvider
from typing import Any, Dict


class MapsProvider(BaseProvider):
    """
    Abstract interface for mapping/routing providers (e.g., Google Maps).
    """

    @abstractmethod
    def get_directions(
        self, origin: str, destination: str, **kwargs: Any
    ) -> Dict[str, Any]:
        """
        Retrieves routing directions between origin and destination.
        """
        pass
