from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.user import create_user, find_user_by_name, find_all_user, authenticate_user, remove_user
from utils.utils import create_access_token,verify_token
from database import get_db
from datetime import timedelta
from fastapi.security import  OAuth2PasswordRequestForm
from schemas.user import UserCreate

ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

@router.post("/user/register")
def register_user( user: UserCreate, db: Session = Depends(get_db)):
    db_user = find_user_by_name(db, user_name=user.user_name)
    if db_user:
        raise HTTPException(status_code=400, detail="User name already register")
    return create_user(db=db, user=user)

@router.get("/user/find/{user_name}")
def get_user(user_name: str, db: Session = Depends(get_db)):
    db_user = find_user_by_name(db, user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="User no available")
    return db_user

@router.get("/user/find")
def get_all_user(db: Session = Depends(get_db)):
    db_all_user = find_all_user(db)
    if not db_all_user:
        raise HTTPException(status_code=404, detail="No users available")
    return db_all_user

@router.post("/user/login")
def login_user(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect Username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    verify_token(token=access_token)
    response.set_cookie(
            key="access_cookie", value=access_token, httponly=True, samesite="Lax")
    return {"message": "Login user", "organizer": user.is_organizer, "user_id" : user.user_id}

@router.post("/user/logout/{user_name}")
def logout_user(user_name: str, response: Response, db: Session = Depends(get_db)):
    db_user = find_user_by_name(db, user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="No user available")     
    response.delete_cookie(key="access_cookie")
    return {"message": "Logout user"}

@router.get("/protected")
def protected_route(request: Request):
    token = request.cookies.get("access_cookie")    
    if not token:
        raise HTTPException(status_code=401, detail="No authorized")
    
    return {"message": "Accessible protected route", "token": token}    

@router.delete("/user/delete/{user_name}")
def delete_user(user_name : str, db: Session = Depends(get_db)):
    db_user = remove_user(db,user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="Can't remove the user")
    return {"message": "User deleted"}