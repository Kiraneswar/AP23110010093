import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, FetchNotificationsParams } from '../api/notifications';
import { Notification } from '../utils/priority';
import { Log } from 'logging-middleware/logger';

export const useNotifications = (initialParams: FetchNotificationsParams) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState<boolean>(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const loadNotifications = useCallback(async (params: FetchNotificationsParams) => {
    setLoading(true);
    setError(null);
    setIsAuthError(false);
    try {
      const data = await fetchNotifications(params);
      setNotifications(data || []);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to load notifications';
      setError(errMsg);

      if (errMsg.toLowerCase().includes('auth') || errMsg.includes('400') || errMsg.includes('401')) {
        setIsAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams.limit, initialParams.page, initialParams.notification_type]);

  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds(new Set(notifications.map(n => n.id)));
    Log("frontend", "info", "hook", "Marked all notifications as read");
  }, [notifications]);

  return {
    notifications,
    loading,
    error,
    isAuthError,
    readIds,
    markAsRead,
    markAllAsRead,
    refetch: () => loadNotifications(initialParams)
  };
};
