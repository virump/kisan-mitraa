import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import engine, Base, SessionLocal
from app.database.seed_data import seed_database

# Initialize tables and seed data for tests
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Kisan Mitra" in data["app"]

def test_auth_and_profile_flow():
    # 1. Login with demo farmer
    login_res = client.post("/api/auth/login", json={
        "username": "9812345678",
        "password": "farmer123"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 2. Get Profile using Token
    headers = {"Authorization": f"Bearer {token}"}
    profile_res = client.get("/api/user/profile", headers=headers)
    assert profile_res.status_code == 200
    profile = profile_res.json()
    assert profile["mobile_number"] == "9812345678"
    assert profile["full_name"] == "Ramesh Patil"

def test_crops_api():
    # Get all crops
    res = client.get("/api/crops")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) > 0
    assert any("Wheat" in c["name"] for c in crops)

    # Filter crops by category
    res_filtered = client.get("/api/crops?category=Cereals")
    assert res_filtered.status_code == 200
    cereals = res_filtered.json()
    assert all(c["category"] == "Cereals" for c in cereals)

def test_weather_api():
    res = client.get("/api/weather?district=Pune")
    assert res.status_code == 200
    weather = res.json()
    assert "Pune" in weather["location"]
    assert "temperature" in weather
    assert "forecast" in weather
    assert len(weather["forecast"]) >= 5

def test_market_prices_api():
    res = client.get("/api/market-prices")
    assert res.status_code == 200
    prices = res.json()
    assert len(prices) > 0

    # Test history endpoint
    res_hist = client.get("/api/market-prices/history?crop=Wheat")
    assert res_hist.status_code == 200
    hist = res_hist.json()
    assert "history" in hist
    assert len(hist["history"]) > 0

def test_soil_recommendation():
    payload = {
        "soil_type": "Black Soil (Regur)",
        "ph_level": 7.4,
        "crop_name": "Cotton",
        "irrigation_type": "Drip"
    }
    res = client.post("/api/soil/recommend", json=payload)
    assert res.status_code == 200
    rec = res.json()
    assert "ph_evaluation" in rec
    assert "recommended_fertilizers" in rec
    assert len(rec["recommended_fertilizers"]) > 0

def test_ai_farmer_assistant():
    payload = {
        "message": "Which crop is suitable for black soil?",
        "language": "en"
    }
    res = client.post("/api/ai/chat", json=payload)
    assert res.status_code == 200
    ai_data = res.json()
    assert "response" in ai_data
    assert "Cotton" in ai_data["response"] or "Soybean" in ai_data["response"]

def test_admin_access_control():
    # Login as admin
    admin_login = client.post("/api/auth/login", json={
        "username": "admin@kisanmitra.gov.in",
        "password": "admin123"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Fetch admin stats
    stats_res = client.get("/api/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_crops"] >= 1
    assert stats["total_users"] >= 1
