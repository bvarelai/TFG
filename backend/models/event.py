from sqlalchemy import Column, Integer, String, DateTime,ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import engine, Base

class Event(Base):
    __tablename__ = "Events"
    event_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"), index=True)     
    event_name = Column(String, nullable=None, index=True)
    event_type = Column(String, nullable=None, index=True)
    event_edition = Column(String, nullable=None, index=True)
    category = Column(String,nullable=None, index=True)
    event_description = Column(String)
    location = Column(String, nullable=None)
    celebration_date = Column(DateTime(timezone=True), nullable=None)
    end_date = Column(DateTime(timezone=True), nullable=None) 
    capacity = Column(Integer,nullable=None, index=True)
    organizer_by = Column(String, nullable=None)
    duration = Column(Integer, nullable=None, index=True)
    event_full_description = Column(String, nullable=None)
    language = Column(String, nullable=None, index=True)
    is_free = Column(Boolean, nullable=None, index=True)

inscription = relationship("Inscriptions", back_populates="Events")
user = relationship("Users", back_populates="Events")
review = relationship("Reviews", back_populates="Events")
event_result = relationship("EventResult", back_populates="Events")

Event.metadata.create_all(bind=engine)
