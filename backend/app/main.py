from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Hotel Management System API",
    description="API for managing hotel bookings, rooms, and staff.",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import auth, users, rooms, bookings
from .database import engine, Base

# Create tables (dev only, usealembic for prod)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rooms.router)
app.include_router(bookings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Hotel Management System API", "docs": "/docs"}
