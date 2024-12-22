import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../socket/client';
import { SOCKET_EVENTS } from '../socket/events';

export default function useSocket() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = getSocket();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string) => {
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