from sqlalchemy.orm import Session
from models.inscription import Inscription
from schemas.inscription import InscriptionCreate
from crud.event import find_event_by_eventId
from datetime import datetime,timedelta

def create_inscription(db: Session, inscription: InscriptionCreate):
    db_inscription = Inscription(event_id = inscription.event_id, user_id = inscription.user_id, inscription_description=inscription.inscription_description, inscription_date=datetime.now())
    
    event = find_event_by_eventId(db=db, event_id=inscription.event_id)
   
    if not event:
        return False
    
    db.add(db_inscription)
    db.commit() 
    return "Inscription created"

def find_inscription_by_userId(db: Session, user_id: int):
    return db.query(Inscription).filter(Inscription.user_id == user_id).all()

def find_inscription_by_userId_and_eventId(db: Session, user_id: int, event_id: int):
    return db.query(Inscription).filter(Inscription.event_id == event_id, Inscription.user_id == user_id).first()
    
def remove_inscription(db: Session,user_id: int, event_id: int):
    db_inscription = find_inscription_by_userId_and_eventId(db=db, user_id=user_id, event_id=event_id)
    if not db_inscription:
       return False   
    
    event = find_event_by_eventId(db=db, event_id=event_id)
   
    if not event:
        return False

    event_date = event.celebration_date
    diferencia = db_inscription.inscription_date - event_date

    if event_date < db_inscription.inscription_date:
        return False
    
    if event_date == db_inscription.inscription_date:
        return False
    
    if diferencia < timedelta(days=3):
        return False
    
    
    db.delete(db_inscription)
    db.commit()
    return "Inscription removed"