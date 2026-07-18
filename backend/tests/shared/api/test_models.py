import pytest
from pydantic import ValidationError
from app.shared.api.models import (
    APIResponse,
    APIError,
    PaginationParams,
)


def test_api_response_serialization():
    response = APIResponse[dict](data={"foo": "bar"}, meta={"time": "now"})
    dump = response.model_dump(by_alias=True)
    assert dump["data"] == {"foo": "bar"}
    assert dump["meta"] == {"time": "now"}


def test_api_error_serialization():
    error = APIError(code="ERR", message="Bad", details={"id": 1})
    dump = error.model_dump(exclude_none=True, by_alias=True)
    assert dump["code"] == "ERR"
    assert dump["message"] == "Bad"
    assert dump["details"] == {"id": 1}


def test_pagination_params_validation():
    # Valid
    params = PaginationParams(page=2, size=50)
    assert params.page == 2
    assert params.size == 50

    # Invalid page
    with pytest.raises(ValidationError):
        PaginationParams(page=0, size=20)

    # Invalid size
    with pytest.raises(ValidationError):
        PaginationParams(page=1, size=101)
