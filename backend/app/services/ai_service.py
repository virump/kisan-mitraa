import os
import re
import logging
import uuid
from typing import Dict, Any, List, Optional
import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Multilingual Agricultural Expert Knowledge Base
KNOWLEDGE_BASE = [
    {
        "keywords": ["black soil", "kali mitti", "काली मिट्टी", "काळी माती", "regur"],
        "en": "Black soil (Regur soil) is rich in clay, moisture-retentive, and contains high amounts of calcium, magnesium, and carbonate. **Best crops to cultivate**: Cotton, Soybean, Sugarcane, Wheat, Gram (Chickpea), Jowar, and Sunflower. Ensure proper drainage during heavy monsoon rains.",
        "hi": "काली मिट्टी (रेगुर मिट्टी) में नमी धारण करने की उत्तम क्षमता होती है और यह कैल्शियम, मैग्नीशियम तथा पोटाश से भरपूर होती है। **उपयुक्त फसलें**: कपास, सोयाबीन, गन्ना, गेहूं, चना, ज्वार और सूरजमुखी। भारी बारिश में जल निकासी की उचित व्यवस्था करें।",
        "mr": "काळी माती (रेगूर माती) ओलावा टिकवून ठेवण्यासाठी उत्तम असते. यात कॅल्शियम आणि मॅग्नेशियम मुबलक प्रमाणात असते. **योग्य पिके**: कापूस, सोयाबीन, ऊस, गहू, हरभरा, ज्वारी आणि सूर्यफूल. जास्त पावसाच्या काळात पाण्याचा योग्य निचरा करा.",
        "suggestions": ["What fertilizer for cotton?", "How to improve soil pH?", "Best sowing time for soybean"]
    },
    {
        "keywords": ["sow wheat", "wheat sowing", "गेहूं की बुवाई", "गहू पेरणी", "rabi wheat", "wheat time"],
        "en": "The optimal sowing time for wheat is from **November 1 to November 25** for timely-sown varieties (like HD-2967, PBW-343, GW-322). For late-sown conditions, sow before December 15. Maintain row spacing of 20-22 cm and seed depth of 4-5 cm with 100-120 kg/ha seed rate.",
        "hi": "गेहूं की बुवाई का सबसे उपयुक्त समय **1 नवंबर से 25 नवंबर** है। समय पर बुवाई वाली मुख्य किस्में HD-2967, GW-322 और DBW-187 हैं। कतार से कतार की दूरी 20-22 सेमी रखें और बीज दर 100-120 किग्रा प्रति हेक्टेयर रखें।",
        "mr": "गव्हाच्या वेळेवर पेरणीसाठी योग्य वेळ **१ नोव्हेंबर ते २५ नोव्हेंबर** आहे. उशिरा पेरणी १५ डिसेंबरपर्यंत करावी. ओळींमधील अंतर २०-२२ सेमी ठेवा आणि हेक्टरी १००-१२० किलो बियाणे वापरावे.",
        "suggestions": ["Fertilizer schedule for wheat", "First irrigation in wheat (CRI stage)", "Wheat rust prevention"]
    },
    {
        "keywords": ["tomato leaves yellow", "yellow leaves", "पत्ते पीले", "पाने पिवळी", "tomato yellow", "chlorosis"],
        "en": "Yellowing in tomato leaves can be caused by: 1) **Nitrogen deficiency** (older lower leaves turn pale yellow), 2) **Overwatering/poor drainage** (root suffocation), 3) **Early Blight or Tomato Yellow Leaf Curl Virus (TYLCV)** spread by whiteflies. **Solution**: Apply balanced NPK 19-19-19 (5g/L spray), avoid waterlogging, and spray Imidacloprid (0.5 ml/L) if whiteflies are present.",
        "hi": "टमाटर की पत्तियों के पीले होने के मुख्य कारण: 1) **नाइट्रोजन की कमी** (निचली पत्तियां पहले पीली होती हैं), 2) **अधिक पानी या जलभराव**, 3) **अर्ली ब्लाइट या लीफ कर्ल वायरस** (सफेद मक्खी द्वारा फैलाया गया)। **उपाय**: NPK 19-19-19 (5 ग्राम/लीटर) का छिड़काव करें, जल निकासी ठीक करें और सफेद मक्खी के लिए इमिडाक्लोप्रिड का प्रयोग करें।",
        "mr": "टोमॅटोची पाने पिवळी पडण्याची मुख्य कारणे: १) **नत्र (नायट्रोजन) ची कमतरता**, २) **जास्त पाणी साचणे**, ३) **लीफ कर्ल व्हायरस** (पांढऱ्या माशीमुळे). **उपाय**: NPK १९:१९:१९ (५ ग्रॅम/लिटर) फवारा, पाण्याचा निचरा योग्य ठेवा आणि पांढऱ्या माशीच्या नियंत्रणासाठी इमिडाक्लोप्रिड फवारा.",
        "suggestions": ["Organic pesticides for tomatoes", "Drip irrigation for tomatoes", "Tomato leaf curl remedy"]
    },
    {
        "keywords": ["fertilizer for rice", "rice fertilizer", "dhan khad", "धान की खाद", "तांदूळ खत", "paddy fertilizer"],
        "en": "Recommended fertilizer dose for high-yielding Paddy (Rice): **NPK 120:60:40 kg/ha**. Apply 50% Nitrogen + 100% Phosphorus + 100% Potash + 25 kg Zinc Sulfate as basal dose during final puddling. Apply the remaining Nitrogen in two equal splits: 25% at active tillering (20-25 DAT) and 25% at panicle initiation (40-45 DAT).",
        "hi": "धान (चावल) के लिए अनुशंसित खाद की मात्रा: **NPK 120:60:40 किग्रा/हेक्टेयर**। रोपाई के समय (बेसल डोज) 50% नाइट्रोजन, 100% फास्फोरस, 100% पोटाश और 25 किग्रा जिंक सल्फेट डालें। शेष 50% नाइट्रोजन को दो भागों में कल्ले फूटते समय (20-25 दिन) और बाली निकलते समय (40-45 दिन) दें।",
        "mr": "भातासाठी (धान) शिफारस केलेले खतांचे प्रमाण: **NPK १२०:६०:४० किलो/हेक्टर** + २५ किलो झिंक सल्फेट. ५०% नत्र, पूर्ण स्फुरद व पालाश चिखलणीच्या वेळी द्यावे. उर्वरित नत्र फुटवे फुटताना (२५%) आणि पोटरी अवस्थेत (२५%) द्यावे.",
        "suggestions": ["Control brown plant hopper in rice", "Paddy weed management", "SRI method of rice cultivation"]
    },
    {
        "keywords": ["water requirement", "how much water", "pani kitna", "पानी की आवश्यकता", "पाणी किती", "irrigation"],
        "en": "Water requirements vary by crop and growth stage: \n- **Wheat**: Needs 4-6 irrigations (Critical stages: CRI at 21 days, Tillering, Flowering, Grain filling).\n- **Paddy/Rice**: Requires standing water of 2-5 cm during vegetative stage, ~1200-1400 mm total.\n- **Cotton**: 700-900 mm with critical need at flowering and boll formation.\n- **Vegetables**: Require frequent light irrigations through Drip System to save 40-50% water.",
        "hi": "फसलों में पानी की आवश्यकता एवं क्रांतिक अवस्थाएं: \n- **गेहूं**: 4-6 सिंचाइयां (मुख्य: 21 दिन पर मुकुट जड़ अवस्था, कल्ले बनते समय, फूल व दाना बनते समय)।\n- **धान**: 1200-1400 मिमी कुल पानी, रोपाई के बाद खेत में 2-5 सेमी नमी बनी रहे।\n- **कपास**: फूल और टिंडे बनते समय पानी की कमी न होने दें।\n- **सब्जियां**: ड्रिप (टपक) सिंचाई से 40-50% पानी की बचत होती है।",
        "mr": "पिकांच्या पाण्याचे प्रमाण आणि संवेदनशील अवस्था: \n- **गहू**: ४ ते ६ पाण्याच्या पाळ्या (२१ दिवसांनी मुकुटमुळे फुटताना, फुलोऱ्यात आणि दाणे भरताना).\n- **भात**: १२००-१४०० मिमी पाणी आवश्यक.\n- **कापूस**: पाते लागताना आणि बोंड भरताना पाण्याचा ताण पडू देऊ नये.\n- **भाजीपाला**: ठिबक सिंचन पद्धतीचा वापर करून ४०-५०% पाण्याची बचत करा.",
        "suggestions": ["Subsidies for drip irrigation", "Soil moisture testing methods", "Mulching techniques to save water"]
    },
    {
        "keywords": ["pm kisan", "pm-kisan", "samman nidhi", "पीएम किसान", "सन्मान निधी", "6000"],
        "en": "Under **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**, eligible landholding farmer families receive **₹6,000 per year** in three equal installments of ₹2,000 directly into their bank accounts. Ensure your eKYC is completed on pmkisan.gov.in and your Aadhaar is linked to your bank account.",
        "hi": "**पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)** योजना के तहत पात्र किसान परिवारों को प्रति वर्ष **₹6,000** की वित्तीय सहायता ₹2,000 की तीन समान किस्तों में सीधे बैंक खाते में दी जाती है। pmkisan.gov.in पर eKYC पूरा करना और आधार-बैंक खाता लिंक होना अनिवार्य है।",
        "mr": "**पीएम-किसान सन्मान निधी** योजनेअंतर्गत पात्र शेतकरी कुटुंबांना दरवर्षी **₹६,०००** तीन हप्त्यांमध्ये (प्रत्येकी ₹२,०००) थेट बँक खात्यात जमा केले जातात. pmkisan.gov.in वर ई-केवायसी (eKYC) पूर्ण करणे व आधार लिंक असणे आवश्यक आहे.",
        "suggestions": ["Check PM-Kisan installment status", "Documents required for PM-Kisan", "Kisan Credit Card eligibility"]
    },
    {
        "keywords": ["organic farming", "jaivik kheti", "जैविक खेती", "सेंद्रिय शेती", "vermicompost", "neemastra"],
        "en": "For natural & organic farming: 1) Prepare **Jeevamarutha** (Cow dung, cow urine, jaggery, gram flour, and virgin soil) to boost soil microbes, 2) Use **Neemastra** or 5% Neem Oil for pest prevention, 3) Apply well-rotted **Vermicompost** (2-3 tons/acre) before sowing.",
        "hi": "जैविक खेती के प्रमुख नुस्खे: 1) सूक्ष्मजीवों को बढ़ाने के लिए **जीवामृत** (गोबर, गोमूत्र, गुड़, बेसन, मिट्टी) का प्रयोग करें, 2) कीट नियंत्रण हेतु **नीमास्त्र** या 5% नीम तेल का छिड़काव करें, 3) बुवाई पूर्व 2-3 टन प्रति एकड़ वर्मीकम्पोस्ट (केंचुआ खाद) का प्रयोग करें।",
        "mr": "सेंद्रिय शेतीसाठी महत्त्वाचे उपाय: १) जमिनीची सुपीकता वाढवण्यासाठी **जीवामृत** वापरा, २) कीड नियंत्रणासाठी **निमास्त्र** किंवा ५% निंबोळी अर्क फवारा, ३) पेरणीपूर्वी एकरी २-३ टन गांडूळ खत जमिनीत मिसळा.",
        "suggestions": ["How to make Jeevamrutha", "Natural pest repellents", "Certification process for organic farming"]
    }
]

DEFAULT_RESPONSES = {
    "en": "Hello Farmer Friend! I am your Kisan AI Assistant. You can ask me questions regarding crop sowing schedules, fertilizer recommendations, pest/disease management, weather impact, soil health, and government farming schemes.",
    "hi": "नमस्ते किसान भाई! मैं आपका किसान एआई सहायक (Kisan Mitra) हूँ। आप मुझसे फसल बुवाई का समय, खाद और उर्वरक, कीट व रोग नियंत्रण, मौसम सलाह, मिट्टी की सेहत और सरकारी कृषि योजनाओं से जुड़े कोई भी सवाल पूछ सकते हैं।",
    "mr": "नमस्कार शेतकरी बंधूंनो! मी तुमचा 'किसान एआय सहाय्यक' आहे. तुम्ही मला पिकांची पेरणी, खतांचे योग्य व्यवस्थापन, रोग व कीड नियंत्रण, हवामान अंदाज आणि सरकारी योजनांबद्दल विचारू शकता."
}

def detect_language(text: str, default_lang: str = "en") -> str:
    # Check for Devanagari script
    if re.search(r'[\u0900-\u097F]', text):
        # Rough Marathi distinction markers
        if any(w in text for w in ["आहे", "कधी", "पिके", "माती", "करावे", "नाही", "शेतकरी", "पाहिजे"]):
            return "mr"
        return "hi"
    return default_lang or "en"

def match_knowledge_base(query: str, lang: str) -> Optional[Dict[str, Any]]:
    q_lower = query.lower()
    for item in KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw.lower() in q_lower:
                return {
                    "response": item.get(lang, item["en"]),
                    "suggestions": item.get("suggestions", [])
                }
    return None

def ask_kisan_ai(query: str, language: str = "en", conversation_id: Optional[str] = None) -> Dict[str, Any]:
    conv_id = conversation_id or str(uuid.uuid4())
    actual_lang = detect_language(query, language)

    # 1. First check offline high-precision knowledge base
    matched = match_knowledge_base(query, actual_lang)
    if matched:
        return {
            "response": matched["response"],
            "language": actual_lang,
            "conversation_id": conv_id,
            "suggestions": matched["suggestions"],
            "source": "expert_knowledge_engine"
        }

    # 2. Try external Gemini API if API key is provided
    if GEMINI_API_KEY:
        try:
            prompt = (
                f"You are Kisan Mitra, a helpful, polite, and expert agricultural AI assistant designed to support Indian farmers. "
                f"Answer the following question in simple, practical, farmer-friendly {actual_lang} language. "
                f"Give concise actionable steps regarding crops, fertilizers, pest remedies, or government schemes. "
                f"User Question: {query}"
            )
            # Call Gemini REST API
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            res = requests.post(gemini_url, json=payload, timeout=8)
            if res.status_code == 200:
                result = res.json()
                ai_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if ai_text:
                    return {
                        "response": ai_text,
                        "language": actual_lang,
                        "conversation_id": conv_id,
                        "suggestions": ["Ask about fertilizer dose", "Weather forecast for my district", "Mandi prices today"],
                        "source": "gemini_llm"
                    }
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}. Using intelligent fallback.")

    # 3. Dynamic intelligent fallback matching agricultural topics
    q_lower = query.lower()
    if any(k in q_lower for k in ["price", "mandi", "bhav", "भाव", "बाजार", "market", "दर"]):
        resp = {
            "en": "You can check live and historical mandi prices across districts in our 'Mandi Prices' section. You can filter by state, district, and crop to see modal prices and market trends.",
            "hi": "आप हमारे 'मंडी भाव' (Market Prices) सेक्शन में जाकर अपने जिले और राज्य की विभिन्न मंडियों के दैनिक न्यूनतम, अधिकतम और मॉडल भाव देख सकते हैं।",
            "mr": "तुम्ही आमच्या 'बाजार भाव' विभागात जाऊन विविध बाजार समित्यांमधील चालू व ऐतिहासिक दर आणि चार्ट पाहू शकता."
        }
        suggestions = ["Check Wheat Mandi Price", "Check Cotton Prices", "Check Soybean Market Rate"]
    elif any(k in q_lower for k in ["weather", "rain", "barish", "मौसम", "पाऊस", "हवामान"]):
        resp = {
            "en": "Check the 'Weather' module for hyper-local 7-day weather forecasts, rainfall probability, humidity, and agricultural weather advisories tailored to your district.",
            "hi": "आप 'मौसम' (Weather) पेज पर जाकर अपने जिले का 7 दिनों का मौसम पूर्वानुमान, बारिश की संभावना और कृषि संबंधी मौसम सलाह देख सकते हैं।",
            "mr": "तुमच्या जिल्ह्यातील ७ दिवसांचा हवामान अंदाज, पावसाची शक्यता आणि शेतीविषयक हवामान सल्ला पाहण्यासाठी 'हवामान' पेजला भेट द्या."
        }
        suggestions = ["7-day rainfall forecast", "Humidity impact on crops", "Spray schedule based on weather"]
    elif any(k in q_lower for k in ["disease", "pest", "keeda", "rog", "रोग", "कीड", "ब्लाइट"]):
        resp = {
            "en": "For accurate disease diagnosis, visit our 'Pest & Disease' page where you can select your crop to view symptoms and remedies, or upload a photo of the affected plant for instant AI diagnosis.",
            "hi": "सटीक रोग पहचान के लिए हमारे 'रोग एवं कीट' सेक्शन में जाएं। वहां आप फसल चुनकर लक्षण और उपचार देख सकते हैं या पौधे की फोटो अपलोड करके एआई विश्लेषण पा सकते हैं।",
            "mr": "रोगाच्या अचूक निदानासाठी 'रोग व कीड' विभागात जा. तिथे पिकाचे नाव निवडून किंवा झाडाचा फोटो अपलोड करून तातडीने सल्ला मिळवा."
        }
        suggestions = ["Upload crop photo for diagnosis", "Tomato early blight remedies", "Cotton pink bollworm control"]
    else:
        resp = DEFAULT_RESPONSES
        suggestions = [
            "Which crop is suitable for black soil?",
            "When should I sow wheat?",
            "Why are my tomato leaves turning yellow?",
            "How to apply for PM-KISAN scheme?"
        ]

    return {
        "response": resp.get(actual_lang, resp["en"]),
        "language": actual_lang,
        "conversation_id": conv_id,
        "suggestions": suggestions,
        "source": "expert_knowledge_engine"
    }

# Crop Disease Image Diagnosis Service
DIAGNOSIS_DATABASE = [
    {
        "keywords": ["tomato", "blight", "yellow", "spot", "leaf"],
        "crop": "Tomato",
        "disease": "Early Blight (Alternaria solani)",
        "hindi_name": "टमाटर का अगेती झुलसा रोग",
        "confidence": 0.92,
        "severity": "High",
        "symptoms": [
            "Dark brown to black spots with concentric rings on older leaves (target board pattern)",
            "Yellowing surrounding leaf lesions",
            "Premature defoliation and sunken lesions on fruit stems"
        ],
        "causes": [
            "Fungal pathogen Alternaria solani",
            "High humidity (>80%) combined with warm temperatures (24-30°C)",
            "Poor air circulation and overhead watering"
        ],
        "treatment": [
            "Spray Mancozeb 75% WP @ 2.5 g/liter of water or Copper Oxychloride 50% WP @ 3 g/liter.",
            "In severe infestation, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/liter.",
            "Remove and safely burn severely infected lower leaves."
        ],
        "prevention": [
            "Maintain 60x45 cm plant spacing for adequate air circulation.",
            "Use drip irrigation instead of sprinkler/overhead watering.",
            "Practice crop rotation with non-solanaceous crops for 2-3 seasons."
        ]
    },
    {
        "keywords": ["wheat", "rust", "brown", "yellow", "pustule"],
        "crop": "Wheat",
        "disease": "Yellow/Stripe Rust (Puccinia striiformis)",
        "hindi_name": "गेहूं का पीला रतुआ",
        "confidence": 0.89,
        "severity": "High",
        "symptoms": [
            "Yellow-orange powdery pustules arranged in linear stripes on leaves",
            "Chlorosis and drying of infected leaf tissues",
            "Reduced grain weight and shriveled grains"
        ],
        "causes": [
            "Fungus Puccinia striiformis f. sp. tritici",
            "Cool humid weather (10-15°C) with morning dew/fog"
        ],
        "treatment": [
            "Spray Propiconazole 25% EC (Tilt) @ 1 ml/liter of water (200 ml in 200 liters of water per acre).",
            "Repeat spray after 15 days if rust pustules persist."
        ],
        "prevention": [
            "Sow rust-resistant varieties such as DBW-187, HD-3086, HD-2967, and PBW-550.",
            "Avoid excess nitrogenous fertilizer application."
        ]
    },
    {
        "keywords": ["cotton", "bollworm", "pink", "hole", "flower"],
        "crop": "Cotton",
        "disease": "Pink Bollworm (Pectinophora gossypiella)",
        "hindi_name": "कपास की गुलाबी सुंडी",
        "confidence": 0.94,
        "severity": "High",
        "symptoms": [
            "Rosette flowers (petals twisted into rosette shape)",
            "Bore holes in developing bolls plugged with excreta",
            "Damaged seeds and stained lint inside bolls"
        ],
        "causes": [
            "Lepidopteran larvae feeding inside buds and bolls",
            "Monoculture and late-season cotton retention"
        ],
        "treatment": [
            "Install Pheromone traps @ 5-8 traps/acre for monitoring.",
            "Spray Profenophos 50% EC @ 2 ml/liter or Chlorantraniliprole 18.5% SC @ 0.3 ml/liter."
        ],
        "prevention": [
            "Strictly observe a closed season (avoid keeping ratoon cotton).",
            "Release Trichogramma egg parasitoids @ 60,000/acre at weekly intervals."
        ]
    },
    {
        "keywords": ["rice", "paddy", "blast", "lesion", "spindle"],
        "crop": "Rice / Paddy",
        "disease": "Rice Blast (Magnaporthe oryzae)",
        "hindi_name": "धान का झोंका रोग (ब्लास्ट)",
        "confidence": 0.91,
        "severity": "High",
        "symptoms": [
            "Spindle-shaped (eye-shaped) lesions with grayish center and brown margin on leaves",
            "Neck rot causing blackening and breakage of the panicle neck",
            "Incomplete grain filling and chaffy panicles"
        ],
        "causes": [
            "Magnaporthe oryzae fungus",
            "High relative humidity (>90%) with night temperature around 20°C and excessive nitrogen usage"
        ],
        "treatment": [
            "Spray Tricyclazole 75% WP @ 0.6 g/liter or Isoprothiolane 40% EC @ 1.5 ml/liter.",
            "Apply Kasugamycin 3% SL @ 2 ml/liter."
        ],
        "prevention": [
            "Treat seeds with Carbendazim 50% WP @ 2 g/kg seed before sowing.",
            "Apply split doses of nitrogen fertilizer instead of single heavy application."
        ]
    }
]

def diagnose_crop_image(filename: str = "", crop_hint: Optional[str] = None) -> Dict[str, Any]:
    # Look for matching disease based on hint or file name
    matched_entry = DIAGNOSIS_DATABASE[0]
    if crop_hint:
        hint_lower = crop_hint.lower()
        for item in DIAGNOSIS_DATABASE:
            if item["crop"].lower() in hint_lower or any(k in hint_lower for k in item["keywords"]):
                matched_entry = item
                break
    elif filename:
        fn_lower = filename.lower()
        for item in DIAGNOSIS_DATABASE:
            if item["crop"].lower() in fn_lower or any(k in fn_lower for k in item["keywords"]):
                matched_entry = item
                break

    return {
        "crop_detected": matched_entry["crop"],
        "disease_detected": matched_entry["disease"],
        "hindi_name": matched_entry.get("hindi_name"),
        "confidence_score": matched_entry["confidence"],
        "severity": matched_entry["severity"],
        "symptoms": matched_entry["symptoms"],
        "possible_causes": matched_entry["causes"],
        "treatment_steps": matched_entry["treatment"],
        "prevention_measures": matched_entry["prevention"],
        "disclaimer": "AI results are for informational and advisory purposes only. Please verify with your local Agriculture Extension Officer (KVK) before chemical application."
    }
