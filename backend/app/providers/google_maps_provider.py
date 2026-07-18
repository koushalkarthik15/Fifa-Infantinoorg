from typing import Optional
import googlemaps
from googlemaps.exceptions import ApiError

from app.shared.providers.maps import MapsProvider
from app.config.config import settings
from app.shared.logging.logger import get_logger
from app.shared.api.exceptions import ExternalServiceError

logger = get_logger(__name__)


class GoogleMapsProvider(MapsProvider):
    def __init__(self):
        self.client: Optional[googlemaps.Client] = None

    def initialize(self) -> None:
        if not settings.ENABLE_MAPS:
            logger.info("Google Maps provider is disabled by configuration.")
            return

        if not settings.GOOGLE_MAPS_API_KEY:
            logger.error("ENABLE_MAPS is true but GOOGLE_MAPS_API_KEY is missing.")
            raise ExternalServiceError("Google Maps configuration is incomplete.")

        try:
            self.client = googlemaps.Client(
                key=settings.GOOGLE_MAPS_API_KEY,
                timeout=settings.EXTERNAL_SERVICE_TIMEOUT_SECONDS,
            )
            logger.info("Google Maps provider initialized successfully.")
        except Exception:
            logger.exception("Failed to initialize Google Maps client.")
            raise ExternalServiceError("Failed to initialize Google Maps provider.")

    def check_health(self) -> str:
        if not settings.ENABLE_MAPS:
            return "disabled"
        if not self.client:
            return "error"

        # Similar to Gemini, we don't ping the live API in health checks.
        return "connected"

    def close(self) -> None:
        # The python googlemaps client uses requests session under the hood.
        # Usually it cleans up, but we'll release the ref.
        self.client = None
        logger.info("Google Maps provider closed.")

    def get_directions(self, origin: str, destination: str, **kwargs) -> dict:
        if not self.client:
            raise ExternalServiceError("Google Maps provider is not initialized.")

        max_attempts = 3
        delay_seconds = 2
        attempt = 0

        while attempt < max_attempts:
            try:
                # We explicitly ask for walking directions for stadium navigation
                result = self.client.directions(
                    origin=origin, destination=destination, mode="walking"
                )

                if not result:
                    return {"segments": [], "total_duration_seconds": 0}

                route = result[0]
                leg = route["legs"][0]

                segments = []
                import re

                for step in leg.get("steps", []):
                    # html_instructions from google maps
                    instruction_html = step.get("html_instructions", "")
                    instruction_clean = re.sub(r"<[^>]+>", "", instruction_html)

                    segments.append(
                        {
                            "instruction": instruction_clean,
                            "distance_meters": step.get("distance", {}).get("value", 0),
                            "duration_seconds": step.get("duration", {}).get(
                                "value", 0
                            ),
                        }
                    )

                return {
                    "segments": segments,
                    "total_duration_seconds": leg.get("duration", {}).get("value", 0),
                }
            except ApiError as e:
                attempt += 1
                logger.warning(
                    f"Google Maps API Error, retry {attempt}/{max_attempts}: {str(e)}"
                )
                if attempt < max_attempts:
                    import time

                    time.sleep(delay_seconds)
                    delay_seconds *= 2
                    continue
                logger.error(f"Google Maps API Error after retries: {str(e)}")
                raise ExternalServiceError(
                    "Failed to fetch directions from Google Maps."
                )
            except Exception as e:
                attempt += 1
                logger.warning(
                    f"Unexpected Google Maps error, retry {attempt}/{max_attempts}: {str(e)}"
                )
                if attempt < max_attempts:
                    import time

                    time.sleep(delay_seconds)
                    delay_seconds *= 2
                    continue
                logger.error(
                    f"Unexpected error in Google Maps directions after retries: {str(e)}"
                )
                raise ExternalServiceError(
                    "Unexpected error communicating with Google Maps."
                )

        raise ExternalServiceError("Google Maps service unavailable after retries.")
