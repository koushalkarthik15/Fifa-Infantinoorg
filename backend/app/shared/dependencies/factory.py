from typing import TypeVar, Type, Callable
from app.shared.dependencies.db import DbSession
from app.shared.infrastructure.repository import BaseRepository
from app.shared.infrastructure.service import BaseService
from sqlmodel import SQLModel

ModelType = TypeVar("ModelType", bound=SQLModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)
ServiceType = TypeVar("ServiceType", bound=BaseService)

def build_service_dependency(
    service_class: Type[ServiceType],
    repository_class: Type[RepositoryType],
    model_class: Type[ModelType]
) -> Callable[[DbSession], ServiceType]:
    """
    Dependency factory to build a completely isolated vertical slice for a single request.
    Instantiates the Service, injecting an instantiated Repository, which wraps the DB session.
    """
    def get_service(session: DbSession) -> ServiceType:
        repo = repository_class(model=model_class, session=session)
        service = service_class(repository=repo)
        return service
        
    return get_service
