import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  MapPin,
  ArrowUpDown,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { marketService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

export const MarketPricesPage = () => {
  const [prices, setPrices] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ states: [], districts: [], crops: [] });
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Historical price chart
  const [chartCrop, setChartCrop] = useState('Wheat');
  const [chartHistory, setChartHistory] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchFilters = async () => {
    try {
      const res = await marketService.getFilters();
      setFilterOptions({
        states: ['All', ...res.data.states],
        districts: ['All', ...res.data.districts],
        crops: ['All', ...res.data.crops],
      });
    } catch (err) {
      console.error("Filter fetch failed:", err);
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await marketService.getPrices({
        state: selectedState !== 'All' ? selectedState : undefined,
        district: selectedDistrict !== 'All' ? selectedDistrict : undefined,
        crop: selectedCrop !== 'All' ? selectedCrop : undefined,
        sort_by: sortBy,
      });
      setPrices(res.data);
    } catch (err) {
      console.error("Failed to load prices:", err);
      setError("Unable to load Mandi market prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (cropName) => {
    setChartLoading(true);
    try {
      const res = await marketService.getPriceHistory({ crop: cropName });
      setChartHistory(res.data.history);
    } catch (err) {
      console.error("Chart history failed:", err);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [selectedState, selectedDistrict, selectedCrop, sortBy]);

  useEffect(() => {
    fetchChartData(chartCrop);
  }, [chartCrop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>National APMC Mandi Price Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Daily Mandi / Market Rates
          </h1>
          <p className="text-sm text-gray-700 font-medium max-w-2xl">
            Real-time modal, minimum, and maximum prices per quintal across agricultural produce market committees (APMC).
          </p>
        </div>

        {/* Demo Mode Notice Tag */}
        <div className="p-3 bg-purple-50 rounded-2xl border-2 border-purple-200 text-xs font-bold text-purple-950 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-700 shrink-0" />
          <span>Demo & APMC Data Feed Synchronized</span>
        </div>
      </div>

      {/* Historical Price Trend Chart Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              15-Day Modal Price Trend for <span className="text-purple-700">{chartCrop}</span>
            </h2>
            <p className="text-xs text-gray-700 font-medium">Historical commodity price index (₹ per Quintal)</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900">Select Crop:</span>
            <select
              value={chartCrop}
              onChange={(e) => setChartCrop(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Onion">Onion (प्याज)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Chickpea / Gram">Gram (चना)</option>
            </select>
          </div>
        </div>

        {chartLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Loading price chart...
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Modal Price / Q']}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="modal_price"
                  stroke="#7e22ce"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-soft grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State Filter */}
        <div>
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-1">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            {filterOptions.states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-1">
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            {filterOptions.districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Crop Filter */}
        <div>
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-1">
            Crop
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            {filterOptions.crops.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="date_desc">Latest Date</option>
            <option value="price_desc">Highest Price First</option>
            <option value="price_asc">Lowest Price First</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPrices} />}

      {/* Prices Table / Card View */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : prices.length === 0 ? (
        <EmptyState
          title="No mandi records found"
          description="Try changing the selected state, district, or crop filters."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedState('All');
            setSelectedDistrict('All');
            setSelectedCrop('All');
            setSortBy('date_desc');
          }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-gray-900 text-xs uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Commodity / Crop</th>
                  <th className="py-4 px-6">Mandi / Market</th>
                  <th className="py-4 px-6">State & District</th>
                  <th className="py-4 px-6 text-right">Min Rate</th>
                  <th className="py-4 px-6 text-right">Max Rate</th>
                  <th className="py-4 px-6 text-right font-black text-forest-800">Modal Price</th>
                  <th className="py-4 px-6 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-forest-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-950">
                      <div>{item.crop_name}</div>
                      <span className="text-xs text-gray-700 font-semibold">{item.variety}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-bold">{item.market_name}</td>
                    <td className="py-4 px-6 text-gray-800 text-xs font-semibold">
                      {item.district}, {item.state}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-800 font-bold">₹{item.min_price}</td>
                    <td className="py-4 px-6 text-right text-gray-800 font-bold">₹{item.max_price}</td>
                    <td className="py-4 px-6 text-right font-black text-forest-800 text-base">
                      ₹{item.modal_price}
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-gray-800 font-mono font-bold">
                      {item.price_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-gray-200">
            {prices.map((item) => (
              <div key={item.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-950 text-base">{item.crop_name}</h3>
                    <span className="text-xs font-bold text-gray-800">{item.market_name}</span>
                    <span className="text-xs font-medium text-gray-700 block">{item.district}, {item.state}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-forest-800">₹{item.modal_price}</span>
                    <span className="text-xs font-bold text-gray-600 block">/ Quintal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 text-gray-800 font-medium border-t border-gray-100">
                  <span>Min: <strong>₹{item.min_price}</strong></span>
                  <span>Max: <strong>₹{item.max_price}</strong></span>
                  <span className="text-gray-700 font-bold">{item.price_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPricesPage;
