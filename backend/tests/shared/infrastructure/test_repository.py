import pytest
from sqlmodel import SQLModel, Field, Session, create_engine
from app.shared.infrastructure.repository import BaseRepository
from app.shared.api.exceptions import NotFoundError


# Dummy model for testing the repository
class DummyItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    is_active: bool = True


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="repo")
def repo_fixture(session: Session):
    return BaseRepository[DummyItem](model=DummyItem, session=session)


def test_create_and_get(repo: BaseRepository[DummyItem]):
    new_item = DummyItem(name="Test Item")
    created = repo.create(new_item)

    assert created.id is not None
    assert created.name == "Test Item"

    fetched = repo.get(created.id)
    assert fetched is not None
    assert fetched.id == created.id


def test_get_or_404(repo: BaseRepository[DummyItem]):
    with pytest.raises(NotFoundError):
        repo.get_or_404(999)


def test_list(repo: BaseRepository[DummyItem]):
    repo.create(DummyItem(name="Item 1"))
    repo.create(DummyItem(name="Item 2"))

    items = repo.list(skip=0, limit=10)
    assert len(items) == 2

    items = repo.list(skip=1, limit=1)
    assert len(items) == 1
    assert items[0].name == "Item 2"


def test_update(repo: BaseRepository[DummyItem]):
    created = repo.create(DummyItem(name="Old Name"))

    # Update via dict
    updated = repo.update(created, {"name": "New Name", "is_active": False})
    assert updated.name == "New Name"
    assert updated.is_active is False

    # Verify in DB
    fetched = repo.get(updated.id)
    assert fetched.name == "New Name"


def test_delete(repo: BaseRepository[DummyItem]):
    created = repo.create(DummyItem(name="To Delete"))
    assert repo.get(created.id) is not None

    repo.delete(created.id)
    assert repo.get(created.id) is None

    with pytest.raises(NotFoundError):
        repo.delete(created.id)
