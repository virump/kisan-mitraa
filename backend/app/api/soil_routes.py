from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.models import SoilType
from app.schemas.schemas import SoilTypeResponse, SoilRecommendationRequest, SoilRecommendationResponse
from app.services.soil_service import calculate_soil_recommendations

router = APIRouter(prefix="/api/soil", tags=["Soil Information & Recommendation"])

@router.get("", response_model=List[SoilTypeResponse])
def get_soil_types(db: Session = Depends(get_db)):
    return db.query(SoilType).all()

@router.get("/{id}", response_model=SoilTypeResponse)
def get_soil_type_by_id(id: int, db: Session = Depends(get_db)):
    soil = db.query(SoilType).filter(SoilType.id == id).first()
    if not soil:
        raise HTTPException(status_code=404, detail="Soil type not found")
    return soil

@router.post("/recommend", response_model=SoilRecommendationResponse)
def get_recommendation(payload: SoilRecommendationRequest):
    return calculate_soil_recommendations(
        soil_type=payload.soil_type,
        ph_level=payload.ph_level or 7.0,
        crop_name=payload.crop_name or "",
        irrigation_type=payload.irrigation_type or "Drip"
    )
