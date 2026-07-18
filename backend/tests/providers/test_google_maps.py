import pytest
from unittest.mock import MagicMock, patch
from googlemaps.exceptions import ApiError
from app.providers.google_maps_provider import GoogleMapsProvider
from app.shared.api.exceptions import ExternalServiceError

@pytest.fixture
def mock_settings():
    with patch("app.providers.google_maps_provider.settings") as mock:
        mock.ENABLE_MAPS = True
        mock.GOOGLE_MAPS_API_KEY = "test_key"
        mock.EXTERNAL_SERVICE_TIMEOUT_SECONDS = 5
        yield mock

def test_google_maps_initialize(mock_settings):
    provider = GoogleMapsProvider()
    with patch("app.providers.google_maps_provider.googlemaps.Client") as mock_client:
        provider.initialize()
        mock_client.assert_called_once_with(key="test_key", timeout=5)
        assert provider.client is not None

def test_google_maps_disabled(mock_settings):
    mock_settings.ENABLE_MAPS = False
    provider = GoogleMapsProvider()
    provider.initialize()
    assert provider.client is None
    assert provider.check_health() == "disabled"

def test_get_directions_success():
    provider = GoogleMapsProvider()
    provider.client = MagicMock()
    
    mock_result = [{
        "legs": [{
            "duration": {"value": 600},
            "steps": [
                {"html_instructions": "<b>Walk</b> straight", "distance": {"value": 100}, "duration": {"value": 300}}
            ]
        }]
    }]
    
    provider.client.directions.return_value = mock_result
    
    result = provider.get_directions("A", "B")
    
    assert result["total_duration_seconds"] == 600
    assert len(result["segments"]) == 1
    assert result["segments"][0]["instruction"] == "Walk straight"

def test_get_directions_uninitialized():
    provider = GoogleMapsProvider()
    provider.client = None
    with pytest.raises(ExternalServiceError):
        provider.get_directions("A", "B")

@patch("time.sleep", return_value=None)
def test_get_directions_retries_on_error(mock_sleep):
    provider = GoogleMapsProvider()
    provider.client = MagicMock()
    
    # Simulate API error 3 times
    provider.client.directions.side_effect = ApiError(400, "Bad Request")
    
    with pytest.raises(ExternalServiceError):
        provider.get_directions("A", "B")
    
    assert provider.client.directions.call_count == 3
