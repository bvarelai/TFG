from sqlalchemy import Column, Integer, String, DateTime
from database import engine, Base

class Event(Base):
    __tablename__ = "eventos"
    eventid = Column(Integer, primary_key=True, index=True) 
    eventName = Column(String,unique=True, index=True)
    Location = Column(String, nullable=None)
    CelebrationDate = Column(DateTime, nullable=None)
    Category = Column(String,nullable=None)
    Capacity = Column(Integer,nullable=None)

Event.metadata.create_all(bind=engine)
