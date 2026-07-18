import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_green_route(async_client: AsyncClient, monkeypatch):
    class MockMapsProvider:
        def get_directions(self, origin, destination):
            return {
                "segments": [
                    {
                        "instruction": "Walk 500m",
                        "distance_meters": 500,
                        "duration_seconds": 300,
                    }
                ],
                "total_duration_seconds": 300,
            }

    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"eco_score": "Saved 0.2kg CO2", "recommendation": "Great job walking!"}'

    monkeypatch.setattr(
        "app.features.sustainability.services.sustainability_service.get_maps_provider",
        lambda: MockMapsProvider(),
    )
    monkeypatch.setattr(
        "app.features.sustainability.services.sustainability_service.get_ai_provider",
        lambda: MockAIProvider(),
    )

    response = await async_client.post(
        "/api/v1/sustainability/route",
        json={"origin": "Gate A", "destination": "Gate B"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert "Walk 500m" in data["segments"][0]["instruction"]
    assert data["eco_score"] == "Saved 0.2kg CO2"


@pytest.mark.asyncio
async def test_facilities(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/sustainability/facilities", json={"location": "Section 102"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data["water_stations"]) == 2
    assert len(data["recycling_bins"]) == 2
