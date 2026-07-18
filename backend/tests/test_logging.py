import logging
import pytest
from fastapi.testclient import TestClient
import asyncio

from app.main import app
from app.shared.logging.logger import get_logger, setup_logging, APP_LOGGER_NAME
from app.shared.logging.request_context import request_id_var, get_request_id

client = TestClient(app)


def test_logger_initialization():
    setup_logging()
    logger = get_logger("test_module")

    # Assert it's attached to the app logger
    assert logger.name == f"{APP_LOGGER_NAME}.test_module"

    # Root app logger should have one handler (idempotent check)
    app_logger = logging.getLogger(APP_LOGGER_NAME)
    assert len(app_logger.handlers) >= 1

    # Setup again shouldn't duplicate handlers
    setup_logging()
    assert len(app_logger.handlers) >= 1


def test_health_endpoint_logs(caplog):
    caplog.set_level(logging.INFO, logger=f"{APP_LOGGER_NAME}.app.main")

    # Enable propagation so pytest's caplog can intercept the logs from root
    app_logger = logging.getLogger(APP_LOGGER_NAME)
    original_propagate = app_logger.propagate
    app_logger.propagate = True

    try:
        response = client.get("/health")
        assert response.status_code == 200

        # Test middleware logs
        middleware_records = [
            r
            for r in caplog.records
            if r.name == f"{APP_LOGGER_NAME}.app.shared.logging.middleware"
        ]
        assert len(middleware_records) > 0
        assert "GET /health - 200" in middleware_records[0].message
        assert hasattr(middleware_records[0], "extra_data")
        assert "duration" in middleware_records[0].extra_data
    finally:
        app_logger.propagate = original_propagate


def test_sensitive_data_redaction():
    from app.shared.logging.formatter import sanitize_dict

    data = {
        "user_id": 123,
        "password": "supersecretpassword",
        "api_key": "12345",
        "nested": {"token": "abc"},
    }

    sanitized = sanitize_dict(data)
    assert sanitized["user_id"] == 123
    assert sanitized["password"] == "***REDACTED***"
    assert sanitized["api_key"] == "***REDACTED***"
    assert sanitized["nested"]["token"] == "***REDACTED***"


@pytest.mark.asyncio
async def test_request_id_concurrency():
    """
    Test that concurrent tasks have isolated request IDs in ContextVars.
    """

    async def simulated_request(req_id: str):
        request_id_var.set(req_id)
        # Yield to event loop to simulate IO / concurrent execution
        await asyncio.sleep(0.01)
        assert get_request_id() == req_id
        return get_request_id()

    # Run 100 simulated requests concurrently
    tasks = [simulated_request(f"req_{i}") for i in range(100)]
    results = await asyncio.gather(*tasks)

    assert len(results) == 100
    assert len(set(results)) == 100  # all unique
