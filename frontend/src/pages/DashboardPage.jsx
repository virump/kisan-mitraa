import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Award,
  Bot,
  Layers,
  ShieldAlert,
  MapPin,
  Bell,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { weatherService, marketService, newsService, cropService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [mainCropInfo, setMainCropInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    const userDistrict = user?.district || 'Pune';

    try {
      const [wRes, mRes, nRes, cRes] = await Promise.all([
        weatherService.getWeather({ district: userDistrict }),
        marketService.getPrices({ district: userDistrict, limit: 6 }),
        newsService.getNews({ limit: 4 }),
        cropService.getCrops({ search: user?.main_crop || 'Wheat', limit: 1 }),
      ]);

      setWeather(wRes.data);
      setMandiPrices(mRes.data);
      setRecentNews(nRes.data);
      if (cRes.data && cRes.data.length > 0) {
        setMainCropInfo(cRes.data[0]);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Unable to load full dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const quickTools = [
    { name: "Live Weather", icon: CloudSun, link: "/weather", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" },
    { name: "Crop Guide", icon: Sprout, link: "/crops", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200" },
    { name: "Disease Diagnosis", icon: ShieldAlert, link: "/diseases", color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200" },
    { name: "Mandi Prices", icon: TrendingUp, link: "/market-prices", color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200" },
    { name: "Govt Schemes", icon: Award, link: "/schemes", color: "bg-teal-50 text-teal-600 hover:bg-teal-100 border-teal-200" },
    { name: "Kisan AI", icon: Bot, link: "/ai-assistant", color: "bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-md" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>{user?.district || 'Pune'}, {user?.state || 'Maharashtra'} {user?.village ? `• ${user.village}` : ''}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Namaste, {user?.full_name || 'Farmer Friend'}! 🙏
          </h1>
          <p className="text-forest-100 text-sm max-w-xl">
            Here is your daily personalized farm advisory, live weather bulletin, and mandi rates for {user?.main_crop || 'your crops'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-assistant"
            className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-forest-950 font-bold rounded-2xl transition shadow-md flex items-center gap-2 text-sm"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Kisan AI</span>
          </Link>
          <button
            onClick={loadDashboardData}
            title="Refresh Dashboard"
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition border border-white/15"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadDashboardData} />}

      {/* Weather Advisory & Active Alert */}
      {weather?.agricultural_alert && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-amber-950">Active Agricultural Advisory for {weather.district}</h4>
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">{weather.agricultural_alert}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Weather + Today's Mandi Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather Card (5 Cols) */}
        {weather && (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-gray-200 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-950 text-base">Weather in {weather.district}</h3>
                    <span className="text-xs font-bold text-gray-700">{weather.state}</span>
                  </div>
                </div>
                <Link to="/weather" className="text-xs font-black text-forest-700 hover:underline">
                  7-Day Forecast →
                </Link>
              </div>

              <div className="flex items-center justify-between my-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div>
                  <div className="text-4xl font-black text-gray-950">{weather.temperature}°C</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">{weather.condition}</div>
                  <div className="text-xs font-semibold text-gray-700">Feels like {weather.feels_like}°C</div>
                </div>
                <div className="text-right space-y-1 text-xs font-semibold text-gray-800">
                  <div>Humidity: <span className="font-black text-gray-950">{weather.humidity}%</span></div>
                  <div>Rain Prob: <span className="font-black text-blue-700">{weather.rain_probability}%</span></div>
                  <div>Wind: <span className="font-black text-gray-950">{weather.wind_speed} km/h</span></div>
                </div>
              </div>

              {/* 3-day quick outlook */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {weather.forecast.slice(0, 3).map((f) => (
                  <div key={f.date} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-black text-gray-950 block">{f.day_name}</span>
                    <span className="text-xs font-black text-gray-950 my-1 block">{f.temp_max}° / {f.temp_min}°</span>
                    <span className="text-xs text-blue-700 font-bold">{f.rain_probability}% Rain</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/weather"
              className="mt-4 pt-3 border-t border-gray-200 text-xs font-black text-forest-800 flex items-center justify-between hover:text-forest-950"
            >
              <span>View Hourly Forecast & Spray Guidance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Mandi Prices Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-gray-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-gray-950 text-base">Today's Mandi / Market Prices</h3>
                  <span className="text-xs font-bold text-gray-700">APMC Live Rates (₹ per Quintal)</span>
                </div>
              </div>
              <Link to="/market-prices" className="text-xs font-black text-forest-700 hover:underline">
                Explore All Mandis →
              </Link>
            </div>

            {mandiPrices.length === 0 ? (
              <div className="text-center py-8 text-gray-700 text-sm font-semibold">
                No active mandi records found for {user?.district}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mandiPrices.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200 hover:border-forest-400 transition flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-black text-gray-950 text-sm">{item.crop_name}</h4>
                      <span className="text-xs font-bold text-gray-800 block truncate max-w-[140px]">{item.market_name}</span>
                      <span className="text-xs text-forest-800 font-bold">{item.variety}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-forest-900">₹{item.modal_price}</div>
                      <div className="text-xs font-semibold text-gray-700">Min: ₹{item.min_price} | Max: ₹{item.max_price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/market-prices"
            className="mt-4 pt-3 border-t border-gray-200 text-xs font-black text-forest-800 flex items-center justify-between hover:text-forest-950"
          >
            <span>View Historical Price Trends & Interactive Charts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Access Action Bar */}
      <div>
        <h3 className="text-lg font-black text-gray-950 mb-4">{t.quickAccess}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                to={tool.link}
                className={`p-4 rounded-2xl border-2 transition duration-150 flex flex-col items-center justify-center text-center gap-2 font-black text-xs ${tool.color}`}
              >
                <Icon className="w-6 h-6" />
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Crop Advisory & News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Crop Protocol Guide */}
        {mainCropInfo && (
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-gray-950 text-base">My Crop: {mainCropInfo.name}</h3>
                  <span className="text-xs font-bold text-gray-700">{mainCropInfo.category} • {mainCropInfo.season} Season</span>
                </div>
              </div>
              <Link to={`/crops/${mainCropInfo.id}`} className="text-xs font-black text-forest-700 hover:underline">
                Full Guide →
              </Link>
            </div>

            <div className="space-y-2 text-xs text-gray-900 font-medium">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-gray-950 block mb-0.5">Sowing & Harvest Time:</span>
                <span>{mainCropInfo.sowing_period} (Sowing) → {mainCropInfo.harvest_period} (Harvest)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-gray-950 block mb-0.5">Fertilizer Guidance:</span>
                <span className="line-clamp-2">{mainCropInfo.fertilizer_info}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-black text-gray-950 block mb-0.5">Common Diseases:</span>
                <span className="line-clamp-2">{mainCropInfo.common_diseases}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Agriculture Bulletins */}
        <div className={`p-6 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4 ${mainCropInfo ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-black text-gray-950 text-base">Agricultural Bulletins</h3>
            </div>
            <Link to="/news" className="text-xs font-black text-forest-700 hover:underline">
              All Bulletins →
            </Link>
          </div>

          <div className="space-y-3">
            {recentNews.slice(0, 3).map((n) => (
              <div key={n.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-forest-800">{n.category}</span>
                  <span className="text-gray-700 font-bold">{new Date(n.published_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-black text-gray-950 text-xs sm:text-sm line-clamp-1">{n.title}</h4>
                <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-relaxed">{n.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
