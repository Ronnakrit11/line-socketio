import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';

let socket: Socket | undefined;

export function initSocketClient(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Setup error handling
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
  if (!socket) {
    socket = initSocketClient();
  }
  return socket;
}

export function emitEvent<T>(event: keyof typeof SOCKET_EVENTS, data: T): void {
  const socket = getSocket();
  socket.emit(event, data);
}

export function subscribeToEvent<T>(
  event: keyof typeof SOCKET_EVENTS, 
  callback: (data: T) => void
): () => void {
  const socket = getSocket();
  socket.on(event, callback);
  return () => socket.off(event, callback);
}