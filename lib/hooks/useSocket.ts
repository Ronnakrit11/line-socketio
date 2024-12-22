import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../socket/client';
import { SOCKET_EVENTS } from '../socket/events';
import { SocketHook, SocketEventData, SocketEventCallback } from '../socket/types';

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

  const emit = useCallback(<K extends keyof SocketEventData>(
    event: K, 
    data: SocketEventData[K]
  ) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(<K extends keyof SocketEventData>(
    event: K,
    callback: SocketEventCallback<SocketEventData[K]>
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback(<K extends keyof SocketEventData>(event: K) => {
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