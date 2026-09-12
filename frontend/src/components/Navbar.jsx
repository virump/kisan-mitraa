import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Award,
  Bot,
  User,
  ShieldAlert,
  Bell,
  Menu,
  X,
  LogOut,
  Layers,
  FileText,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationModal from './NotificationModal';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount, isOpen, setIsOpen } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t.navHome, path: '/' },
    { name: t.navWeather, path: '/weather', icon: CloudSun },
    { name: t.navCrops, path: '/crops', icon: Sprout },
    { name: t.navDiseases, path: '/diseases', icon: ShieldAlert },
    { name: t.navMarket, path: '/market-prices', icon: TrendingUp },
    { name: t.navSchemes, path: '/schemes', icon: Award },
    { name: t.navNews, path: '/news', icon: FileText },
    { name: t.navAIAssistant, path: '/ai-assistant', icon: Bot, highlight: true },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md shadow-forest-900/20 group-hover:scale-105 transition-transform duration-200">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 flex items-center gap-1">
                  Kisan<span className="text-forest-700">Mitra</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-black tracking-widest text-amber-700 -mt-1">
                  Smart Agri Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      item.highlight
                        ? 'bg-forest-800 text-white shadow-sm hover:bg-forest-900'
                        : active
                        ? 'bg-forest-100 text-forest-950 font-black ring-1 ring-forest-300'
                        : 'text-gray-900 hover:text-forest-900 hover:bg-forest-50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Tools: Language, Notification, Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative flex items-center bg-gray-200 rounded-xl p-1 border border-gray-300 text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-gray-800 ml-2 mr-1 hidden sm:inline" />
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'en'
                      ? 'bg-forest-800 text-white shadow-xs font-black'
                      : 'text-gray-900 hover:text-black font-bold'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'hi'
                      ? 'bg-forest-800 text-white shadow-xs font-black'
                      : 'text-gray-900 hover:text-black font-bold'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'mr'
                      ? 'bg-forest-800 text-white shadow-xs font-black'
                      : 'text-gray-900 hover:text-black font-bold'
                  }`}
                >
                  मराठी
                </button>
              </div>

              {/* Notification Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative p-2.5 rounded-xl text-gray-900 hover:text-forest-900 hover:bg-forest-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="px-3 py-2 text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 rounded-xl hover:bg-amber-200 transition"
                      >
                        {t.navAdmin}
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="px-3.5 py-2 text-xs font-black bg-forest-100 text-forest-950 rounded-xl hover:bg-forest-200 transition flex items-center gap-1.5 border border-forest-300"
                    >
                      <User className="w-4 h-4 text-forest-800" />
                      <span className="truncate max-w-[100px]">{user?.full_name?.split(' ')[0]}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="p-2 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition border border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-xs font-black text-gray-900 hover:text-forest-800 hover:bg-gray-100 rounded-xl transition border border-gray-300"
                    >
                      {t.navLogin}
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-xs font-black bg-forest-800 hover:bg-forest-900 text-white rounded-xl transition shadow-md"
                    >
                      {t.navRegister}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 lg:hidden focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
            {isAuthenticated && (
              <div className="p-3 bg-forest-50 rounded-xl flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-forest-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{user?.full_name}</div>
                    <div className="text-xs text-forest-700">{user?.district}, {user?.state}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 bg-white px-2.5 py-1 rounded-lg border border-red-200"
                >
                  Logout
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-forest-100 text-forest-800'
                      : 'bg-gray-50 text-gray-700 hover:bg-forest-50'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-forest-600" />}
                  {item.name}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-bold bg-amber-100 text-amber-900 rounded-xl"
              >
                {t.navAdmin}
              </Link>
            )}

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold border border-forest-600 text-forest-700 rounded-xl"
                >
                  {t.navLogin}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold bg-forest-600 text-white rounded-xl"
                >
                  {t.navRegister}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Notification Drawer Modal */}
      <NotificationModal />
    </>
  );
};

export default Navbar;
