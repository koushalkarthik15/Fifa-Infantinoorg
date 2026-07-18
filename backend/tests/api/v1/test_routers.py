from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_openapi_schema_generation():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    assert "/api/v1/crowd/heatmap" in schema["paths"]
    assert "/api/v1/navigation/venue" in schema["paths"]
