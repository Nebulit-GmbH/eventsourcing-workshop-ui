import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useNotificationSubscription, NotificationEvent } from './useNotificationSubscription';

type NotificationCallback = (data: unknown) => void;

interface NotificationContextValue {
  subscribe: (type: string, callback: NotificationCallback) => () => void;
  subscribeAll: (callback: (event: NotificationEvent) => void) => () => void;
  isConnected: boolean;
  sessionId: string | null;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const subscribersRef = useRef<Map<string, Set<NotificationCallback>>>(new Map());
  const allSubscribersRef = useRef<Set<(event: NotificationEvent) => void>>(new Set());

  const handleMessage = useCallback((event: NotificationEvent) => {
    // Notify all-event subscribers
    allSubscribersRef.current.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in notification subscriber:', error);
      }
    });

    // Notify type-specific subscribers
    const eventType = event.type;
    const typeSubscribers = subscribersRef.current.get(eventType);
    if (typeSubscribers) {
      typeSubscribers.forEach((callback) => {
        try {
          callback(event.data);
        } catch (error) {
          console.error('Error in notification subscriber:', error);
        }
      });
    }

    // Also check if the data has a type property (common pattern)
    const dataType = (event.data as { type?: string })?.type;
    if (dataType && dataType !== eventType) {
      const dataTypeSubscribers = subscribersRef.current.get(dataType);
      if (dataTypeSubscribers) {
        dataTypeSubscribers.forEach((callback) => {
          try {
            callback(event.data);
          } catch (error) {
            console.error('Error in notification subscriber:', error);
          }
        });
      }
    }
  }, []);

  const { sessionId, isConnected } = useNotificationSubscription({
    onMessage: handleMessage,
  });

  const subscribe = useCallback((type: string, callback: NotificationCallback) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set());
    }
    subscribersRef.current.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current.get(type);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          subscribersRef.current.delete(type);
        }
      }
    };
  }, []);

  const subscribeAll = useCallback((callback: (event: NotificationEvent) => void) => {
    allSubscribersRef.current.add(callback);

    return () => {
      allSubscribersRef.current.delete(callback);
    };
  }, []);

  const value: NotificationContextValue = {
    subscribe,
    subscribeAll,
    isConnected,
    sessionId,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to subscribe to notifications of a specific type.
 * The callback will be called whenever a notification of that type is received.
 *
 * @param type - The notification type to subscribe to
 * @param callback - Function to call when a notification is received
 *
 * @example
 * useNotification('ORDER_CREATED', (data) => {
 *   console.log('New order:', data);
 *   refetch(); // Trigger a refetch
 * });
 */
export function useNotification(type: string, callback: NotificationCallback) {
  const context = useContext(NotificationContext);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!context) {
      console.warn('useNotification must be used within a NotificationProvider');
      return;
    }

    const unsubscribe = context.subscribe(type, (data) => {
      callbackRef.current(data);
    });

    return unsubscribe;
  }, [context, type]);
}

/**
 * Hook to subscribe to all notifications.
 * The callback will be called for every notification received.
 *
 * @param callback - Function to call when any notification is received
 *
 * @example
 * useNotificationAll((event) => {
 *   console.log('Notification:', event.type, event.data);
 * });
 */
export function useNotificationAll(callback: (event: NotificationEvent) => void) {
  const context = useContext(NotificationContext);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!context) {
      console.warn('useNotificationAll must be used within a NotificationProvider');
      return;
    }

    const unsubscribe = context.subscribeAll((event) => {
      callbackRef.current(event);
    });

    return unsubscribe;
  }, [context]);
}

/**
 * Hook to get the notification connection status.
 *
 * @returns Object with isConnected and sessionId
 */
export function useNotificationStatus() {
  const context = useContext(NotificationContext);

  if (!context) {
    return { isConnected: false, sessionId: null };
  }

  return {
    isConnected: context.isConnected,
    sessionId: context.sessionId,
  };
}
