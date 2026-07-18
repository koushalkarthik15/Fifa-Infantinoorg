from datetime import datetime, timezone
from app.shared.utils.datetime_utils import utcnow, format_iso8601
from app.shared.utils.pagination_utils import format_paginated_response
from app.shared.utils.validation_utils import normalize_whitespace, is_valid_email_format

def test_utcnow():
    now = utcnow()
    assert now.tzinfo == timezone.utc

def test_format_iso8601():
    dt = datetime(2023, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    formatted = format_iso8601(dt)
    assert formatted == "2023-01-01T12:00:00Z"
    
    # Test naive conversion
    dt_naive = datetime(2023, 1, 1, 12, 0, 0)
    formatted_naive = format_iso8601(dt_naive)
    assert formatted_naive == "2023-01-01T12:00:00Z"

def test_format_paginated_response():
    items = [1, 2, 3]
    response = format_paginated_response(items, total_count=15, page=1, size=3)
    
    assert response.items == items
    assert response.total_count == 15
    assert response.current_page == 1
    assert response.page_size == 3
    assert response.has_next_page is True
    
    # Last page test
    response_end = format_paginated_response(items, total_count=15, page=5, size=3)
    assert response_end.has_next_page is False

def test_normalize_whitespace():
    text = "  hello   world  "
    assert normalize_whitespace(text) == "hello world"
    assert normalize_whitespace("") == ""
    assert normalize_whitespace(None) is None

def test_is_valid_email_format():
    assert is_valid_email_format("test@example.com") is True
    assert is_valid_email_format("test.user@sub.domain.co") is True
    assert is_valid_email_format("invalid-email") is False
    assert is_valid_email_format("@example.com") is False
