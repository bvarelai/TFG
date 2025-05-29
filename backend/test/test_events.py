from fastapi.testclient import TestClient
import pytest
from httpx import ASGITransport, AsyncClient
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
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 11, "organizer_by" : "organizer",
                               "duration" : 1, "event_full_description" : "event_full_description", "language" : "language", "is_free" : True},
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
        "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 22, "organizer_by" : "organizer",
        "event_full_description" : "event_full_description", "language" : "language", "is_free" : False}

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
        "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 33, "organizer_by" : "organizer",
        "event_full_description" : "event_full_description", "language" : "language", "is_free" : True}
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True  

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
      "capacity": 22,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
    }]

def test_find_non_existent_event_by_category():
    response = event.get("/event/find/category/category2")  
    assert response.status_code == 404
    assert response.json() == {
       "detail": "Events no available"
    }

def test_find_event_by_userId():
    response = event.get("/event/find/myevents/2")
    assert response.status_code == 200
    assert response.json() ==  [
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True  

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
      "capacity": 22,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
    }]

def test_find_non_existent_event_by_userId():
    response = event.get("/event/find/myevents/4")  
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22, 
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22, 
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 11,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
      "capacity": 22, 
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": False
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
      "capacity": 33,
      "organizer_by": "organizer",
      "event_full_description": "event_full_description",
      "language": "language",
      "is_free": True
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
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 12, "organizer_by" : "organizer", "event_full_description": "event_full_description", "language": "language", "is_free": True},
                         headers={"content-type" : "application/json"}
    )
    assert response.status_code==200
    assert response.json() == "Event updated" 
    

def test_update_non_existent_event():
    response = event.put("/event/update/event4",
                         json={"event_name": "event4", "user_id" : 2,  "event_type" : "type",
                               "event_edition" : "edition", "category" : "category", "event_description" : "event_description",  "location" : "location",
                               "celebration_date" : "2025-03-28T18:56:59", "end_date": "2025-03-28T18:56:59", "capacity" : 12, "organizer_by" : "organizer", "event_full_description": "event_full_description", "language": "language", "is_free": True},
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

@pytest.mark.anyio("asyncio")
async def test_register_event_result():
    
  csv_content = b"name,score\nAlice,90\nBob,85"

  files = {
      "file": ("results.csv", csv_content, "text/csv"),
  }

  params = {
      "event_id": 1,
      "event_name": "event1",
      "edition_result": "edition",
      "category_result": "category"
  }

  async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ev:
      response = await ev.post(
          "/event/result/upload/1",
          params=params,
          files=files
  )

  assert response.status_code == 200
  assert response.json() == {"message": "CSV file uploaded successfully"}


def test_download_event_result():
    response = event.get("/event/result/download/1")
    assert response.status_code == 200
    assert response.json() == [
        {
            "event_id": 1,
            "event_name": "event1",
            "edition_result": "edition",
            "result_id": 1,
            "category_result": "category",
            "csv_file": "name,score\nAlice,90\nBob,85"
        },
        {
            "event_id": 1,
            "event_name": "event1",
            "edition_result": "edition",
            "result_id": 2,
            "category_result": "category",
            "csv_file": "name,score\nAlice,90\nBob,85"
        }
    ]

def test_download_event_result_fail():
  response = event.get("/event/result/download/2")
  assert response.status_code == 404
  assert response.json() == {
    "detail": "Event result no available"
  }

def test_find_event_result_by_edition_and_category():
  response = event.get("/event/result/find/1/edition/category")
  assert response.status_code == 200
  assert response.json() == {
      "event_id": 1,
      "event_name": "event1",
      "edition_result": "edition",
      "result_id": 1,
      "category_result": "category",
      "csv_file": "name,score\nAlice,90\nBob,85"
  }        

def test_find_event_result_by_edition_and_category_fail():
  response = event.get("/event/result/find/1/edition/category2")
  assert response.status_code == 404
  assert response.json() == {
    "detail": "Event result no available"
  }

def test_delete_event_result():
  response = event.delete("/event/result/delete/1/1")
  assert response.status_code == 200
  assert response.json() == {
      "message": "Event result deleted"
  }

def test_delete_event_result_fail():  
  response = event.delete("/event/result/delete/1/3")
  assert response.status_code == 404
  assert response.json() == {
    "detail": "Event result no available"
  }  