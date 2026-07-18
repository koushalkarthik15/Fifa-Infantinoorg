import pytest
from unittest.mock import patch
from app.providers.firebase_provider import BackendFirebaseProvider

@pytest.fixture
def mock_settings():
    with patch("app.providers.firebase_provider.settings") as mock:
        yield mock

def test_firebase_initialize(mock_settings):
    provider = BackendFirebaseProvider()
    
    with patch("app.providers.firebase_provider.firebase_admin") as mock_admin:
        mock_admin.get_app.side_effect = ValueError("Not initialized")
        provider.initialize()
        mock_admin.initialize_app.assert_called_once()

def test_firebase_disabled(mock_settings):
    mock_settings.ENABLE_FIREBASE = False
    provider = BackendFirebaseProvider()
    
    with patch("app.providers.firebase_provider.firebase_admin") as mock_admin:
        provider.initialize()
        mock_admin.initialize_app.assert_not_called()

def test_firebase_missing_credentials(mock_settings):
    mock_settings.FIREBASE_PROJECT_ID = None
    provider = BackendFirebaseProvider()
    
    with patch("app.providers.firebase_provider.firebase_admin") as mock_admin:
        mock_admin.get_app.side_effect = ValueError("Not initialized")
        from app.shared.api.exceptions import ExternalServiceError
        with pytest.raises(ExternalServiceError):
            provider.initialize()
