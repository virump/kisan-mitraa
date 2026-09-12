import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Droplets,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { soilService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export const SoilPage = () => {
  const [soilTypes, setSoilTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Recommendation Form State
  const [formData, setFormData] = useState({
    soil_type: 'Black Soil (Regur)',
    ph_level: 7.2,
    crop_name: 'Cotton',
    irrigation_type: 'Drip',
  });
  const [recLoading, setRecLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    soilService.getSoilTypes()
      .then((res) => {
        setSoilTypes(res.data);
      })
      .catch((err) => {
        console.error("Failed to load soil types:", err);
        setError("Unable to load soil catalog. Please try again.");
      })
      .finally(() => setLoading(false));

    // Load initial recommendation
    calculateRec(formData);
  }, []);

  const calculateRec = async (data) => {
    setRecLoading(true);
    try {
      const res = await soilService.getRecommendation({
        soil_type: data.soil_type,
        ph_level: parseFloat(data.ph_level) || 7.0,
        crop_name: data.crop_name,
        irrigation_type: data.irrigation_type,
      });
      setRecommendation(res.data);
    } catch (err) {
      console.error("Failed to calculate soil recommendation:", err);
    } finally {
      setRecLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    calculateRec(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Soil Science & Agronomic Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Soil Health & Nutrient Management
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            Understand your soil chemistry, optimal pH ranges, micronutrient deficiencies, and calculate tailored fertilizer dosages.
          </p>
        </div>
      </div>

      {/* Interactive Soil Recommendation Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-forest-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">Soil Nutrient & Fertilizer Recommendation Wizard</h2>
            <p className="text-xs text-forest-200">
              Input your field soil parameters to get customized scientific fertilizer and irrigation guidance.
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-forest-200 mb-1">
              Soil Type
            </label>
            <select
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="Black Soil (Regur)">Black Soil (Regur)</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Red and Yellow Soil">Red & Yellow Soil</option>
              <option value="Laterite Soil">Laterite Soil</option>
              <option value="Sandy / Arid Soil">Sandy / Arid Soil</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase text-forest-200">
                Soil pH Level: <span className="text-amber-300 font-extrabold">{formData.ph_level}</span>
              </label>
            </div>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={formData.ph_level}
              onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-300 mt-1">
              <span>Acidic (4.5)</span>
              <span>Neutral (7.0)</span>
              <span>Alkaline (9.0)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-forest-200 mb-1">
              Target Crop
            </label>
            <input
              type="text"
              value={formData.crop_name}
              onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
              placeholder="e.g. Wheat, Cotton, Tomato"
              className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-forest-200 mb-1">
              Irrigation Method
            </label>
            <select
              value={formData.irrigation_type}
              onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
              className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="Drip">Drip Irrigation (टपक)</option>
              <option value="Sprinkler">Sprinkler Irrigation (फव्वारा)</option>
              <option value="Flood">Flood / Furrow Irrigation</option>
              <option value="Rainfed">Rainfed (बारानी)</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={recLoading}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-forest-950 font-bold rounded-xl transition text-xs flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{recLoading ? 'Recalculating...' : 'Generate Recommendations'}</span>
            </button>
          </div>
        </form>

        {/* Calculated Output Card */}
        {recommendation && (
          <div className="mt-4 p-6 bg-forest-950/70 rounded-2xl border border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-amber-300 text-xs block mb-1">pH Chemistry Evaluation:</strong>
                  <p className="text-xs text-forest-100 leading-relaxed">{recommendation.ph_evaluation}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-amber-300 text-xs block mb-1">Crop Suitability & Drainage:</strong>
                  <p className="text-xs text-forest-100 leading-relaxed">{recommendation.crop_suitability}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-amber-300 text-xs block mb-1">Irrigation Guidance:</strong>
                  <p className="text-xs text-forest-100 leading-relaxed">{recommendation.irrigation_advice}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-emerald-300 text-xs block mb-1">Recommended Fertilizers & Amendments:</strong>
                  <ul className="list-disc list-inside text-xs text-forest-100 space-y-1">
                    {recommendation.recommended_fertilizers.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-emerald-300 text-xs block mb-1">Long-term Soil Health Practices:</strong>
                  <ul className="list-disc list-inside text-xs text-forest-100 space-y-1">
                    {recommendation.soil_health_tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

      {/* Soil Encyclopedia Catalog */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-gray-900">National Soil Classification Encyclopedia</h2>
        <p className="text-sm text-gray-600">Major agricultural soil orders across the Indian subcontinent.</p>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilTypes.map((soil) => (
              <div
                key={soil.id}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-forest-100 text-forest-800 text-[10px] font-bold">
                      pH {soil.ph_range}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">
                      Water Retention: {soil.water_retention}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{soil.name}</h3>
                  {soil.hindi_name && (
                    <p className="text-xs text-gray-500 mb-3">{soil.hindi_name} {soil.marathi_name ? `• ${soil.marathi_name}` : ''}</p>
                  )}

                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="leading-relaxed"><strong className="text-gray-900">Characteristics:</strong> {soil.characteristics}</p>
                    <p className="leading-relaxed"><strong className="text-gray-900">Suitable Crops:</strong> {soil.suitable_crops}</p>
                    <p className="leading-relaxed"><strong className="text-gray-900">Nutrients:</strong> {soil.nutrient_profile}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs text-forest-700 bg-forest-50/50 p-2.5 rounded-xl font-medium">
                  <strong>Fertilizer Advice:</strong> {soil.fertilizer_guidance}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilPage;
