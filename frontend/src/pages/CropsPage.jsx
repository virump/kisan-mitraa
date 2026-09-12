import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  Filter,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { cropService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ["All", "Cereals", "Pulses", "Vegetables", "Fruits", "Cash crops"];
const SEASONS = ["All", "Kharif", "Rabi", "Zaid", "All Season"];

export const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');

  const fetchCrops = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await cropService.getCrops({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        season: selectedSeason !== 'All' ? selectedSeason : undefined,
        search: search ? search : undefined,
      });
      setCrops(res.data);
    } catch (err) {
      console.error("Failed to load crops:", err);
      setError("Unable to load crops database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [selectedCategory, selectedSeason]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCrops();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>National Crop Encyclopedia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Crop Cultivation & Farming Guides
          </h1>
          <p className="text-sm text-gray-700 font-medium max-w-2xl">
            Explore scientific agronomy practices, soil requirements, fertilizer dosing (NPK), and sowing timelines across 5 major categories.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops (e.g. Wheat, Tomato)..."
            className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-forest-700 text-white rounded-lg text-xs font-bold hover:bg-forest-800 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Category & Season Chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-800 shrink-0">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-forest-800 text-white shadow-sm ring-2 ring-forest-800'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-forest-600 hover:bg-forest-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-800 shrink-0">Season:</span>
          {SEASONS.map((sea) => (
            <button
              key={sea}
              onClick={() => setSelectedSeason(sea)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedSeason === sea
                  ? 'bg-amber-700 text-white ring-2 ring-amber-700 shadow-sm'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50'
              }`}
            >
              {sea}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCrops} />}

      {/* Crop Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : crops.length === 0 ? (
        <EmptyState
          title="No crops found matching your criteria"
          description="Try selecting a different category, season, or clearing your search term."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSelectedSeason('All');
            setSearch('');
            fetchCrops();
          }}
          icon="sprout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft hover:shadow-card transition flex flex-col justify-between group"
            >
              <div>
                {/* Crop Image & Badges */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-forest-50">
                  <img
                    src={crop.image_url || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop"}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-forest-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {crop.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold">
                      {crop.season}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 group-hover:text-forest-700 transition mb-1">
                  {crop.name}
                </h3>
                {crop.hindi_name && (
                  <p className="text-xs text-gray-700 mb-3 font-bold">
                    {crop.hindi_name} {crop.marathi_name ? `• ${crop.marathi_name}` : ''}
                  </p>
                )}

                {/* Key Specs */}
                <div className="space-y-2 text-xs text-gray-800 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    <span>Sowing: <strong className="text-gray-950 font-bold">{crop.sowing_period}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    <span className="truncate">Soil: <strong className="text-gray-950 font-bold">{crop.soil_type}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Water: <strong className="text-gray-950 font-bold">{crop.water_requirement}</strong></span>
                  </div>
                </div>
              </div>

              {/* View Full Protocol Button */}
              <Link
                to={`/crops/${crop.id}`}
                className="mt-6 pt-4 border-t border-gray-200 w-full py-2.5 bg-forest-50 hover:bg-forest-700 text-forest-900 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>View Full Farming Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropsPage;
