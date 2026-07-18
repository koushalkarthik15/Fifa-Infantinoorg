from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.main import app

client = TestClient(app)

@patch("app.features.crowd.services.crowd_service.CrowdRepository")
def test_heatmap_empty_repository(mock_repo_class):
    # Mock the repository to return empty list
    mock_repo_instance = mock_repo_class.return_value
    mock_repo_instance.get_all_nodes.return_value = []
    
    # We also need to patch get_crowd_service dependency to inject this mock
    # A simple way without changing Depends is patching at the service level 
    # but the router instantiates it via Depends. 
    # Let's override the dependency in FastAPI.
    from app.features.crowd.routes import get_crowd_service
    from app.features.crowd.services.crowd_service import CrowdService
    
    mock_service = CrowdService(mock_repo_instance)
    app.dependency_overrides[get_crowd_service] = lambda: mock_service
    
    response = client.get("/api/v1/crowd/heatmap")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["nodes"]) == 0
    
    app.dependency_overrides.clear()

@patch("app.features.crowd.services.crowd_service.get_ai_provider")
def test_prediction_gemini_unavailable(mock_get_ai):
    # Mock AI provider to throw an exception
    mock_ai_instance = MagicMock()
    mock_ai_instance.generate_text.side_effect = Exception("Gemini API Error")
    mock_get_ai.return_value = mock_ai_instance
    
    request_payload = {
        "currentZone": "North Gate",
        "targetZone": "Section 101",
        "timeOffsetMinutes": 10
    }
    response = client.post("/api/v1/crowd/prediction", json=request_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Unable to generate prediction" in data["data"]["predictionText"]

@patch("app.features.crowd.services.crowd_service.get_maps_provider")
@patch("app.features.crowd.services.crowd_service.get_ai_provider")
def test_route_maps_and_gemini_unavailable(mock_get_ai, mock_get_maps):
    mock_maps_instance = MagicMock()
    mock_maps_instance.get_directions.side_effect = Exception("Maps API Error")
    mock_get_maps.return_value = mock_maps_instance
    
    mock_ai_instance = MagicMock()
    mock_ai_instance.generate_text.side_effect = Exception("Gemini API Error")
    mock_get_ai.return_value = mock_ai_instance
    
    request_payload = {
        "origin": "North Gate",
        "destination": "Section 101"
    }
    response = client.post("/api/v1/crowd/route", json=request_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    # Fallback path should exist
    assert len(data["data"]["segments"]) == 1
    assert data["data"]["segments"][0]["instruction"] == "Head directly to Section 101"
    assert data["data"]["crowdContext"] == "AI crowd context currently unavailable."

@patch("app.features.crowd.services.crowd_service.get_maps_provider")
@patch("app.features.crowd.services.crowd_service.get_ai_provider")
def test_route_success(mock_get_ai, mock_get_maps):
    mock_maps_instance = MagicMock()
    mock_maps_instance.get_directions.return_value = {
        "segments": [
            {"instruction": "Walk North 100m", "distance_meters": 100, "duration_seconds": 60}
        ],
        "total_duration_seconds": 60
    }
    mock_get_maps.return_value = mock_maps_instance
    
    mock_ai_instance = MagicMock()
    # Need to return JSON string as the service calls json.loads
    mock_ai_instance.generate_content.return_value = '{"crowd_context": "Route is mostly clear."}'
    mock_get_ai.return_value = mock_ai_instance
    
    request_payload = {
        "origin": "North Gate",
        "destination": "Section 101"
    }
    response = client.post("/api/v1/crowd/route", json=request_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["segments"]) == 1
    assert data["data"]["segments"][0]["distanceMeters"] == 100
    assert data["data"]["crowdContext"] == "Route is mostly clear."
