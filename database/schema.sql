-- ==========================================================
-- Database Schema for Kisan Mitra (Smart Farmer Support Platform)
-- Database Engine: MySQL / MariaDB (Compatible with SQLite / PostgreSQL)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS kisan_mitra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kisan_mitra;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    district VARCHAR(100) DEFAULT 'Pune',
    village VARCHAR(150) NULL,
    preferred_language VARCHAR(20) DEFAULT 'en',
    main_crop VARCHAR(100) DEFAULT 'Wheat',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_mobile (mobile_number),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NULL,
    marathi_name VARCHAR(100) NULL,
    category VARCHAR(50) NOT NULL, -- Cereals, Pulses, Vegetables, Fruits, Cash crops
    season VARCHAR(50) NOT NULL, -- Kharif, Rabi, Zaid, All Season
    soil_type VARCHAR(150) NOT NULL,
    temp_min FLOAT NULL,
    temp_max FLOAT NULL,
    rainfall_min FLOAT NULL,
    rainfall_max FLOAT NULL,
    sowing_period VARCHAR(100) NOT NULL,
    harvest_period VARCHAR(100) NOT NULL,
    water_requirement VARCHAR(100) DEFAULT 'Medium',
    fertilizer_info TEXT NULL,
    common_diseases TEXT NULL,
    common_pests TEXT NULL,
    farming_practices TEXT NULL,
    image_url VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_crop_name (name),
    INDEX idx_crop_category (category),
    INDEX idx_crop_season (season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Crop Diseases and Pests
CREATE TABLE IF NOT EXISTS crop_diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NULL,
    crop_name VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150) NULL,
    disease_type VARCHAR(50) DEFAULT 'Fungal',
    symptoms TEXT NOT NULL,
    causes TEXT NULL,
    prevention TEXT NULL,
    treatment TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Moderate',
    image_url VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL,
    INDEX idx_disease_crop (crop_name),
    INDEX idx_disease_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Soil Types Table
CREATE TABLE IF NOT EXISTS soil_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    hindi_name VARCHAR(100) NULL,
    marathi_name VARCHAR(100) NULL,
    characteristics TEXT NOT NULL,
    suitable_crops TEXT NOT NULL,
    nutrient_profile TEXT NOT NULL,
    ph_range VARCHAR(50) NOT NULL,
    fertilizer_guidance TEXT NOT NULL,
    water_retention VARCHAR(50) DEFAULT 'Moderate',
    image_url VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Markets Table
CREATE TABLE IF NOT EXISTS markets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    market_name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_market_state_dist (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Market / Mandi Prices Table
CREATE TABLE IF NOT EXISTS market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    market_id INT NULL,
    market_name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) DEFAULT 'Standard',
    min_price FLOAT NOT NULL,
    max_price FLOAT NOT NULL,
    modal_price FLOAT NOT NULL,
    price_date VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE SET NULL,
    INDEX idx_mp_crop (crop_name),
    INDEX idx_mp_date (price_date),
    INDEX idx_mp_loc (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Weather Cache Table
CREATE TABLE IF NOT EXISTS weather_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_key VARCHAR(150) NOT NULL,
    temperature FLOAT NOT NULL,
    condition VARCHAR(100) NOT NULL,
    humidity FLOAT NOT NULL,
    wind_speed FLOAT NOT NULL,
    rain_probability FLOAT NOT NULL,
    forecast_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_weather_loc (location_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Agriculture News Table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hindi_title VARCHAR(255) NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    source VARCHAR(100) DEFAULT 'Krishi Bhavan',
    source_url VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_news_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Government Schemes Table
CREATE TABLE IF NOT EXISTS government_schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255) NULL,
    ministry VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    benefits TEXT NOT NULL,
    required_documents TEXT NOT NULL,
    application_process TEXT NOT NULL,
    official_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'Financial Assistance',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scheme_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    conversation_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_conv (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
