import React from 'react';
import { ArrowLeft, Check, Clock, DollarSign, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = ({ notifications, markAllAsRead, markAsRead }) => {
  const navigate = useNavigate();

    const getNotificationBorderColor = (type) => {
    switch (type) {
        case 'received':
        return 'border-l-green-500';
        case 'sent':
        return 'border-l-blue-500';
        default:
        return 'border-l-purple-500';
    }
    };

    const getNotificationGradient = (type) => {
    switch (type) {
        case 'received':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
        case 'sent':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        default:
        return 'bg-gradient-to-r from-purple-500 to-violet-500';
    }
    };

    const getNotificationIconBg = (type) => {
    switch (type) {
        case 'received':
        return 'bg-green-100';
        case 'sent':
        return 'bg-blue-100';
        default:
        return 'bg-purple-100';
    }
    };

    // Update your existing getNotificationIcon function
    const getNotificationIcon = (type) => {
    switch (type) {
        case 'received':
        return <DollarSign className="h-5 w-5 text-green-600" />;
        case 'sent':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
        default:
        return <User className="h-5 w-5 text-purple-600" />;
    }
    };

  const handleMarkAsRead = (notificationId) => {
    if (markAsRead) {
      markAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    if (markAllAsRead) {
      markAllAsRead();
    }
  };

      {/* Add these helper functions before the return statement */}
    <style jsx>{`
        @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
        }
    `}</style>

return (
  <div className="font-voyage min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    {/* Header */}
    <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500">{notifications.length} total</p>
            </div>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Notifications List */}
    <div className="max-w-md mx-auto px-6 py-6">
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">All caught up!</h3>
          <p className="text-slate-500 max-w-sm mx-auto">You're all set! New notifications will appear here when they arrive.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                notification.read 
                  ? 'bg-white/70 border-slate-200 hover:bg-white/90' 
                  : `bg-white/90 border-l-4 ${getNotificationBorderColor(notification.type)} shadow-md`
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {/* Gradient overlay for unread notifications */}
              {!notification.read && (
                <div className={`absolute inset-0 opacity-5 ${getNotificationGradient(notification.type)}`} />
              )}
              
              <div className="relative p-5">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-2.5 rounded-xl ${getNotificationIconBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="p-1 bg-slate-100 rounded-full">
                          <Clock className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{notification.timestamp}</span>
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
                      <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Quick Actions */}
    {notifications.length > 0 && (
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate('/wallet')}
              className="group flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">View Dashboard</p>
                <p className="text-xs text-slate-500">Go to your wallet overview</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/transactions')}
              className="group flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200 border border-transparent hover:border-green-200"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Transaction History</p>
                <p className="text-xs text-slate-500">View all your transactions</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Notifications;