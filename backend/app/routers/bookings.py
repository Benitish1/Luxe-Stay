from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..auth import deps

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
)

@router.post("/", response_model=schemas.BookingResponse)
def create_booking(
    booking: schemas.BookingCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    # Check if room exists and is available
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
         raise HTTPException(status_code=404, detail="Room not found")
    
    # Simple availability check (overlap logic should be more robust in prod)
    # Check if any booking for this room overlaps with requested dates
    # overlapping = db.query(models.Booking).filter(...)
    # For MVP just creating it.

    # Calculate total price
    days = (booking.end_date - booking.start_date).days
    if days <= 0:
        raise HTTPException(status_code=400, detail="Invalid dates")
    
    total_price = days * room.room_type.base_price

    db_booking = models.Booking(
        **booking.dict(), 
        user_id=current_user.id,
        total_price=total_price,
        status=models.BookingStatus.PENDING
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/my", response_model=List[schemas.BookingResponse])
def read_my_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()

@router.get("/", response_model=List[schemas.BookingResponse])
def read_all_bookings(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    return db.query(models.Booking).offset(skip).limit(limit).all()

@router.patch("/{booking_id}/status", response_model=schemas.BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: schemas.BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    # Only allow owner or admin to cancel
    if booking.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    booking.status = models.BookingStatus.CANCELLED
    db.commit()
    return {"ok": True}
