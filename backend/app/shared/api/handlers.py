from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.shared.logging.logger import get_logger
from app.shared.api.exceptions import AppException
from app.shared.api.models import APIError

logger = get_logger(__name__)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handles custom domain-agnostic AppExceptions and maps them to the standard APIError payload.
    """
    logger.warning(
        f"AppException: {exc.code} - {exc.message}", extra={"details": exc.details}
    )
    error_response = APIError(code=exc.code, message=exc.message, details=exc.details)
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(exclude_none=True, by_alias=True),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handles FastAPI/Pydantic validation errors and maps them to the standard APIError payload.
    """
    details = exc.errors()
    logger.warning("Request validation error", extra={"details": details})

    # Restructure Pydantic errors to be more frontend-friendly if necessary
    formatted_details = [
        {
            "loc": ".".join(map(str, err.get("loc", []))),
            "msg": err.get("msg"),
            "type": err.get("type"),
        }
        for err in details
    ]

    error_response = APIError(
        code="VALIDATION_ERROR",
        message="Request validation failed",
        details=formatted_details,
    )
    return JSONResponse(
        status_code=422,
        content=error_response.model_dump(exclude_none=True, by_alias=True),
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """
    Handles raw Starlette/FastAPI HTTPExceptions (e.g., 404 from non-existent route)
    and maps them to the standard APIError payload.
    """
    logger.warning(f"HTTPException: {exc.status_code} - {exc.detail}")

    code = "API_ERROR"
    if exc.status_code == 404:
        code = "NOT_FOUND"
    elif exc.status_code == 401:
        code = "UNAUTHORIZED"
    elif exc.status_code == 403:
        code = "FORBIDDEN"

    error_response = APIError(code=code, message=str(exc.detail), details=None)
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(exclude_none=True, by_alias=True),
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all for any unhandled exceptions to prevent leaking stack traces
    and ensure standard APIError payload.
    """
    logger.exception("Unhandled server error")
    error_response = APIError(
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected internal server error occurred.",
        details=None,
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump(exclude_none=True, by_alias=True),
    )
