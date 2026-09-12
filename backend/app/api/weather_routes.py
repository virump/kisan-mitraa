from fastapi import APIRouter, Query
from typing import Optional, List, Dict
from app.services.weather_service import fetch_weather_forecast, DISTRICT_COORDINATES
from app.schemas.schemas import WeatherResponse

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("", response_model=WeatherResponse)
@router.get("/forecast", response_model=WeatherResponse)
def get_weather(
    district: Optional[str] = Query("Pune", description="District name"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    weather_data = fetch_weather_forecast(district=district, lat=lat, lon=lon)
    return weather_data

@router.get("/districts")
def list_districts() -> List[Dict[str, str]]:
    return [{"district": k, "state": v["state"]} for k, v in DISTRICT_COORDINATES.items()]
