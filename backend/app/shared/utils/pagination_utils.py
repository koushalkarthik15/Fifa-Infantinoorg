from typing import List, TypeVar
from app.shared.api.models import PaginatedResponse

T = TypeVar("T")


def format_paginated_response(
    items: List[T], total_count: int, page: int, size: int
) -> PaginatedResponse[T]:
    """
    Safely format raw generic lists into the standard PaginatedResponse envelope.
    Calculates `hasNextPage` automatically.
    """
    total_pages = (total_count + size - 1) // size if size > 0 else 0
    has_next = page < total_pages

    return PaginatedResponse(
        items=items,
        total_count=total_count,
        page_size=size,
        current_page=page,
        has_next_page=has_next,
    )
