from sqlalchemy import Column, Integer, ForeignKey,String,Float
from sqlalchemy.orm import relationship
from database import engine, Base

class Reviews(Base):
    __tablename__ = "Reviews"
    review_id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("Events.event_id"), index=True) 
    user_id = Column(Integer, ForeignKey("Users.user_id"), index=True) 
    user_name = Column(String, nullable=None)
    review_text = Column(String, nullable=None)
    review_rating = Column(Float,nullable=None)

event = relationship("Events", back_populates="Reviews")
user = relationship("Users", back_populates="Reviews")

Reviews.metadata.create_all(bind=engine)
