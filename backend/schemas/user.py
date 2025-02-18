from pydantic import BaseModel

class UserCreate(BaseModel):
    userName: str
    password: str