from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship
from database import engine, Base

class User(Base):
    __tablename__ = "Users"
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True, nullable=False)
    user_surname = Column(String, nullable=False)
    password = Column(String, unique=True, nullable=False)
    age = Column(String,index=True, nullable=False)
    email = Column(String)
    phone = Column(String)
    city = Column(String, nullable= False)
    autonomous_community = Column(String, nullable = False)
    country = Column(String, nullable=False)
    is_organizer = Column(Boolean,nullable=False)

inscription = relationship("Inscriptions", back_populates="Users")
event = relationship("Events", back_populates="Users")

User.metadata.create_all(bind=engine)