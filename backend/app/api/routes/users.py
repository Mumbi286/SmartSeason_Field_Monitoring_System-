from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.auth import UserResponse


router = APIRouter(prefix="/users", tags=["users"])

# list agents route
@router.get("/agents", response_model=List[UserResponse])
def list_agents(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> List[User]:
    del admin_user
    return db.query(User).filter(User.role == UserRole.agent).order_by(User.id.asc()).all()
