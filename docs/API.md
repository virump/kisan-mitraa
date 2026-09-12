# Kisan Mitra API Documentation

The Kisan Mitra API is built using **FastAPI** and adheres to RESTful standards with JWT token authentication, JSON payloads, and standard HTTP response codes.

**Base URL**: `http://localhost:8000`  
**Interactive Swagger UI**: `http://localhost:8000/docs`  
**ReDoc Documentation**: `http://localhost:8000/redoc`

---

## Authentication Endpoints

### 1. Register Farmer Account
* **URL**: `POST /api/auth/register`
* **Request Body**:
```json
{
  "full_name": "Ramesh Patil",
  "mobile_number": "9812345678",
  "email": "farmer@kisanmitra.gov.in",
  "password": "farmer123",
  "state": "Maharashtra",
  "district": "Pune",
  "village": "Shirur",
  "preferred_language": "mr",
  "main_crop": "Soybean"
}
```
* **Response (201 Created)**:
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "full_name": "Ramesh Patil",
    "mobile_number": "9812345678",
    "role": "USER",
    "district": "Pune"
  }
}
```

### 2. Login
* **URL**: `POST /api/auth/login`
* **Request Body**:
```json
{
  "username": "9812345678",
  "password": "farmer123"
}
```

### 3. Forgot Password
* **URL**: `POST /api/auth/forgot-password`
* **Request Body**:
```json
{
  "mobile_or_email": "9812345678",
  "new_password": "newpassword123"
}
```

---

## Weather Endpoints

### 1. Get Live Weather Forecast
* **URL**: `GET /api/weather`
* **Query Parameters**:
  * `district` (string, default: "Pune")
  * `lat` (float, optional)
  * `lon` (float, optional)
* **Response (200 OK)**: Returns current temperature, humidity, wind, rainfall probability, agricultural spray advisory, 7-day outlook, and hourly trend.

### 2. Supported Districts List
* **URL**: `GET /api/weather/districts`

---

## Crop Catalog Endpoints

### 1. List Crops
* **URL**: `GET /api/crops`
* **Query Parameters**:
  * `category`: `Cereals` | `Pulses` | `Vegetables` | `Fruits` | `Cash crops`
  * `season`: `Kharif` | `Rabi` | `Zaid` | `All Season`
  * `search`: Crop name search string

### 2. Get Crop by ID
* **URL**: `GET /api/crops/{id}`

---

## Pest & Disease Endpoints

### 1. List Diseases & Pests
* **URL**: `GET /api/diseases`
* **Query Parameters**:
  * `crop_name`: Filter by crop
  * `disease_type`: `Fungal` | `Bacterial` | `Viral` | `Pest` | `Deficiency`
  * `search`: Symptom or disease name

### 2. Get Disease Details
* **URL**: `GET /api/diseases/{id}`

---

## Mandi & Market Prices Endpoints

### 1. Get Mandi Prices
* **URL**: `GET /api/market-prices`
* **Query Parameters**:
  * `state`, `district`, `crop`, `sort_by` (`date_desc`, `price_asc`, `price_desc`)

### 2. Historical Price Trend
* **URL**: `GET /api/market-prices/history`
* **Query Parameters**: `crop` (e.g. "Wheat")

---

## Soil Recommendation Endpoints

### 1. Soil Types
* **URL**: `GET /api/soil`

### 2. Calculate Agronomic Recommendations
* **URL**: `POST /api/soil/recommend`
* **Request Body**:
```json
{
  "soil_type": "Black Soil (Regur)",
  "ph_level": 7.4,
  "crop_name": "Cotton",
  "irrigation_type": "Drip"
}
```

---

## AI Farmer Assistant Endpoints

### 1. Multilingual Chat
* **URL**: `POST /api/ai/chat`
* **Request Body**:
```json
{
  "message": "Which crop is suitable for black soil?",
  "language": "en",
  "conversation_id": null
}
```

### 2. AI Crop Image Diagnosis
* **URL**: `POST /api/ai/diagnose`
* **Form-Data**:
  * `file`: Image file (JPG/PNG)
  * `crop_name`: (optional hint)

---

## Admin Endpoints (Protected - Admin Role)

* `GET /api/admin/stats` - Platform statistics
* `GET /api/admin/users` - User management list
* `PUT /api/admin/users/{id}/toggle-active` - Toggle user status
* `POST /api/admin/crops` - Add crop
* `PUT /api/admin/crops/{id}` - Update crop
* `DELETE /api/admin/crops/{id}` - Delete crop
* `POST /api/admin/diseases` - Add disease record
* `POST /api/admin/news` - Publish bulletin
* `POST /api/admin/schemes` - Add government scheme
