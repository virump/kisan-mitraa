import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-forest-950 text-forest-100 pt-16 pb-24 lg:pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                Kisan<span className="text-forest-400">Mitra</span>
              </span>
            </div>
            <p className="text-forest-200 text-sm leading-relaxed max-w-sm">
              {language === 'hi'
                ? "भारतीय किसानों के लिए एक उन्नत डिजिटल मंच — मौसम पूर्वानुमान, मंडी भाव, फसल रोग निदान और सरकारी योजनाओं की सटीक जानकारी।"
                : language === 'mr'
                ? "भारतीय शेतकऱ्यांसाठी एक प्रगत डिजिटल व्यासपीठ — थेट हवामान अंदाज, बाजार भाव, पीक रोग निदान आणि शासकीय योजनांची अचूक माहिती."
                : "An intelligent, responsive digital companion for Indian agriculture, delivering real-time weather analytics, market mandis, crop pathology advisory, and welfare schemes."}
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? "राष्ट्रीय कृषि ओपन डेटा अनुरूप" : language === 'mr' ? "राष्ट्रीय कृषी ओपन डेटा सुसंगत" : "Certified National Agriculture Open Data Compliant"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">{t.farmingTools || "Farming Tools"}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/weather" className="hover:text-white transition">{t.navWeather || "Weather Forecast"}</Link>
              </li>
              <li>
                <Link to="/crops" className="hover:text-white transition">{t.navCrops || "Crop Database"}</Link>
              </li>
              <li>
                <Link to="/diseases" className="hover:text-white transition">{t.navDiseases || "Disease Diagnosis"}</Link>
              </li>
              <li>
                <Link to="/market-prices" className="hover:text-white transition">{t.navMarket || "Mandi Price Ticker"}</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">{t.resources || "Resources"}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/schemes" className="hover:text-white transition">{t.navSchemes || "Govt Welfare Schemes"}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition">{t.navNews || "Agriculture Bulletins"}</Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-white transition">{t.navAIAssistant || "Kisan AI Chatbot"}</Link>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white transition">
                  PM-KISAN Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white transition">
                  e-NAM Mandis <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">{t.farmerHelplines || "Farmer Helplines"}</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
                <span className="text-xs text-amber-400 block font-semibold">{t.tollFreeLabel || "Toll-Free Kisan Call Center"}</span>
                <span className="text-white font-bold text-base">{t.tollFreeNumber || "1800-180-1551"}</span>
              </div>
              <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
                <span className="text-xs text-amber-400 block font-semibold">{t.supportDesk || "Kisan Mitra Support Desk"}</span>
                <span className="text-white text-xs">support@kisanmitra.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-400 gap-4">
          <p>© {new Date().getFullYear()} {t.copyright || "Kisan Mitra Smart Farmer Platform. Built for Indian Farmers."}</p>
          <div className="flex items-center gap-1">
            <span>{language === 'hi' ? "कृषि और तकनीक का सशक्त संगम" : language === 'mr' ? "कृषी व तंत्रज्ञानाचा संगम" : "Empowering agriculture with"}</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>{language === 'hi' ? "" : language === 'mr' ? "" : "and Technology"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
