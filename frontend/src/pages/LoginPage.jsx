import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Phone, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/api';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(formData);
      login(res.data.access_token, res.data.user);
      if (res.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.detail || (language === 'hi' ? 'लॉगिन विफल। कृपया अपने विवरण की पुष्टि करें।' : language === 'mr' ? 'लॉगिन अयशस्वी. कृपया तपशील तपासा.' : 'Failed to login. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setFormData({ username: '9812345678', password: 'farmer123' });
  };

  const fillDemoAdmin = () => {
    setFormData({ username: 'admin@kisanmitra.gov.in', password: 'admin123' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-card border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-forest-600 text-white flex items-center justify-center mx-auto shadow-md shadow-forest-600/20">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'किसान लॉगिन' : language === 'mr' ? 'शेतकरी लॉगिन' : 'Farmer Login'}
          </h2>
          <p className="text-sm text-gray-500">
            {language === 'hi'
              ? 'मौसम, फसल अलर्ट और मंडी भाव तक पहुँचने के लिए लॉगिन करें'
              : language === 'mr'
              ? 'हवामान, पीक सूचना आणि बाजार भाव पाहण्यासाठी लॉगिन करा'
              : 'Access your personalized weather, crop alerts, and mandi rates'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'मोबाइल नंबर या ईमेल' : language === 'mr' ? 'मोबाईल नंबर किंवा ईमेल' : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. 9812345678 or admin@kisanmitra.gov.in"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'}
              </label>
              <Link to="/forgot-password" className="text-xs text-forest-600 hover:underline font-semibold">
                {language === 'hi' ? 'पासवर्ड भूल गए?' : language === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot password?'}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 disabled:opacity-60 text-white font-bold rounded-xl transition duration-150 shadow-md shadow-forest-600/20 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (language === 'hi' ? 'लॉगिन हो रहा है...' : language === 'mr' ? 'लॉगिन होत आहे...' : 'Logging in...') : (language === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : language === 'mr' ? 'डॅशबोर्डमध्ये प्रवेश करा' : 'Sign In to Dashboard')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 text-xs space-y-2">
          <div className="font-bold text-forest-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            <span>{language === 'hi' ? 'डेमो त्वरित लॉगिन' : language === 'mr' ? 'डेमो त्वरित लॉगिन' : 'Quick Demo Logins'}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={fillDemoFarmer}
              className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-forest-200 text-forest-800 font-semibold hover:bg-forest-100 transition text-[11px]"
            >
              {language === 'hi' ? 'किसान (पाटिल)' : language === 'mr' ? 'शेतकरी (पाटील)' : 'Demo Farmer (Patil)'}
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-forest-200 text-forest-800 font-semibold hover:bg-forest-100 transition text-[11px]"
            >
              {language === 'hi' ? 'एडमिन' : language === 'mr' ? 'प्रशासक' : 'Demo Admin'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
          {language === 'hi' ? 'नया खाता बनाना है? ' : language === 'mr' ? 'नवीन खाते तयार करायचे आहे? ' : "Don't have an account? "}
          <Link to="/register" className="font-bold text-forest-700 hover:underline">
            {language === 'hi' ? 'निःशुल्क पंजीकरण करें' : language === 'mr' ? 'मोफत नोंदणी करा' : 'Register for Free'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
