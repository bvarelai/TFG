from fastapi.testclient import TestClient
from main import app
from database import get_db
from test.test_users import _get_db_test

app.dependency_overrides[get_db] = _get_db_test

review = TestClient(app)

def test_register_review():
    response = review.post("/review/register", 
                           json={"user_id": 1, "event_id": 1, "user_name" : "user1", "review_text": "This is a review", "review_rating": 4.5},
                           headers={"content-type": "application/json"})
    
    assert response.status_code == 200
    assert response.json() == "Review created"

def test_register_review_already_exists():
    response = review.post("/review/register", 
                           json={"user_id": 1, "event_id": 1, "user_name" : "user1", "review_text": "This is a review", "review_rating": 4.5},
                           headers={"content-type": "application/json"})
    
    assert response.status_code == 400
    assert response.json() == {"detail": "Review name already register"} 

def test_find_review_by_userId_and_eventId():
    response = review.get("/review/find/1/1")
    
    assert response.status_code == 200
    assert response.json() == {
        "event_id": 1,
        "user_id": 1,
        "review_text": "This is a review",
        "review_id": 1,
        "user_name" : "user1",        
        "review_rating": 4.5
    }

def test_find_no_review_by_userId_and_eventId():
    response = review.get("/review/find/1/2")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Review no available"}

def test_find_review_by_eventId():
    response = review.get("/review/event/find/1")
    
    assert response.status_code == 200
    assert response.json() == [{
        "event_id": 1,
        "user_id": 1,
        "review_text": "This is a review",
        "review_id": 1,
        "user_name" : "user1",        
        "review_rating": 4.5
    }]

def test_find_no_review_by_eventId():
    response = review.get("/review/event/find/2")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Review no available"}    

def test_find_review_by_userId():
    response = review.get("/review/user/find/1")
    
    assert response.status_code == 200
    assert response.json() == [{
        "event_id": 1,
        "user_id": 1,
        "review_text": "This is a review",
        "review_id": 1,
        "user_name" : "user1",        
        "review_rating": 4.5
    }]   

def test_find_no_review_by_userId():
    response = review.get("/review/user/find/2")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Review no available"}    


def test_update_review():
    response = review.put("/review/update/", 
                           json={"event_id": 1, "user_id": 1, "user_name": "user1", "review_text": "Updated review", "review_rating": 5.0},
                           headers={"content-type": "application/json"})
    
    assert response.status_code == 200
    assert response.json() == "Review updated"    

def test_update_no_review():
    response = review.put("/review/update/", 
                           json={"event_id": 2, "user_id": 1, "user_name": "user1", "review_text": "Updated review", "review_rating": 5.0},
                           headers={"content-type": "application/json"})
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Can't update the rewiew"}   

def test_delete_review():
    response = review.delete("/review/delete/1")
    
    assert response.status_code == 200
    assert response.json() == {"message": "Review deleted"}     

def test_delete_no_review():
    response = review.delete("/review/delete/1")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Can't remove the rewiew"}    