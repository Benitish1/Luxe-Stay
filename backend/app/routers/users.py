from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..auth import deps

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

@router.get("/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, 
               current_user: models.User = Depends(deps.get_current_admin_user), 
               db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.patch("/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(
    user_id: int,
    role_update: schemas.UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user
