from sqlalchemy import Column, DateTime, Enum as SAEnum, Integer, String, func
from app.db.session import Base
from app.models.enums import UserRole


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(SAEnum(UserRole, name="user_role"), nullable=False, default=UserRole.agent)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())