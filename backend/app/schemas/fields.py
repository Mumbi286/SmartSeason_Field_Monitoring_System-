from datetime import date
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import FieldStage

# Field Create Schema
class FieldCreate(BaseModel):
    name: str
    crop_type: str
    planting_date: date
    current_stage: FieldStage = FieldStage.planted
    assigned_agent_id: Optional[int] = None

# Field Assign Request Schema
class FieldAssignRequest(BaseModel):
    assigned_agent_id: Optional[int] = None

# Field Response Schema
class FieldResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    crop_type: str
    planting_date: date
    current_stage: FieldStage
    assigned_agent_id: Optional[int]
    created_by: int
    created_at: datetime
    status: str
