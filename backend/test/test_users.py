from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from database import get_db, Base
from datetime import datetime


SQLALCHEMY_DATABASE_URL = "sqlite:///test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _get_db_test():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
app.dependency_overrides[get_db] = _get_db_test

user = TestClient(app)


def test_no_user():
    response = user.get("/user/find")
    assert response.status_code == 404
    assert response.json() == {
       "detail": "No users available"
    }


def test_register_user():
    response = user.post("/user/register",
                         json={"user_name": "user1", "user_surname" : "surname",  "password" : "password1",
                               "age" : "age", "email" : "email", "phone" : "phone",  "city" : "city",
                               "autonomous_community" : "autonomous_community", "country": "country", "is_organizer" : False, "register_date": datetime.now().replace(microsecond=0).isoformat()},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==200
    assert response.json() == "User created"
    

def test_register_an_existing_user():
    
    user_data = {
        "user_name": "organizer","user_surname" : "surname",  "password" : "org_passwd",
        "age" : "age", "email" : "email", "phone" : "phone",  "city" : "city",
        "autonomous_community" : "autonomous_community", "country": "country" , "is_organizer" : True, "register_date": datetime.now().replace(microsecond=0).isoformat()}

    user.post("/user/register", json=user_data, headers={"content-type" : "application/json"})
    
    response = user.post("/user/register", json=user_data, headers={"content-type" : "application/json"})

    assert response.status_code == 400
    assert response.json() == {
        "detail" : "User name already register"
    }     


def test_find_user():
    user_data = {
        "user_name": "user2", "user_surname" : "surname", "password" : "password2",
        "age" : "age", "email" : "email", "phone" : "phone",  "city" : "city",
        "autonomous_community" : "autonomous_community", "country": "country", "is_organizer" : False, "register_date": datetime.now().replace(microsecond=0).isoformat()}
    user.post("/user/register", json=user_data)
    response = user.get("/user/find/user2")
    assert response.status_code == 200
    assert response.json() == {
        "password": "password2",
        "user_id": 3,
        "email": "email",
        "city": "city",
        "country": "country",
        "is_organizer": False,
        "user_surname": "surname",
        "age": "age",
        "user_name": "user2",
        "phone": "phone",
        "autonomous_community": "autonomous_community", 
        "register_date": datetime.now().replace(microsecond=0).isoformat()
    }

def test_find_non_existent_user():
    response = user.get("/user/find/user3")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "User no available"
    }

def test_find_all_users():
    response = user.get("/user/find")  
    assert response.status_code == 200
    assert response.json() == [
      {
        "password": "password1",
        "user_id": 1,
        "email": "email",
        "city": "city",
        "country": "country",
        "is_organizer": False,
        "user_surname": "surname",
        "age": "age",
        "user_name": "user1",
        "phone": "phone",
        "autonomous_community": "autonomous_community",
        "register_date": datetime.now().replace(microsecond=0).isoformat()       
      },
      {
        "password": "org_passwd",
        "user_id": 2,
        "email": "email",
        "city": "city",
        "country": "country",
        "is_organizer": True,
        "user_surname": "surname",
        "age": "age",
        "user_name": "organizer",
        "phone": "phone",
        "autonomous_community": "autonomous_community",        
        "register_date": datetime.now().replace(microsecond=0).isoformat()          
      },
      {
        "password": "password2",
        "user_id": 3,
        "email": "email",
        "city": "city",
        "country": "country",
        "is_organizer": False,
        "user_surname": "surname",
        "age": "age",
        "user_name": "user2",
        "phone": "phone",
        "autonomous_community": "autonomous_community",
        "register_date": datetime.now().replace(microsecond=0).isoformat()          
      }
    ]


def test_login_user():
    response = user.post("/user/login",
                        data={"username": "organizer", "password" : "org_passwd"},
                        headers={"content-type" : "application/x-www-form-urlencoded"}
    )
    
    assert response.status_code == 200
    assert response.json() == { 
        "message" : "Login user", "organizer" : True, "user_id" : 2, "session_id" : response.json()["session_id"]
    }   


def test_login_unauthorized_user():
    response = user.post("/user/login",
                        data={"username": "user3", "password" : "password3"},
                        headers= {"content-type" : "application/x-www-form-urlencoded"})
    assert response.status_code == 401
    assert response.json() == {
       "detail": "Incorrect Username or password"
    }
    
def test_login_user_without_credentials():
    response_login = user.post("/user/login",
                               data={"username": "organizer", "password": "org_passwd"},
                               headers={"content-type": "application/x-www-form-urlencoded"})
    
    assert response_login.status_code == 200

    user.post("/user/logout/organizer")

    response_protected = user.get("/protected/1")
    assert response_protected.status_code == 401
    assert response_protected.json() == {
        "detail": "No authorized"
    }

def test_logout_user():
    response_logout = user.post("/user/logout/organizer")
    assert response_logout.status_code == 200
    assert response_logout.json() == {
        "message" : "Logout successful"
    }

def test_protected_route():
    response_login = user.post("/user/login",
                               data={"username": "organizer", "password": "org_passwd"},
                               headers={"content-type": "application/x-www-form-urlencoded"})
    
    response_protected = user.get(f"/protected/{response_login.json()['session_id']}", cookies={"access_cookie": "test_token"})
    assert response_protected.status_code == 200
    assert response_protected.json() == {
        "message" : "Accessible protected route", "token" : response_protected.json()['token']}

def test_protected_route_fail():
    user.post("/user/logout/usuario")
    response_protected = user.get("/protected/2")
    assert response_protected.status_code == 401
    assert response_protected.json() == {
        "detail" : "No authorized"
    }

def test_deleted_user():
    response_delete = user.delete("/user/delete/user2")
    response_delete.status_code == 200
    assert response_delete.json() == {
        "message": "User deleted"
    }

def test_deleted_non_existent_user():
    response_delete = user.delete("/user/delete/user4")
    response_delete.status_code == 404
    assert response_delete.json() == {
        "detail": "Can't remove the user"
    }

    