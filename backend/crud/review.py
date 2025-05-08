from sqlalchemy.orm import Session
from models.review import Reviews
from schemas.review import ReviewCreate,ReviewUpdate
from crud.event import find_event_by_eventId
from datetime import datetime,timedelta

def create_review(db: Session, review: ReviewCreate):
    db_review = Reviews(event_id = review.event_id, user_id = review.user_id,user_name=review.user_name, review_text = review.review_text, review_rating = review.review_rating)
    db.add(db_review)
    db.commit() 
    return "Review created"

def find_review_by_reviewId(db: Session, review_id: int):
    return db.query(Reviews).filter(Reviews.review_id == review_id).first()

def find_review_by_userId(db: Session, user_id: int):
    return db.query(Reviews).filter(Reviews.user_id == user_id).all()

def find_review_by_eventId(db: Session, event_id: int):
    return db.query(Reviews).filter(Reviews.event_id == event_id).all()

def find_review_by_userId_and_eventId(db: Session, user_id: int, event_id: int):
    return db.query(Reviews).filter(Reviews.user_id == user_id, Reviews.event_id == event_id).first()

def remove_review(db: Session, review_id: int):
    db_review = find_review_by_reviewId(db=db, review_id=review_id)
    if not db_review:
       return False   
    
    db.delete(db_review)
    db.commit()
    return "Review removed"

def change_review(db: Session, review: ReviewUpdate):
   
    db_review = find_review_by_userId_and_eventId(db=db, user_id=review.user_id, event_id=review.event_id)
    if not db_review:
        return False 

    for key, value in review.model_dump(exclude_unset=True).items():
        setattr(db_review, key, value)
        
    db.commit()
    db.refresh(db_review)
    return "Review updated"