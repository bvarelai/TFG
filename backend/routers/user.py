from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.user import create_user, find_user_by_name, find_all_user, authenticate_user, remove_user
from utils.utils import create_access_token,verify_token
from database import get_db
from datetime import timedelta
from fastapi.security import  OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from schemas.user import UserCreate
from uuid import uuid4

ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
security = HTTPBearer()

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
    session_id = str(uuid4())
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    verify_token(token=access_token)
    response.set_cookie(
        key=f"access_cookie_{session_id}", value=access_token, httponly=True, samesite="Lax"
    )
    return {"message": "Login user", "organizer": user.is_organizer, "user_id" : user.user_id, "session_id" : session_id}

@router.post("/user/logout/{session_id}")
def logout_user(session_id: str, response: Response):
    # Eliminar la cookie asociada al session_id
    response.delete_cookie(f"access_cookie_{session_id}")
    return {"message": "Logout successful"}

@router.get("/protected/{session_id}")
def protected_route(request: Request, session_id: str):
    token = request.cookies.get(f"access_cookie_{session_id}")
    if not token:
        raise HTTPException(status_code=401, detail="No authorized")
    try:
        payload = verify_token(token)  # Valida el token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {"message": "Accessible protected route", "token": token}    

@router.delete("/user/delete/{user_name}")
def delete_user(user_name : str, db: Session = Depends(get_db)):
    db_user = remove_user(db,user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="Can't remove the user")
    return {"message": "User deleted"}