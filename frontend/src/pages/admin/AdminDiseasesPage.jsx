import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  X
} from 'lucide-react';
import { diseaseService, adminService } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export const AdminDiseasesPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [formData, setFormData] = useState({
    crop_name: 'Tomato',
    name: '',
    hindi_name: '',
    disease_type: 'Fungal',
    symptoms: '',
    causes: '',
    prevention: '',
    treatment: '',
    severity: 'High',
  });
  const [saving, setSaving] = useState(false);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await diseaseService.getDiseases({ limit: 200 });
      setDiseases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleOpenAdd = () => {
    setEditingDisease(null);
    setFormData({
      crop_name: 'Tomato',
      name: '',
      hindi_name: '',
      disease_type: 'Fungal',
      symptoms: '',
      causes: '',
      prevention: '',
      treatment: '',
      severity: 'High',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDisease(d);
    setFormData({
      crop_name: d.crop_name,
      name: d.name,
      hindi_name: d.hindi_name || '',
      disease_type: d.disease_type || 'Fungal',
      symptoms: d.symptoms,
      causes: d.causes || '',
      prevention: d.prevention || '',
      treatment: d.treatment,
      severity: d.severity || 'High',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this disease record?")) return;
    try {
      await adminService.deleteDisease(id);
      fetchDiseases();
    } catch (err) {
      alert("Failed to delete disease record");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingDisease) {
        await adminService.updateDisease(editingDisease.id, formData);
      } else {
        await adminService.createDisease(formData);
      }
      setModalOpen(false);
      fetchDiseases();
    } catch (err) {
      alert("Failed to save disease record");
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
          <h1 className="text-2xl font-black text-gray-900">Manage Pest & Diseases</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Disease Record</span>
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
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Disease Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Treatment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {diseases.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">{d.crop_name}</td>
                    <td className="py-3 px-4 text-gray-800 font-semibold">{d.name}</td>
                    <td className="py-3 px-4 text-amber-700">{d.disease_type}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{d.treatment}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingDisease ? 'Edit Disease Details' : 'Add Disease Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Crop *</label>
                  <input
                    type="text"
                    required
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Disease Type *</label>
                  <select
                    value={formData.disease_type}
                    onChange={(e) => setFormData({ ...formData, disease_type: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Fungal">Fungal</option>
                    <option value="Bacterial">Bacterial</option>
                    <option value="Viral">Viral</option>
                    <option value="Pest">Pest</option>
                    <option value="Deficiency">Deficiency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Disease Name *</label>
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
                <label className="font-bold text-gray-700 block mb-1">Symptoms *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Causes</label>
                <textarea
                  rows={2}
                  value={formData.causes}
                  onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Treatment Steps *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save Disease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiseasesPage;
