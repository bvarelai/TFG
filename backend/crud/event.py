from sqlalchemy.orm import Session
from models.event import Event
from schemas.event import EventCreate, EventUpdate
from datetime import datetime, timedelta

# Dar de alta al usuario
def create_event(db: Session,  event: EventCreate):
    db_event = Event(user_id=event.user_id,event_name=event.event_name, event_type=event.event_type, event_edition=event.event_edition,category=event.category,event_description=event.event_description, location=event.location, celebration_date=event.celebration_date, capacity=event.capacity)
    db.add(db_event)
    db.commit() 
    return db_event

def find_event_by_name(db: Session, event_name: str):
    return db.query(Event).filter(Event.event_name == event_name).first()

def find_event_by_userId(db: Session, user_id: int):
    return db.query(Event).filter(Event.user_id == user_id).all()

def find_all_event(db: Session):
    return db.query(Event).all()


def remove_event(db: Session,event_name: str):
    db_event = find_event_by_name(db=db, event_name=event_name)
    if not db_event:
       return False   
    
    actual_date = datetime.now()
    diferencia = db_event.celebration_date - actual_date

    if actual_date > db_event.celebration_date:
        return False
    
    if actual_date == db_event.celebration_date:
        return False
    
    if diferencia < timedelta(days=3):
        return False

    db.delete(db_event)
    db.commit()
    return "Event removed"
       
def change_event(db: Session, event: EventUpdate):
    db_event =  find_event_by_name(db=db, event_name=event.event_name)
    if not db_event:
       return False
    
    actual_date = datetime.now()
    diferencia = db_event.celebration_date - actual_date

    if actual_date > db_event.celebration_date:
        return False
    
    if actual_date == db_event.celebration_date:
        return False
    
    if diferencia < timedelta(days=3):
        return False

    update_data = event.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_event, key, value)  
    
    db.commit()
    db.refresh(db_event)