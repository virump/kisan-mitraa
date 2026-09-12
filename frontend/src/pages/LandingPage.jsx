import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Award,
  Bot,
  Layers,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Activity,
  MapPin,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { weatherService, marketService, newsService } from '../services/api';

export const LandingPage = () => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // Load snapshot for landing hero widgets
    weatherService.getWeather({ district: 'Pune' })
      .then((res) => setWeatherData(res.data))
      .catch(() => {});

    marketService.getPrices({ limit: 4 })
      .then((res) => setMandiPrices(res.data))
      .catch(() => {});

    newsService.getNews({ limit: 3 })
      .then((res) => setNewsList(res.data))
      .catch(() => {});
  }, []);

  const features = [
    {
      title: "Weather Intelligence",
      description: "Hyper-local 7-day temperature, rainfall probability, humidity alerts, and crop spray advisory.",
      icon: CloudSun,
      link: "/weather",
      tag: "Live & Hourly",
      bg: "from-blue-500/10 to-emerald-500/10",
      border: "border-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Crop Encyclopedia",
      description: "Over 50+ detailed crop protocols covering sowing, NPK fertilizer dosing, season, and irrigation.",
      icon: Sprout,
      link: "/crops",
      tag: "5 Major Categories",
      bg: "from-emerald-500/10 to-green-500/10",
      border: "border-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "AI Disease Diagnosis",
      description: "Instant photographic and symptom-based diagnosis of crop diseases, pests, and certified remedies.",
      icon: ShieldAlert,
      link: "/diseases",
      tag: "AI Powered",
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Mandi Price Tracker",
      description: "Daily APMC mandi commodity rates, minimum/maximum/modal prices, and 15-day price history graphs.",
      icon: TrendingUp,
      link: "/market-prices",
      tag: "State-wise",
      bg: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Government Schemes",
      description: "Direct verified eligibility, financial benefits, and application guidelines for PM-KISAN, PMFBY, and KCC.",
      icon: Award,
      link: "/schemes",
      tag: "Official Portals",
      bg: "from-teal-500/10 to-cyan-500/10",
      border: "border-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 gradient-green-hero text-white rounded-b-3xl sm:rounded-b-[40px] shadow-2xl">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Next-Gen Agricultural Intelligence Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Smart Farming Starts With{" "}
                <span className="text-amber-400 drop-shadow-sm">
                  Better Information
                </span>
              </h1>

              <p className="text-emerald-100 text-base sm:text-lg sm:leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Get weather, crop, market and farming information in one place. Empowering farmers with hyper-local forecasts, daily mandi prices, crop disease diagnosis, and multilingual AI advisory.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/crops"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition duration-200 shadow-xl shadow-black/30 flex items-center justify-center gap-2 group text-base"
                >
                  <span>Explore Farming Tools</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/ai-assistant"
                  className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black rounded-2xl transition duration-200 shadow-xl shadow-black/20 flex items-center justify-center gap-2 text-base"
                >
                  <Bot className="w-5 h-5 text-gray-950" />
                  <span>Ask Kisan AI</span>
                </Link>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/80 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                  <div className="text-xs text-emerald-100 font-bold">Free for Farmers</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">3 Langs</div>
                  <div className="text-xs text-emerald-100 font-bold">EN | HI | MR</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">24x7</div>
                  <div className="text-xs text-emerald-100 font-bold">AI Agri Assistance</div>
                </div>
              </div>
            </div>

            {/* Right Hero Live Snapshot Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Live Weather Card */}
              {weatherData && (
                <div className="p-6 rounded-3xl glass-dark-card text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <MapPin className="w-4 h-4" />
                      <span>{weatherData.location}</span>
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-forest-950 text-xs font-black">
                      Live Weather
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <div className="text-5xl font-black text-white">{weatherData.temperature}°C</div>
                      <div className="text-sm text-emerald-200 font-bold mt-0.5">{weatherData.condition}</div>
                    </div>
                    <CloudSun className="w-14 h-14 text-amber-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center text-xs">
                    <div className="p-2 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-emerald-200 block text-[11px] font-medium">Humidity</span>
                      <span className="font-black text-sm text-white">{weatherData.humidity}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-emerald-200 block text-[11px] font-medium">Rain Chance</span>
                      <span className="font-black text-sm text-amber-300">{weatherData.rain_probability}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-emerald-200 block text-[11px] font-medium">Wind</span>
                      <span className="font-black text-sm text-white">{weatherData.wind_speed} km/h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mandi Ticker Preview */}
              <div className="p-6 rounded-3xl glass-dark-card text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Today's Mandi Snapshot</span>
                  </div>
                  <Link to="/market-prices" className="text-xs font-bold text-emerald-300 hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-2">
                  {mandiPrices.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white text-sm block">{item.crop_name}</span>
                        <span className="text-xs text-emerald-200 font-medium">{item.market_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-base text-amber-400">₹{item.modal_price}</span>
                        <span className="text-[10px] text-emerald-200 block font-medium">/ Quintal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-forest-800 bg-forest-100 px-3.5 py-1 rounded-full border border-forest-300">
            Comprehensive Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
            Everything A Progressive Farmer Needs
          </h2>
          <p className="text-gray-700 font-medium text-sm sm:text-base">
            From climate-smart weather advisories to instant pathology diagnostics and direct market price intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComp = feat.icon;
            return (
              <Link
                key={feat.title}
                to={feat.link}
                className={`group p-6 rounded-3xl bg-white border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.bg} flex items-center justify-center ${feat.iconColor}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest-800 transition">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 font-normal leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-forest-700 group-hover:text-forest-900">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Kisan AI Assistant Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-green-hero text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Multilingual 24/7 Digital Agri Expert</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Got A Farming Problem? Ask Kisan AI Assistant!
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Ask in English, हिन्दी, or मराठी. Get immediate solutions for leaf yellowing, pest treatments, crop sowing dates, fertilizer dosage calculations, and government scheme eligibility.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/ai-assistant"
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black rounded-xl transition shadow-lg flex items-center gap-2 text-sm"
                >
                  <Bot className="w-4 h-4 text-gray-950" />
                  <span>Start Chat with Kisan AI</span>
                </Link>
                <Link
                  to="/diseases"
                  className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold rounded-xl transition text-sm"
                >
                  Upload Plant Photo
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-black/50 p-5 rounded-2xl border border-emerald-400/30 space-y-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                Sample Questions You Can Ask
              </span>
              <div className="space-y-2 text-xs text-white font-medium">
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                  "Which crop is suitable for black soil?"
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                  "गेहूं की बुवाई का सही समय और बीज दर क्या है?"
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                  "टोमॅटोची पाने पिवळी पडत आहेत, काय उपाय करावा?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Agricultural Bulletins Section */}
      {newsList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Latest Agricultural Bulletins
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Verified announcements from Ministry of Agriculture, IMD, and ICAR.
              </p>
            </div>
            <Link
              to="/news"
              className="text-sm font-bold text-forest-600 hover:text-forest-800 flex items-center gap-1"
            >
              <span>View All Bulletins</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-700 font-bold">
                      {item.category}
                    </span>
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 font-medium">
                  Source: {item.source}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
