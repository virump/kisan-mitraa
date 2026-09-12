from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.models.models import GovernmentScheme
from app.schemas.schemas import SchemeResponse

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(GovernmentScheme)
    if category and category != "All":
        query = query.filter(GovernmentScheme.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (GovernmentScheme.name.ilike(f"%{search}%")) |
            (GovernmentScheme.hindi_name.ilike(f"%{search}%")) |
            (GovernmentScheme.description.ilike(f"%{search}%"))
        )
    return query.order_by(GovernmentScheme.id.asc()).offset(offset).limit(limit).all()

@router.get("/{id}", response_model=SchemeResponse)
def get_scheme_by_id(id: int, db: Session = Depends(get_db)):
    scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
