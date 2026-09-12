from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database.connection import get_db
from app.models.models import User, UserRole, Notification
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse, ForgotPasswordRequest
from app.auth.security import get_password_hash, verify_password
from app.auth.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    # Check if mobile already exists
    existing_mobile = db.query(User).filter(User.mobile_number == payload.mobile_number).first()
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered. Please login instead."
        )

    # Check if email provided and exists
    if payload.email:
        existing_email = db.query(User).filter(User.email == payload.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already registered."
            )

    # Check if first user -> can be admin, or check if admin email
    role = UserRole.USER.value
    if payload.email and "admin" in payload.email.lower():
        role = UserRole.ADMIN.value

    new_user = User(
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=role,
        state=payload.state or "Maharashtra",
        district=payload.district or "Pune",
        village=payload.village,
        preferred_language=payload.preferred_language or "en",
        main_crop=payload.main_crop or "Wheat"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create welcome notification
    welcome_notif = Notification(
        user_id=new_user.id,
        title="Welcome to Kisan Mitra!",
        message=f"Namaste {new_user.full_name}! Your farmer dashboard is ready with customized weather, market prices, and crop alerts for {new_user.district}.",
        alert_type="info"
    )
    db.add(welcome_notif)
    db.commit()

    access_token = create_access_token(
        data={"sub": new_user.mobile_number, "role": new_user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.mobile_number == payload.username) | (User.email == payload.username)
    ).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect mobile number/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated. Please contact support.")

    access_token = create_access_token(
        data={"sub": user.mobile_number, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.mobile_number == payload.mobile_or_email) | (User.email == payload.mobile_or_email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with the provided mobile number or email."
        )

    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    return {"message": "Password updated successfully. You can now login with your new password."}
