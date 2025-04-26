from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InscriptionCreate(BaseModel):
    event_id  : int
    user_id : int
    event_name : str
    inscription_date : datetime
    start_date : datetime
    end_date : datetime
    location : str

class InscriptionUpdate(BaseModel):
    event_id  : Optional[int]
    user_id : Optional[int]
    event_name : Optional[str]
    inscription_date : Optional[datetime]
    start_date : Optional[datetime]
    end_date : Optional[datetime]
    location : Optional[str]   