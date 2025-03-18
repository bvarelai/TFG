from sqlalchemy import Column, Integer, ForeignKey,String,DateTime 
from sqlalchemy.orm import relationship
from database import engine, Base

class Inscription(Base):
    __tablename__ = "Inscriptions"
    event_id = Column(Integer, ForeignKey("Events.event_id"), primary_key=True,  index=True) 
    user_id = Column(Integer, ForeignKey("Users.user_id"), primary_key=True, index=True) 
    inscription_description =  Column(String)
    inscription_date = Column(DateTime)                 

event = relationship("Events", back_populates="Inscriptions")
user = relationship("Users", back_populates="Inscriptions")

Inscription.metadata.create_all(bind=engine)
