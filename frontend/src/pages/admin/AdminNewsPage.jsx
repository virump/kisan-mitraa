import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  X
} from 'lucide-react';
import { newsService, adminService } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export const AdminNewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    hindi_title: '',
    summary: '',
    content: '',
    category: 'Government',
    source: 'Ministry of Agriculture',
    source_url: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getNews({ limit: 100 });
      setNews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenAdd = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      hindi_title: '',
      summary: '',
      content: '',
      category: 'Government',
      source: 'Ministry of Agriculture',
      source_url: 'https://pib.gov.in',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (n) => {
    setEditingNews(n);
    setFormData({
      title: n.title,
      hindi_title: n.hindi_title || '',
      summary: n.summary,
      content: n.content,
      category: n.category,
      source: n.source,
      source_url: n.source_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news article?")) return;
    try {
      await adminService.deleteNews(id);
      fetchNews();
    } catch (err) {
      alert("Failed to delete news");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingNews) {
        await adminService.updateNews(editingNews.id, formData);
      } else {
        await adminService.createNews(formData);
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      alert("Failed to save news article");
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
          <h1 className="text-2xl font-black text-gray-900">Manage Agriculture Bulletins & News</h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Bulletin</span>
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
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {news.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900 max-w-sm truncate">{n.title}</td>
                    <td className="py-3 px-4 text-forest-700 font-semibold">{n.category}</td>
                    <td className="py-3 px-4 text-gray-600">{n.source}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(n.published_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
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
                {editingNews ? 'Edit News Bulletin' : 'Publish News Bulletin'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Government">Government</option>
                    <option value="Weather">Weather</option>
                    <option value="Crop Alert">Crop Alert</option>
                    <option value="Market">Market</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Source Publisher</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Summary / Brief *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Article Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Official Source URL</label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  {saving ? 'Publishing...' : 'Publish Bulletin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
