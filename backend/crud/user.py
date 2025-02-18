from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dar de alta al usuario
def create_user(db: Session, userName: str, password: str):
    hashed_password = pwd_context.hash(password)
    db_user = User(userName=userName, hashed_password=hashed_password)
    db.add(db_user)
    db.commit() 
    return "Usuario creado"

def get_users(db: Session):
    return db.query(User).all

def get_user_by_username(db: Session, userName: str):
    return db.query(User).filter(User.userName == userName).first()

# Autenticación usuario
def authenticate_user(userName: str, password: str, db: Session):
    user = db.query(User).filter(User.userName == userName).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user