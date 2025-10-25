import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, XCircle, Info, X, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export type NotificationType = "success" | "error" | "warning" | "info";

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
  persistent?: boolean;
}

interface NotificationSystemProps {
  maxNotifications?: number;
}

// Global notification state
let notificationId = 0;
const notificationListeners = new Set<(notifications: Notification[]) => void>();
let globalNotifications: Notification[] = [];

// Global notification functions
export const addNotification = (notification: Omit<Notification, "id">) => {
  const newNotification: Notification = {
    ...notification,
    id: `notification-${++notificationId}`,
    duration: notification.duration ?? 5000,
  };

  globalNotifications = [newNotification, ...globalNotifications].slice(0, 10);
  notificationListeners.forEach(listener => listener(globalNotifications));

  // Auto remove non-persistent notifications
  if (!newNotification.persistent && newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, newNotification.duration);
  }

  return newNotification.id;
};

export const removeNotification = (id: string) => {
  globalNotifications = globalNotifications.filter(n => n.id !== id);
  notificationListeners.forEach(listener => listener(globalNotifications));
};

export const clearAllNotifications = () => {
  globalNotifications = [];
  notificationListeners.forEach(listener => listener(globalNotifications));
};

// Convenience functions
export const showSuccess = (title: string, message?: string, options?: Partial<Notification>) =>
  addNotification({ type: "success", title, message, ...options });

export const showError = (title: string, message?: string, options?: Partial<Notification>) =>
  addNotification({ type: "error", title, message, persistent: true, ...options });

export const showWarning = (title: string, message?: string, options?: Partial<Notification>) =>
  addNotification({ type: "warning", title, message, ...options });

export const showInfo = (title: string, message?: string, options?: Partial<Notification>) =>
  addNotification({ type: "info", title, message, ...options });

export function NotificationSystem({ maxNotifications = 5 }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>(globalNotifications);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications.slice(0, maxNotifications));
    };
    
    notificationListeners.add(listener);
    return () => notificationListeners.delete(listener);
  }, [maxNotifications]);

  const handleRemove = useCallback((id: string) => {
    removeNotification(id);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColorClasses = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className={`p-4 shadow-lg border ${getColorClasses(notification.type)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  {notification.message && (
                    <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                  )}
                  {notification.action && (
                    <Button
                      onClick={notification.action.onClick}
                      size="sm"
                      variant="outline"
                      className="mt-3 text-xs h-7"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for using notifications in components
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(globalNotifications);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications([...newNotifications]);
    };
    
    notificationListeners.add(listener);
    return () => notificationListeners.delete(listener);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Bell icon component for notification counter
export function NotificationBell() {
  const { notifications } = useNotifications();
  const unreadCount = notifications.length;

  if (unreadCount === 0) {
    return (
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5 text-gray-600" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-5 w-5 text-gray-600" />
      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </Button>
  );
}