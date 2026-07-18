from app.shared.infrastructure.service import BaseService
from app.shared.infrastructure.repository import BaseRepository
from sqlmodel import SQLModel


class DummyModel(SQLModel):
    id: int


def test_base_service_initialization():
    # Mock a repository instance
    mock_repo = BaseRepository[DummyModel](model=DummyModel, session=None)  # type: ignore

    service = BaseService[BaseRepository[DummyModel]](repository=mock_repo)

    assert service.repository is mock_repo
