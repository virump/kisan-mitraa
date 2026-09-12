from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from app.database.connection import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(150), nullable=False)
    mobile_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.USER.value, nullable=False)
    state = Column(String(100), default="Maharashtra")
    district = Column(String(100), default="Pune")
    village = Column(String(150), nullable=True)
    preferred_language = Column(String(20), default="en") # en, hi, mr
    main_crop = Column(String(100), default="Wheat")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    hindi_name = Column(String(100), nullable=True)
    marathi_name = Column(String(100), nullable=True)
    category = Column(String(50), nullable=False, index=True) # Cereals, Pulses, Vegetables, Fruits, Cash crops
    season = Column(String(50), nullable=False) # Kharif, Rabi, Zaid, All Season
    soil_type = Column(String(150), nullable=False)
    temp_min = Column(Float, nullable=True)
    temp_max = Column(Float, nullable=True)
    rainfall_min = Column(Float, nullable=True) # in mm
    rainfall_max = Column(Float, nullable=True)
    sowing_period = Column(String(100), nullable=False)
    harvest_period = Column(String(100), nullable=False)
    water_requirement = Column(String(100), default="Medium")
    fertilizer_info = Column(Text, nullable=True)
    common_diseases = Column(Text, nullable=True)
    common_pests = Column(Text, nullable=True)
    farming_practices = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    diseases = relationship("CropDisease", back_populates="crop", cascade="all, delete-orphan")

class CropDisease(Base):
    __tablename__ = "crop_diseases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=True, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    hindi_name = Column(String(150), nullable=True)
    disease_type = Column(String(50), default="Fungal") # Fungal, Bacterial, Viral, Pest, Deficiency
    symptoms = Column(Text, nullable=False)
    causes = Column(Text, nullable=True)
    prevention = Column(Text, nullable=True)
    treatment = Column(Text, nullable=False)
    severity = Column(String(50), default="Moderate") # Low, Moderate, High
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    crop = relationship("Crop", back_populates="diseases")

class SoilType(Base):
    __tablename__ = "soil_types"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    hindi_name = Column(String(100), nullable=True)
    marathi_name = Column(String(100), nullable=True)
    characteristics = Column(Text, nullable=False)
    suitable_crops = Column(Text, nullable=False)
    nutrient_profile = Column(Text, nullable=False)
    ph_range = Column(String(50), nullable=False)
    fertilizer_guidance = Column(Text, nullable=False)
    water_retention = Column(String(50), default="Moderate")
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    market_name = Column(String(150), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    prices = relationship("MarketPrice", back_populates="market", cascade="all, delete-orphan")

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    market_id = Column(Integer, ForeignKey("markets.id"), nullable=True, index=True)
    market_name = Column(String(150), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    variety = Column(String(100), default="Standard")
    min_price = Column(Float, nullable=False) # In Rs. per Quintal
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    price_date = Column(String(20), nullable=False, index=True) # YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)

    market = relationship("Market", back_populates="prices")

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location_key = Column(String(150), nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    condition = Column(String(100), nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    rain_probability = Column(Float, nullable=False)
    forecast_json = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    hindi_title = Column(String(255), nullable=True)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="General", index=True) # Government, Weather, Crop Alert, Market, Technology
    source = Column(String(100), default="Krishi Bhavan")
    source_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    hindi_name = Column(String(255), nullable=True)
    ministry = Column(String(200), default="Ministry of Agriculture & Farmers Welfare")
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    required_documents = Column(Text, nullable=False)
    application_process = Column(Text, nullable=False)
    official_url = Column(String(500), nullable=False)
    category = Column(String(100), default="Financial Assistance")
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String(50), default="info") # weather, market, crop, scheme, warning
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    conversation_id = Column(String(100), nullable=False, index=True)
    role = Column(String(20), nullable=False) # user or assistant
    message = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
