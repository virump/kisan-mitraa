from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.database.connection import get_db
from app.models.models import MarketPrice
from app.schemas.schemas import MarketPriceResponse
from app.services.market_service import get_market_prices, get_price_history

router = APIRouter(prefix="/api/market-prices", tags=["Mandi & Market Prices"])

@router.get("", response_model=List[MarketPriceResponse])
def fetch_prices(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("date_desc"),
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return get_market_prices(
        db=db,
        state=state,
        district=district,
        crop=crop,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )

@router.get("/history")
def fetch_history(
    crop: str = Query("Wheat"),
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    history = get_price_history(db=db, crop_name=crop, district=district)
    return {"crop": crop, "district": district, "history": history}

@router.get("/filters")
def fetch_filter_options(db: Session = Depends(get_db)) -> Dict[str, List[str]]:
    states = [s[0] for s in db.query(MarketPrice.state).distinct().all() if s[0]]
    districts = [d[0] for d in db.query(MarketPrice.district).distinct().all() if d[0]]
    crops = [c[0] for c in db.query(MarketPrice.crop_name).distinct().all() if c[0]]

    return {
        "states": sorted(list(set(states))),
        "districts": sorted(list(set(districts))),
        "crops": sorted(list(set(crops)))
    }
