import logging
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.models import (
    User, UserRole, Crop, CropDisease, SoilType, Market, MarketPrice,
    News, GovernmentScheme, Notification
)
from app.auth.security import get_password_hash

logger = logging.getLogger(__name__)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.email == "admin@kisanmitra.gov.in").first():
        logger.info("Database already seeded.")
        return

    logger.info("Starting database seeding...")

    # 1. Users
    admin_user = User(
        full_name="Dr. Rajesh Sharma (Admin)",
        mobile_number="9876543210",
        email="admin@kisanmitra.gov.in",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN.value,
        state="Maharashtra",
        district="Pune",
        village="Krishi Bhavan",
        preferred_language="en",
        main_crop="Wheat"
    )

    demo_farmer = User(
        full_name="Ramesh Patil",
        mobile_number="9812345678",
        email="farmer@kisanmitra.gov.in",
        hashed_password=get_password_hash("farmer123"),
        role=UserRole.USER.value,
        state="Maharashtra",
        district="Pune",
        village="Shirur",
        preferred_language="mr",
        main_crop="Soybean"
    )

    db.add(admin_user)
    db.add(demo_farmer)
    db.commit()

    # 2. Crops
    crops_data = [
        Crop(
            name="Wheat (गेहूं / गहू)",
            hindi_name="गेहूं",
            marathi_name="गहू",
            category="Cereals",
            season="Rabi",
            soil_type="Well-drained fertile loamy & clayey soils",
            temp_min=10.0,
            temp_max=25.0,
            rainfall_min=350.0,
            rainfall_max=750.0,
            sowing_period="Late October - November",
            harvest_period="March - April",
            water_requirement="Medium (4-6 irrigations at CRI, Tillering, Flowering)",
            fertilizer_info="NPK 120:60:40 kg/ha. Apply half N + full P and K at sowing. Top dress remaining N in two splits.",
            common_diseases="Yellow Rust, Brown Rust, Loose Smut, Karnal Bunt, Powdery Mildew",
            common_pests="Termites, Aphids, Armyworm",
            farming_practices="Maintain 20-22 cm row distance. Sowing depth 4-5 cm. Apply balanced zinc sulfate (25 kg/ha) at field prep.",
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Rice / Paddy (धान / भात)",
            hindi_name="धान",
            marathi_name="भात",
            category="Cereals",
            season="Kharif",
            soil_type="Heavy clayey or alluvial loam with high water holding capacity",
            temp_min=20.0,
            temp_max=38.0,
            rainfall_min=1000.0,
            rainfall_max=1500.0,
            sowing_period="June - July (Nursery in May-June)",
            harvest_period="October - November",
            water_requirement="High (Requires 2-5 cm standing water during vegetative stage)",
            fertilizer_info="NPK 120:60:40 kg/ha + 25 kg Zinc Sulphate. Split nitrogen: 50% basal, 25% active tillering, 25% panicle initiation.",
            common_diseases="Rice Blast, Bacterial Leaf Blight, Sheath Blight, Brown Spot",
            common_pests="Stem Borer, Brown Plant Hopper (BPH), Leaf Folder, Gundhi Bug",
            farming_practices="Adopt SRI (System of Rice Intensification) or Direct Seeded Rice (DSR) to conserve 30-40% water. Transplating 21-25 day seedlings.",
            image_url="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Maize / Corn (मक्का / मका)",
            hindi_name="मक्का",
            marathi_name="मका",
            category="Cereals",
            season="Kharif & Rabi",
            soil_type="Well-drained deep loamy soil rich in organic matter",
            temp_min=18.0,
            temp_max=32.0,
            rainfall_min=500.0,
            rainfall_max=800.0,
            sowing_period="June - July (Kharif) / Oct - Nov (Rabi)",
            harvest_period="Sept - Oct (Kharif) / Feb - March (Rabi)",
            water_requirement="Medium (Sensitive to waterlogging, requires 5-6 irrigations)",
            fertilizer_info="NPK 120:60:40 kg/ha. Apply 20 kg Zinc Sulphate per hectare.",
            common_diseases="Maydis Leaf Blight, Turcicum Leaf Blight, Downy Mildew",
            common_pests="Fall Armyworm (FAW), Stem Borer, Shoot Fly",
            farming_practices="Spacing: 60 cm row-to-row and 20 cm plant-to-plant. Install pheromone traps for Fall Armyworm surveillance.",
            image_url="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Chickpea / Gram (चना / हरभरा)",
            hindi_name="चना",
            marathi_name="हरभरा",
            category="Pulses",
            season="Rabi",
            soil_type="Medium to deep black soils, sandy loam with neutral pH",
            temp_min=15.0,
            temp_max=28.0,
            rainfall_min=300.0,
            rainfall_max=500.0,
            sowing_period="October - November",
            harvest_period="February - March",
            water_requirement="Low to Medium (1-2 irrigations: Branching and Pod development)",
            fertilizer_info="NPK 20:50:20 kg/ha (Legume crop fixes atmospheric nitrogen). Seed treatment with Rhizobium + PSB.",
            common_diseases="Fusarium Wilt, Ascochyta Blight, Collar Rot, Dry Root Rot",
            common_pests="Gram Pod Borer (Helicoverpa armigera), Cutworms",
            farming_practices="Treat seeds with Trichoderma viride @ 5g/kg. Install 'T' shaped bird perches @ 20/acre to control pod borer naturally.",
            image_url="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Pigeon Pea / Arhar (अरहर / तूर)",
            hindi_name="अरहर / तुअर",
            marathi_name="तूर",
            category="Pulses",
            season="Kharif",
            soil_type="Deep black soil or sandy loam with good internal drainage",
            temp_min=20.0,
            temp_max=35.0,
            rainfall_min=600.0,
            rainfall_max=1000.0,
            sowing_period="June - July",
            harvest_period="December - January",
            water_requirement="Medium (Critical stages: Flower bud initiation & pod development)",
            fertilizer_info="NPK 25:50:25 kg/ha + 20 kg Sulphur/ha. Intercrop with Soybean (1:4 ratio).",
            common_diseases="Sterility Mosaic Disease, Phytophthora Blight, Wilt",
            common_pests="Pod Borer, Plume Moth, Pod Fly",
            farming_practices="Adopt transplanting method for high-yield hybrids (spacing 120 x 45 cm). Top clipping at 45-50 days to promote branching.",
            image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Tomato (टमाटर / टोमॅटो)",
            hindi_name="टमाटर",
            marathi_name="टोमॅटो",
            category="Vegetables",
            season="All Season",
            soil_type="Rich, well-drained sandy loam or clay loam with pH 6.0 - 7.5",
            temp_min=18.0,
            temp_max=30.0,
            rainfall_min=400.0,
            rainfall_max=700.0,
            sowing_period="Aug-Sept (Autumn), Nov-Dec (Spring), June-July (Kharif)",
            harvest_period="60-70 days after transplanting (multiple pickings)",
            water_requirement="Medium (Regular light irrigation via Drip with fertigation)",
            fertilizer_info="NPK 150:100:120 kg/ha. Calcium nitrate spray to prevent Blossom End Rot.",
            common_diseases="Early Blight, Late Blight, Tomato Leaf Curl Virus (TYLCV), Bacterial Wilt",
            common_pests="Fruit Borer, Whiteflies, Leaf Miner, Red Spider Mite",
            farming_practices="Staking with bamboo trellising improves fruit quality and prevents fungal soil splashes. Use silver-black reflective mulch film.",
            image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Onion (प्याज / कांदा)",
            hindi_name="प्याज",
            marathi_name="कांदा",
            category="Vegetables",
            season="Kharif, Late Kharif, Rabi",
            soil_type="Deep friable loamy soil rich in humus and organic matter",
            temp_min=13.0,
            temp_max=28.0,
            rainfall_min=400.0,
            rainfall_max=650.0,
            sowing_period="Oct-Nov (Rabi), May-June (Kharif), Aug-Sept (Late Kharif)",
            harvest_period="March-April (Rabi), Oct-Nov (Kharif)",
            water_requirement="Medium (Stop irrigation 10-15 days prior to harvest for bulb curing)",
            fertilizer_info="NPK 100:50:50 kg/ha + 30 kg Elemental Sulphur per hectare.",
            common_diseases="Purple Blotch, Stemphylium Blight, Basal Rot, Downy Mildew",
            common_pests="Thrips (Thrips tabaci), Head Borer",
            farming_practices="Transplant 6-8 week seedlings at 15 x 10 cm spacing. Proper sun curing of bulbs in field before storage prevents rotting.",
            image_url="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Cotton (कपास / कापूस)",
            hindi_name="कपास",
            marathi_name="कापूस",
            category="Cash crops",
            season="Kharif",
            soil_type="Deep black soil (Regur), alluvial loams with good depth",
            temp_min=21.0,
            temp_max=36.0,
            rainfall_min=600.0,
            rainfall_max=1000.0,
            sowing_period="May - June",
            harvest_period="October - December",
            water_requirement="Medium to High (Critical at flowering & boll formation)",
            fertilizer_info="NPK 120:60:60 kg/ha. Apply Magnesium Sulphate @ 25 kg/ha to avoid reddening of leaves.",
            common_diseases="Bacterial Blight, Alternaria Leaf Spot, Fusarium Wilt, Grey Mildew",
            common_pests="Pink Bollworm, Whitefly, Jassids, Thrips, Mealybugs",
            farming_practices="Maintain 90x60 cm or 120x45 cm plant geometry. Install pheromone traps for pink bollworm early monitoring.",
            image_url="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Sugarcane (गन्ना / ऊस)",
            hindi_name="गन्ना",
            marathi_name="ऊस",
            category="Cash crops",
            season="All Season (Adsali, Pre-seasonal, Suru)",
            soil_type="Deep well-drained loamy, alluvial and heavy clay soils",
            temp_min=20.0,
            temp_max=38.0,
            rainfall_min=1200.0,
            rainfall_max=2200.0,
            sowing_period="July-Aug (Adsali), Oct-Nov (Pre-seasonal), Jan-Feb (Suru)",
            harvest_period="12-18 months after planting",
            water_requirement="High (1800-2200 mm, drip fertigation recommended)",
            fertilizer_info="NPK 250:115:115 kg/ha. 4 split doses: Planting, 45 DAP, 90 DAP, and earthing up (120-135 DAP).",
            common_diseases="Red Rot, Smut, Grassy Shoot Disease, Wilt",
            common_pests="Early Shoot Borer, Top Borer, White Grub, Scale Insects",
            farming_practices="Adopt paired row planting (90-180-90 cm) with trash mulching. Earthing up prevents lodging during cyclones.",
            image_url="https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop"
        ),
        Crop(
            name="Mango (आम / आंबा)",
            hindi_name="आम",
            marathi_name="आंबा",
            category="Fruits",
            season="All Season (Perennial Orchard)",
            soil_type="Deep, well-drained alluvial, red loamy soils with pH 5.5 - 7.5",
            temp_min=22.0,
            temp_max=38.0,
            rainfall_min=750.0,
            rainfall_max=1500.0,
            sowing_period="July - August (Planting of grafts)",
            harvest_period="March - June (depending on variety)",
            water_requirement="Medium (Crucial fruit setting period; stop irrigation 15 days before harvest)",
            fertilizer_info="Apply 1000g N, 500g P2O5, 1000g K2O per bearing tree (10+ years) along with 50 kg FYM in Sept-Oct.",
            common_diseases="Powdery Mildew, Anthracnose, Dieback, Malformation",
            common_pests="Mango Hopper, Fruit Fly, Stem Borer, Mealybug",
            farming_practices="High Density Planting (5m x 5m) or Ultra High Density (3m x 2m). Pruning in July-August immediately after harvest.",
            image_url="https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop"
        )
    ]

    for crop in crops_data:
        db.add(crop)
    db.commit()

    # 3. Crop Diseases & Pests
    diseases_data = [
        CropDisease(
            crop_name="Tomato",
            name="Early Blight (Alternaria solani)",
            hindi_name="टमाटर का अगेती झुलसा रोग",
            disease_type="Fungal",
            symptoms="Dark brown to black spots with concentric rings on older leaves forming 'target board' patterns. Yellowing and premature leaf drop.",
            causes="Alternaria solani fungus thriving in high humidity (>80%) and temperatures around 25-30°C with overhead watering.",
            prevention="Crop rotation with non-solanaceous crops, avoid overhead sprinkler irrigation, maintain proper plant spacing.",
            treatment="Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin + Difenoconazole @ 1 ml/L. Prune and destroy lower infected leaves.",
            severity="High",
            image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop"
        ),
        CropDisease(
            crop_name="Tomato",
            name="Tomato Yellow Leaf Curl Virus (TYLCV)",
            hindi_name="टमाटर पर्ण कुंचन रोग (लीफ कर्ल)",
            disease_type="Viral",
            symptoms="Severe stunting of shoots, upward rolling and yellowing of leaf margins, thick leathery leaves, and dropped blossoms.",
            causes="Begomovirus transmitted by Whitefly (Bemisia tabaci).",
            prevention="Use yellow sticky traps @ 15/acre. Grow barrier crops like maize/bajra around field.",
            treatment="No direct chemical cure for viral pathogen. Control whitefly vector by spraying Imidacloprid 17.8% SL @ 0.5 ml/L or Diafenthiuron 50% WP @ 1g/L.",
            severity="High",
            image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop"
        ),
        CropDisease(
            crop_name="Wheat",
            name="Yellow / Stripe Rust (Puccinia striiformis)",
            hindi_name="गेहूं का पीला रतुआ",
            disease_type="Fungal",
            symptoms="Yellow-orange powdery pustules arranged in parallel stripes on leaf blades, causing leaf desiccation.",
            causes="Puccinia striiformis fungus favored by cool, humid weather (10-15°C) and morning dew.",
            prevention="Sow rust-resistant wheat varieties (DBW-187, HD-3086). Avoid excess nitrogen.",
            treatment="Spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 liters water/acre) upon first appearance.",
            severity="High",
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"
        ),
        CropDisease(
            crop_name="Rice / Paddy",
            name="Rice Blast (Magnaporthe oryzae)",
            hindi_name="धान का झोंका रोग (ब्लास्ट)",
            disease_type="Fungal",
            symptoms="Spindle-shaped elliptical lesions with gray centers and brown borders. Neck blast causes blackening and breakage of panicles.",
            causes="Magnaporthe oryzae fungus favored by high humidity (>90%) and cool night temperatures.",
            prevention="Seed treatment with Carbendazim 2g/kg seed. Split nitrogen application.",
            treatment="Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at first symptom.",
            severity="High",
            image_url="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop"
        ),
        CropDisease(
            crop_name="Cotton",
            name="Pink Bollworm (Pectinophora gossypiella)",
            hindi_name="कपास की गुलाबी सुंडी",
            disease_type="Pest",
            symptoms="Rosetted flowers (petals tied together), bored holes in bolls plugged with feces, stained lint, and premature boll opening.",
            causes="Pink bollworm larvae feeding internally on developing seeds and fibers.",
            prevention="Install Pheromone traps @ 5/acre for monitoring. Terminate crop by December-January to break pest lifecycle.",
            treatment="Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Profenofos 50% EC @ 2 ml/L.",
            severity="High",
            image_url="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop"
        ),
        CropDisease(
            crop_name="Chickpea / Gram",
            name="Fusarium Wilt (Fusarium oxysporum)",
            hindi_name="चने का उकठा / विल्ट रोग",
            disease_type="Fungal",
            symptoms="Drooping and wilting of leaves from top to bottom, internal vascular browning inside the root when split open.",
            causes="Soil-borne Fusarium fungus that infects through root xylem vessels.",
            prevention="Deep summer ploughing, 3-year crop rotation, treat seeds with Trichoderma viride @ 5g/kg.",
            treatment="Soil drenching around root zone with Carbendazim 12% + Mancozeb 63% WP @ 2g/L.",
            severity="Moderate",
            image_url="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop"
        )
    ]

    for d in diseases_data:
        db.add(d)
    db.commit()

    # 4. Soil Types
    soil_data = [
        SoilType(
            name="Black Soil (Regur)",
            hindi_name="काली मिट्टी (रेगुर)",
            marathi_name="काळी माती (रेगूर)",
            characteristics="Formed from basaltic lava rocks. Highly clayey (40-60%), deep dark color, self-ploughing nature (develops deep cracks in summer), exceptional water retention.",
            suitable_crops="Cotton, Soybean, Wheat, Gram (Chickpea), Sugarcane, Jowar, Sunflower, Citrus.",
            nutrient_profile="Rich in Calcium, Magnesium Carbonate, Potash, and Iron. Deficient in Nitrogen, Phosphorus, and Organic Matter.",
            ph_range="7.2 - 8.5 (Neutral to mildly alkaline)",
            fertilizer_guidance="Requires regular Nitrogen and Phosphorus supplements (DAP, SSP). Incorporate Farmyard Manure (FYM) to enhance porosity.",
            water_retention="High",
            image_url="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop"
        ),
        SoilType(
            name="Alluvial Soil",
            hindi_name="जलोढ़ मिट्टी",
            marathi_name="गाळाची माती",
            characteristics="Deposited by major rivers (Indo-Gangetic plains, coastal deltas). Loamy to sandy-clay texture, highly porous, friable, and exceptionally fertile.",
            suitable_crops="Wheat, Rice / Paddy, Sugarcane, Maize, Mustard, Pulses, Vegetables, Mango.",
            nutrient_profile="Rich in Potash and Lime. Moderate in Phosphate. Deficient in Nitrogen and Humus.",
            ph_range="6.5 - 7.8 (Optimal neutral)",
            fertilizer_guidance="Apply balanced NPK formulations (120:60:40). Zinc and sulfur fortification gives substantial yield boosts.",
            water_retention="Medium to High",
            image_url="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop"
        ),
        SoilType(
            name="Red and Yellow Soil",
            hindi_name="लाल और पीली मिट्टी",
            marathi_name="तांबडी माती",
            characteristics="Formed from ancient crystalline igneous rocks under high rainfall. Porous, crumbly structure, reddish due to iron diffusion in crystalline form.",
            suitable_crops="Groundnut, Pulses (Arhar, Gram), Millets (Ragi, Bajra), Tobacco, Potato, Oilseeds, Cashew.",
            nutrient_profile="Deficient in Nitrogen, Phosphorus, Potassium, Lime, and Humus. Rich in Iron.",
            ph_range="5.5 - 6.8 (Slightly acidic to neutral)",
            fertilizer_guidance="Requires heavy organic amendments (Vermicompost 3 tons/acre) and lime application if pH < 6.0.",
            water_retention="Low to Medium",
            image_url="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop"
        ),
        SoilType(
            name="Laterite Soil",
            hindi_name="लेटराइट मिट्टी",
            marathi_name="जांभी माती",
            characteristics="Formed by intense tropical leaching under alternating wet and dry spells. Coarse texture, hardens like brick upon exposure.",
            suitable_crops="Tea, Coffee, Rubber, Cashewnut, Coconut, Arecanut, Tapioca.",
            nutrient_profile="Very low in Nitrogen, Phosphate, Potassium, and Calcium. Rich in Iron and Aluminum oxides.",
            ph_range="4.5 - 5.8 (Strongly acidic)",
            fertilizer_guidance="Mandatory Liming (Dolomite) to correct soil acidity + heavy application of organic manures and rock phosphate.",
            water_retention="Low",
            image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop"
        ),
        SoilType(
            name="Sandy / Arid Soil",
            hindi_name="बलुई / मरुस्थलीय मिट्टी",
            marathi_name="वाळूमिश्रित माती",
            characteristics="High sand content (>85%), low water retention capacity, high salt content, fast percolation rate.",
            suitable_crops="Bajra, Guar, Moth Bean, Mustard, Watermelon, Muskmelon, Pomegranate (with drip).",
            nutrient_profile="Poor in Nitrogen and organic humus. High in soluble salts and Phosphate.",
            ph_range="7.5 - 8.8 (Alkaline)",
            fertilizer_guidance="Drip fertigation with water-soluble fertilizers + organic mulching to prevent moisture evaporation.",
            water_retention="Very Low",
            image_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop"
        )
    ]

    for s in soil_data:
        db.add(s)
    db.commit()

    # 5. Mandi & Market Prices
    today_str = datetime.now().strftime("%Y-%m-%d")
    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    mandi_data = [
        MarketPrice(market_name="Pune APMC (Gultekdi)", state="Maharashtra", district="Pune", crop_name="Wheat", variety="Sharbati", min_price=2450.0, max_price=3100.0, modal_price=2780.0, price_date=today_str),
        MarketPrice(market_name="Pune APMC (Gultekdi)", state="Maharashtra", district="Pune", crop_name="Soybean", variety="Yellow", min_price=4300.0, max_price=4850.0, modal_price=4620.0, price_date=today_str),
        MarketPrice(market_name="Pune APMC (Gultekdi)", state="Maharashtra", district="Pune", crop_name="Onion", variety="Red Nashik", min_price=1600.0, max_price=2400.0, modal_price=2050.0, price_date=today_str),
        MarketPrice(market_name="Pune APMC (Gultekdi)", state="Maharashtra", district="Pune", crop_name="Tomato", variety="Hybrid", min_price=1400.0, max_price=2200.0, modal_price=1850.0, price_date=today_str),
        MarketPrice(market_name="Lasalgaon APMC", state="Maharashtra", district="Nashik", crop_name="Onion", variety="Garva", min_price=1750.0, max_price=2650.0, modal_price=2250.0, price_date=today_str),
        MarketPrice(market_name="Nashik APMC", state="Maharashtra", district="Nashik", crop_name="Tomato", variety="Vaishali", min_price=1300.0, max_price=2100.0, modal_price=1750.0, price_date=today_str),
        MarketPrice(market_name="Nagpur APMC (Kalamna)", state="Maharashtra", district="Nagpur", crop_name="Cotton", variety="Medium Staple", min_price=6600.0, max_price=7400.0, modal_price=7050.0, price_date=today_str),
        MarketPrice(market_name="Nagpur APMC (Kalamna)", state="Maharashtra", district="Nagpur", crop_name="Soybean", variety="JS-335", min_price=4400.0, max_price=4800.0, modal_price=4650.0, price_date=today_str),
        MarketPrice(market_name="Karnal Grain Market", state="Haryana", district="Karnal", crop_name="Paddy / Rice", variety="Basmati 1121", min_price=3600.0, max_price=4400.0, modal_price=4150.0, price_date=today_str),
        MarketPrice(market_name="Karnal Grain Market", state="Haryana", district="Karnal", crop_name="Wheat", variety="HD-2967", min_price=2275.0, max_price=2450.0, modal_price=2350.0, price_date=today_str),
        MarketPrice(market_name="Indore Mandi (Chhavani)", state="Madhya Pradesh", district="Indore", crop_name="Soybean", variety="Yellow", min_price=4500.0, max_price=4950.0, modal_price=4750.0, price_date=today_str),
        MarketPrice(market_name="Indore Mandi (Chhavani)", state="Madhya Pradesh", district="Indore", crop_name="Chickpea / Gram", variety="Desi", min_price=5600.0, max_price=6200.0, modal_price=5950.0, price_date=today_str),
        MarketPrice(market_name="Rajkot APMC", state="Gujarat", district="Rajkot", crop_name="Cotton", variety="Shankar-6", min_price=6800.0, max_price=7600.0, modal_price=7250.0, price_date=today_str),
        MarketPrice(market_name="Guntur Mirchi Yard", state="Andhra Pradesh", district="Guntur", crop_name="Cotton", variety="Bunny", min_price=6750.0, max_price=7550.0, modal_price=7180.0, price_date=today_str),
        MarketPrice(market_name="Jaipur APMC (Surajpole)", state="Rajasthan", district="Jaipur", crop_name="Mustard", variety="Black", min_price=5100.0, max_price=5700.0, modal_price=5450.0, price_date=today_str),
    ]

    for m in mandi_data:
        db.add(m)
    db.commit()

    # 6. Government Schemes
    schemes_data = [
        GovernmentScheme(
            name="Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            hindi_name="प्रधानमंत्री किसान सम्मान निधि",
            ministry="Ministry of Agriculture and Farmers Welfare",
            description="Central sector scheme to provide income support to all landholding farmer families across India to supplement their financial needs for procuring agricultural inputs and domestic expenses.",
            eligibility="All landholding farmer families having cultivable landholding in their names. Excludes institutional landholders, income tax payees, and constitutional post holders.",
            benefits="₹6,000 per year directly credited into the verified Aadhaar-linked bank accounts of farmers in three equal installments of ₹2,000 every four months.",
            required_documents="Aadhaar Card, Land ownership papers (7/12 extract / Khatauni), Active Bank Account Passbook, Mobile Number for eKYC.",
            application_process="1. Visit pmkisan.gov.in -> 'New Farmer Registration'. 2. Enter Aadhaar and mobile. 3. Enter land record details and upload documents. 4. Complete biometric/OTP eKYC.",
            official_url="https://pmkisan.gov.in",
            category="Financial Assistance"
        ),
        GovernmentScheme(
            name="Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            hindi_name="प्रधानमंत्री फसल बीमा योजना",
            ministry="Ministry of Agriculture and Farmers Welfare",
            description="Comprehensive crop insurance scheme providing financial support and risk cover to farmers against crop loss/damage resulting from non-preventable natural risks, drought, flood, pests, and unseasonal rains.",
            eligibility="All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
            benefits="Maximum uniform premium: 2% for Kharif crops, 1.5% for Rabi food & oilseed crops, and 5% for annual commercial/horticultural crops. Balance premium subsidized by Central and State Governments.",
            required_documents="Land possession certificate, Sowing certificate / declaration, Bank passbook, Aadhaar card.",
            application_process="Apply online at pmfby.gov.in or through local Commercial Banks, Regional Rural Banks, Primary Agricultural Credit Societies (PACS), or Common Service Centers (CSC).",
            official_url="https://pmfby.gov.in",
            category="Crop Insurance"
        ),
        GovernmentScheme(
            name="Soil Health Card Scheme (SHC)",
            hindi_name="मृदा स्वास्थ्य कार्ड योजना",
            ministry="Ministry of Agriculture and Farmers Welfare",
            description="Government initiative to issue customized soil health report cards to farmers every 2 years carrying crop-wise fertilizer dosage and micronutrient recommendations.",
            eligibility="All farmers holding agricultural land.",
            benefits="Free soil nutrient testing (12 parameters: N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) helping reduce fertilizer costs by 15-25% and increase crop yields.",
            required_documents="Farmer Aadhaar, Land survey number (Gat/Khasra number).",
            application_process="Soil samples collected by local agriculture extension workers or submitted at nearest Soil Testing Lab / Krishi Vigyan Kendra (KVK). Access cards at soilhealth.dac.gov.in.",
            official_url="https://soilhealth.dac.gov.in",
            category="Soil & Nutrient Health"
        ),
        GovernmentScheme(
            name="Kisan Credit Card (KCC) Scheme",
            hindi_name="किसान क्रेडिट कार्ड योजना",
            ministry="Ministry of Finance & Department of Agriculture",
            description="Credit delivery system to provide timely and adequate short-term credit to farmers for crop cultivation, post-harvest expenses, farm asset maintenance, and dairy/fisheries activities.",
            eligibility="Individual/joint borrowers, owner cultivators, tenant farmers, oral lessees, and Self Help Groups (SHGs).",
            benefits="Credit limit up to ₹3 Lakhs at a subsidized interest rate of 4% per annum (with 3% prompt repayment incentive). Collateral-free loan up to ₹1.60 Lakh.",
            required_documents="Application form, Land record copy, ID proof (Aadhaar/Voter ID), Address proof, 2 passport photos.",
            application_process="Submit single-page KCC application form at any commercial bank branch, RRB, or CSC center. Online application available on banking portals.",
            official_url="https://www.myscheme.gov.in/schemes/kcc",
            category="Credit & Finance"
        ),
        GovernmentScheme(
            name="National Agriculture Market (e-NAM)",
            hindi_name="राष्ट्रीय कृषि बाजार (ई-नाम)",
            ministry="Ministry of Agriculture and Farmers Welfare",
            description="Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities with transparent price discovery.",
            eligibility="Farmers, FPOs (Farmer Producer Organizations), and licensed traders across participating States.",
            benefits="Elimination of middlemen, electronic bidding, online instant payment directly to bank account, assaying/quality testing facilities at mandis.",
            required_documents="Aadhaar Card, Bank account details, APMC registration details / Mandi gate entry pass.",
            application_process="Register at enam.gov.in or directly at the e-NAM kiosk at participating APMC mandi gates.",
            official_url="https://enam.gov.in",
            category="Market & Trade"
        ),
        GovernmentScheme(
            name="Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
            hindi_name="प्रधानमंत्री कृषि सिंचाई योजना",
            ministry="Ministry of Jal Shakti & Agriculture",
            description="Scheme focused on enhancing water-use efficiency at farm level through Micro Irrigation technologies (Drip & Sprinkler Systems) and precision water management.",
            eligibility="All farmer categories. Preference given to Small and Marginal Farmers.",
            benefits="Up to 55% capital subsidy for Small & Marginal farmers and 45% for other farmers on installation of Drip & Sprinkler irrigation systems.",
            required_documents="Aadhaar card, 7/12 Land extract & 8A certificate, Water and Electricity availability certificate, Quotation from authorized micro-irrigation dealer.",
            application_process="Apply online through State Agriculture / Horticulture department portals (e.g. MahaDBT in Maharashtra, Horticulture portal in other states).",
            official_url="https://pmksy.gov.in",
            category="Irrigation & Infrastructure"
        )
    ]

    for sch in schemes_data:
        db.add(sch)
    db.commit()

    # 7. Agriculture News
    news_data = [
        News(
            title="Cabinet approves MSP Hike for Rabi Crops 2026-27 season",
            hindi_title="मंत्रिमंडल ने रबी फसलों के एमएसपी (न्यूनतम समर्थन मूल्य) में वृद्धि को दी मंजूरी",
            summary="Government has increased the Minimum Support Price (MSP) for Wheat by ₹150 per quintal, Mustard by ₹300 per quintal, and Gram by ₹210 per quintal to ensure profitable returns for farmers.",
            content="The Cabinet Committee on Economic Affairs (CCEA) chaired by the Prime Minister has approved the increase in Minimum Support Prices (MSP) for all mandated Rabi crops for Marketing Season 2026-27. The increase is in line with the Union Budget principle of fixing the MSP at a level of at least 1.5 times the all-India weighted average cost of production.",
            category="Government",
            source="PIB Agriculture",
            source_url="https://pib.gov.in",
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop",
            published_at=datetime.utcnow() - timedelta(hours=3)
        ),
        News(
            title="IMD issues Agromet Weather Advisory: Timely showers expected across Central India",
            hindi_title="मौसम विभाग की कृषि मौसम सलाह: मध्य भारत में अनुकूल वर्षा की संभावना",
            summary="India Meteorological Department predicts widespread moisture revival over Maharashtra, Madhya Pradesh, and Gujarat, favorable for late vegetative growth of Kharif crops.",
            content="According to the latest Agro-meteorological Advisory Service (AAS) bulletin, soil moisture levels across Western Maharashtra and Malwa plateau are expected to improve significantly. Farmers are advised to postpone heavy pesticide sprays during overcast and drizzly days and maintain clean drainage channels in low-lying pulse plots.",
            category="Weather",
            source="IMD Agromet Service",
            source_url="https://mausam.imd.gov.in",
            image_url="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop",
            published_at=datetime.utcnow() - timedelta(hours=12)
        ),
        News(
            title="Advisory on Pink Bollworm Monitoring in Cotton: Install Pheromone Traps",
            hindi_title="कपास में गुलाबी सुंडी नियंत्रण के लिए कृषि वैज्ञानिकों की एडवाइजरी",
            summary="Central Institute for Cotton Research (CICR) urges farmers to install 5 pheromone traps per acre to monitor moth catches and take timely bio-control measures.",
            content="Agricultural scientists have highlighted the need for early scouting of pink bollworm in Bt cotton fields. When moth catches exceed 8 moths/trap/night for three consecutive days or 10% rosette flowers are observed, spray authorized bio-pesticides or selective green chemistry insecticides as per KVK advisory.",
            category="Crop Alert",
            source="ICAR-CICR Nagpur",
            source_url="https://cicr.org.in",
            image_url="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop",
            published_at=datetime.utcnow() - timedelta(days=1)
        ),
        News(
            title="e-NAM completes milestone of integrating 1,400+ APMC Mandis across 23 States",
            hindi_title="ई-नाम पोर्टल से जुड़े देश के 1400 से अधिक कृषि बाजार",
            summary="Direct farm-gate trade and transparent electronic auctions through e-NAM have enabled over ₹3 lakh crore in digital agricultural trade value.",
            content="The National Agriculture Market (e-NAM) continues to modernize farm trade in India by providing online transparent bidding, quality testing, and assaying at mandi gates. Farmers can trade from the comfort of their homes using the Kisan Mitra & eNAM mobile application.",
            category="Market",
            source="Ministry of Agriculture",
            source_url="https://enam.gov.in",
            image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop",
            published_at=datetime.utcnow() - timedelta(days=2)
        )
    ]

    for n in news_data:
        db.add(n)
    db.commit()

    # 8. Notifications
    notifs = [
        Notification(
            user_id=demo_farmer.id,
            title="Weather Advisory: Rain expected in Pune district",
            message="Light to moderate rain showers forecasted in Pune over the next 48 hours. Postpone foliar spraying of fertilizers.",
            alert_type="weather"
        ),
        Notification(
            user_id=demo_farmer.id,
            title="Mandi Price Alert: Soybean modal price ₹4,650/Q",
            message="Soybean prices gained +₹120/Q at Pune and Nagpur APMC markets today.",
            alert_type="market"
        ),
        Notification(
            user_id=demo_farmer.id,
            title="PM-KISAN eKYC Deadline Reminder",
            message="Ensure your biometric/OTP eKYC is updated on pmkisan.gov.in to receive the upcoming 17th installment without delay.",
            alert_type="scheme"
        )
    ]

    for notif in notifs:
        db.add(notif)
    db.commit()

    logger.info("Database successfully seeded with authentic data.")
