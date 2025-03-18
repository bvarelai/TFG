from pydantic import BaseModel
from datetime import datetime

class InscriptionCreate(BaseModel):
    event_id  : int
    user_id : int
    inscription_description : str