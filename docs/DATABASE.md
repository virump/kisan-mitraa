# Kisan Mitra Database Documentation

Kisan Mitra is built with a relational architecture using **SQLAlchemy ORM** supporting both **MySQL / MariaDB** and **SQLite** (automatic fallback).

---

## Entity Relationship Summary

```
                      +-------------------+
                      |       users       |
                      +-------------------+
                                | 1
                                |
                   +------------+------------+
                   |                         |
                   v *                       v *
        +--------------------+     +--------------------+
        |   notifications    |     |    chat_history    |
        +--------------------+     +--------------------+

                      +-------------------+
                      |       crops       |
                      +-------------------+
                                | 1
                                |
                                v *
                      +-------------------+
                      |   crop_diseases   |
                      +-------------------+

                      +-------------------+
                      |      markets      |
                      +-------------------+
                                | 1
                                |
                                v *
                      +-------------------+
                      |   market_prices   |
                      +-------------------+

      [ soil_types ]     [ news ]     [ government_schemes ]     [ weather_cache ]
```

---

## Table Definitions

### 1. `users`
* `id` (INT, PK, Auto-Increment)
* `full_name` (VARCHAR 150, Not Null)
* `mobile_number` (VARCHAR 20, Unique, Index)
* `email` (VARCHAR 150, Unique, Nullable)
* `hashed_password` (VARCHAR 255, Not Null)
* `role` (VARCHAR 20, Default: 'USER')
* `state` (VARCHAR 100, Default: 'Maharashtra')
* `district` (VARCHAR 100, Default: 'Pune')
* `village` (VARCHAR 150, Nullable)
* `preferred_language` (VARCHAR 20, Default: 'en')
* `main_crop` (VARCHAR 100, Default: 'Wheat')
* `is_active` (BOOLEAN, Default: TRUE)
* `created_at` (DATETIME)
* `updated_at` (DATETIME)

### 2. `crops`
* `id` (INT, PK)
* `name` (VARCHAR 100, Indexed)
* `hindi_name` (VARCHAR 100)
* `marathi_name` (VARCHAR 100)
* `category` (VARCHAR 50, Indexed) - Cereals, Pulses, Vegetables, Fruits, Cash crops
* `season` (VARCHAR 50, Indexed) - Kharif, Rabi, Zaid, All Season
* `soil_type` (VARCHAR 150)
* `temp_min` (FLOAT), `temp_max` (FLOAT)
* `rainfall_min` (FLOAT), `rainfall_max` (FLOAT)
* `sowing_period` (VARCHAR 100), `harvest_period` (VARCHAR 100)
* `water_requirement` (VARCHAR 100)
* `fertilizer_info` (TEXT)
* `common_diseases` (TEXT)
* `common_pests` (TEXT)
* `farming_practices` (TEXT)
* `image_url` (VARCHAR 500)

### 3. `crop_diseases`
* `id` (INT, PK)
* `crop_id` (INT, FK -> crops.id, Nullable)
* `crop_name` (VARCHAR 100, Indexed)
* `name` (VARCHAR 150, Indexed)
* `hindi_name` (VARCHAR 150)
* `disease_type` (VARCHAR 50) - Fungal, Bacterial, Viral, Pest, Deficiency
* `symptoms` (TEXT)
* `causes` (TEXT)
* `prevention` (TEXT)
* `treatment` (TEXT)
* `severity` (VARCHAR 50)

### 4. `market_prices`
* `id` (INT, PK)
* `market_name` (VARCHAR 150)
* `state` (VARCHAR 100, Indexed)
* `district` (VARCHAR 100, Indexed)
* `crop_name` (VARCHAR 100, Indexed)
* `variety` (VARCHAR 100)
* `min_price` (FLOAT)
* `max_price` (FLOAT)
* `modal_price` (FLOAT)
* `price_date` (VARCHAR 20, Indexed)

### 5. `soil_types`
* `id` (INT, PK)
* `name` (VARCHAR 100, Unique)
* `characteristics` (TEXT)
* `suitable_crops` (TEXT)
* `nutrient_profile` (TEXT)
* `ph_range` (VARCHAR 50)
* `fertilizer_guidance` (TEXT)

### 6. `government_schemes`
* `id` (INT, PK)
* `name` (VARCHAR 255)
* `ministry` (VARCHAR 200)
* `description` (TEXT)
* `eligibility` (TEXT)
* `benefits` (TEXT)
* `required_documents` (TEXT)
* `application_process` (TEXT)
* `official_url` (VARCHAR 500)
* `category` (VARCHAR 100)

---

## SQL Scripts Provided
* `database/schema.sql` - Full table creation script with indexes and foreign keys
* `database/seed.sql` - Initial seed dataset containing admin, demo farmer, and sample records
