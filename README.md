# Kisan Mitra (किसान मित्र) - Smart Farmer Support Platform

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-green)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-blue)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20SQLAlchemy%20%7C%20SQLite-orange)](https://www.mysql.com/)
[![AI-Powered](https://img.shields.io/badge/AI-Kisan%20Multilingual%20Bot-emerald)](https://deepmind.google/)

---

## 1. Project Introduction

**Kisan Mitra (किसान मित्र)** is a modern, responsive, full-stack digital agriculture platform inspired by the mission of farmer-support platforms such as Kisan Suvidha, built with completely original branding, layout, UI/UX, and clean modular code. 

Designed as a premier college engineering and agronomy project, Kisan Mitra empowers Indian farmers with:
* Hyper-local real-time weather forecasts & farm spray advisories
* Comprehensive searchable crop cultivation encyclopedia (Cereals, Pulses, Vegetables, Fruits, Cash crops)
* AI-assisted Crop Disease Image Diagnosis & IPM pathology catalog
* Live APMC Mandi commodity prices with interactive 15-day price history graphs
* Soil chemistry evaluation & personalized agronomy calculator
* Multilingual **Kisan AI Assistant** chatbot (supporting English, हिन्दी, and मराठी)
* Verified Central and State Government welfare schemes with direct official portal links
* Dedicated Administrator Control Panel with full CRUD operations.

---

## 2. Key Modules & Features

### 🌾 Personalized Farmer Dashboard (`/dashboard`)
* Hyper-local weather card (temperature, humidity, wind, rainfall probability)
* Today's APMC mandi market price ticker
* Crop advisories & active heavy rain/pest warnings
* Quick tool shortcuts & recent agricultural news bulletins

### ⛅ Weather Intelligence & Agromet Advisory (`/weather`)
* Live temperature, weather condition, humidity, wind speed, UV index
* 7-day day-by-day forecast cards
* Hourly forecast timeline (next 16 hours)
* District selection lookup across major Indian states + GPS Geolocation detection
* Field operation & chemical spray guidance

### 📖 Crop Knowledge Base (`/crops`, `/crops/:id`)
* Categorized catalog across 5 major sectors: **Cereals, Pulses, Vegetables, Fruits, Cash crops**
* Detailed protocols for Sowing period, Harvest period, Ideal temperature range, Water requirements, NPK fertilizer dosing, Common diseases/pests, and Best farming practices

### 🛡️ Pest & Disease Pathology + AI Image Diagnosis (`/diseases`)
* Crop-wise pest and disease database with symptoms, causes, prevention, and treatment
* **AI Image Diagnosis**: Upload a plant photo (leaf, stem, fruit) to receive immediate symptom matching, severity rating, and recommended treatments
* Prominently displayed farmer advisory disclaimer

### 📈 APMC Mandi / Market Prices (`/market-prices`)
* Filter by State, District, and Crop
* Sort by Min Price, Max Price, Modal Price, and Date
* Interactive 15-day price trend history chart using **Recharts**

### 🧪 Soil Health & Fertilizer Calculator (`/soil`)
* Encyclopedia of major Indian soil types (Black/Regur, Alluvial, Red & Yellow, Laterite, Sandy)
* Interactive Agronomy Calculator: Enter Soil Type, pH level, Crop, and Irrigation method to receive customized soil amendments, fertilizer dosing, and irrigation advice

### 🏛️ Government Schemes & Direct Subsidies (`/schemes`)
* Authentic schemes (PM-KISAN, PMFBY, Soil Health Card, Kisan Credit Card, PMKSY, e-NAM)
* Detailed eligibility, financial benefits, required documents, application process, and official website links

### 🤖 Kisan AI Farmer Assistant (`/ai-assistant`)
* Multilingual chatbot supporting **English, हिन्दी (Hindi), and मराठी (Marathi)**
* Voice input support (Web Speech Recognition)
* Interactive quick prompt presets for common farming inquiries
* Offline agricultural expert knowledge engine + optional Gemini LLM integration

### 🔐 Farmer Authentication & Profile (`/login`, `/register`, `/profile`)
* Secure user registration with State, District, Village, Preferred Language, and Primary Crop
* Bcrypt password hashing & JWT token authentication with protected routes

### ⚙️ Admin Control Panel (`/admin`)
* Administrative dashboard with platform statistics and user activity
* Full CRUD management for Crops, Diseases, News Bulletins, Schemes, and Users

---

## 3. Technology Stack

### Frontend
* **React.js 18+ (Vite)**
* **Tailwind CSS** (Custom agricultural theme palette & design tokens)
* **React Router v6**
* **Axios** (With JWT interceptors)
* **Lucide React** (Modern agricultural iconography)
* **Recharts** (Interactive historical price graphs)
* Mobile App experience with bottom navigation bar

### Backend
* **Python 3.12**
* **FastAPI**
* **SQLAlchemy 2.0 ORM**
* **Pydantic v2**
* **JWT (Python-Jose & Passlib/Bcrypt)**
* **Open-Meteo REST API & PyMySQL**
* **Pytest & HTTPX**

### Database
* **MySQL 8.0** / **MariaDB**
* Automatic zero-config **SQLite** fallback for instantaneous local running

---

## 4. System Requirements

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Python**: 3.10, 3.11, or 3.12
* **MySQL** (Optional; SQLite auto-fallback enabled by default)

---

## 5. Local Installation & Running Guide

### Quick Start (2 Simple Commands)

#### Step 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*(The backend automatically creates tables and seeds the database with authentic crop, disease, scheme, and mandi records on startup).*

#### Step 2: Start Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 6. Demo Login Credentials

| Role | Username / Mobile / Email | Password |
| :--- | :--- | :--- |
| **Demo Farmer** | `9812345678` / `farmer@kisanmitra.gov.in` | `farmer123` |
| **Administrator** | `admin@kisanmitra.gov.in` / `9876543210` | `admin123` |

*(You can also use the one-click "Quick Demo Logins" buttons on the `/login` page).*

---

## 7. Project Structure

```
kisan-mitra/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, BottomNav, Skeleton, Modals
│   │   ├── pages/            # Landing, Dashboard, Weather, Crops, Diseases, etc.
│   │   │   └── admin/        # Admin dashboard and CRUD pages
│   │   ├── context/          # AuthContext, LanguageContext, NotificationContext
│   │   ├── services/         # Axios API client
│   │   ├── App.jsx           # Route registry
│   │   ├── main.jsx          # Root DOM renderer
│   │   └── index.css         # Tailwind & theme styles
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── api/              # REST route controllers
│   │   ├── auth/             # JWT tokens & Bcrypt security
│   │   ├── database/         # SQLAlchemy engine & seeding scripts
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Weather, AI chatbot, Soil, and Market services
│   │   └── main.py           # FastAPI application entry point
│   ├── tests/                # Automated pytest suite
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   ├── schema.sql            # MySQL schema DDL script
│   └── seed.sql              # Initial SQL seed data
│
├── docs/
│   ├── API.md                # Complete REST API reference
│   ├── DATABASE.md           # ER diagram and table dictionary
│   └── SETUP.md              # Installation walkthrough
│
├── README.md
└── docker-compose.yml
```

---

## 8. Running Automated Tests

Run the backend test suite:
```bash
cd backend
pytest -v
```

---

## 9. Troubleshooting & FAQ

* **Issue: MySQL is not installed on my computer.**
  * *Solution*: Kisan Mitra includes an automatic SQLite fallback. If MySQL is unreachable, it seamlessly creates `kisan_mitra.db` locally so all features, login, and CRUD work without MySQL setup.
* **Issue: AI API key is not configured.**
  * *Solution*: The application includes a built-in multilingual agricultural knowledge engine with keyword and rule-based diagnostic systems. You can optionally add `GEMINI_API_KEY=your_key` in `backend/.env`.

---

## 10. License

Built for educational and agricultural development. Open-source under the MIT License.
