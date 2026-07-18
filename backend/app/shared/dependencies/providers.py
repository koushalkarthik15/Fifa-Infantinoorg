
from app.shared.providers.ai import AIProvider
from app.shared.providers.maps import MapsProvider
from app.shared.providers.firebase import FirebaseProvider

from app.providers.gemini_provider import GeminiProvider
from app.providers.google_maps_provider import GoogleMapsProvider
from app.providers.firebase_provider import BackendFirebaseProvider

import threading
from app.shared.logging.logger import get_logger

logger = get_logger(__name__)

# Thread-safe global singletons. Initialized lazily.
_gemini_provider_instance = GeminiProvider()
_maps_provider_instance = GoogleMapsProvider()
_firebase_provider_instance = BackendFirebaseProvider()

_init_locks = {
    "ai": threading.Lock(),
    "maps": threading.Lock(),
    "firebase": threading.Lock(),
}

_initialized = {
    "ai": False,
    "maps": False,
    "firebase": False,
}

def initialize_providers() -> None:
    """Invoked during application lifespan startup. Now skipping eager initialization to optimize startup performance."""
    logger.info("Skipping eager initialization of external providers. They will be lazy-loaded on first request.")
    pass

def close_providers() -> None:
    """Invoked during application lifespan shutdown to clean up clients."""
    _gemini_provider_instance.close()
    _maps_provider_instance.close()
    _firebase_provider_instance.close()

# Dependency Providers
def get_ai_provider() -> AIProvider:
    if not _initialized["ai"]:
        with _init_locks["ai"]:
            if not _initialized["ai"]:
                _gemini_provider_instance.initialize()
                _initialized["ai"] = True
    return _gemini_provider_instance

def get_maps_provider() -> MapsProvider:
    if not _initialized["maps"]:
        with _init_locks["maps"]:
            if not _initialized["maps"]:
                _maps_provider_instance.initialize()
                _initialized["maps"] = True
    return _maps_provider_instance

def get_firebase_provider() -> FirebaseProvider:
    if not _initialized["firebase"]:
        with _init_locks["firebase"]:
            if not _initialized["firebase"]:
                _firebase_provider_instance.initialize()
                _initialized["firebase"] = True
    return _firebase_provider_instance
