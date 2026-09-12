import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Sprout,
  FileText,
  Award,
  TrendingUp,
  PlusCircle,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorMessage from '../../components/ErrorMessage';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Admin stats failed:", err);
      setError("Unable to load admin analytics. Please ensure you are logged in as administrator.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const adminModules = [
    { title: "Manage Crops", count: stats?.total_crops || 0, link: "/admin/crops", icon: Sprout, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { title: "Pest & Diseases", count: stats?.total_diseases || 0, link: "/admin/diseases", icon: ShieldAlert, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { title: "Govt Schemes", count: stats?.total_schemes || 0, link: "/admin/schemes", icon: Award, color: "bg-teal-50 text-teal-700 border-teal-200" },
    { title: "Agri News & Alerts", count: stats?.total_news || 0, link: "/admin/news", icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { title: "Registered Users", count: stats?.total_users || 0, link: "/admin/users", icon: Users, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { title: "Mandi Price Records", count: stats?.total_markets || 0, link: "/market-prices", icon: TrendingUp, color: "bg-orange-50 text-orange-700 border-orange-200" },
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
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Platform Administration & Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Admin Master Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage crop protocols, disease treatments, government schemes, agricultural bulletins, and user roles.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.title}
              to={mod.link}
              className={`p-6 rounded-3xl border ${mod.color} shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-150 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">{mod.title}</span>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-4xl font-black text-gray-900 mb-1">{mod.count}</div>
                <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-black/5">
                  <span>Manage Records</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Registrations Table */}
      {stats?.recent_registrations && stats.recent_registrations.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Recent Farmer Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-forest-700 hover:underline">
              View All Users →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Main Crop</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_registrations.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">{u.full_name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.mobile_number}</td>
                    <td className="py-3 px-4 text-gray-600">{u.district}, {u.state}</td>
                    <td className="py-3 px-4 text-forest-800 font-semibold">{u.main_crop}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-forest-100 text-forest-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
