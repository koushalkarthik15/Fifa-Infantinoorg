from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch

client = TestClient(app)


def test_health_liveness():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "InfantinoOrg Backend API"
    assert data["version"] == "0.1.0"
    # Liveness should not contain services/database details
    assert "database" not in data


@patch("app.api.v1.router.get_ai_provider")
@patch("app.api.v1.router.get_maps_provider")
@patch("app.api.v1.router.get_firebase_provider")
def test_readiness_checks(mock_firebase, mock_maps, mock_ai):
    # Mock all providers to return 'connected'
    mock_ai.return_value.check_health.return_value = "connected"
    mock_maps.return_value.check_health.return_value = "connected"
    mock_firebase.return_value.check_health.return_value = "connected"

    response = client.get("/api/v1/readiness")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"
    assert "services" in data
    assert data["services"]["gemini"] == "connected"
    assert data["services"]["maps"] == "connected"
    assert data["services"]["firebase"] == "connected"
