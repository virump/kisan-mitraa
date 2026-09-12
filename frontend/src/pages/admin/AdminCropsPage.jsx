import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { cropService, adminService } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export const AdminCropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hindi_name: '',
    marathi_name: '',
    category: 'Cereals',
    season: 'Rabi',
    soil_type: '',
    temp_min: 15,
    temp_max: 30,
    rainfall_min: 400,
    rainfall_max: 800,
    sowing_period: '',
    harvest_period: '',
    water_requirement: 'Medium',
    fertilizer_info: '',
    common_diseases: '',
    common_pests: '',
    farming_practices: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await cropService.getCrops({ limit: 200 });
      setCrops(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormData({
      name: '',
      hindi_name: '',
      marathi_name: '',
      category: 'Cereals',
      season: 'Rabi',
      soil_type: 'Well drained fertile loamy soil',
      temp_min: 15,
      temp_max: 30,
      rainfall_min: 400,
      rainfall_max: 800,
      sowing_period: 'November',
      harvest_period: 'April',
      water_requirement: 'Medium',
      fertilizer_info: 'NPK 120:60:40 kg/ha',
      common_diseases: 'Leaf Blight, Rust',
      common_pests: 'Aphids, Borer',
      farming_practices: 'Row spacing 20 cm',
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      hindi_name: crop.hindi_name || '',
      marathi_name: crop.marathi_name || '',
      category: crop.category,
      season: crop.season,
      soil_type: crop.soil_type,
      temp_min: crop.temp_min || 15,
      temp_max: crop.temp_max || 30,
      rainfall_min: crop.rainfall_min || 400,
      rainfall_max: crop.rainfall_max || 800,
      sowing_period: crop.sowing_period,
      harvest_period: crop.harvest_period,
      water_requirement: crop.water_requirement || 'Medium',
      fertilizer_info: crop.fertilizer_info || '',
      common_diseases: crop.common_diseases || '',
      common_pests: crop.common_pests || '',
      farming_practices: crop.farming_practices || '',
      image_url: crop.image_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop record?")) return;
    try {
      await adminService.deleteCrop(id);
      fetchCrops();
    } catch (err) {
      alert("Failed to delete crop");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCrop) {
        await adminService.updateCrop(editingCrop.id, formData);
      } else {
        await adminService.createCrop(formData);
      }
      setModalOpen(false);
      fetchCrops();
    } catch (err) {
      alert("Failed to save crop");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs text-forest-700 font-bold flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Master Admin
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Manage Crop Database</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crop</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-bold">
                  <th className="py-3 px-4">Crop Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">Sowing</th>
                  <th className="py-3 px-4">Harvest</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {crops.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 text-forest-700 font-semibold">{c.category}</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">{c.season}</td>
                    <td className="py-3 px-4 text-gray-600">{c.sowing_period}</td>
                    <td className="py-3 px-4 text-gray-600">{c.harvest_period}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingCrop ? 'Edit Crop Details' : 'Add New Crop'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Crop Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hindi Name</label>
                  <input
                    type="text"
                    value={formData.hindi_name}
                    onChange={(e) => setFormData({ ...formData, hindi_name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Marathi Name</label>
                  <input
                    type="text"
                    value={formData.marathi_name}
                    onChange={(e) => setFormData({ ...formData, marathi_name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Cereals">Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Cash crops">Cash crops</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Season *</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="All Season">All Season</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sowing Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.sowing_period}
                    onChange={(e) => setFormData({ ...formData, sowing_period: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Harvest Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.harvest_period}
                    onChange={(e) => setFormData({ ...formData, harvest_period: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Soil Requirements *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Fertilizer Info (NPK)</label>
                <textarea
                  rows={2}
                  value={formData.fertilizer_info}
                  onChange={(e) => setFormData({ ...formData, fertilizer_info: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Farming Practices & Spacing</label>
                <textarea
                  rows={2}
                  value={formData.farming_practices}
                  onChange={(e) => setFormData({ ...formData, farming_practices: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCropsPage;
