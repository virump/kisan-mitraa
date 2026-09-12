import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CloudSun, Sprout, TrendingUp, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/weather', label: t.navWeather, icon: CloudSun },
    { to: '/ai-assistant', label: 'Kisan AI', icon: Bot, highlight: true },
    { to: '/market-prices', label: t.navMarket, icon: TrendingUp },
    { to: isAuthenticated ? '/dashboard' : '/login', label: isAuthenticated ? t.navDashboard : t.navLogin, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden shadow-lg pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full py-1 text-xs font-bold transition-all duration-150 ${
                item.highlight
                  ? 'text-forest-700 font-extrabold'
                  : isActive
                  ? 'text-forest-900 font-black scale-105'
                  : 'text-gray-800 hover:text-forest-800'
              }`
            }
          >
            {item.highlight ? (
              <div className="w-10 h-10 -mt-5 bg-gradient-to-tr from-forest-700 to-forest-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-forest-600/30">
                <item.icon className="w-5 h-5" />
              </div>
            ) : (
              <item.icon className="w-5 h-5 mb-0.5" />
            )}
            <span className={`text-[11px] truncate ${item.highlight ? 'mt-0.5' : ''}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
