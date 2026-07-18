import pytest
from httpx import AsyncClient
from sqlmodel import Session, SQLModel
from app.database.core import engine
from app.features.navigation.domain.models import VenueLocation

@pytest.fixture(name="navigation_setup")
def setup_navigation_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Check if North Gate exists to avoid duplicate constraint errors in tests
        existing = session.query(VenueLocation).filter_by(name="North Gate").first()
        if not existing:
            session.add(VenueLocation(name="North Gate", category="Gate", latitude=33.9, longitude=-118.2))
            session.add(VenueLocation(name="Seat 10", category="Seat", latitude=33.91, longitude=-118.21))
            session.commit()
    yield
    # Cleanup not strictly necessary for simple SQLite tests, but good practice

@pytest.mark.asyncio
async def test_venue_navigation(async_client: AsyncClient, navigation_setup, monkeypatch):
    # Mock MapsProvider
    class MockMapsProvider:
        def get_directions(self, origin, destination, **kwargs):
            return {
                "segments": [{"instruction": f"Walk to {destination}", "distance_meters": 100, "duration_seconds": 60}],
                "total_duration_seconds": 60
            }
            
    monkeypatch.setattr("app.features.navigation.services.navigation_service.get_maps_provider", lambda: MockMapsProvider())

    response = await async_client.post(
        "/api/v1/navigation/venue",
        json={"origin": "North Gate", "destination_name": "Seat 10"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["destination"] == "Seat 10"
    assert len(data["segments"]) == 1

@pytest.mark.asyncio
async def test_transportation_recommendation(async_client: AsyncClient, monkeypatch):
    # Mock Providers
    class MockMapsProvider:
        def get_directions(self, origin, destination, **kwargs):
            return {"total_duration_seconds": 600, "segments": []}

    class MockAIProvider:
        def generate_content(self, prompt, **kwargs):
            return '{"recommended_mode": "Shuttle", "explanation": "It is faster."}'

    monkeypatch.setattr("app.features.navigation.services.navigation_service.get_maps_provider", lambda: MockMapsProvider())
    monkeypatch.setattr("app.features.navigation.services.navigation_service.get_ai_provider", lambda: MockAIProvider())

    response = await async_client.post(
        "/api/v1/navigation/transportation",
        json={"origin": "Hotel", "destination": "Stadium", "context": "I have bags."}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["recommended_mode"] == "Shuttle"
    assert "faster" in data["explanation"]
