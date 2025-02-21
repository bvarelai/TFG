from sqlalchemy import Column, String, Integer
from database import engine, Base

class User(Base):
    __tablename__ = "Usuario"
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True, nullable=None)
    password = Column(String, unique=True, nullable=None)
    age= Column(String,index=True, nullable=None)
    city = Column(String)
    autonomous_community = (String)
    country = Column(String, nullable=None)

User.metadata.create_all(bind=engine)