from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """
    Abstract base class for all external service providers.
    Ensures a consistent lifecycle and health-checking interface.
    """

    @abstractmethod
    def initialize(self) -> None:
        """Initialize the provider client or SDK."""
        pass

    @abstractmethod
    def check_health(self) -> str:
        """
        Verify the provider is operational.
        Returns a string status: 'connected', 'disabled', or 'error'.
        """
        pass

    @abstractmethod
    def close(self) -> None:
        """Clean up connections, sessions, or background tasks."""
        pass
