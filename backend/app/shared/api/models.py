from typing import Any, Generic, TypeVar, Optional, List
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class BaseCamelModel(BaseModel):
    """Base model that automatically aliases snake_case to camelCase for JSON."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class APIError(BaseCamelModel):
    """
    Standard error envelope for all failed API responses.
    """

    code: str = Field(
        description="A machine-readable error code (e.g., 'VALIDATION_ERROR')"
    )
    message: str = Field(description="A human-readable error message")
    details: Optional[Any] = Field(
        default=None, description="Optional structured details about the error"
    )


class APIResponse(BaseCamelModel, Generic[T]):
    """
    Standard success envelope for single item responses.
    """

    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None
    meta: Optional[dict[str, Any]] = None


class PaginatedResponse(BaseCamelModel, Generic[T]):
    """
    Standard success envelope for paginated collection responses.
    """

    items: List[T]
    total_count: int
    page_size: int
    current_page: int
    has_next_page: bool


class HealthResponse(BaseCamelModel):
    """
    Liveness health check response model.
    """

    status: str = "ok"
    service: str = "InfantinoOrg API"
    version: str = "0.1.0"


class ReadinessResponse(BaseCamelModel):
    """
    Readiness health check response model aggregating dependencies.
    """

    status: str
    database: str
    services: dict[str, str]


# Shared Request Parameters


class PaginationParams(BaseCamelModel):
    """
    Standard query parameters for pagination.
    """

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    size: int = Field(default=20, ge=1, le=100, description="Number of items per page")


class SortParams(BaseCamelModel):
    """
    Standard query parameters for sorting.
    """

    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_desc: bool = Field(default=False, description="Sort in descending order")


class FilterParams(BaseCamelModel):
    """
    Standard query parameters for basic filtering.
    """

    query: Optional[str] = Field(default=None, description="General search query")
