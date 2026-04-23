from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_admin, require_agent
from app.db.session import get_db
from app.models.field import Field
from app.models.field_update import FieldUpdate
from app.models.user import User
from app.schemas.field_updates import FieldUpdateCreate
from app.schemas.fields import FieldCreate


router = APIRouter(prefix="/fields", tags=["fields"])


# Create a new field by an admin user
@router.post("", status_code=status.HTTP_201_CREATED)
def create_field(
    payload: FieldCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> dict:
    field = Field(
        name=payload.name,
        crop_type=payload.crop_type,
        planting_date=payload.planting_date,
        current_stage=payload.current_stage,
        assigned_agent_id=payload.assigned_agent_id,
        created_by=admin_user.id,
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    return {"id": field.id, "message": "Field created"}

# Create a field update by an agent user
# Create a new field update for a field
@router.post("/{field_id}/updates", status_code=status.HTTP_201_CREATED)
def create_field_update(
    field_id: int,
    payload: FieldUpdateCreate,
    db: Session = Depends(get_db),
    agent_user: User = Depends(require_agent),
) -> dict:
    field = db.get(Field, field_id)
    if field is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found",
        )
# Check if the agent user is assigned to the field
    if field.assigned_agent_id != agent_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, # Forbidden
            detail="Agents can only update assigned fields",
        )
# Create a new field update
    update = FieldUpdate(
        field_id=field.id,
        agent_id=agent_user.id,
        stage=payload.stage,
        note=payload.note,
    )
    db.add(update)
    field.current_stage = payload.stage
    db.commit()
    db.refresh(update)

    return {"id": update.id, "message": "Field update created"}
