import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sprout,
  ArrowLeft,
  Calendar,
  Layers,
  Thermometer,
  CloudRain,
  ShieldAlert,
  Bug,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { cropService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export const CropDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cropService.getCropById(id)
      .then((res) => setCrop(res.data))
      .catch((err) => {
        console.error("Failed to load crop details:", err);
        setError(language === 'hi' ? "फसल विवरण लोड करने में असमर्थ। कृपया पुनः प्रयास करें।" : language === 'mr' ? "पीक तपशील लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा." : "Unable to load crop details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id, language]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorMessage message={error || (language === 'hi' ? "फसल नहीं मिली" : language === 'mr' ? "पीक सापडले नाही" : "Crop not found")} />
        <div className="text-center mt-4">
          <Link to="/crops" className="text-forest-700 font-bold underline">
            {language === 'hi' ? "← फसल सूची पर वापस जाएं" : language === 'mr' ? "← पीक यादीवर परत जा" : "← Return to Crops Catalog"}
          </Link>
        </div>
      </div>
    );
  }

  const cropDisplayName = language === 'hi' && crop.hindi_name ? crop.hindi_name : language === 'mr' && crop.marathi_name ? crop.marathi_name : crop.name;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation */}
      <div>
        <Link
          to="/crops"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-forest-700"
        >
          <ArrowLeft className="w-4 h-4" /> {language === 'hi' ? "फसल सूची पर वापस जाएं" : language === 'mr' ? "पीक यादीवर परत जा" : "Back to Crop Catalog"}
        </Link>
      </div>

      {/* Hero Banner with Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-forest-950 text-white min-h-[280px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src={crop.image_url || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"}
          alt={cropDisplayName}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 space-y-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-forest-600 text-white text-xs font-bold">
              {crop.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
              {crop.season} {language === 'hi' ? "ऋतु / सीजन" : language === 'mr' ? "हंगाम" : "Season"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">{cropDisplayName}</h1>
          {(crop.hindi_name || crop.marathi_name) && (
            <p className="text-forest-200 text-sm font-medium">
              {crop.name} {crop.hindi_name && language !== 'hi' ? `• Hindi: ${crop.hindi_name}` : ''} {crop.marathi_name && language !== 'mr' ? `• Marathi: ${crop.marathi_name}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Quick Agronomy Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-soft">
          <Calendar className="w-5 h-5 text-forest-700 mb-2" />
          <span className="text-xs font-bold text-gray-700 block">
            {language === 'hi' ? "बुवाई समय" : language === 'mr' ? "पेरणी कालावधी" : "Sowing Timeline"}
          </span>
          <span className="text-sm font-black text-gray-950">{crop.sowing_period}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-soft">
          <Calendar className="w-5 h-5 text-amber-700 mb-2" />
          <span className="text-xs font-bold text-gray-700 block">
            {language === 'hi' ? "कटाई समय" : language === 'mr' ? "काढणी कालावधी" : "Harvest Timeline"}
          </span>
          <span className="text-sm font-black text-gray-950">{crop.harvest_period}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-soft">
          <Thermometer className="w-5 h-5 text-red-600 mb-2" />
          <span className="text-xs font-bold text-gray-700 block">
            {language === 'hi' ? "आदर्श तापमान" : language === 'mr' ? "योग्य तापमान" : "Ideal Temperature"}
          </span>
          <span className="text-sm font-black text-gray-950">
            {crop.temp_min || 15}°C - {crop.temp_max || 32}°C
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-soft">
          <CloudRain className="w-5 h-5 text-blue-600 mb-2" />
          <span className="text-xs font-bold text-gray-700 block">
            {language === 'hi' ? "आवश्यक वर्षा" : language === 'mr' ? "आवश्यक पाऊस" : "Rainfall Needed"}
          </span>
          <span className="text-sm font-black text-gray-950">
            {crop.rainfall_min || 400} - {crop.rainfall_max || 800} mm
          </span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Soil, Fertilizer, Farming Practices (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Soil Requirements */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-forest-800 font-bold text-lg">
              <Layers className="w-5 h-5 text-forest-600" />
              <h3>{language === 'hi' ? "मिट्टी एवं खेत की तैयारी" : language === 'mr' ? "जमीन व मशागत" : "Soil & Land Preparation"}</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {crop.soil_type}
            </p>
          </div>

          {/* Fertilizer & Nutrient Schedule */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-forest-800 font-bold text-lg">
              <Sprout className="w-5 h-5 text-forest-600" />
              <h3>{language === 'hi' ? "उर्वरक एवं एनपीके मात्रा (खाद प्रबंधन)" : language === 'mr' ? "खत व्यवस्थापन व NPK प्रमाण" : "Fertilizer & NPK Dosage"}</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {crop.fertilizer_info || (language === 'hi' ? "राज्य कृषि विश्वविद्यालय की सिफारिश के अनुसार संतुलित NPK डालें।" : language === 'mr' ? "कृषी विद्यापीठाच्या शिफारशीनुसार संतुलित खते वापरा." : "Apply balanced NPK as recommended by your state Agricultural University.")}
            </p>
          </div>

          {/* Agronomic Farming Practices */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-forest-800 font-bold text-lg">
              <CheckCircle2 className="w-5 h-5 text-forest-600" />
              <h3>{language === 'hi' ? "सर्वोत्तम कृषि क्रियाएं व पौधों की दूरी" : language === 'mr' ? "उत्तम कृषी पद्धती व अंतर" : "Best Agronomic Practices & Spacing"}</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {crop.farming_practices || (language === 'hi' ? "स्वच्छ खेत, बीजोपचार और खरपतवार नियंत्रण का ध्यान रखें।" : language === 'mr' ? "स्वच्छ मशागत, बीजप्रक्रिया आणि योग्य तण नियंत्रण ठेवा." : "Maintain clean seedbed preparation, treated certified seeds, and proper inter-row weed management.")}
            </p>
          </div>
        </div>

        {/* Right Column: Diseases & Pest Alerts + AI Assistant (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Diseases & Pests Card */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h4>{language === 'hi' ? "मुख्य फसल रोग" : language === 'mr' ? "प्रमुख पीक रोग" : "Common Diseases"}</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {crop.common_diseases || (language === 'hi' ? "गेरुआ (Rust), झुलसा (Blight) और पत्ती धब्बा।" : language === 'mr' ? "तांबेरा, करपा आणि पानांवरील ठिपके." : "Rusts, Blights, and Leaf Spots.")}
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-red-800 font-bold text-base">
              <Bug className="w-5 h-5 text-red-600" />
              <h4>{language === 'hi' ? "प्रमुख कीट व पतंगे" : language === 'mr' ? "प्रमुख कीटक व कीड" : "Major Insect Pests"}</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {crop.common_pests || (language === 'hi' ? "तना छेदक, माहू (चेपा), और थ्रिप्स।" : language === 'mr' ? "खोडकीड, मावा, आणि तुडतुडे." : "Borer, Aphids, and Thrips.")}
            </p>

            <Link
              to="/diseases"
              className="mt-2 block w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold text-center transition"
            >
              {language === 'hi' ? "रोग व कीट उपचार देखें →" : language === 'mr' ? "रोग व कीड उपाय पहा →" : "Explore Disease Remedies →"}
            </Link>
          </div>

          {/* Ask AI Chatbot Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-forest-800 to-forest-700 text-white shadow-card space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Bot className="w-4 h-4" />
              <span>{language === 'hi' ? `${cropDisplayName} के बारे में प्रश्न है?` : language === 'mr' ? `${cropDisplayName} बद्दल काही प्रश्न आहे?` : `Have a question on ${crop.name}?`}</span>
            </div>
            <p className="text-xs text-forest-100 leading-relaxed">
              {language === 'hi' ? "खाद की सही मात्रा, बीजोपचार या जैविक कीटनाशक के लिए किसान एआई से तुरंत सलाह लें।" : language === 'mr' ? "खतांचे योग्य प्रमाण, बीजप्रक्रिया किंवा जैविक औषधांसाठी किसान AI कडून त्वरित सल्ला घ्या." : "Ask Kisan AI Assistant for real-time dosage calculations, seed treatment, or organic remedies."}
            </p>
            <Link
              to="/ai-assistant"
              className="block w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-forest-950 rounded-xl text-xs font-bold text-center transition shadow-md"
            >
              {language === 'hi' ? `किसान एआई से ${cropDisplayName} पर पूछें` : language === 'mr' ? `किसान AI ला ${cropDisplayName} बद्दल विचारा` : `Ask Kisan AI about ${crop.name}`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailPage;
