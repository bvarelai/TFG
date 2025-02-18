from sqlalchemy import Column, Integer, String, DateTime

class Event(Base):
    __tablename__ = "eventos"
    eventName = Column(String,primary_key=True, index=True)
    Location = Column(String, nullable=None)
    CelebrationDate = Column(DateTime, nullable=None)
    Category = Column(String,nullable=None)
    Capacity = Column(Integer,nullable=None)

Event.metadata.create_all(bind=engine)
