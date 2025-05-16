from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional

class EventResultCreate(BaseModel):
   event_id : int
   event_name : str
   edition_result : str
   category_result : str