from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.models.models import CropDisease
from app.schemas.schemas import DiseaseResponse

router = APIRouter(prefix="/api/diseases", tags=["Pest & Disease"])

@router.get("", response_model=List[DiseaseResponse])
def get_diseases(
    crop_name: Optional[str] = Query(None, description="Filter by crop name"),
    disease_type: Optional[str] = Query(None, description="Fungal, Bacterial, Viral, Pest, Deficiency"),
    search: Optional[str] = Query(None, description="Search disease or pest"),
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(CropDisease)
    if crop_name and crop_name != "All":
        query = query.filter(CropDisease.crop_name.ilike(f"%{crop_name}%"))
    if disease_type and disease_type != "All":
        query = query.filter(CropDisease.disease_type.ilike(f"%{disease_type}%"))
    if search:
        query = query.filter(
            (CropDisease.name.ilike(f"%{search}%")) |
            (CropDisease.hindi_name.ilike(f"%{search}%")) |
            (CropDisease.symptoms.ilike(f"%{search}%"))
        )
    return query.order_by(CropDisease.crop_name.asc(), CropDisease.name.asc()).offset(offset).limit(limit).all()

@router.get("/crops-list")
def get_crops_with_diseases(db: Session = Depends(get_db)):
    results = db.query(CropDisease.crop_name).distinct().all()
    return [r[0] for r in results]

@router.get("/{id}", response_model=DiseaseResponse)
def get_disease_by_id(id: int, db: Session = Depends(get_db)):
    disease = db.query(CropDisease).filter(CropDisease.id == id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease or pest record not found")
    return disease
