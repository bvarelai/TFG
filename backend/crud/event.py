from sqlalchemy.orm import Session
from models.event import Event
from schemas.event import EventCreate, EventUpdate
from datetime import datetime, timedelta

def create_event(db: Session,  event: EventCreate):
    db_event = Event(user_id=event.user_id,event_name=event.event_name, event_type=event.event_type, event_edition=event.event_edition,category=event.category,event_description=event.event_description, location=event.location, celebration_date=event.celebration_date,end_date=event.end_date, capacity=event.capacity, organizer_by=event.organizer_by, event_full_description=event.event_full_description, language=event.language, is_free=event.is_free)
    db.add(db_event)
    db.commit() 
    return db_event

def find_event_by_name(db: Session, event_name: str):
    return db.query(Event).filter(Event.event_name == event_name).first()

def find_event_by_type(db: Session, event_type: str):
    return db.query(Event).filter(Event.event_type == event_type).all()

def find_event_by_category(db: Session, category: str):
    return db.query(Event).filter(Event.category == category).all()

def find_big_event(db:Session, capacity: int):
    return db.query(Event).filter(Event.capacity >= capacity).all()

def find_small_event(db:Session, capacity: int):
    return db.query(Event).filter(Event.capacity <= capacity).all()

def find_medium_event(db:Session, small_capacity: int, big_capacity: int):
    return db.query(Event).filter(Event.capacity >= small_capacity, Event.capacity <= big_capacity).all()

def find_event_by_eventId(db: Session, event_id: int):
    return db.query(Event).filter(Event.event_id == event_id)

def find_event_by_userId(db: Session, user_id: int):
    return db.query(Event).filter(Event.user_id == user_id).all()

def find_all_event(db: Session):
    return db.query(Event).all()

def find_event_by_celebration_date_and_end_date(db: Session, celebration_date: datetime, end_date: datetime):
    return db.query(Event).filter(Event.celebration_date >= celebration_date, Event.end_date <= end_date).all()

def remove_event(db: Session,event_name: str):
    db_event = find_event_by_name(db=db, event_name=event_name)
    if not db_event:
       return False   
    
    db.delete(db_event)
    db.commit()
    return "Event removed"
       
def change_event(db: Session, event: EventUpdate, event_name: str):
   
    db_event = find_event_by_name(db=db, event_name=event_name)
    if not db_event:
        return False 

    for key, value in event.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)
        
    db.commit()
    db.refresh(db_event)
    return "Event updated"