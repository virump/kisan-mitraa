import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database.connection import engine, Base, SessionLocal
from app.database.seed_data import seed_database
import app.models.models # Ensure all models are registered

# Import routers
from app.api.auth_routes import router as auth_router
from app.api.user_routes import router as user_router
from app.api.weather_routes import router as weather_router
from app.api.crop_routes import router as crop_router
from app.api.disease_routes import router as disease_router
from app.api.market_routes import router as market_router
from app.api.soil_routes import router as soil_router
from app.api.news_routes import router as news_router
from app.api.scheme_routes import router as scheme_router
from app.api.ai_routes import router as ai_router
from app.api.admin_routes import router as admin_router

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kisan-mitra")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables & seed data
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")
        
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error during DB startup initialization: {e}")
    yield
    # Shutdown
    logger.info("Shutting down Kisan Mitra API server.")

app = FastAPI(
    title="Kisan Mitra API",
    description="Smart Agricultural Platform Backend providing Weather, Mandi Prices, Crop Diagnosis, Soil Health, Welfare Schemes, and AI Farmer Assistant.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
origins = [o.strip() for o in origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(weather_router)
app.include_router(crop_router)
app.include_router(disease_router)
app.include_router(market_router)
app.include_router(soil_router)
app.include_router(news_router)
app.include_router(scheme_router)
app.include_router(ai_router)
app.include_router(admin_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": "Kisan Mitra - Smart Farmer Support Platform",
        "version": "1.0.0",
        "demo_mode": os.getenv("DEMO_MODE", "True").lower() == "true"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Kisan Mitra API Service.",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }
