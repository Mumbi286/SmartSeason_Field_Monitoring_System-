from sqlalchemy import Column, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, func
from app.db.session import Base
from app.models.enums import FieldStage

# Field Update model
class FieldUpdate(Base):
    __tablename__ = "field_updates"
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stage = Column(SAEnum(FieldStage, name="field_stage"), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())