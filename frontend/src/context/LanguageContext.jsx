import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appTitle: "Kisan Mitra",
    tagline: "Smart Farming Starts With Better Information",
    heroSubtitle: "Get hyper-local weather, searchable crop guides, daily mandi market rates, disease diagnosis, and farming schemes in one single place.",
    exploreTools: "Explore Farming Tools",
    askAI: "Ask Kisan AI",
    navHome: "Home",
    navDashboard: "Dashboard",
    navWeather: "Weather",
    navCrops: "Crops",
    navDiseases: "Pest & Disease",
    navMarket: "Mandi Prices",
    navSoil: "Soil Health",
    navNews: "Agri News",
    navSchemes: "Govt Schemes",
    navAIAssistant: "Kisan AI",
    navAdmin: "Admin Panel",
    navLogin: "Login",
    navRegister: "Register",
    navProfile: "My Profile",
    navLogout: "Logout",
    welcome: "Welcome",
    quickAccess: "Quick Access",
    weatherForecast: "Weather Forecast",
    marketRates: "Today's Mandi Rates",
    cropAlerts: "Crop Advisories",
    recentNews: "Recent Agriculture News",
    search: "Search",
    filter: "Filter",
    all: "All",
    viewDetails: "View Details",
    loading: "Loading information...",
    retry: "Try Again",
    noData: "No data available at the moment.",
    disclaimer: "AI & market results are for informational purposes. Verify with local agriculture experts before chemical applications.",
  },
  hi: {
    appTitle: "किसान मित्र",
    tagline: "स्मार्ट खेती, बेहतर जानकारी के साथ",
    heroSubtitle: "मौसम पूर्वानुमान, फसलों की संपूर्ण जानकारी, दैनिक मंडी भाव, कीट-रोग पहचान और सरकारी योजनाएं एक ही स्थान पर प्राप्त करें।",
    exploreTools: "कृषि सेवाएं देखें",
    askAI: "किसान एआई से पूछें",
    navHome: "होम",
    navDashboard: "डैशबोर्ड",
    navWeather: "मौसम",
    navCrops: "फसलें",
    navDiseases: "रोग व कीट",
    navMarket: "मंडी भाव",
    navSoil: "मिट्टी की सेहत",
    navNews: "कृषि समाचार",
    navSchemes: "सरकारी योजनाएं",
    navAIAssistant: "किसान एआई",
    navAdmin: "एडमिन पैनल",
    navLogin: "लॉगिन",
    navRegister: "पंजीकरण",
    navProfile: "मेरी प्रोफाइल",
    navLogout: "लॉगआउट",
    welcome: "स्वागत है",
    quickAccess: "त्वरित सेवाएं",
    weatherForecast: "मौसम पूर्वानुमान",
    marketRates: "आज के मंडी भाव",
    cropAlerts: "फसल परामर्श",
    recentNews: "ताज़ा कृषि समाचार",
    search: "खोजें",
    filter: "फ़िल्टर",
    all: "सभी",
    viewDetails: "विवरण देखें",
    loading: "जानकारी लोड हो रही है...",
    retry: "पुनः प्रयास करें",
    noData: "फिलहाल कोई डेटा उपलब्ध नहीं है।",
    disclaimer: "एआई और मंडी परिणाम केवल सूचनात्मक उद्देश्य के लिए हैं। रासायनिक छिड़काव से पहले कृषि विशेषज्ञों से सलाह लें।",
  },
  mr: {
    appTitle: "किसान मित्र",
    tagline: "स्मार्ट शेती, अचूक माहितीच्या बळावर",
    heroSubtitle: "हवामान अंदाज, पिकांची सविस्तर माहिती, दैनंदिन बाजार भाव, रोग-कीड निदान आणि शासकीय योजना आता एकाच ठिकाणी मिळवा.",
    exploreTools: "शेती साधने एक्सप्लोर करा",
    askAI: "किसान AI ला विचारा",
    navHome: "मुख्यपृष्ठ",
    navDashboard: "डॅशबोर्ड",
    navWeather: "हवामान",
    navCrops: "पिके",
    navDiseases: "रोग व कीड",
    navMarket: "बाजार भाव",
    navSoil: "माती परीक्षण",
    navNews: "कृषी बातम्या",
    navSchemes: "शासकीय योजना",
    navAIAssistant: "किसान AI",
    navAdmin: "प्रशासन",
    navLogin: "लॉगिन",
    navRegister: "नोंदणी",
    navProfile: "माझे प्रोफाईल",
    navLogout: "लॉगआउट",
    welcome: "स्वागत आहे",
    quickAccess: "द्रुत सेवा",
    weatherForecast: "हवामान अंदाज",
    marketRates: "आजचे बाजार भाव",
    cropAlerts: "पीक सल्ला",
    recentNews: "ताज्या कृषी घडामोडी",
    search: "शोधा",
    filter: "फिल्टर",
    all: "सर्व",
    viewDetails: "तपशील पहा",
    loading: "माहिती लोड होत आहे...",
    retry: "पुन्हा प्रयत्न करा",
    noData: "सध्या कोणतीही माहिती उपलब्ध नाही.",
    disclaimer: "AI आणि बाजार भाव केवळ मार्गदर्शनासाठी आहेत. औषध फवारणीपूर्वी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisan_lang') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisan_lang', lang);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
