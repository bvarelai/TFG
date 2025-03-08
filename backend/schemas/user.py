from pydantic import BaseModel

class UserCreate(BaseModel):
    user_name: str
    password: str
    age: str
    city: str
    autonomous_community : str
    country : str
    is_organizer: bool
