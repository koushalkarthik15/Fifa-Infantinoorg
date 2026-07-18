from unittest.mock import patch, MagicMock
from app.database.core import get_session, init_db, engine
from sqlmodel import Session

def test_init_db(monkeypatch):
    # Mock create_all so we don't actually run it against the main DB in this test
    # (though in pytest we usually use an in-memory DB anyway, we just want to verify invocation here)
    mock_create_all = MagicMock()
    
    # We patch SQLModel.metadata.create_all
    with patch("sqlmodel.SQLModel.metadata.create_all", mock_create_all):
        init_db()
        mock_create_all.assert_called_once_with(engine)

def test_get_session_yields_valid_session():
    generator = get_session()
    session = next(generator)
    assert isinstance(session, Session)
    
    # Clean up the generator manually
    try:
        next(generator)
    except StopIteration:
        pass
