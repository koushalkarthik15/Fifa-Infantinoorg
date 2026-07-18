from typing import TypeVar, Generic, Type, Optional, List, Any
from sqlmodel import SQLModel, Session, select
from app.shared.api.exceptions import NotFoundError

ModelType = TypeVar("ModelType", bound=SQLModel)

class BaseRepository(Generic[ModelType]):
    """
    Generic Base Repository to encapsulate all common CRUD operations.
    Enforces strong typing and consistent database interaction.
    """
    
    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session

    def get(self, id: Any) -> Optional[ModelType]:
        """Fetch a single record by its primary key."""
        return self.session.get(self.model, id)

    def get_or_404(self, id: Any) -> ModelType:
        """Fetch a single record by its primary key, raising NotFoundError if not found."""
        obj = self.get(id)
        if not obj:
            raise NotFoundError(message=f"{self.model.__name__} with ID {id} not found.")
        return obj

    def list(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Fetch a list of records."""
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def create(self, obj_in: SQLModel) -> ModelType:
        """Create a new record."""
        # Convert schema input to internal model instance
        db_obj = self.model.model_validate(obj_in)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, obj_in: SQLModel | dict[str, Any]) -> ModelType:
        """Update an existing record."""
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def delete(self, id: Any) -> None:
        """Permanently delete a record by ID (Hard Delete)."""
        obj = self.get_or_404(id)
        self.session.delete(obj)
        self.session.commit()
