from sqlalchemy import Column, String, Integer
from database import engine, Base

class User(Base):
    __tablename__ = "usuarios"
    userID = Column(Integer, primary_key=True, index=True)
    userName = Column(String, unique=True, index=True)
    hashed_password = Column(String)

User.metadata.create_all(bind=engine)