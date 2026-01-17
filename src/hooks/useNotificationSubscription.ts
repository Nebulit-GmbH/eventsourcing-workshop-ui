import { useEffect, useRef, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080';

function generateSessionId(): string {
  return crypto.randomUUID();
}

function getOrCreateSessionId(): string {
  const storageKey = 'notification_session_id';
  let sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

export interface NotificationEvent {
  type: string;
  data: unknown;
}

export interface UseNotificationSubscriptionOptions {
  onMessage?: (event: NotificationEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  timeout?: number;
}

export function useNotificationSubscription(options: UseNotificationSubscriptionOptions = {}) {
  const { onMessage, onError, onOpen, timeout = 0 } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const subscribe = useCallback(() => {
    if (eventSourceRef.current) {
      return;
    }

    const sessionId = getOrCreateSessionId();
    sessionIdRef.current = sessionId;

    const url = `${API_BASE_URL}/subscribe/${sessionId}${timeout > 0 ? `?timeout=${timeout}` : ''}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log(`SSE connection established for session: ${sessionId}`);
      onOpen?.();
    };

    eventSource.onmessage = (event) => {
        try {
          console.log("notified")
        const data = JSON.parse(event.data);
        onMessage?.({ type: 'message', data });
      } catch(e) {
            console.error(e)
        onMessage?.({ type: 'message', data: event.data });
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError?.(error);

      if (eventSource.readyState === EventSource.CLOSED) {
        eventSourceRef.current = null;
        setTimeout(() => subscribe(), 5000);
      }
    };

    eventSourceRef.current = eventSource;
  }, [onMessage, onError, onOpen, timeout]);

  const unsubscribe = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  return {
    sessionId: sessionIdRef.current,
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
    unsubscribe,
    reconnect: subscribe,
  };
}