from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from crud.user import create_user, find_user_by_name, authenticate_user
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
        raise HTTPException(status_code=400, detail="Nombre de usuario ya registrado")
    return create_user(db=db, user=user)

@router.get("/user/{user_name}")
def find_user(user_name: str, db: Session = Depends(get_db)):
    db_user = find_user_by_name(db, user_name)
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
    verify_token(token=access_token)
    response.set_cookie(
            key="access_cookie", value=access_token, httponly=True, samesite="Lax")
    return {"message": "Usuario logueado"}

@router.post("/user/logout/{user_name}")
def logout_user(user_name: str, response: Response, db: Session = Depends(get_db)):
    db_user = find_user_by_name(db, user_name)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")     
    response.delete_cookie(key="access_cookie")
    return {"message": "Usuario deslogueado"}

@router.get("/protected")
def protected_route(request: Request):
    token = request.cookies.get("access_cookie")    
    if not token:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    return {"message": "Ruta protegida accesible", "token": token}    