from typing import Dict, Any, List

def calculate_soil_recommendations(
    soil_type: str,
    ph_level: float = 7.0,
    crop_name: str = "",
    irrigation_type: str = "Drip"
) -> Dict[str, Any]:
    # 1. pH Evaluation
    if ph_level < 6.0:
        ph_eval = f"Acidic (pH {ph_level:.1f}). Soil acidity can restrict phosphorus and calcium uptake. Application of agricultural lime (Calcium Carbonate @ 2-3 tons/ha) is strongly advised before planting."
    elif ph_level > 8.0:
        ph_eval = f"Alkaline / Calcareous (pH {ph_level:.1f}). Micronutrient availability (Iron, Zinc, Manganese) is reduced. Apply agricultural gypsum (1.5-2 tons/ha) and incorporate organic green manure."
    else:
        ph_eval = f"Optimal Neutral Range (pH {ph_level:.1f}). Excellent condition for major nutrient availability and microbial biodiversity."

    # 2. Crop Suitability
    crop_eval = ""
    s_lower = soil_type.lower()
    c_lower = (crop_name or "").lower()

    if "black" in s_lower:
        crop_eval = "Black soil has exceptional water holding capacity. Highly suitable for Cotton, Soybean, Wheat, Gram, and Sugarcane. Ensure drainage furrows during heavy monsoon."
    elif "alluvial" in s_lower:
        crop_eval = "Alluvial soil is fertile and loamy. Superbly suited for Wheat, Rice, Sugarcane, Maize, Vegetables, and Oilseeds."
    elif "red" in s_lower:
        crop_eval = "Red soil has high iron content and good porous drainage. Suitable for Groundnut, Pulses, Millets (Ragi, Bajra), Tobacco, and Fruit orchards."
    elif "laterite" in s_lower:
        crop_eval = "Laterite soil is rich in iron and aluminum. Excellent for Plantation crops like Cashew, Tea, Coffee, Rubber, and Coconut."
    elif "sandy" in s_lower:
        crop_eval = "Sandy / Desert soil has quick drainage and low water retention. Suitable for Bajra, Guar, Watermelon, Muskmelon, and Mustard with drip irrigation."
    else:
        crop_eval = "Medium Loamy soil supports a wide array of cereals, vegetables, pulses, and horticulture crops."

    # 3. Fertilizer Recommendations
    fertilizers = []
    if ph_level < 6.5:
        fertilizers.append("Single Super Phosphate (SSP) - 50 kg/acre (supplies P, Sulfur, and Calcium)")
        fertilizers.append("Dolomite / Agricultural Lime - 150 kg/acre to neutralize acidity")
    elif ph_level > 7.8:
        fertilizers.append("Di-Ammonium Phosphate (DAP) or Urea with coated Sulfur")
        fertilizers.append("Chelated Zinc (Zn-EDTA 12%) @ 500g/acre foliar spray")
        fertilizers.append("Ferrous Sulphate @ 10 kg/acre soil application")
    else:
        fertilizers.append("Balanced NPK 19:19:19 @ 5 kg/acre through fertigation")
        fertilizers.append("Urea (in 2-3 split doses according to crop stages)")
        fertilizers.append("Muriate of Potash (MOP) @ 25 kg/acre at base preparation")

    fertilizers.append("Well-decomposed Farm Yard Manure (FYM) or Vermicompost @ 2.5 tons/acre")
    fertilizers.append("Bio-fertilizers: Azotobacter/Rhizobium + PSB (Phosphate Solubilizing Bacteria) @ 2 kg/acre")

    # 4. Irrigation Advice
    if irrigation_type.lower() == "drip":
        irrigation_advice = "Drip irrigation provides 90%+ water efficiency and allows precise fertigation. Run drip for 1.5 - 2.5 hours every alternate day based on soil moisture probe."
    elif irrigation_type.lower() == "sprinkler":
        irrigation_advice = "Sprinkler irrigation is suitable for undulating fields and close-growing crops like wheat and pulses. Operate in early morning to minimize evaporation loss."
    elif irrigation_type.lower() == "flood":
        irrigation_advice = "Flood / Furrow irrigation. Adopt alternate furrow irrigation to save 30% water and prevent soil crusting and root asphyxiation."
    else:
        irrigation_advice = "Rainfed farming. Adopt in-situ moisture conservation such as broad-bed furrow (BBF) systems and organic straw mulching."

    # 5. Soil Health Tips
    tips = [
        "Incorporate green manure crops like Dhaincha (Sesbania) or Sunnhemp every 2-3 years.",
        "Apply neem-coated urea to enhance nitrogen use efficiency by 15-20%.",
        "Perform a comprehensive Soil Health Card test every 2 years before Kharif sowing.",
        "Use organic mulching (crop residue or plastic mulch) to conserve topsoil moisture and suppress weeds."
    ]

    return {
        "soil_type": soil_type,
        "ph_evaluation": ph_eval,
        "crop_suitability": crop_eval,
        "recommended_fertilizers": fertilizers,
        "irrigation_advice": irrigation_advice,
        "soil_health_tips": tips
    }
