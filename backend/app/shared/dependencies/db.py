from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from app.database.core import get_session

# Common type alias for injecting the database session into FastAPI routes
DbSession = Annotated[Session, Depends(get_session)]
