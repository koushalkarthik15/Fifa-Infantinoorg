import logging
import sys

from app.config.config import settings
from app.shared.logging.formatter import JSONFormatter, TextFormatter

# We use an application-specific root logger to avoid polluting the global python root logger
APP_LOGGER_NAME = "infantinoorg"

_is_setup = False


def setup_logging():
    global _is_setup
    if _is_setup:
        return

    app_logger = logging.getLogger(APP_LOGGER_NAME)

    # Idempotent setup: clear existing handlers
    if app_logger.hasHandlers():
        app_logger.handlers.clear()

    app_logger.propagate = False
    app_logger.setLevel(settings.LOG_LEVEL.upper())

    handler = logging.StreamHandler(sys.stdout)

    if settings.LOG_FORMAT.lower() == "json":
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(TextFormatter())

    app_logger.addHandler(handler)
    _is_setup = True


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger child of the main application logger.
    If the name is just __name__ and it's outside 'app', we still attach it to APP_LOGGER_NAME.
    """
    # If it's already starting with the app logger name, use it directly
    if name.startswith(APP_LOGGER_NAME):
        return logging.getLogger(name)

    # Standardize by nesting all requested loggers under the main app logger
    return logging.getLogger(f"{APP_LOGGER_NAME}.{name}")
