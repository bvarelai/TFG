from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional

class EventCreate(BaseModel):
    event_name: str
    event_type : str
    event_edition : str
    category : str 
    description : str
    location: str
    celebration_date : datetime
    capacity : int

class EventUpdate(BaseModel):
    event_name: Optional[str]
    event_type : Optional[str]
    event_edition : Optional[str]
    category : Optional[str]
    description : Optional[str]
    location: Optional[str]
    celebration_date : Optional[datetime]
    capacity : Optional[int]