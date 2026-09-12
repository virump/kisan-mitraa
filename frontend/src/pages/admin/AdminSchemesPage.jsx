import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  X
} from 'lucide-react';
import { schemeService, adminService } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export const AdminSchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hindi_name: '',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    description: '',
    eligibility: '',
    benefits: '',
    required_documents: '',
    application_process: '',
    official_url: '',
    category: 'Financial Assistance',
  });
  const [saving, setSaving] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemes({ limit: 100 });
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenAdd = () => {
    setEditingScheme(null);
    setFormData({
      name: '',
      hindi_name: '',
      ministry: 'Ministry of Agriculture and Farmers Welfare',
      description: '',
      eligibility: '',
      benefits: '',
      required_documents: '',
      application_process: '',
      official_url: 'https://pmkisan.gov.in',
      category: 'Financial Assistance',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingScheme(s);
    setFormData({
      name: s.name,
      hindi_name: s.hindi_name || '',
      ministry: s.ministry,
      description: s.description,
      eligibility: s.eligibility,
      benefits: s.benefits,
      required_documents: s.required_documents,
      application_process: s.application_process,
      official_url: s.official_url,
      category: s.category,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this government scheme record?")) return;
    try {
      await adminService.deleteScheme(id);
      fetchSchemes();
    } catch (err) {
      alert("Failed to delete scheme");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingScheme) {
        await adminService.updateScheme(editingScheme.id, formData);
      } else {
        await adminService.createScheme(formData);
      }
      setModalOpen(false);
      fetchSchemes();
    } catch (err) {
      alert("Failed to save scheme record");
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
          <h1 className="text-2xl font-black text-gray-900">Manage Government Schemes</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
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
                  <th className="py-3 px-4">Scheme Name</th>
                  <th className="py-3 px-4">Ministry</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Benefits</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                    <td className="py-3 px-4 text-gray-600">{s.ministry}</td>
                    <td className="py-3 px-4 text-teal-700 font-semibold">{s.category}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{s.benefits}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingScheme ? 'Edit Scheme Details' : 'Add Government Scheme'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Scheme Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Financial Assistance">Financial Assistance</option>
                    <option value="Crop Insurance">Crop Insurance</option>
                    <option value="Credit & Finance">Credit & Finance</option>
                    <option value="Soil & Nutrient Health">Soil & Nutrient Health</option>
                    <option value="Market & Trade">Market & Trade</option>
                    <option value="Irrigation & Infrastructure">Irrigation & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Ministry Department *</label>
                <input
                  type="text"
                  required
                  value={formData.ministry}
                  onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Financial Benefits *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Eligibility Criteria *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Required Documents *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.required_documents}
                  onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Application Process *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.application_process}
                  onChange={(e) => setFormData({ ...formData, application_process: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Official Portal URL *</label>
                <input
                  type="url"
                  required
                  value={formData.official_url}
                  onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemesPage;
