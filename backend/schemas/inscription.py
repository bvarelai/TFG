from pydantic import BaseModel
from datetime import datetime

class InscriptionCreate(BaseModel):
    event_id  : int
    user_id : int
    event_name : str
    inscription_date : datetime
    location : str