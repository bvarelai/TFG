from sqlalchemy.orm import Session
from models.event_result import EventResult
from fastapi import UploadFile
from schemas.event_result import EventResultCreate

async def create_event_result_csv(file: UploadFile, event_id: int, edition_result:str, category_result: str, db: Session):
    try:
        if file.content_type != "text/csv":
            return {"success": False, "message": "Invalid file type. Only CSV files are allowed."}

        csv_content = await file.read()

        event_result = EventResult(
            event_id=event_id,
            csv_file=csv_content,
            edition_result=edition_result,
            category_result=category_result
        )

        db.add(event_result)
        db.commit()

        return {"success": True, "message": "CSV file uploaded successfully."}
    except Exception as e:
        db.rollback()
        return {"success": False, "message": f"An error occurred: {e}"}

def find_all_event_result_csv(event_id: int, db: Session):
    try:
        event_result = db.query(EventResult).filter_by(event_id=event_id).all()

        if not event_result :
            print("No CSV file found for the given event and result IDs.")
            return
    
        return event_result

    except Exception as e:
        print(f"An error occurred: {e}")    

def find_event_result_csv(event_id: int,result_id : int, db: Session):
    try:
        event_result = db.query(EventResult).filter_by(event_id=event_id, result_id=result_id).first()

        if not event_result :
            print("No CSV file found for the given event and result IDs.")
            return
    
        return event_result

    except Exception as e:
        print(f"An error occurred: {e}")    

def delete_event_result_csv(event_id: int, result_id: int, db: Session):
    try:
        event_result = db.query(EventResult).filter_by(event_id=event_id, result_id=result_id).first()

        if not event_result:
            print("No CSV file found for the given event and result IDs.")
            return

        db.delete(event_result)
        db.commit()
        print("CSV file successfully deleted from the database.")

    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")            