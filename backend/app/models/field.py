from sqlalchemy import Column, Date, DateTime, Enum as SAEnum, ForeignKey, Integer, String, func
from app.db.session import Base
from app.models.enums import FieldStage

# Field model
class Field(Base):
    __tablename__ = "fields"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    planting_date = Column(Date, nullable=False)
    current_stage = Column(SAEnum(FieldStage, name="field_stage"), nullable=False, default=FieldStage.planted)
    assigned_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())