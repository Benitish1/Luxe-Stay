from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from ..models.models import UserRole, BookingStatus

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.GUEST

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Room Type Schemas ---
class RoomTypeBase(BaseModel):
    name: str
    description: str | None = None
    base_price: float
    capacity: int
    image_url: str | None = None

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomTypeResponse(RoomTypeBase):
    id: int
    class Config:
        from_attributes = True

# --- Room Schemas ---
class RoomBase(BaseModel):
    room_number: str
    room_type_id: int
    is_available: bool = True

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int
    room_type: RoomTypeResponse
    class Config:
        from_attributes = True

# --- Booking Schemas ---
class BookingBase(BaseModel):
    room_id: int
    start_date: datetime
    end_date: datetime

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    total_price: float
    status: BookingStatus
    created_at: datetime
    room: RoomResponse # detailed room info
    class Config:
        from_attributes = True

# --- Token Schema ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    role: UserRole | None = None

# --- Update Schemas ---
class BookingStatusUpdate(BaseModel):
    status: BookingStatus

class UserRoleUpdate(BaseModel):
    role: UserRole
