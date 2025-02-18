from fastapi import FastAPI
from request import router as auth_router

app = FastAPI()

origins = [
    "http://localhost:3000",  
]

app.include_router(auth_router)

