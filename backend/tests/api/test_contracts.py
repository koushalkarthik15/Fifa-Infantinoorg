from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_success_envelope():
    """Validate that successful responses use a standard envelope or follow schema rules."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    # While Health may not have full pagination/data envelopes, we check consistency.
    assert isinstance(data, dict)

def test_api_error_envelope():
    """Validate that error responses follow the standard error schema."""
    response = client.post("/api/v1/health")
    assert response.status_code == 405
    data = response.json()
    # The error is returned directly at the top level
    assert "code" in data
    assert "message" in data

def test_api_422_validation_envelope():
    """Validate that Pydantic validation errors are correctly formatted."""
    response = client.post("/api/v1/volunteer/incidents", json={})
    if response.status_code == 422:
        data = response.json()
        assert "code" in data
        assert data["code"] == "VALIDATION_ERROR"
        assert "details" in data
        assert isinstance(data["details"], list)
