from pydantic import BaseModel

class UserCreate(BaseModel):
    user_name: str
    user_surname : str
    password: str
    age: str
    email : str
    phone : str
    city: str
    autonomous_community : str
    country : str
    is_organizer: bool
