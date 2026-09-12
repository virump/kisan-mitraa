from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.models.models import Crop
from app.schemas.schemas import CropResponse

router = APIRouter(prefix="/api/crops", tags=["Crop Information"])

@router.get("", response_model=List[CropResponse])
def get_crops(
    category: Optional[str] = Query(None, description="Category filter (Cereals, Pulses, Vegetables, Fruits, Cash crops)"),
    season: Optional[str] = Query(None, description="Season filter (Kharif, Rabi, Zaid, All Season)"),
    search: Optional[str] = Query(None, description="Search term for crop name"),
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Crop)
    if category and category != "All":
        query = query.filter(Crop.category.ilike(f"%{category}%"))
    if season and season != "All":
        query = query.filter(Crop.season.ilike(f"%{season}%"))
    if search:
        query = query.filter(
            (Crop.name.ilike(f"%{search}%")) |
            (Crop.hindi_name.ilike(f"%{search}%")) |
            (Crop.marathi_name.ilike(f"%{search}%"))
        )
    return query.order_by(Crop.name.asc()).offset(offset).limit(limit).all()

@router.get("/categories")
def get_categories():
    return ["Cereals", "Pulses", "Vegetables", "Fruits", "Cash crops"]

@router.get("/seasons")
def get_seasons():
    return ["Kharif", "Rabi", "Zaid", "All Season"]

@router.get("/{id}", response_model=CropResponse)
def get_crop_by_id(id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop
