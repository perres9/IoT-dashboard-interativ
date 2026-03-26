"use client";

/**
 * Custom Hook: useWebSocket
 * Manages WebSocket connection for real-time sensor data
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { SensorDataPayload } from "@/types/sensor";

interface UseWebSocketOptions {
  url?: string;
  onMessage?: (data: SensorDataPayload) => void;
  enabled?: boolean;
}

export const useWebSocket = ({
  url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/sensors",
  onMessage,
  enabled = true,
}: UseWebSocketOptions = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      console.log(`Attempting to connect to WebSocket: ${url}`);
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SensorDataPayload;
          onMessage?.(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current?.();
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnected(false);
    }
  }, [enabled, url, onMessage]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    const delayedConnect = setTimeout(() => {
      connect();
    }, 0);

    return () => {
      clearTimeout(delayedConnect);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    send,
  };
};
