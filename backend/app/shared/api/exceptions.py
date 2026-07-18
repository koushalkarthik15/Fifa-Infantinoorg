from typing import Any, Optional


class AppException(Exception):
    """
    Base exception for all domain-agnostic application errors.
    All custom exceptions should inherit from this.
    """

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = 500,
        details: Optional[Any] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details


class NotFoundError(AppException):
    def __init__(
        self, message: str = "Resource not found", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="NOT_FOUND", status_code=404, details=details
        )


class ValidationError(AppException):
    def __init__(
        self, message: str = "Validation failed", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="VALIDATION_ERROR", status_code=422, details=details
        )


class UnauthorizedError(AppException):
    def __init__(
        self, message: str = "Authentication required", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="UNAUTHORIZED", status_code=401, details=details
        )


class ForbiddenError(AppException):
    def __init__(
        self, message: str = "Permission denied", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="FORBIDDEN", status_code=403, details=details
        )


class ExternalServiceError(AppException):
    def __init__(
        self, message: str = "External service error", details: Optional[Any] = None
    ):
        super().__init__(
            message=message,
            code="EXTERNAL_SERVICE_ERROR",
            status_code=502,
            details=details,
        )


class ExternalServiceTimeoutError(ExternalServiceError):
    def __init__(
        self, message: str = "External service timeout", details: Optional[Any] = None
    ):
        super().__init__(
            message=message,
            code="EXTERNAL_SERVICE_TIMEOUT",
            status_code=504,
            details=details,
        )


class RateLimitError(AppException):
    def __init__(
        self, message: str = "Too many requests", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="RATE_LIMIT_ERROR", status_code=429, details=details
        )


class ConflictError(AppException):
    def __init__(
        self, message: str = "Resource conflict", details: Optional[Any] = None
    ):
        super().__init__(
            message=message, code="CONFLICT", status_code=409, details=details
        )
