from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    review_id : int
    event_id  : int
    user_id : int
    user_name: str
    review_text : str
    review_rating : float

class ReviewUpdate(BaseModel):
    review_id : Optional[int]
    event_id: Optional[int]
    user_id : Optional[int]
    user_name : Optional[str]
    review_text : Optional[str]
    review_rating : Optional[float]