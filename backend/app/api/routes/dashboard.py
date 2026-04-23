from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.field import Field
from app.models.user import User
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.field_status import (
    STATUS_ACTIVE,
    STATUS_AT_RISK,
    STATUS_COMPLETED,
    compute_field_status,
    get_last_update_map,
)


router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Dashboard Summary Route
@router.get("/summary", response_model=DashboardSummaryResponse)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardSummaryResponse:
    query = db.query(Field)
    if current_user.role == UserRole.agent:
        query = query.filter(Field.assigned_agent_id == current_user.id)

    fields = query.order_by(Field.id.asc()).all()
    field_ids = [field.id for field in fields]
    last_update_map = get_last_update_map(db, field_ids)

    counts = {
        STATUS_ACTIVE: 0,
        STATUS_AT_RISK: 0,
        STATUS_COMPLETED: 0,
    }
    for field in fields:
        status = compute_field_status(field, last_update_map.get(field.id))
        counts[status] += 1

    return DashboardSummaryResponse(
        total=len(fields),
        active=counts[STATUS_ACTIVE],
        atRisk=counts[STATUS_AT_RISK],
        completed=counts[STATUS_COMPLETED],
    )
