
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.event import create_event,find_event_by_name,remove_event,change_event
from database import get_db
from schemas.event import EventCreate, EventUpdate

router = APIRouter()

@router.post("/event/register")
def register_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db,event_name=event.event_name)
    if db_event:
        raise HTTPException(status_code=400, detail="Nombre de evento ya registrado")
    return create_event(db, event)

@router.get("/event/{event_name}")
def find_event(event_name: str, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db, event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="No hay eventos disponibles")
    return db_event
 
@router.put("/event/update/")
def update_event(event: EventUpdate, db: Session= Depends(get_db)):
    db_event = change_event(db,event)
    if not db_event:
        raise HTTPException(status_code=404, detail="No se puede modificar este evento")
    return db_event

@router.delete("/event/delete/{event_name}")
def delete_event(event_name : str, db: Session = Depends(get_db)):
    db_event = remove_event(db,event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="No se puede modificar este evento")
    return "Evento Eliminado"