import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../client';
import { SOCKET_EVENTS } from '../events';
import type { SocketHook, SocketEventCallback } from '@/lib/socket/types';

export default function useSocket(): SocketHook {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = getSocket();
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const emit = useCallback((event: keyof typeof SOCKET_EVENTS, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(<T>(event: keyof typeof SOCKET_EVENTS, callback: SocketEventCallback<T>) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: keyof typeof SOCKET_EVENTS) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    events: SOCKET_EVENTS
  };
}