from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response,status
from crud.user import create_user, get_user_by_username, authenticate_user
from utils.utils import create_access_token,verify_token
from database import get_db
from datetime import timedelta
from fastapi.security import  OAuth2PasswordRequestForm
from schemas.user import UserCreate

ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

@router.post("/user/register")
def register_user( user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user_name=user.user_name)
    if db_user:
        raise HTTPException(status_code=400, detail="Nombre de usuario ya registrado")
    return create_user(db=db, user=user)

@router.get("/user/{user_name}")
def find_users(user_name: str, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="No hay usuarios disponibles")
    return db_user

@router.post("/user/login")
def login_user(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Nombre de usuario o contraseña incorrecto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    response.set_cookie(
            key="access_cookie", value=access_token, httponly=True, samesite="Lax")
    return {"access_token": access_token, "response" : response, "token_type": "bearer"}

@router.get("/user/token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {"message": "El token es válido"}

@router.get("/protected")
def protected_route(request: Request):
    token = request.cookies.get("access_cookie")    
    if not token:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    return {"message": "Ruta protegida accesible", "token": token}    