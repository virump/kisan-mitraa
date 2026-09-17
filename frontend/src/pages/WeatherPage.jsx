import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Navigation,
  MapPin,
  AlertTriangle,
  Compass,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { weatherService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const DISTRICTS = [
  { name: "Pune", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Aurangabad", state: "Maharashtra" },
  { name: "Kolhapur", state: "Maharashtra" },
  { name: "Ludhiana", state: "Punjab" },
  { name: "Karnal", state: "Haryana" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Patna", state: "Bihar" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Guntur", state: "Andhra Pradesh" },
  { name: "Mandya", state: "Karnataka" },
  { name: "Coimbatore", state: "Tamil Nadu" },
];

export const WeatherPage = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Pune');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const fetchWeather = async (districtName = selectedDistrict, lat = null, lon = null) => {
    setLoading(true);
    setError('');
    try {
      const res = await weatherService.getWeather({
        district: districtName,
        lat,
        lon
      });
      setWeatherData(res.data);
    } catch (err) {
      console.error("Failed to load weather:", err);
      setError("Unable to load weather forecast. Please check your connection.");
    } finally {
      setLoading(false);
      setLocating(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDistrict);
  }, [selectedDistrict]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather("My Location", latitude, longitude);
      },
      (err) => {
        setLocating(false);
        alert("Unable to detect current location. Please select your district from the dropdown.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & District Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>{t.agrometForecast}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t.weatherAdvisories}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <MapPin className="w-4 h-4 text-forest-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}, {d.state}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? t.detectingGps : t.useMyGps}</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => fetchWeather(selectedDistrict)} />}

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : weatherData ? (
        <div className="space-y-8">
          {/* Main Weather Overview Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-forest-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Temperature */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <MapPin className="w-4 h-4" />
                  <span>{weatherData.location}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <div className="text-6xl sm:text-7xl font-black">{weatherData.temperature}°C</div>
                  <div>
                    <div className="text-xl font-black text-emerald-300">{weatherData.condition}</div>
                    <div className="text-xs font-semibold text-emerald-100">{t.feelsLike} {weatherData.feels_like}°C</div>
                  </div>
                </div>
                <p className="text-xs font-medium text-emerald-100">
                  {weatherData.sunrise} ({t.sunrise}) • {weatherData.sunset} ({t.sunset})
                </p>
              </div>

              {/* Right Weather Parameter Grid */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                  <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-100 block">{t.humidity}</span>
                  <span className="text-lg font-black text-white">{weatherData.humidity}%</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                  <CloudRain className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-100 block">{t.rainChance}</span>
                  <span className="text-lg font-black text-white">{weatherData.rain_probability}%</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                  <Wind className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-100 block">{t.windSpeed}</span>
                  <span className="text-lg font-black text-white">{weatherData.wind_speed} km/h</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                  <Sun className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                  <span className="text-xs font-bold text-emerald-100 block">{t.uvIndex}</span>
                  <span className="text-lg font-black text-white">{weatherData.uv_index}</span>
                </div>
              </div>
            </div>

            {/* Farm Spray Advisory Banner */}
            {weatherData.agricultural_alert && (
              <div className="mt-8 pt-6 border-t border-white/15 flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">{t.fieldAdvisory}</h4>
                  <p className="text-xs text-white font-medium mt-0.5 leading-relaxed">
                    {weatherData.agricultural_alert}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hourly Forecast Strip */}
          {weatherData.hourly && weatherData.hourly.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-forest-700" />
                <h3 className="font-black text-gray-900 text-base">{t.hourlyTrend}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {weatherData.hourly.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-forest-50/70 border border-forest-200 text-center flex flex-col items-center justify-between space-y-1.5"
                  >
                    <span className="text-xs font-black text-gray-900">{h.time}</span>
                    <CloudSun className="w-6 h-6 text-forest-700" />
                    <span className="text-sm font-black text-gray-950">{h.temp}°C</span>
                    <span className="text-xs text-blue-700 font-bold">{h.rain_probability}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Day-by-Day Forecast */}
          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest-700" />
              <h3 className="font-black text-gray-900 text-base">{t.extendedForecast7Day}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {weatherData.forecast.map((f, i) => (
                <div
                  key={f.date}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    i === 0
                      ? 'bg-forest-50 border-2 border-forest-500 shadow-sm'
                      : 'bg-white border-2 border-gray-200 hover:border-forest-400'
                  }`}
                >
                  <span className="text-xs font-black text-gray-950 block">{f.day_name}</span>
                  <span className="text-xs text-gray-700 font-semibold block mb-2">{f.date.slice(5)}</span>

                  <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-2">
                    <CloudSun className="w-6 h-6" />
                  </div>

                  <div className="text-base font-black text-gray-950">{f.temp_max}°</div>
                  <div className="text-xs font-bold text-gray-700">{f.temp_min}°</div>

                  <div className="text-xs text-blue-700 font-bold mt-2 pt-2 border-t border-gray-200">
                    💧 {f.rain_probability}%
                  </div>
                  <div className="text-xs text-gray-800 font-semibold mt-0.5 line-clamp-1">
                    {f.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;
