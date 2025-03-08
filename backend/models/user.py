from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship
from database import engine, Base

class User(Base):
    __tablename__ = "Users"
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True, nullable=None)
    password = Column(String, unique=True, nullable=None)
    age = Column(String,index=True, nullable=None)
    city = Column(String)
    autonomous_community = (String)
    country = Column(String, nullable=None)
    is_organizer = Column(Boolean,nullable=None)

user = relationship("Inscriptions", back_populates="Users")


User.metadata.create_all(bind=engine)