import pytest
from unittest.mock import MagicMock
from app.shared.infrastructure.transaction import transactional


def test_transactional_commit():
    session_mock = MagicMock()

    with transactional(session_mock) as session:
        assert session is session_mock
        # Simulating successful operation

    # Assert commit was called
    session_mock.commit.assert_called_once()
    session_mock.rollback.assert_not_called()


def test_transactional_rollback_on_exception():
    session_mock = MagicMock()

    with pytest.raises(ValueError, match="Domain error"):
        with transactional(session_mock):
            raise ValueError("Domain error")

    # Assert rollback was called and commit was not called
    session_mock.rollback.assert_called_once()
    session_mock.commit.assert_not_called()
