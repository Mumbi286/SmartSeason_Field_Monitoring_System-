from datetime import date, datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.enums import FieldStage, UserRole
from app.models.field import Field
from app.models.field_update import FieldUpdate
from app.models.user import User
from app.services.security import hash_password

# create user
def get_or_create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password: str,
    role: UserRole,
) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user is not None:
        return user

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# create field
def get_or_create_field(
    db: Session,
    *,
    name: str,
    crop_type: str,
    planting_date: date,
    current_stage: FieldStage,
    assigned_agent_id: Optional[int],
    created_by: int,
    created_at: datetime,
) -> Field:
    field = db.query(Field).filter(Field.name == name).first()
    if field is not None:
        return field

    field = Field(
        name=name,
        crop_type=crop_type,
        planting_date=planting_date,
        current_stage=current_stage,
        assigned_agent_id=assigned_agent_id,
        created_by=created_by,
        created_at=created_at,
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    return field

# create field update
def ensure_update(
    db: Session,
    *,
    field_id: int,
    agent_id: int,
    stage: FieldStage,
    note: str,
    created_at: datetime,
) -> FieldUpdate:
    update = (
        db.query(FieldUpdate)
        .filter(
            FieldUpdate.field_id == field_id,
            FieldUpdate.agent_id == agent_id,
            FieldUpdate.note == note,
        )
        .first()
    )
    if update is not None:
        return update

    update = FieldUpdate(
        field_id=field_id,
        agent_id=agent_id,
        stage=stage,
        note=note,
        created_at=created_at,
    )
    db.add(update)
    db.commit()
    db.refresh(update)
    return update

# seed reference data
# seed the reference data for the database
def seed_reference_data() -> None:
    db = SessionLocal()
    now = datetime.now(timezone.utc)
    try:
        admin = get_or_create_user(
            db,
            name="Admin 1",
            email="admin@smartseason.com",
            password="test123",
            role=UserRole.admin,
        )
        agent_a = get_or_create_user(
            db,
            name="Agent A",
            email="agent.a@smartseason.com",
            password="Agent123",
            role=UserRole.agent,
        )
        agent_b = get_or_create_user(
            db,
            name="Agent B",
            email="agent.b@smartseason.com",
            password="Agent123",
            role=UserRole.agent,
        )

        field_active = get_or_create_field(
            db,
            name="Kakamega Maize Farm",
            crop_type="Maize",
            planting_date=(now - timedelta(days=10)).date(),
            current_stage=FieldStage.growing,
            assigned_agent_id=agent_a.id,
            created_by=admin.id,
            created_at=now - timedelta(days=10),
        )
        field_unassigned = get_or_create_field(
            db,
            name="Kericho Beans Farm",
            crop_type="Beans",
            planting_date=(now - timedelta(days=8)).date(),
            current_stage=FieldStage.growing,
            assigned_agent_id=None,
            created_by=admin.id,
            created_at=now - timedelta(days=8),
        )
        field_stale = get_or_create_field(
            db,
            name="Tukuze Kitungu Farm",
            crop_type="Onions",
            planting_date=(now - timedelta(days=25)).date(),
            current_stage=FieldStage.growing,
            assigned_agent_id=agent_a.id,
            created_by=admin.id,
            created_at=now - timedelta(days=25),
        )
        field_completed = get_or_create_field(
            db,
            name="Ngano Safi Limited Farm",
            crop_type="Wheat",
            planting_date=(now - timedelta(days=45)).date(),
            current_stage=FieldStage.harvested,
            assigned_agent_id=agent_b.id,
            created_by=admin.id,
            created_at=now - timedelta(days=45),
        )

        ensure_update(
            db,
            field_id=field_active.id,
            agent_id=agent_a.id,
            stage=FieldStage.growing,
            note="Weekly check: crop healthy",
            created_at=now - timedelta(days=2),
        )
        ensure_update(
            db,
            field_id=field_stale.id,
            agent_id=agent_a.id,
            stage=FieldStage.growing,
            note="Last report before delay",
            created_at=now - timedelta(days=20),
        )
        ensure_update(
            db,
            field_id=field_completed.id,
            agent_id=agent_b.id,
            stage=FieldStage.harvested,
            note="Harvest completed successfully",
            created_at=now - timedelta(days=1),
        )

        print("Reference data seeded successfully.")
        print("Admin: admin@smartseason.com / Admin123")
        print("Agent A: agent.a@smartseason.com / Agent123")
        print("Agent B: agent.b@smartseason.com / Agent123")
        print(
            "Fields seeded: Kakamega Maize Farm, Kericho Beans Farm, "
            "Tukuze Kitungu Farm, Ngano Safi Limited Farm",
        )
    finally:
        db.close()


if __name__ == "__main__":
    seed_reference_data()
