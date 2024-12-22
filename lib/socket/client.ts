import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';

let socket: Socket | undefined;

// Socket.IO configuration
const SOCKET_CONFIG = {
  path: '/api/socket',
  addTrailingSlash: false,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
} as const;

export function initSocketClient(): Socket {
  if (!socket) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    socket = io(baseUrl, {
      ...SOCKET_CONFIG,
      path: '/api/socket'
    });
    setupSocketListeners(socket);
  }
  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    return initSocketClient();
  }
  return socket;
}

export function emitEvent<T>(event: keyof typeof SOCKET_EVENTS, data: T): void {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected, event not emitted:', event);
  }
}

export function subscribeToEvent<T>(
  event: keyof typeof SOCKET_EVENTS,
  callback: (data: T) => void
): () => void {
  const socket = getSocket();
  socket.on(event, callback);
  return () => socket.off(event, callback);
}

function setupSocketListeners(socket: Socket): void {
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Attempt to reconnect with a delay
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, attempt to reconnect
      socket.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
    socket = undefined;
  }
}