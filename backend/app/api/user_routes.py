from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.database.connection import get_db
from app.models.models import User, Notification
from app.schemas.schemas import UserResponse, UserProfileUpdate, NotificationResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/user", tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.email is not None:
        # Check uniqueness if changed
        if payload.email != current_user.email:
            existing = db.query(User).filter(User.email == payload.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already taken.")
        current_user.email = payload.email
    if payload.state is not None:
        current_user.state = payload.state
    if payload.district is not None:
        current_user.district = payload.district
    if payload.village is not None:
        current_user.village = payload.village
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language
    if payload.main_crop is not None:
        current_user.main_crop = payload.main_crop

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = db.query(Notification).filter(
        (Notification.user_id == current_user.id) | (Notification.user_id == None)
    ).order_by(desc(Notification.created_at)).limit(20).all()
    return notifs

@router.put("/notifications/{id}/read")
def mark_notification_read(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(
        Notification.id == id,
        (Notification.user_id == current_user.id) | (Notification.user_id == None)
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}

@router.put("/notifications/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(
        (Notification.user_id == current_user.id) | (Notification.user_id == None)
    ).update({"is_read": True}, synchronize_session=False)
    db.commit()
    return {"status": "all marked as read"}
