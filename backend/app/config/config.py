from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Config
    PROJECT_NAME: str = "InfantinoOrg API"
    ENVIRONMENT: str = "development"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    ENABLE_REQUEST_LOGGING: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./infantinoorg.db"

    # CORS — Empty by default (safe). Must be explicitly configured via
    # CORS_ORIGINS environment variable in all environments.
    # Example: CORS_ORIGINS=["https://infantino.org","http://localhost:3000"]
    CORS_ORIGINS: List[str] = []

    # External Services Flags
    ENABLE_GEMINI: bool = False
    ENABLE_MAPS: bool = False
    ENABLE_FIREBASE: bool = False

    # Timeouts
    EXTERNAL_SERVICE_TIMEOUT_SECONDS: int = 15

    # External Services Keys (Placeholders)
    GOOGLE_MAPS_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    FIREBASE_PROJECT_ID: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached instance of the settings.
    Ensures environment variables are only read from the disk once.
    """
    return Settings()


# Backwards compatibility for existing imports until refactored globally
settings = get_settings()
