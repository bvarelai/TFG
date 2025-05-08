from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.review import create_review, find_review_by_userId, find_review_by_eventId, find_review_by_userId_and_eventId, remove_review, change_review
from database import get_db
from schemas.review import ReviewCreate,ReviewUpdate

router = APIRouter()

@router.post("/review/register")
def register_event(review: ReviewCreate, db: Session = Depends(get_db)):
    db_event = find_review_by_userId_and_eventId(db, event_id=review.event_id, user_id=review.user_id)
    if db_event:
        raise HTTPException(status_code=400, detail="Review name already register")
    db_event = create_review(db, review)
    return db_event

@router.get("/review/find/{user_id}/{event_id}")
def get_review(user_id: int, event_id: int, db: Session = Depends(get_db)):
    db_event = find_review_by_userId_and_eventId(db, user_id=user_id, event_id=event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Review no available")
    return db_event

@router.get("/review/find/{event_id}")
def get_review(event_id: int, db: Session = Depends(get_db)):
    db_event = find_review_by_eventId(db, event_id=event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Review no available")
    return db_event

@router.get("/review/find/{user_id}")
def get_review(user_id: int, db: Session = Depends(get_db)):
    db_event = find_review_by_userId(db, user_id=user_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Review no available")
    return db_event

@router.put("/review/update/")
def update_event(review: ReviewUpdate, db: Session= Depends(get_db)):
    db_event = change_review(db=db, review=review)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't update the rewiew")
    return db_event

@router.delete("/review/delete/{review_id}")
def delete_event(review_id : int, db: Session = Depends(get_db)):
    db_event = remove_review(db,review_id=review_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Can't remove the rewiew")
    return {"message" : "Review deleted"}
