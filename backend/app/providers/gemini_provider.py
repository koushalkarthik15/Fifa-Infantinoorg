from typing import Any, Optional
from google import genai
from google.genai.errors import APIError

from app.shared.providers.ai import AIProvider
from app.config.config import settings
from app.shared.logging.logger import get_logger
from app.shared.api.exceptions import ExternalServiceError, ExternalServiceTimeoutError

logger = get_logger(__name__)

class GeminiProvider(AIProvider):
    def __init__(self):
        self.client: Optional[genai.Client] = None

    def initialize(self) -> None:
        if not settings.ENABLE_GEMINI:
            logger.info("Gemini provider is disabled by configuration.")
            return

        if not settings.GEMINI_API_KEY:
            logger.error("ENABLE_GEMINI is true but GEMINI_API_KEY is missing.")
            raise ExternalServiceError("Gemini configuration is incomplete.")

        try:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            logger.info("Gemini provider initialized successfully.")
        except Exception:
            logger.exception("Failed to initialize Gemini client.")
            raise ExternalServiceError("Failed to initialize Gemini provider.")

    def check_health(self) -> str:
        if not settings.ENABLE_GEMINI:
            return "disabled"
        if not self.client:
            return "error"
        
        # A lightweight check: Since the SDK doesn't have a direct "ping", 
        # checking if the client exists and is enabled serves as readiness.
        # We avoid expensive generation calls.
        return "connected"

    def close(self) -> None:
        self.client = None
        logger.info("Gemini provider closed.")

    def generate_content(
        self, 
        prompt: str, 
        image_bytes: Optional[bytes] = None, 
        mime_type: Optional[str] = None, 
        **kwargs: Any
    ) -> str:
        if not self.client:
            raise ExternalServiceError("Gemini provider is not initialized.")
        # List of models to try in order of preference
        FALLBACK_MODELS = [
            "gemini-3.5-flash",
            "gemini-2.5-flash",
            "gemini-2.0-flash-001",
            "gemini-2.0-flash",
        ]
        max_attempts = 3
        delay_seconds = 2
        for model_name in FALLBACK_MODELS:
            attempt = 0
            while attempt < max_attempts:
                try:
                    contents = []
                    if image_bytes and mime_type:
                        contents.append({"mime_type": mime_type, "data": image_bytes})
                    contents.append(prompt)

                    response = self.client.models.generate_content(
                        model=model_name,
                        contents=contents
                    )
                    return response.text or ""
                except APIError as e:
                    # Retry on 503 UNAVAILABLE errors (high demand)
                    if "503" in str(e) or "UNAVAILABLE" in str(e):
                        attempt += 1
                        logger.warning(f"Gemini 503 error on {model_name}, retry {attempt}/{max_attempts}: {e}")
                        if attempt < max_attempts:
                            import time
                            time.sleep(delay_seconds)
                            continue
                    # Non‑retryable Gemini error – move to next model
                    logger.error(f"Gemini API Error with model {model_name}: {str(e)}")
                    break
                except Exception as e:
                    # Handle generic timeout/connection errors
                    if "timeout" in str(e).lower():
                        raise ExternalServiceTimeoutError("Gemini request timed out.")
                    logger.error(f"Unexpected error in Gemini generation: {str(e)}")
                    raise ExternalServiceError("Unexpected error communicating with Gemini.")
            # End while attempts for this model – try next model
        # If all models exhausted
        raise ExternalServiceError("Failed to generate content via Gemini after all fallback models.")
