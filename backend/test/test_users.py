from fastapi.testclient import TestClient
from routers.user import router
from main import app
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import sessionmaker
from database import get_db, Base


SQLALCHEMY_DATABASE_URL = "sqlite:///test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
app.dependency_overrides[get_db] = override_get_db

user = TestClient(app)


def test_register_user():
    response = user.post("/user/register",
                         json={"user_name": "usuario", "password" : "contraseña",
                               "age" : "edad", "city" : "ciudad",
                               "autonomous_community" : "comunidad autónoma", "country": "país"},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==200
    assert response.json() == "Usuario creado"
    

def test_register_an_existing_user():
    
    user_data = {
        "user_name": "usuario2", "password" : "password2",
        "age" : "34", "city" : "ciudad2",
        "autonomous_community" : "comunidad Autónoma2", "country": "país2"
    }

    user.post("/user/register", json=user_data, headers={"content-type" : "application/json"})
    
    response = user.post("/user/register", json=user_data, headers={"content-type" : "application/json"})

    assert response.status_code == 400
    assert response.json() == {
        "detail" : "Nombre de usuario ya registrado"
    }     


def test_find_user():
    user_data = {
        "user_name": "usuario3", "password" : "password3",
        "age" : "35", "city" : "ciudad3",
        "autonomous_community" : "comunidad Autónoma3", "country": "país3"
    }
    user.post("/user/register", json=user_data)
    response = user.get("/user/usuario3")
    assert response.status_code == 200
    assert response.json() == {
        "age": "35",
        "user_name": "usuario3",
        "user_id": 3,
        "country": "país3",
        "password": "password3",
        "city": "ciudad3"
    }

def test_find_non_existent_user():
    response = user.get("/user/usuario4")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "No hay usuarios disponibles"
    }


def test_login_user():
    response = user.post("/user/login",
                        data={"username": "usuario", "password" : "contraseña"},
                        headers={"content-type" : "application/x-www-form-urlencoded"}
    )
    
    assert response.status_code == 200
    assert response.json() == { 
        "message" : "Usuario logueado"
    }   


def test_login_unauthorized_user():
    response = user.post("/user/login",
                        data={"username": "usuario4", "password" : "contraseña4"},
                        headers= {"content-type" : "application/x-www-form-urlencoded"})
    assert response.status_code == 401
    assert response.json() == {
       "detail": "Nombre de usuario o contraseña incorrecto"
}
    
def test_login_user_without_credentials():
    response = user.post("/user/login",
                        data={"username": "usuario", "password" : "contraseña"},
                        headers={"content-type" : "application/x-www-form-urlencoded"}
    )
    response_protected = user.get("/protected")
    assert response.status_code == 200

def test_logout_user():
    response_logout = user.post("/user/logout/usuario", cookies={"access_cookie": response_logout.cookies["access_cookie"]})
    assert response_logout.status_code == 200
    assert response_logout.json() == {
        "message" : "Usuario deslogueado"
    }

def test_logout_non_existent_user():
    response_logout = user.post("/user/logout/usuario5", cookies={"access_cookie": response_logout.cookies["access_cookie"]})
    assert response_logout.status_code == 404
    assert response_logout.json() == {
        "detail" : "Usuario no encontrado"
    }    

def test_protected_route():
    response_protected = user.get("/protected", cookies={"access_cookie": response_protected.cookies["access_cookie"]})
    assert response_protected.status_code == 200
    assert response_protected.json() == {
        "message" : "Ruta protegida"
    }
def test_protected_route_fail():
    response_protected = user.get("/protected")
    assert response_protected.status_code == 401
    assert response_protected.json() == {
        "detail" : "No autorizado"
    }
