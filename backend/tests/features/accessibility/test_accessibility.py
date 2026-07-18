import pytest
from httpx import AsyncClient
import io

@pytest.mark.asyncio
async def test_assistant(async_client: AsyncClient, monkeypatch):
    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"response": "Here to help.", "suggested_actions": ["Call Medical"]}'

    monkeypatch.setattr("app.features.accessibility.services.accessibility_service.get_ai_provider", lambda: MockAIProvider())

    response = await async_client.post(
        "/api/v1/accessibility/assistant",
        json={"query": "I need help"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["response"] == "Here to help."
    assert "Call Medical" in data["suggested_actions"]

@pytest.mark.asyncio
async def test_translation(async_client: AsyncClient, monkeypatch):
    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"translated_text": "Hola"}'

    monkeypatch.setattr("app.features.accessibility.services.accessibility_service.get_ai_provider", lambda: MockAIProvider())

    response = await async_client.post(
        "/api/v1/accessibility/translate",
        json={"text": "Hello", "targetLanguage": "Spanish"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["translated_text"] == "Hola"

@pytest.mark.asyncio
async def test_translation_invalid_language(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/accessibility/translate",
        json={"text": "Hello", "targetLanguage": "German"}
    )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_vision_invalid_type(async_client: AsyncClient):
    files = {'file': ('test.txt', io.BytesIO(b"not an image"), 'text/plain')}
    response = await async_client.post("/api/v1/accessibility/vision", files=files)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_vision_valid_image(async_client: AsyncClient, monkeypatch):
    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"description": "A ramp.", "obstacles_identified": ["Wet floor"]}'

    monkeypatch.setattr("app.features.accessibility.services.accessibility_service.get_ai_provider", lambda: MockAIProvider())

    files = {'file': ('test.jpg', io.BytesIO(b"fake image data"), 'image/jpeg')}
    response = await async_client.post("/api/v1/accessibility/vision", files=files)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "ramp" in data["description"].lower()
    assert "Wet floor" in data["obstacles_identified"]
