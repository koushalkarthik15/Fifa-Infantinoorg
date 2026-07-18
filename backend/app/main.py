from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config.config import settings
from app.shared.logging.logger import get_logger, setup_logging
from app.shared.logging.middleware import RequestLoggerMiddleware
from app.shared.middleware.security import SecurityHeadersMiddleware
from app.shared.api.exceptions import AppException
from app.shared.api.handlers import (
    app_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler,
)
from app.api.v1.router import api_v1_router, health_check
from app.database.core import init_db
from app.shared.dependencies.providers import initialize_providers, close_providers

# Ensure logging is setup as early as possible
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up")
    init_db()
    logger.info("Database initialized successfully")

    initialize_providers()
    logger.info("External service providers initialized")

    yield

    # Shutdown
    logger.info("Application shutting down")
    close_providers()
    logger.info("External service providers closed")


tags_metadata = [
    {
        "name": "Infrastructure",
        "description": "Health and readiness endpoints for infrastructure monitoring.",
    },
    {
        "name": "Crowd AI",
        "description": "Crowd analytics and AI predictive modeling.",
    },
    {
        "name": "Smart Navigation",
        "description": "Stadium mapping and routing workflows.",
    },
    {
        "name": "Accessibility & Multilingual Assistant",
        "description": "Multi-language and accessibility translation services.",
    },
    {
        "name": "Volunteer AI",
        "description": "Volunteer deployment and task recommendations.",
    },
    {
        "name": "Sustainability Assistant",
        "description": "Environmental analytics and sustainability reporting.",
    },
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="InfantinoOrg Backend Platform",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
)

# CORS Middleware Configuration
if not settings.CORS_ORIGINS:
    logger.warning("CORS_ORIGINS is empty. API may be unreachable from web clients.")

# In production, we restrict to explicitly defined origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        [str(origin) for origin in settings.CORS_ORIGINS]
        if settings.CORS_ORIGINS
        else []
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

if settings.ENABLE_REQUEST_LOGGING:
    app.add_middleware(RequestLoggerMiddleware)

# Routers
app.include_router(api_v1_router)


# Infrastructure unversioned health alias
@app.get(
    "/health",
    tags=["Infrastructure"],
    response_model=health_check.__annotations__.get("return"),
)
async def unversioned_health_check():
    """Alias to the versioned health check for infrastructure compatibility."""
    return await health_check()
