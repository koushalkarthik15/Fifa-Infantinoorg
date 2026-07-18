from typing import Generator
from sqlmodel import SQLModel, Session, create_engine
from app.config.config import get_settings

settings = get_settings()

# Conditional logic for SQLite arguments
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True  # Ensure connections are tested before use
)

def init_db() -> None:
    """
    Initializes the database by creating all tables defined in SQLModel metadata.
    Idempotent operation (will not recreate existing tables).
    """
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """
    Provides a generator for a new database session.
    Yields the session to the caller and ensures it is safely closed.
    """
    with Session(engine) as session:
        yield session
