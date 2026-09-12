import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  FileText,
  Building2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { schemeService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ["All", "Financial Assistance", "Crop Insurance", "Credit & Finance", "Soil & Nutrient Health", "Market & Trade", "Irrigation & Infrastructure"];

export const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await schemeService.getSchemes({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search ? search : undefined,
      });
      setSchemes(res.data);
    } catch (err) {
      console.error("Failed to load schemes:", err);
      setError("Unable to load government schemes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Direct Benefit & Welfare Schemes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Government Agriculture Schemes
          </h1>
          <p className="text-sm text-gray-700 font-medium max-w-2xl">
            Verified Indian Central & State Government farmer welfare initiatives, subsidies, crop insurance, and Kisan Credit Card facilities.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes (e.g. PM-KISAN)..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </form>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black text-gray-900 shrink-0">Category:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-800'
                : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSchemes} />}

      {/* Schemes Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : schemes.length === 0 ? (
        <EmptyState
          title="No government schemes found"
          description="Try changing the category or search keywords."
          actionText="Reset Filter"
          onAction={() => {
            setSelectedCategory('All');
            setSearch('');
            fetchSchemes();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-black">
                      {scheme.category}
                    </span>
                    <h2 className="text-xl font-black text-gray-950 mt-2">{scheme.name}</h2>
                    {scheme.hindi_name && (
                      <p className="text-xs text-gray-700 font-bold">{scheme.hindi_name}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-teal-950 font-bold bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                  {scheme.ministry}
                </p>

                <p className="text-xs text-gray-800 font-medium leading-relaxed">
                  {scheme.description}
                </p>

                {/* Benefits & Eligibility Details */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <strong className="text-emerald-950 text-xs font-black flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Financial Benefits & Support:
                    </strong>
                    <p className="text-xs text-emerald-900 font-medium leading-relaxed">{scheme.benefits}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                    <strong className="text-blue-950 text-xs font-black flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      Eligibility Criteria:
                    </strong>
                    <p className="text-xs text-blue-900 font-medium leading-relaxed">{scheme.eligibility}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                    <strong className="text-gray-950 text-xs font-black flex items-center gap-1.5 mb-1">
                      <FileCheck className="w-4 h-4 text-gray-700" />
                      Required Documents:
                    </strong>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">{scheme.required_documents}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <strong className="text-amber-950 text-xs font-black flex items-center gap-1.5 mb-1">
                      <FileText className="w-4 h-4 text-amber-700" />
                      How to Apply:
                    </strong>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">{scheme.application_process}</p>
                  </div>
                </div>
              </div>

              {/* Official Application Portal Button */}
              <div className="pt-4 border-t border-gray-100">
                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
