from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from database import engine, Base

class EventResult(Base):
    __tablename__ = "EventsResults"
    result_id = Column(Integer, primary_key=True, index=True) 
    event_id = Column(Integer,ForeignKey("Events.event_id"), index=True) 
    csv_file = Column(LargeBinary, nullable=True)  
    edition_result = Column(String, nullable=True)
    category_result = Column(String, nullable=True) 

event = relationship("Events", back_populates="EventsResults")

EventResult.metadata.create_all(bind=engine)
