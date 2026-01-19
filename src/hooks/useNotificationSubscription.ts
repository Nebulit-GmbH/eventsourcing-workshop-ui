import { useEffect, useRef, useCallback, useState } from 'react';

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
  const sessionIdRef = useRef<string>(getOrCreateSessionId());
  const [isConnected, setIsConnected] = useState(false);

  // Store callbacks in refs to avoid recreating subscribe function
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
  }, [onMessage, onError, onOpen]);

  const subscribe = useCallback(() => {
    if (eventSourceRef.current) {
      return;
    }

    const sessionId = sessionIdRef.current;

    const url = `${API_BASE_URL}/subscribe/${sessionId}${timeout > 0 ? `?timeout=${timeout}` : ''}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log(`SSE connection established for session: ${sessionId}`);
      setIsConnected(true);
      onOpenRef.current?.();
    };

    eventSource.onmessage = (event) => {
      try {
        console.log("notified");
        const data = JSON.parse(event.data);
        onMessageRef.current?.({ type: 'message', data });
      } catch (e) {
        console.error(e);
        onMessageRef.current?.({ type: 'message', data: event.data });
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      
      if (eventSource.readyState === EventSource.CLOSED) {
        setIsConnected(false);
        onErrorRef.current?.(error);
        eventSourceRef.current = null;
        setTimeout(() => subscribe(), 5000);
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        // Still trying to connect, don't mark as disconnected yet
        console.log('SSE reconnecting...');
      }
    };

    eventSourceRef.current = eventSource;
  }, [timeout]);

  const unsubscribe = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
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
    isConnected,
    unsubscribe,
    reconnect: subscribe,
  };
}