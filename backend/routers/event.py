
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.event import create_event,find_event_by_name,find_event_by_userId,find_all_event,remove_event,change_event
from database import get_db
from schemas.event import EventCreate, EventUpdate

router = APIRouter()

@router.post("/event/register")
def register_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db,event_name=event.event_name)
    if db_event:
        raise HTTPException(status_code=400, detail="Event name already register")
    db_event = create_event(db, event)
    return {"event_id" : db_event.event_id}

@router.get("/event/find/{event_name}")
def get_event(event_name: str, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db, event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event no available")
    return db_event

@router.get ("/event/find/{user_id}")
def get_event_by_userId( user_id: int, db: Session = Depends(get_db)):
    db_event = find_event_by_userId(db, user_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="No events available")
    return db_event

@router.get("/event/find")
def get_all_event(db:Session = Depends(get_db)):
    db_all_event = find_all_event(db)
    if not db_all_event:
        raise HTTPException(status_code=404, detail="No events available")
    return db_all_event

@router.put("/event/update/")
def update_event(event: EventUpdate, db: Session= Depends(get_db)):
    db_event = change_event(db,event)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't update the event")
    return db_event

@router.delete("/event/delete/{event_name}")
def delete_event(event_name : str, db: Session = Depends(get_db)):
    db_event = remove_event(db,event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't remove the event")
    return "Evento Eliminado"