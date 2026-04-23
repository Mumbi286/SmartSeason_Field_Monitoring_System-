from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.models.enums import FieldStage

# Field Create Schema
class FieldCreate(BaseModel):
    name: str
    crop_type: str
    planting_date: date
    current_stage: FieldStage = FieldStage.planted
    assigned_agent_id: Optional[int] = None
