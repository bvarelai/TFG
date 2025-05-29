from fastapi.testclient import TestClient
from main import app
from database import get_db
from test.test_users import _get_db_test
from datetime import datetime

app.dependency_overrides[get_db] = _get_db_test

client = TestClient(app)


def test_get_non_existing_inscription():
    response = client.get(f"/inscription/find/2")
    assert response.status_code == 404
    assert response.json() ==  {"detail": "No inscriptions available"}

def test_register_inscription():
    event_data = {"event_id": 1, "user_id": 2, "event_name": "event1", "inscription_date": datetime.now().replace(microsecond=0).isoformat(), "start_date" : "2025-06-02T19:20:57", "end_date" : "2025-06-08T19:20:57", "location": "location", "category_inscription": "category", "type_inscription": "type"}
    response = client.post("/inscription/register", json=event_data)
    assert response.status_code == 200
    assert response.json() == "Inscription created"

def test_register_existing_inscription():
    event_data = {"event_id": 1, "user_id": 2, "event_name": "event1", "inscription_date": datetime.now().replace(microsecond=0).isoformat(), "start_date" : "2025-06-02T19:20:57", "end_date" : "2025-06-08T19:20:57", "location": "location", "category_inscription": "category", "type_inscription": "type"}
    response = client.post("/inscription/register", json=event_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Inscription name already register"}

def test_get_all_inscriptions_by_user():
    response = client.get(f"/inscription/find/2")
    assert response.status_code == 200
    assert response.json() == [
    {
        "inscription_date": datetime.now().replace(microsecond=0).isoformat(),
        "start_date": "2025-06-02T19:20:57",
        "end_date": "2025-06-08T19:20:57",
        "event_id": 1,
        "location": "location",
        "user_id": 2,
        "event_name": "event1",
        "category_inscription": "category",
        "type_inscription": "type"
    }]

def test_get_all_inscriptions_by_event():
    response = client.get(f"/inscription/find/event/1")
    assert response.status_code == 200
    assert response.json() == [
    {
        "inscription_date": datetime.now().replace(microsecond=0).isoformat(),
        "start_date": "2025-06-02T19:20:57",
        "end_date": "2025-06-08T19:20:57",
        "event_id": 1,
        "location": "location",
        "user_id": 2,
        "event_name": "event1",
        "category_inscription": "category",
        "type_inscription": "type"
    }]
def test_get_all_inscriptions_by_event_not_found():
    response = client.get(f"/inscription/find/event/3")
    assert response.status_code == 404
    assert response.json() == {"detail": "No inscriptions available"}

def test_get_inscription_by_user_and_event():
    response = client.get(f"/inscription/find/2/1")
    assert response.status_code == 200
    assert response.json() == {
        "inscription_date": datetime.now().replace(microsecond=0).isoformat(),
        "start_date": "2025-06-02T19:20:57",
        "end_date": "2025-06-08T19:20:57",
        "event_id": 1,
        "location": "location",
        "user_id": 2,
        "event_name": "event1",
        "category_inscription" : "category",
        "type_inscription": "type"
    }
    

def test_get_inscription_not_found():
    response = client.get("/inscription/find/4/1")
    assert response.status_code == 404
    assert response.json() == {"detail": "No inscriptions available"}

def test_delete_inscription():
    response = client.delete("/inscription/delete/2/1")
    assert response.status_code == 200

def test_delete_inscription_not_found():
    response = client.delete("/inscription/delete/2/1")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Can't remove the inscription"
    }

def test_update_inscription():
    event_data = {"event_id": 1, "user_id": 3, "event_name": "event1", "inscription_date": datetime.now().replace(microsecond=0).isoformat(), "start_date" : "2025-06-02T19:20:57", "end_date" : "2025-06-08T19:20:57", "location": "location", "category_inscription": "category", "type_inscription": "type"}
    response = client.post("/inscription/register", json=event_data)
    update_data = {
        "event_id": 1,
        "user_id": 3,
        "event_name": "event1",
        "inscription_date": datetime.now().replace(microsecond=0).isoformat(),
        "start_date": "2025-06-02T19:20:57",
        "end_date": "2025-06-08T19:20:57",
        "location": "new_location",
        "category_inscription": "new_category",
        "type_inscription": "new_type"
    }
    response = client.put("/inscription/update/", json=update_data)
    assert response.status_code == 200
    assert response.json() == "Inscription updated"

def test_update_inscription_not_found():
    update_data = {
        "event_id": 3,
        "user_id": 2,
        "event_name": "event1",
        "inscription_date": datetime.now().replace(microsecond=0).isoformat(),
        "start_date": "2025-06-02T19:20:57",
        "end_date": "2025-06-08T19:20:57",
        "location": "new_location",
        "category_inscription": "new_category",
        "type_inscription": "new_type"
    }
    response = client.put("/inscription/update/", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Can't update the inscription"}        