import React from 'react';
import { Bell, CheckCheck, X, CloudRain, TrendingUp, AlertTriangle, Award, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationModal = () => {
  const { notifications, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'scheme':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'crop':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-forest-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-forest-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Alerts & Notifications</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">
            {notifications.filter((n) => !n.is_read).length} unread updates
          </span>
          <button
            onClick={markAllAsRead}
            className="text-forest-700 font-semibold hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No new alerts at this time.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.is_read
                    ? 'bg-white border-gray-100 opacity-75'
                    : 'bg-forest-50/40 border-forest-200 shadow-xs'
                }`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">{getAlertIcon(item.alert_type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
