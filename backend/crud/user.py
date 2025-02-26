from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate


# Dar de alta al usuario
def create_user(db: Session,  user: UserCreate):
    db_user = User(user_name=user.user_name, password=user.password, age=user.age, city=user.city, autonomous_community=user.autonomous_community, country=user.country)
    db.add(db_user)
    db.commit() 
    return "Usuario creado"

def get_user_by_username(db: Session, user_name: str):
    return db.query(User).filter(User.user_name == user_name).first()

# Autenticación usuario
def authenticate_user(user_name: str, password: str, db: Session):
    user = db.query(User).filter(User.user_name == user_name).first()
    if not user:
        return False
    if not password.lower() == user.password.lower():
        return False
    return user