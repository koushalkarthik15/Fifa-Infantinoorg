import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_report_incident(async_client: AsyncClient, monkeypatch):
    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"category": "Medical", "priority": "High", "suggested_actions": ["Dispatch EMT"]}'

    monkeypatch.setattr(
        "app.features.volunteer.services.volunteer_service.get_ai_provider",
        lambda: MockAIProvider(),
    )

    response = await async_client.post(
        "/api/v1/volunteer/incident",
        json={"description": "Someone fainted.", "location": "Section 102"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["category"] == "Medical"
    assert data["priority"] == "High"
    assert "Dispatch EMT" in data["suggested_actions"]
    assert "Maria" in data["assigned_volunteer"]


@pytest.mark.asyncio
async def test_report_incident_fallback(async_client: AsyncClient, monkeypatch):
    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            raise Exception("AI down")

    monkeypatch.setattr(
        "app.features.volunteer.services.volunteer_service.get_ai_provider",
        lambda: MockAIProvider(),
    )

    response = await async_client.post(
        "/api/v1/volunteer/incident",
        json={"description": "Help me.", "location": "Gate A"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["category"] == "Safety Concern"
    assert data["priority"] == "High"
    assert "Mike" in data["assigned_volunteer"]
