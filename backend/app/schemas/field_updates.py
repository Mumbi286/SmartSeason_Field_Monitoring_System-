from typing import Optional

from pydantic import BaseModel

from app.models.enums import FieldStage

# Field Update Create Schema
class FieldUpdateCreate(BaseModel):
    stage: FieldStage
    note: Optional[str] = None
