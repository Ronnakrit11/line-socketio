import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';

let socket: Socket | undefined;

const SOCKET_CONFIG = {
  path: '/api/socket.io',
  addTrailingSlash: false,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 10000
};

export function initSocketClient(): Socket {
  if (!socket) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    socket = io(baseUrl, SOCKET_CONFIG);
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  return socket;
}

export function getSocket(): Socket {
  return socket || initSocketClient();
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
    socket = undefined;
  }
}

export function emitEvent<T>(event: keyof typeof SOCKET_EVENTS, data: T): void {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit(event, data);
  }
}