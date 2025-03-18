from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import engine, Base

class EventResult(Base):
    __tablename__ = "EventsResults"
    event_id = Column(Integer,ForeignKey("Eventos.eventid"), primary_key=True, index=True) 
    result_id = Column(Integer, primary_key=True, index=True) 
    

user = relationship("Events", back_populates="EventsResults")

EventResult.metadata.create_all(bind=engine)
