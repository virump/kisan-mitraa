from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ================= Auth & User =================
class UserRegister(BaseModel):
    full_name: str
    mobile_number: str
    email: Optional[EmailStr] = None
    password: str
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Pune"
    village: Optional[str] = None
    preferred_language: Optional[str] = "en"
    main_crop: Optional[str] = "Wheat"

class UserLogin(BaseModel):
    username: str # mobile number or email
    password: str

class ForgotPasswordRequest(BaseModel):
    mobile_or_email: str
    new_password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    preferred_language: Optional[str] = None
    main_crop: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    mobile_number: str
    email: Optional[str] = None
    role: str
    state: str
    district: str
    village: Optional[str] = None
    preferred_language: str
    main_crop: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

# ================= Crop & Disease =================
class CropBase(BaseModel):
    name: str
    hindi_name: Optional[str] = None
    marathi_name: Optional[str] = None
    category: str # Cereals, Pulses, Vegetables, Fruits, Cash crops
    season: str # Kharif, Rabi, Zaid, All Season
    soil_type: str
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    rainfall_min: Optional[float] = None
    rainfall_max: Optional[float] = None
    sowing_period: str
    harvest_period: str
    water_requirement: Optional[str] = "Medium"
    fertilizer_info: Optional[str] = None
    common_diseases: Optional[str] = None
    common_pests: Optional[str] = None
    farming_practices: Optional[str] = None
    image_url: Optional[str] = None

class CropCreate(CropBase):
    pass

class CropResponse(CropBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DiseaseBase(BaseModel):
    crop_id: Optional[int] = None
    crop_name: str
    name: str
    hindi_name: Optional[str] = None
    disease_type: Optional[str] = "Fungal"
    symptoms: str
    causes: Optional[str] = None
    prevention: Optional[str] = None
    treatment: str
    severity: Optional[str] = "Moderate"
    image_url: Optional[str] = None

class DiseaseCreate(DiseaseBase):
    pass

class DiseaseResponse(DiseaseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ================= Soil =================
class SoilTypeResponse(BaseModel):
    id: int
    name: str
    hindi_name: Optional[str] = None
    marathi_name: Optional[str] = None
    characteristics: str
    suitable_crops: str
    nutrient_profile: str
    ph_range: str
    fertilizer_guidance: str
    water_retention: Optional[str] = "Moderate"
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class SoilRecommendationRequest(BaseModel):
    soil_type: str
    ph_level: Optional[float] = 7.0
    crop_name: Optional[str] = None
    irrigation_type: Optional[str] = "Drip" # Drip, Sprinkler, Flood, Rainfed

class SoilRecommendationResponse(BaseModel):
    soil_type: str
    ph_evaluation: str
    crop_suitability: str
    recommended_fertilizers: List[str]
    irrigation_advice: str
    soil_health_tips: List[str]

# ================= Market =================
class MarketPriceResponse(BaseModel):
    id: int
    market_name: str
    state: str
    district: str
    crop_name: str
    variety: str
    min_price: float
    max_price: float
    modal_price: float
    price_date: str

    class Config:
        from_attributes = True

class MarketPriceCreate(BaseModel):
    market_name: str
    state: str
    district: str
    crop_name: str
    variety: Optional[str] = "Standard"
    min_price: float
    max_price: float
    modal_price: float
    price_date: str

class PriceHistoryItem(BaseModel):
    date: str
    modal_price: float
    min_price: float
    max_price: float

# ================= Weather =================
class WeatherDayForecast(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    condition: str
    rain_probability: int
    icon: str

class WeatherHourlyForecast(BaseModel):
    time: str
    temp: float
    condition: str
    rain_probability: int

class WeatherResponse(BaseModel):
    location: str
    state: str
    district: str
    temperature: float
    feels_like: float
    condition: str
    humidity: int
    wind_speed: float
    wind_direction: Optional[str] = "NE"
    rain_probability: int
    uv_index: float
    sunrise: str
    sunset: str
    forecast: List[WeatherDayForecast]
    hourly: List[WeatherHourlyForecast]
    agricultural_alert: Optional[str] = None

# ================= News =================
class NewsBase(BaseModel):
    title: str
    hindi_title: Optional[str] = None
    summary: str
    content: str
    category: str
    source: str
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None

class NewsCreate(NewsBase):
    pass

class NewsResponse(NewsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ================= Government Schemes =================
class SchemeBase(BaseModel):
    name: str
    hindi_name: Optional[str] = None
    ministry: str
    description: str
    eligibility: str
    benefits: str
    required_documents: str
    application_process: str
    official_url: str
    category: str

class SchemeCreate(SchemeBase):
    pass

class SchemeResponse(SchemeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ================= Notifications =================
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    alert_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ================= AI Assistant & Diagnosis =================
class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # en, hi, mr
    conversation_id: Optional[str] = None

class AIChatResponse(BaseModel):
    response: str
    language: str
    conversation_id: str
    suggestions: List[str] = []
    source: str = "expert_knowledge_engine" # or gemini_llm

class AIDiagnoseResponse(BaseModel):
    crop_detected: str
    disease_detected: str
    hindi_name: Optional[str] = None
    confidence_score: float
    severity: str
    symptoms: List[str]
    possible_causes: List[str]
    treatment_steps: List[str]
    prevention_measures: List[str]
    disclaimer: str = "AI results are for informational purposes only and should be verified with an agriculture extension officer or Krishi Vigyan Kendra (KVK)."

# ================= Admin Stats =================
class AdminStatsResponse(BaseModel):
    total_users: int
    total_crops: int
    total_diseases: int
    total_markets: int
    total_schemes: int
    total_news: int
    recent_registrations: List[UserResponse]
