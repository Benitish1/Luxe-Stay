from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..auth import deps

router = APIRouter(
    prefix="/rooms",
    tags=["rooms"],
)

# --- Room Types ---

@router.post("/types", response_model=schemas.RoomTypeResponse)
def create_room_type(
    room_type: schemas.RoomTypeCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    db_room_type = models.RoomType(**room_type.dict())
    db.add(db_room_type)
    db.commit()
    db.refresh(db_room_type)
    return db_room_type

@router.get("/types", response_model=List[schemas.RoomTypeResponse])
def read_room_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.RoomType).offset(skip).limit(limit).all()

# --- Rooms ---

@router.post("/", response_model=schemas.RoomResponse)
def create_room(
    room: schemas.RoomCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    db_room = models.Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/", response_model=List[schemas.RoomResponse])
def read_rooms(
    skip: int = 0, 
    limit: int = 100, 
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Room)
    if available_only:
        query = query.filter(models.Room.is_available == True)
    return query.offset(skip).limit(limit).all()

@router.get("/{room_id}", response_model=schemas.RoomResponse)
def read_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return db_room

@router.delete("/{room_id}")
def delete_room(
    room_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(db_room)
    db.commit()
    return {"ok": True}
