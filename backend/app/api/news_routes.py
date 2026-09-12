from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.database.connection import get_db
from app.models.models import News
from app.schemas.schemas import NewsResponse

router = APIRouter(prefix="/api/news", tags=["Agriculture News"])

@router.get("", response_model=List[NewsResponse])
def get_news(
    category: Optional[str] = Query(None, description="Government, Weather, Crop Alert, Market, Technology"),
    search: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(News)
    if category and category != "All":
        query = query.filter(News.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (News.title.ilike(f"%{search}%")) |
            (News.summary.ilike(f"%{search}%")) |
            (News.hindi_title.ilike(f"%{search}%"))
        )
    return query.order_by(desc(News.published_at)).offset(offset).limit(limit).all()

@router.get("/categories")
def get_news_categories():
    return ["Government", "Weather", "Crop Alert", "Market", "Technology"]

@router.get("/{id}", response_model=NewsResponse)
def get_news_article(id: int, db: Session = Depends(get_db)):
    article = db.query(News).filter(News.id == id).first()
    if not article:
        raise HTTPException(status_code=404, detail="News article not found")
    return article
