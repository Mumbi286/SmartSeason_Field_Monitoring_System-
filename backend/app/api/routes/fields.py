from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin, require_agent
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.field import Field
from app.models.field_update import FieldUpdate
from app.models.user import User
from app.schemas.field_updates import FieldUpdateCreate, FieldUpdateResponse
from app.schemas.fields import FieldAssignRequest, FieldCreate, FieldResponse


router = APIRouter(prefix="/fields", tags=["fields"])

# List all fields
@router.get("", response_model=List[FieldResponse])
def list_fields(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Field]:
    if current_user.role == UserRole.admin:
        return db.query(Field).order_by(Field.id.asc()).all()

    return (
        db.query(Field)
        .filter(Field.assigned_agent_id == current_user.id)
        .order_by(Field.id.asc())
        .all()
    )


# Create a new field by an admin user
@router.post("", status_code=status.HTTP_201_CREATED, response_model=FieldResponse)
def create_field(
    payload: FieldCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Field:
    if payload.assigned_agent_id is not None:
        assigned_agent = db.get(User, payload.assigned_agent_id)
        if assigned_agent is None or assigned_agent.role != UserRole.agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="assigned_agent_id must reference an existing agent",
            )

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
    return field

# Assign a field to an agent by an admin user
@router.patch("/{field_id}/assign", response_model=FieldResponse)
def assign_field(
    field_id: int,
    payload: FieldAssignRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
) -> Field:
    del admin_user  # dependency enforces admin role

    field = db.get(Field, field_id)
    if field is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found",
        )

    if payload.assigned_agent_id is not None:
        assigned_agent = db.get(User, payload.assigned_agent_id)
        if assigned_agent is None or assigned_agent.role != UserRole.agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="assigned_agent_id must reference an existing agent",
            )

    field.assigned_agent_id = payload.assigned_agent_id
    db.commit()
    db.refresh(field)
    return field

# Create a field update by an agent user
# Create a new field update for a field
@router.post(
    "/{field_id}/updates",
    status_code=status.HTTP_201_CREATED,
    response_model=FieldUpdateResponse,
)
def create_field_update(
    field_id: int,
    payload: FieldUpdateCreate,
    db: Session = Depends(get_db),
    agent_user: User = Depends(require_agent),
) -> FieldUpdate:
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

    return update

# List all field updates by an agent user
@router.get("/{field_id}/updates", response_model=List[FieldUpdateResponse])
def list_field_updates(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FieldUpdate]:
    field = db.get(Field, field_id)
    if field is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found",
        )

    if current_user.role == UserRole.agent and field.assigned_agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agents can only view updates for assigned fields",
        )

    return (
        db.query(FieldUpdate)
        .filter(FieldUpdate.field_id == field_id)
        .order_by(FieldUpdate.created_at.desc())
        .all()
    )
