# Kisan Mitra Setup & Installation Guide

This guide walks you through setting up and running the **Kisan Mitra** Smart Farmer Platform locally.

---

## Prerequisites
* **Python**: 3.10 or higher (Python 3.12 recommended)
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MySQL** (Optional, automatic SQLite fallback is enabled by default)

---

## 1. Backend Setup

1. Open a terminal in the `backend/` directory:
```bash
cd backend
```

2. (Optional but recommended) Create and activate a Python virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install required Python packages:
```bash
pip install -r requirements.txt
```

4. Configure Environment Variables:
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, `.env` is pre-configured with SQLite fallback and Demo mode, so it works out of the box without any external API keys or MySQL configuration).*

5. Start the FastAPI Backend Server:
```bash
uvicorn app.main:app --reload --port 8000
```
The API server will start on `http://localhost:8000`. Database tables and initial seed data are auto-created on initial boot.

---

## 2. Frontend Setup

1. Open a second terminal in the `frontend/` directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start Vite Development Server:
```bash
npm run dev
```

4. Access the application in your browser:
```
http://localhost:5173
```

---

## 3. Demo Login Credentials

| Role | Username / Mobile / Email | Password |
| :--- | :--- | :--- |
| **Demo Farmer** | `9812345678` / `farmer@kisanmitra.gov.in` | `farmer123` |
| **Administrator** | `admin@kisanmitra.gov.in` / `9876543210` | `admin123` |

You can also click the **"Quick Demo Logins"** buttons on the `/login` page to auto-fill credentials.

---

## 4. Running Backend Tests

Run the test suite with `pytest`:
```bash
cd backend
pytest -v
```

---

## 5. Docker Deployment (Optional)

You can launch both the frontend, backend, and MySQL database using Docker Compose:
```bash
docker-compose up --build
```
