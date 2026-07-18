from typing import Optional
import firebase_admin

from app.shared.providers.firebase import FirebaseProvider
from app.config.config import settings
from app.shared.logging.logger import get_logger
from app.shared.api.exceptions import ExternalServiceError

logger = get_logger(__name__)


class BackendFirebaseProvider(FirebaseProvider):
    def __init__(self):
        self.app: Optional[firebase_admin.App] = None

    def initialize(self) -> None:
        if not settings.ENABLE_FIREBASE:
            logger.info("Firebase provider is disabled by configuration.")
            return

        # Check if already initialized to prevent duplicate initialization
        try:
            self.app = firebase_admin.get_app()
            logger.info("Firebase app was already initialized.")
            return
        except ValueError:
            pass  # Not initialized

        if not settings.FIREBASE_PROJECT_ID:
            logger.error("ENABLE_FIREBASE is true but FIREBASE_PROJECT_ID is missing.")
            raise ExternalServiceError("Firebase configuration is incomplete.")

        try:
            # For simplicity without service account files in this setup,
            # we initialize with the default credential strategy which will pick up
            # GOOGLE_APPLICATION_CREDENTIALS automatically if deployed.
            # In a real environment, we might load from a JSON path.
            self.app = firebase_admin.initialize_app(
                options={
                    "projectId": settings.FIREBASE_PROJECT_ID,
                }
            )
            logger.info("Firebase provider initialized successfully.")
        except Exception:
            logger.exception("Failed to initialize Firebase Admin SDK.")
            raise ExternalServiceError("Failed to initialize Firebase provider.")

    def check_health(self) -> str:
        if not settings.ENABLE_FIREBASE:
            return "disabled"
        if not self.app:
            return "error"
        return "connected"

    def close(self) -> None:
        if self.app:
            firebase_admin.delete_app(self.app)
            self.app = None
        logger.info("Firebase provider closed.")
