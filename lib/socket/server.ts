import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketHandlers } from './handlers';
import { applyMiddleware } from './middleware';

let io: SocketIOServer;

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Apply middleware
    io.use(applyMiddleware);

    // Setup connection handler
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      setupSocketHandlers(socket);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }
  return io;
}