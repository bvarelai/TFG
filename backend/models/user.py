from sqlalchemy import Column, String
from database import engine, Base

class User(Base):
    __tablename__ = "usuarios"
    userName = Column(String, primary_key=True, index=True)
    hashed_password = Column(String)

User.metadata.create_all(bind=engine)