from unittest.mock import MagicMock
from sqlmodel import SQLModel
from app.shared.dependencies.factory import build_service_dependency
from app.shared.infrastructure.repository import BaseRepository
from app.shared.infrastructure.service import BaseService


class DummyModel(SQLModel):
    id: int


class DummyRepository(BaseRepository[DummyModel]):
    pass


class DummyService(BaseService[DummyRepository]):
    pass


def test_build_service_dependency_isolation():
    # Build the dependency injector
    get_service = build_service_dependency(DummyService, DummyRepository, DummyModel)

    # Mock two separate session requests
    session_1 = MagicMock()
    session_2 = MagicMock()

    service_1 = get_service(session_1)
    service_2 = get_service(session_2)

    # Assert they are isolated instances
    assert service_1 is not service_2
    assert service_1.repository is not service_2.repository

    # Assert the correct session was injected to the correct repository instance
    assert service_1.repository.session is session_1
    assert service_2.repository.session is session_2
