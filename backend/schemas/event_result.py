from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional

class EventResultCreate(BaseModel):
   event_id : int
   edition_result : str
   category_result : str