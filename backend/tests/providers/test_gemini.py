import pytest
from unittest.mock import MagicMock, patch
from google.genai.errors import APIError
from app.providers.gemini_provider import GeminiProvider
from app.shared.api.exceptions import ExternalServiceError

@pytest.fixture
def mock_settings():
    with patch("app.providers.gemini_provider.settings") as mock:
        mock.ENABLE_GEMINI = True
        mock.GEMINI_API_KEY = "test_key"
        yield mock

def test_gemini_initialize(mock_settings):
    provider = GeminiProvider()
    with patch("app.providers.gemini_provider.genai.Client") as mock_client:
        provider.initialize()
        mock_client.assert_called_once_with(api_key="test_key")
        assert provider.client is not None

def test_gemini_disabled(mock_settings):
    mock_settings.ENABLE_GEMINI = False
    provider = GeminiProvider()
    provider.initialize()
    assert provider.client is None
    assert provider.check_health() == "disabled"

def test_generate_content_success():
    provider = GeminiProvider()
    provider.client = MagicMock()
    
    # Mocking the response
    mock_response = MagicMock()
    mock_response.text = "This is a mock response"
    provider.client.models.generate_content.return_value = mock_response
    
    result = provider.generate_content("Hello")
    assert result == "This is a mock response"
    provider.client.models.generate_content.assert_called_once()

def test_generate_content_uninitialized():
    provider = GeminiProvider()
    provider.client = None
    with pytest.raises(ExternalServiceError):
        provider.generate_content("Hello")

@patch("time.sleep", return_value=None)
def test_generate_content_retries_on_503(mock_sleep):
    provider = GeminiProvider()
    provider.client = MagicMock()
    
    # Mock an APIError with 503 UNAVAILABLE
    class MockAPIError(APIError):
        def __init__(self):
            super().__init__("503 UNAVAILABLE", 503, "UNAVAILABLE")
    
    provider.client.models.generate_content.side_effect = MockAPIError()
    
    with pytest.raises(ExternalServiceError):
        provider.generate_content("Hello")
    
    # Check that it tried 3 times per model, and there are 4 fallback models -> 12 calls
    assert provider.client.models.generate_content.call_count == 12
