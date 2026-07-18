import pytest
from unittest.mock import patch
from app.config.config import settings
from app.providers.gemini_provider import GeminiProvider
from app.providers.google_maps_provider import GoogleMapsProvider
from app.providers.firebase_provider import BackendFirebaseProvider
from app.shared.api.exceptions import ExternalServiceError

# Tests for Gemini
def test_gemini_disabled(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_GEMINI", False)
    provider = GeminiProvider()
    provider.initialize()
    assert provider.check_health() == "disabled"
    assert provider.client is None

@patch("google.genai.Client")
def test_gemini_enabled(mock_client, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_GEMINI", True)
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "dummy_key")
    provider = GeminiProvider()
    provider.initialize()
    assert provider.check_health() == "connected"
    
def test_gemini_missing_key(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_GEMINI", True)
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    provider = GeminiProvider()
    with pytest.raises(ExternalServiceError, match="Gemini configuration is incomplete"):
        provider.initialize()

# Tests for Maps
def test_maps_disabled(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_MAPS", False)
    provider = GoogleMapsProvider()
    provider.initialize()
    assert provider.check_health() == "disabled"
    assert provider.client is None

@patch("googlemaps.Client")
def test_maps_enabled(mock_client, monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_MAPS", True)
    monkeypatch.setattr(settings, "GOOGLE_MAPS_API_KEY", "dummy_key")
    provider = GoogleMapsProvider()
    provider.initialize()
    assert provider.check_health() == "connected"

# Tests for Firebase
def test_firebase_disabled(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_FIREBASE", False)
    provider = BackendFirebaseProvider()
    provider.initialize()
    assert provider.check_health() == "disabled"
    assert provider.app is None

@patch("firebase_admin.initialize_app")
@patch("firebase_admin.get_app")
def test_firebase_enabled(mock_get_app, mock_init, monkeypatch):
    # Force get_app to raise ValueError simulating not initialized
    mock_get_app.side_effect = ValueError()
    
    monkeypatch.setattr(settings, "ENABLE_FIREBASE", True)
    monkeypatch.setattr(settings, "FIREBASE_PROJECT_ID", "dummy_id")
    provider = BackendFirebaseProvider()
    provider.initialize()
    assert provider.check_health() == "connected"
