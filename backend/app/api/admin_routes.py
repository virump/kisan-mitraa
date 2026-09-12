from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any

from app.database.connection import get_db
from app.models.models import User, Crop, CropDisease, MarketPrice, News, GovernmentScheme, Market, UserRole
from app.schemas.schemas import (
    AdminStatsResponse, UserResponse,
    CropCreate, CropResponse,
    DiseaseCreate, DiseaseResponse,
    NewsCreate, NewsResponse,
    SchemeCreate, SchemeResponse,
    MarketPriceCreate, MarketPriceResponse
)
from app.auth.jwt import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_crops = db.query(Crop).count()
    total_diseases = db.query(CropDisease).count()
    total_markets = db.query(MarketPrice).count()
    total_schemes = db.query(GovernmentScheme).count()
    total_news = db.query(News).count()
    recent_users = db.query(User).order_by(desc(User.created_at)).limit(5).all()

    return {
        "total_users": total_users,
        "total_crops": total_crops,
        "total_diseases": total_diseases,
        "total_markets": total_markets,
        "total_schemes": total_schemes,
        "total_news": total_news,
        "recent_registrations": recent_users
    }

# ================= User Management =================
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(desc(User.created_at)).all()

@router.put("/users/{id}/toggle-active")
def toggle_user_active(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status changed to {'active' if user.is_active else 'inactive'}"}

@router.delete("/users/{id}")
def delete_user(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# ================= Crops Management =================
@router.post("/crops", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
def create_crop(
    payload: CropCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    crop = Crop(**payload.dict())
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop

@router.put("/crops/{id}", response_model=CropResponse)
def update_crop(
    id: int,
    payload: CropCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    for key, value in payload.dict().items():
        setattr(crop, key, value)
    db.commit()
    db.refresh(crop)
    return crop

@router.delete("/crops/{id}")
def delete_crop(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    db.delete(crop)
    db.commit()
    return {"message": "Crop deleted successfully"}

# ================= Disease Management =================
@router.post("/diseases", response_model=DiseaseResponse, status_code=status.HTTP_201_CREATED)
def create_disease(
    payload: DiseaseCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    disease = CropDisease(**payload.dict())
    db.add(disease)
    db.commit()
    db.refresh(disease)
    return disease

@router.put("/diseases/{id}", response_model=DiseaseResponse)
def update_disease(
    id: int,
    payload: DiseaseCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    disease = db.query(CropDisease).filter(CropDisease.id == id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    for key, value in payload.dict().items():
        setattr(disease, key, value)
    db.commit()
    db.refresh(disease)
    return disease

@router.delete("/diseases/{id}")
def delete_disease(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    disease = db.query(CropDisease).filter(CropDisease.id == id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    db.delete(disease)
    db.commit()
    return {"message": "Disease record deleted successfully"}

# ================= News Management =================
@router.post("/news", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(
    payload: NewsCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    news = News(**payload.dict())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news

@router.put("/news/{id}", response_model=NewsResponse)
def update_news(
    id: int,
    payload: NewsCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    news = db.query(News).filter(News.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    for key, value in payload.dict().items():
        setattr(news, key, value)
    db.commit()
    db.refresh(news)
    return news

@router.delete("/news/{id}")
def delete_news(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    news = db.query(News).filter(News.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    db.delete(news)
    db.commit()
    return {"message": "News article deleted"}

# ================= Scheme Management =================
@router.post("/schemes", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
def create_scheme(
    payload: SchemeCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    scheme = GovernmentScheme(**payload.dict())
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme

@router.put("/schemes/{id}", response_model=SchemeResponse)
def update_scheme(
    id: int,
    payload: SchemeCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    for key, value in payload.dict().items():
        setattr(scheme, key, value)
    db.commit()
    db.refresh(scheme)
    return scheme

@router.delete("/schemes/{id}")
def delete_scheme(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    db.delete(scheme)
    db.commit()
    return {"message": "Scheme deleted"}

# ================= Market Price Management =================
@router.post("/market-prices", response_model=MarketPriceResponse, status_code=status.HTTP_201_CREATED)
def create_market_price(
    payload: MarketPriceCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    mp = MarketPrice(**payload.dict())
    db.add(mp)
    db.commit()
    db.refresh(mp)
    return mp

@router.delete("/market-prices/{id}")
def delete_market_price(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    mp = db.query(MarketPrice).filter(MarketPrice.id == id).first()
    if not mp:
        raise HTTPException(status_code=404, detail="Market price record not found")
    db.delete(mp)
    db.commit()
    return {"message": "Market price record deleted"}
