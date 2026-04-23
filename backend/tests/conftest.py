from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_db
from app.main import app
from app.models.enums import UserRole
from app.models.user import User
from app.db.session import Base
from app.services.security import create_access_token, hash_password

# create engine
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create database session
@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

# create test client
@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

# create user
def create_user(db_session, *, name: str, email: str, password: str, role: UserRole) -> User:
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
        created_at=datetime.now(timezone.utc),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

# create admin user
@pytest.fixture()
def admin_user(db_session):
    return create_user(
        db_session,
        name="Admin User",
        email="admin@test.com",
        password="Admin123",
        role=UserRole.admin,
    )

# create agent user
@pytest.fixture()
def agent_user(db_session):
    return create_user(
        db_session,
        name="Agent User",
        email="agent@test.com",
        password="Agent123",
        role=UserRole.agent,
    )

# create second agent user
@pytest.fixture()
def second_agent_user(db_session):
    return create_user(
        db_session,
        name="Agent Two",
        email="agent2@test.com",
        password="Agent123",
        role=UserRole.agent,
    )

# create admin headers
@pytest.fixture()
def admin_headers(admin_user):
    token = create_access_token(subject=str(admin_user.id))
    return {"Authorization": f"Bearer {token}"}

# create agent headers
@pytest.fixture()
def agent_headers(agent_user):
    token = create_access_token(subject=str(agent_user.id))
    return {"Authorization": f"Bearer {token}"}

# create second agent headers
@pytest.fixture()
def second_agent_headers(second_agent_user):
    token = create_access_token(subject=str(second_agent_user.id))
    return {"Authorization": f"Bearer {token}"}
