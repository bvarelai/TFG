from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional

class EventCreate(BaseModel):
    event_name: str
    user_id : int
    event_type : str
    event_edition : str
    category : str 
    event_description : str
    location: str
    celebration_date : datetime
    capacity : int

class EventUpdate(BaseModel):
    event_name: Optional[str]
    user_id : Optional[int]
    event_type : Optional[str]
    event_edition : Optional[str]
    category : Optional[str]
    event_description : Optional[str]
    location: Optional[str]
    celebration_date : Optional[datetime]
    capacity : Optional[int]