from sqlalchemy.orm import Session
from models.event import Event
from schemas.event import EventCreate, EventUpdate
from datetime import datetime
import pytz



# Dar de alta al usuario
def create_event(db: Session,  event: EventCreate):
    db_event = Event(event_name=event.event_name, event_type=event.event_type, event_edition=event.event_edition,category=event.category,description=event.description, location=event.location, celebration_date=event.celebration_date, capacity=event.capacity)
    db.add(db_event)
    db.commit() 
    return "Evento creado"

def find_event_by_name(db: Session, event_name: str):
    return db.query(Event).filter(Event.event_name == event_name).first()

def remove_event(db: Session,event_name: str):
    db_event = find_event_by_name(db=db, event_name=event_name)
    if not db_event:
       return False   
    db.delete(db_event)
    db.commit()
    return "Evento eliminado"
       
def change_event(db: Session, event: EventUpdate):
    db_event =  find_event_by_name(db=db, event_name=event.event_name)
    if not db_event:
       return False
    
    celebration_datetime = datetime.now()
    local_tz = pytz.timezone('Europe/Madrid')
    celebration_datetime = local_tz.localize(celebration_datetime)

    update_data = event.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_event, key, value)  
    
    db.commit()
    db.refresh(db_event)