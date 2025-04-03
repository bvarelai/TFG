from fastapi.testclient import TestClient
from main import app
from database import get_db
from test.test_users import _get_db_test

app.dependency_overrides[get_db] = _get_db_test

event = TestClient(app)

def test_no_event():
    response = event.get("/event/find")
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_register_event():
    response = event.post("/event/register",
                         json={"event_name": "event1", "user_id" : 2,  "event_type" : "type",
                               "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 11},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==200
    assert response.json() == {
        "event_id": 1
    }    

def test_register_an_existing_event():
    event_data = {
        "event_name": "event2", "user_id" : 2,  "event_type" : "type",
        "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
        "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 22}

    event.post("/event/register", json=event_data, headers={"content-type" : "application/json"})
    
    response = event.post("/event/register", json=event_data, headers={"content-type" : "application/json"})

    assert response.status_code == 400
    assert response.json() == {
        "detail" : "Event name already register"
    }

def test_register_event_with_missing_fields():
    response = event.post("/event/register",
                          json={"event_name": "event4"},  
                          headers={"content-type": "application/json"})
    assert response.status_code == 422      

def test_find_event_by_name():
    event_data = {
        "event_name": "event3", "user_id" : 2,  "event_type" : "type",
        "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
        "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 33}
    event.post("/event/register", json=event_data)
    response = event.get("/event/find/name/event3")
    assert response.status_code == 200
    assert response.json() == {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }

def test_find_non_existent_event_by_name():
    response = event.get("/event/find/name/event4")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Event no available"
    }


def test_find_events():
    response = event.get("/event/find")
    assert response.status_code == 200
    assert response.json() == [
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_event_by_type():
    response = event.get("/event/find/type/type")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]


def test_find_non_existent_event_by_type():
    response = event.get("/event/find/type/type2")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_category():
    response = event.get("/event/find/category/category")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_category():
    response = event.get("/event/find/category/category2")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_userId():
    response = event.get("/event/find/user/2")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_userId():
    response = event.get("/event/find/user/4")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_date():
    response = event.get("/event/find/date/2025-03-28T18:56:59/2025-03-28T18:56:59")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_date():
    response = event.get("/event/find/date/2025-04-28T18:56:59/2025-04-28T18:56:59")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_small_capacity():
    response = event.get("/event/find/small/50")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_small_capacity():
    response = event.get("/event/find/small/1")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_big_capacity():
    response = event.get("/event/find/big/10")
    assert response.status_code == 200
    assert response.json() == [
   {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_big_capacity():
    response = event.get("/event/find/big/1000")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_medium_capacity():
    response = event.get("/event/find/medium/10/50")
    assert response.status_code == 200
    assert response.json() == [
 {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event1",
      "event_id": 1,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 11
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event2",
      "event_id": 2,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 22
    },
    {
      "event_type": "type",
      "category": "category",
      "location": "location",
      "end_date": "2025-03-28T18:56:59",
      "user_id": 2,
      "event_edition": "edition",
      "event_name": "event3",
      "event_id": 3,
      "event_description": "event_description",
      "celebration_date": "2025-03-28T18:56:59",
      "capacity": 33
    }]

def test_find_non_existent_event_by_medium_capacity():
    response = event.get("/event/find/medium/1000/2000")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_update_event():
    response = event.put("/event/update/event1",
                         json={"event_name": "event1", "user_id" : 2,  "event_type" : "type",
                               "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 12},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==200
    assert response.json() == "Event updated" 
    

def test_update_non_existent_event():
    response = event.put("/event/update/event4",
                         json={"event_name": "event4", "user_id" : 2,  "event_type" : "type",
                               "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 12},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==404
    assert response.json() == {
        "detail": "Can't update the event"
    }

def test_deleted_event():
    response_delete = event.delete("/event/delete/event3")
    response_delete.status_code == 200
    assert response_delete.json() == {
        "message": "Event deleted"
    }

def test_deleted_non_existent_event():
    response_delete = event.delete("/event/delete/event4")
    response_delete.status_code == 404
    assert response_delete.json() == {
        "detail": "Can't remove the event"
    }
    
