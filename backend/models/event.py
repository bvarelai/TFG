from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import engine, Base

class Event(Base):
    __tablename__ = "Events"
    event_id = Column(Integer, primary_key=True, index=True) 
    event_name = Column(String, nullable=None, index=True)
    event_type = Column(String, nullable=None, index=True)
    event_edition = Column(String, nullable=None, index=True)
    category = Column(String,nullable=None, index=True)
    description = Column(String)
    location = Column(String, nullable=None)
    celebration_date = Column(DateTime(timezone=True), nullable=None) 
    capacity = Column(Integer,nullable=None, index=True)

user = relationship("Inscriptions", back_populates="Events")

Event.metadata.create_all(bind=engine)
