from contextlib import contextmanager
from typing import Generator
from sqlmodel import Session
from app.shared.logging.logger import get_logger

logger = get_logger(__name__)

@contextmanager
def transactional(session: Session) -> Generator[Session, None, None]:
    """
    Explicit transaction boundary manager for executing multi-repository or 
    multi-step database operations atomically.
    
    Yields the current session.
    Commits on successful block exit.
    Rolls back gracefully on ANY domain or Python exception.
    """
    try:
        yield session
        session.commit()
    except Exception as e:
        logger.error(f"Transaction failed, rolling back. Reason: {str(e)}")
        session.rollback()
        # Re-raise the exception so global exception handlers can catch it
        raise
