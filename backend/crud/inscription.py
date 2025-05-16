from sqlalchemy.orm import Session
from models.inscription import Inscription
from schemas.inscription import InscriptionCreate, InscriptionUpdate
from datetime import datetime,timedelta

def create_inscription(db: Session, inscription: InscriptionCreate):
    db_inscription = Inscription(event_id = inscription.event_id, user_id = inscription.user_id, event_name = inscription.event_name ,inscription_date=datetime.now().replace(microsecond=0),start_date=inscription.start_date,end_date=inscription.end_date,location=inscription.location, category_inscription=inscription.category_inscription, type_inscription=inscription.type_inscription)
    db.add(db_inscription)
    db.commit() 
    return "Inscription created"

def find_inscription_by_userId(db: Session, user_id: int):
    return db.query(Inscription).filter(Inscription.user_id == user_id).all()

def find_inscription_by_eventId(db: Session, event_id: int):
    return db.query(Inscription).filter(Inscription.event_id == event_id).all()

def find_inscription_by_userId_and_eventId(db: Session, user_id: int, event_id: int):
    return db.query(Inscription).filter(Inscription.user_id == user_id, Inscription.event_id == event_id).first()
    
def remove_inscription(db: Session,user_id: int, event_id: int):
    db_inscription = find_inscription_by_userId_and_eventId(db=db, user_id=user_id, event_id=event_id)
    if not db_inscription:
       return False   
    
    db.delete(db_inscription)
    db.commit()
    return "Inscription removed"

def change_inscription(db: Session, inscription: InscriptionUpdate):
    db_inscription = find_inscription_by_userId_and_eventId(db=db, user_id=inscription.user_id, event_id=inscription.event_id)
    if not db_inscription:
        return False 

    for key, value in inscription.model_dump(exclude_unset=True).items():
        setattr(db_inscription, key, value)
        
    db.commit()
    db.refresh(db_inscription)
    return "Inscription updated"