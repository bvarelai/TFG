
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response, File, UploadFile
from crud.event import create_event, find_event_by_name, find_event_by_type, find_event_by_category, find_big_event, find_small_event, find_medium_event,  find_event_by_userId, find_all_event, find_event_by_celebration_date_and_end_date, remove_event, change_event
from crud.event_result import create_event_result_csv, find_event_result_csv_by_edition_and_category, find_all_event_result_csv,find_event_result_csv,delete_event_result_csv
from models.event_result import EventResult
from schemas.event_result import EventResultCreate
from database import get_db
import csv
import codecs
from datetime import datetime
from schemas.event import EventCreate, EventUpdate

router = APIRouter()

@router.post("/event/register")
def register_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db,event_name=event.event_name)
    if db_event:
        raise HTTPException(status_code=400, detail="Event name already register")
    db_event = create_event(db, event)
    return {"event_id" : db_event.event_id}

@router.get("/event/find/name/{event_name}")
def get_event(event_name: str, db: Session = Depends(get_db)):
    db_event = find_event_by_name(db, event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event no available")
    return db_event

@router.get("/event/find/type/{event_type}")
def get_event(event_type: str, db: Session = Depends(get_db)):
    db_event = find_event_by_type(db, event_type)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find/category/{category}")
def get_event(category: str, db: Session = Depends(get_db)):
    db_event = find_event_by_category(db, category)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get ("/event/find/myevents/{user_id}")
def get_event_by_userId( user_id: int, db: Session = Depends(get_db)):
    db_event = find_event_by_userId(db, user_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find/date/{celebration_date}/{end_date}")
def get_events_by_date(celebration_date: datetime, end_date: datetime, db:Session=Depends(get_db)):
    db_event = find_event_by_celebration_date_and_end_date(db,celebration_date=celebration_date, end_date=end_date)
    if not db_event:
      raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find/small/{capacity}")
def get_event_by_small_capacity(capacity: int, db:Session=Depends(get_db)):
    db_event = find_small_event(db=db,capacity=capacity)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find/big/{capacity}")
def get_event_by_big_capacity(capacity: int, db:Session=Depends(get_db)):
    db_event = find_big_event(db=db,capacity=capacity)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find/medium/{small_capacity}/{big_capacity}")
def get_event_by_medium_capacity(small_capacity: int, big_capacity: int, db:Session=Depends(get_db)):
    db_event = find_medium_event(db=db,small_capacity=small_capacity, big_capacity=big_capacity)
    if not db_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_event

@router.get("/event/find")
def get_all_event(db:Session = Depends(get_db)):
    db_all_event = find_all_event(db)
    if not db_all_event:
        raise HTTPException(status_code=404, detail="Events no available")
    return db_all_event

@router.put("/event/update/{event_name}")
def update_event(event: EventUpdate, event_name : str , db: Session= Depends(get_db)):
    db_event = change_event(db,event, event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't update the event")
    return db_event

@router.delete("/event/delete/{event_name}")
def delete_event(event_name : str, db: Session = Depends(get_db)):
    db_event = remove_event(db,event_name)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't remove the event")
    return {"message" : "Event deleted"}


@router.post("/event/result/upload/{event_id}")
async def register_event_result( event_id: int, event_name : str, edition_result:str, category_result: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_event_result = await create_event_result_csv(file=file, event_id=event_id,event_name=event_name, edition_result=edition_result, category_result=category_result, db=db)
    if not db_event_result:
        raise HTTPException(status_code=400, detail="Error saving CSV file to the database")
    return {"message": "CSV file uploaded successfully"}

@router.get("/event/result/download/{event_id}")
def get_event_result(event_id: int, db: Session = Depends(get_db)):
    db_event_result = find_all_event_result_csv(db=db, event_id=event_id)
    if not db_event_result:
        raise HTTPException(status_code=404, detail="Event result no available")
    return db_event_result

@router.get("/event/result/find/{event_id}/{edition_result}/{category_result}")
def get_event_result(event_id: int, edition_result: str, category_result:str, db: Session = Depends(get_db)):
    db_event_result = find_event_result_csv_by_edition_and_category(db=db, event_id=event_id, edition_result=edition_result, category_result=category_result)
    if not db_event_result:
        raise HTTPException(status_code=404, detail="Event result no available")
    return db_event_result


@router.delete("/event/result/delete/{event_id}/{result_id}")
def delete_event_result(event_id: int, result_id: int, db: Session = Depends(get_db)):
    db_event_result = find_event_result_csv(db=db, event_id=event_id, result_id=result_id)
    if not db_event_result:
        raise HTTPException(status_code=404, detail="Event result no available")
    delete_event_result_csv(db=db,event_id=event_id,result_id=result_id)
    return {"message": "Event result deleted"}