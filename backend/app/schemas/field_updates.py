from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import FieldStage

# Field Update Create Schema
class FieldUpdateCreate(BaseModel):
    stage: FieldStage
    note: Optional[str] = None

# Field Update Response Schema
class FieldUpdateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    field_id: int
    agent_id: int
    stage: FieldStage
    note: Optional[str]
    created_at: datetime
