from typing import TypeVar, Generic
from app.shared.infrastructure.repository import BaseRepository

RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)


class BaseService(Generic[RepositoryType]):
    """
    Generic Base Service to orchestrate business logic around a primary repository.
    Keeps API route handlers clean and prevents direct ORM access in controllers.
    """

    def __init__(self, repository: RepositoryType):
        self.repository = repository
