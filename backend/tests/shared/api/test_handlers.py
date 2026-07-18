from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import BaseModel
from app.shared.api.exceptions import NotFoundError, AppException
from app.shared.api.handlers import (
    app_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

app = FastAPI()

# Register handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)


class DummyPayload(BaseModel):
    name: str
    age: int


@app.get("/test/not-found")
async def route_not_found():
    raise NotFoundError(message="Custom not found", details={"id": 123})


@app.get("/test/general-error")
async def route_general_error():
    raise ValueError("Something bad happened internally")


@app.post("/test/validation")
async def route_validation(payload: DummyPayload):
    return payload


client = TestClient(app)


def test_custom_app_exception_handler():
    response = client.get("/test/not-found")
    assert response.status_code == 404
    data = response.json()
    assert data["code"] == "NOT_FOUND"
    assert data["message"] == "Custom not found"
    assert data["details"] == {"id": 123}


def test_pydantic_validation_handler():
    response = client.post("/test/validation", json={"name": "test"})  # Missing age
    assert response.status_code == 422
    data = response.json()
    assert data["code"] == "VALIDATION_ERROR"
    assert data["message"] == "Request validation failed"
    assert len(data["details"]) > 0
    assert data["details"][0]["loc"] == "body.age"
    assert data["details"][0]["type"] == "missing"


def test_starlette_http_exception_handler():
    # Calling a route that doesn't exist
    response = client.get("/does-not-exist")
    assert response.status_code == 404
    data = response.json()
    assert data["code"] == "NOT_FOUND"
    assert data["message"] == "Not Found"
    assert "details" not in data or data["details"] is None


def test_general_exception_handler():
    # We must set raise_server_exceptions=False so the client doesn't re-raise the ValueError
    error_client = TestClient(app, raise_server_exceptions=False)
    response = error_client.get("/test/general-error")
    assert response.status_code == 500
    data = response.json()
    assert data["code"] == "INTERNAL_SERVER_ERROR"
    assert data["message"] == "An unexpected internal server error occurred."
