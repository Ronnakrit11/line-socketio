import { io } from 'socket.io-client';

// Create socket instance
const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

export const SOCKET_EVENTS = {
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error',
  AUTH_LOGOUT: 'auth:logout'
} as const;

export { socket };