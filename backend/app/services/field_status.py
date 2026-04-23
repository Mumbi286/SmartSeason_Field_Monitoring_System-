from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.enums import FieldStage
from app.models.field import Field
from app.models.field_update import FieldUpdate


STATUS_COMPLETED = "Completed"
STATUS_AT_RISK = "At Risk"
STATUS_ACTIVE = "Active"

# Convert to UTC
def _as_utc(value: Optional[datetime]) -> Optional[datetime]:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value

# Get the last update map
def get_last_update_map(db: Session, field_ids: List[int]) -> Dict[int, datetime]:
    if not field_ids:
        return {}

    rows = (
        db.query(
            FieldUpdate.field_id,
            func.max(FieldUpdate.created_at).label("last_update_at"),
        )
        .filter(FieldUpdate.field_id.in_(field_ids))
        .group_by(FieldUpdate.field_id)
        .all()
    )
    return {field_id: last_update_at for field_id, last_update_at in rows}

# field status
    
def compute_field_status(
    field: Field,
    last_update_at: Optional[datetime],
    now: Optional[datetime] = None,
) -> str:
    current_time = _as_utc(now) or datetime.now(timezone.utc)

    if field.current_stage == FieldStage.harvested:
        return STATUS_COMPLETED

    planted_for_too_long = (
        field.current_stage == FieldStage.planted
        and (current_time.date() - field.planting_date).days > 21
    )

    last_activity_at = _as_utc(last_update_at) or _as_utc(field.created_at)
    no_recent_updates = (
        last_activity_at is not None
        and (current_time - last_activity_at) > timedelta(days=14)
    )

    if field.assigned_agent_id is None or no_recent_updates or planted_for_too_long:
        return STATUS_AT_RISK

    return STATUS_ACTIVE

# Build the field payload
def build_field_payload(field: Field, last_update_at: Optional[datetime]) -> dict:
    return {
        "id": field.id,
        "name": field.name,
        "crop_type": field.crop_type,
        "planting_date": field.planting_date,
        "current_stage": field.current_stage,
        "assigned_agent_id": field.assigned_agent_id,
        "created_by": field.created_by,
        "created_at": field.created_at,
        "status": compute_field_status(field, last_update_at),
    }
