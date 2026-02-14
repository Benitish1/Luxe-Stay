from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    GUEST = "guest"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.GUEST)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class RoomType(Base):
    __tablename__ = "room_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g. "Single", "Double", "Suite"
    description = Column(String)
    base_price = Column(Float)
    capacity = Column(Integer)
    image_url = Column(String)

    rooms = relationship("Room", back_populates="room_type")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True)
    room_type_id = Column(Integer, ForeignKey("room_types.id"))
    is_available = Column(Boolean, default=True)
    
    room_type = relationship("RoomType", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    total_price = Column(Float)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    amount = Column(Float)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    payment_method = Column(String) # e.g. "Stripe", "Cash"
    transaction_id = Column(String, nullable=True)

    booking = relationship("Booking", back_populates="payment")

# Optional: Reviews
class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
