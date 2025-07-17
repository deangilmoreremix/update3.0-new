import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Convenience methods
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper functions moved outside component for memoized component access
const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getBackgroundColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    case 'info':
      return 'text-blue-800';
  }
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration: duration ?? 7000 });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      success,
      error,
      warning,
      info
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Memoized Notification Item Component for Performance
const NotificationItem = React.memo<{
  notification: Notification;
  onRemove: (id: string) => void;
}>(({ notification, onRemove }) => {
  return (
    <div
      className={`
        ${getBackgroundColor(notification.type)} 
        border rounded-lg shadow-lg p-4 transition-all duration-300 transform
        animate-in slide-in-from-right-full
      `}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor(notification.type)}`}>
            {notification.title}
          </p>
          {notification.message && (
            <p className={`mt-1 text-sm ${getTextColor(notification.type)} opacity-75`}>
              {notification.message}
            </p>
          )}
          {notification.action && (
            <div className="mt-2">
              <button
                onClick={notification.action.onClick}
                className={`
                  text-sm font-medium underline ${getTextColor(notification.type)}
                  hover:opacity-75 focus:outline-none
                `}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(notification.id)}
            className={`
              inline-flex rounded-md p-1.5 ${getTextColor(notification.type)}
              hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
