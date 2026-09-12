-- ==========================================================
-- Seed Data for Kisan Mitra
-- ==========================================================

USE kisan_mitra;

-- 1. Insert Default Users (Admin: admin123, Farmer: farmer123)
-- Passwords hashed using bcrypt
INSERT INTO users (id, full_name, mobile_number, email, hashed_password, role, state, district, village, preferred_language, main_crop)
VALUES 
(1, 'Dr. Rajesh Sharma (Admin)', '9876543210', 'admin@kisanmitra.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', 'Maharashtra', 'Pune', 'Krishi Bhavan', 'en', 'Wheat'),
(2, 'Ramesh Patil', '9812345678', 'farmer@kisanmitra.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', 'Maharashtra', 'Pune', 'Shirur', 'mr', 'Soybean');

-- 2. Insert Soil Types
INSERT INTO soil_types (id, name, hindi_name, marathi_name, characteristics, suitable_crops, nutrient_profile, ph_range, fertilizer_guidance, water_retention)
VALUES
(1, 'Black Soil (Regur)', 'काली मिट्टी (रेगुर)', 'काळी माती (रेगूर)', 'High clay content (40-60%), deep moisture retention, develops self-aerating cracks in dry season.', 'Cotton, Soybean, Wheat, Gram, Sugarcane, Jowar', 'Rich in Calcium, Magnesium Carbonate, Potash. Deficient in Nitrogen & Phosphorus.', '7.2 - 8.5', 'Apply balanced DAP, SSP, and Farmyard Manure.', 'High'),
(2, 'Alluvial Soil', 'जलोढ़ मिट्टी', 'गाळाची माती', 'Deposited by rivers, fertile loamy texture, excellent porosity.', 'Wheat, Rice, Sugarcane, Maize, Mustard, Pulses', 'Rich in Potash & Lime. Deficient in Nitrogen.', '6.5 - 7.8', 'Balanced NPK 120:60:40 with Zinc sulfate.', 'Medium to High'),
(3, 'Red and Yellow Soil', 'लाल और पीली मिट्टी', 'तांबडी माती', 'Porous, rich in iron oxide diffusion, well-drained.', 'Groundnut, Pulses, Millets, Tobacco, Potato', 'Deficient in Nitrogen, Phosphorus, and Humus. Rich in Iron.', '5.5 - 6.8', 'Apply Vermicompost 3 tons/acre and dolomite if acidic.', 'Low to Medium'),
(4, 'Laterite Soil', 'लेटराइट मिट्टी', 'जांभी माती', 'Formed by intense tropical leaching, acidic, hardens upon drying.', 'Tea, Coffee, Rubber, Cashewnut, Coconut', 'Low in Nitrogen, Potash, Calcium. High in Iron & Aluminum.', '4.5 - 5.8', 'Liming with dolomite + rock phosphate is required.', 'Low'),
(5, 'Sandy / Arid Soil', 'बलुई / मरुस्थलीय मिट्टी', 'वाळूमिश्रित माती', 'High sand content (>85%), quick water percolation.', 'Bajra, Guar, Moth Bean, Watermelon, Mustard', 'Deficient in Nitrogen and Organic Matter.', '7.5 - 8.8', 'Drip fertigation + organic mulching to prevent moisture loss.', 'Very Low');

-- 3. Insert Government Schemes
INSERT INTO government_schemes (id, name, hindi_name, ministry, description, eligibility, benefits, required_documents, application_process, official_url, category)
VALUES
(1, 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)', 'प्रधानमंत्री किसान सम्मान निधि', 'Ministry of Agriculture and Farmers Welfare', 'Central sector scheme to provide income support to all landholding farmer families across India.', 'All landholding farmer families with cultivable land in their names.', '₹6,000 per year directly into bank accounts in 3 equal installments of ₹2,000.', 'Aadhaar Card, Land ownership papers (7/12 / Khatauni), Bank Passbook', 'Apply online at pmkisan.gov.in or CSC centers.', 'https://pmkisan.gov.in', 'Financial Assistance'),
(2, 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'प्रधानमंत्री फसल बीमा योजना', 'Ministry of Agriculture and Farmers Welfare', 'Comprehensive crop insurance scheme providing financial support and risk cover to farmers against crop loss.', 'All farmers including sharecroppers growing notified crops.', 'Low premium (1.5% to 2% for food crops, 5% for commercial crops) with complete loss claim settlement.', 'Land possession certificate, Sowing certificate, Bank passbook, Aadhaar', 'Apply online at pmfby.gov.in or through bank branches.', 'https://pmfby.gov.in', 'Crop Insurance'),
(3, 'Soil Health Card Scheme (SHC)', 'मृदा स्वास्थ्य कार्ड योजना', 'Ministry of Agriculture and Farmers Welfare', 'Government initiative to issue customized soil health report cards carrying 12-parameter nutrient report.', 'All farmers holding agricultural land.', 'Free soil nutrient testing and customized fertilizer advisory saving 15-25% input costs.', 'Farmer Aadhaar, Land survey number', 'Soil samples collected by local agriculture extension workers.', 'https://soilhealth.dac.gov.in', 'Soil & Nutrient Health'),
(4, 'Kisan Credit Card (KCC) Scheme', 'किसान क्रेडिट कार्ड योजना', 'Ministry of Finance & Agriculture', 'Timely short-term credit to farmers for crop cultivation and post-harvest expenses at low interest rate.', 'Owner cultivators, tenant farmers, Self Help Groups.', 'Credit limit up to ₹3 Lakhs at 4% subsidized interest rate. Collateral-free up to ₹1.60 Lakh.', 'KCC application form, Land record copy, ID proof, Passport photos', 'Submit single-page application at any commercial bank / RRB.', 'https://www.myscheme.gov.in/schemes/kcc', 'Credit & Finance'),
(5, 'National Agriculture Market (e-NAM)', 'राष्ट्रीय कृषि बाजार (ई-नाम)', 'Ministry of Agriculture and Farmers Welfare', 'Pan-India electronic trading portal networking APMC mandis for transparent price discovery.', 'Farmers, FPOs, and licensed traders.', 'Direct electronic bidding, transparent weights, instant online bank transfer.', 'Aadhaar Card, Bank account details, APMC entry pass', 'Register at enam.gov.in or APMC mandi kiosk.', 'https://enam.gov.in', 'Market & Trade');
