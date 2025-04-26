from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.inscription import create_inscription, find_inscription_by_userId, find_inscription_by_userId_and_eventId, remove_inscription,change_inscription
from database import get_db
from schemas.inscription import InscriptionCreate

router = APIRouter()

@router.post("/inscription/register")
def register_inscription(inscription: InscriptionCreate, db: Session = Depends(get_db)):
    db_inscription = find_inscription_by_userId_and_eventId(db, user_id=inscription.user_id, event_id=inscription.event_id)
    if db_inscription:
        raise HTTPException(status_code=400, detail="Inscription name already register")    
    return create_inscription(db, inscription) 

@router.get("/inscription/find/{user_id}")
def get_all_inscription_by_userId(user_id: int, db: Session = Depends(get_db)):
    db_inscription = find_inscription_by_userId(db, user_id=user_id)
    if not db_inscription:
        raise HTTPException(status_code=404, detail="No inscriptions available")
    return db_inscription

@router.get("/inscription/find/{user_id}/{event_id}")
def get_inscription_by_userId_and_eventId(user_id: int, event_id: int, db: Session = Depends(get_db)):
    db_inscription = find_inscription_by_userId_and_eventId(db=db,user_id=user_id,event_id=event_id)
    if not db_inscription:
        raise HTTPException(status_code=404, detail="No inscriptions available")
    return db_inscription

@router.delete("/inscription/delete/{user_id}/{event_id}")
def delete_inscription(user_id: int, event_id: int,  db: Session = Depends(get_db)):
    db_inscription = remove_inscription(db,user_id=user_id, event_id=event_id)
    if not db_inscription:
        raise HTTPException(status_code=404, detail="Can't remove the inscription")

@router.put("/inscription/update/")
def update_inscription(inscription: InscriptionCreate, db: Session= Depends(get_db)):
    db_inscription = change_inscription(db=db, inscription=inscription)
    if not db_inscription:
        raise HTTPException(status_code=404, detail="Can't update the inscription")
    return db_inscription