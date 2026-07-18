from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.shared.middleware.security import SecurityHeadersMiddleware
from app.shared.logging.middleware import RequestLoggerMiddleware


def test_security_headers_middleware():
    app = FastAPI()
    app.add_middleware(SecurityHeadersMiddleware)

    @app.get("/test")
    def test_route():
        return {"status": "ok"}

    client = TestClient(app)
    response = client.get("/test")

    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"


def test_request_logger_middleware_injects_request_id():
    app = FastAPI()
    app.add_middleware(RequestLoggerMiddleware)

    @app.get("/test")
    def test_route():
        return {"status": "ok"}

    client = TestClient(app)
    response = client.get("/test")

    assert response.status_code == 200
    assert "X-Request-ID" in response.headers
    assert len(response.headers["X-Request-ID"]) > 0
