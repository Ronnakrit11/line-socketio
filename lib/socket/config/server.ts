import { SocketServerConfig } from '../types/server';

export const SOCKET_SERVER_CONFIG: SocketServerConfig = {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_URL || ''
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: 'page/api/socket.io',
  addTrailingSlash: false
};