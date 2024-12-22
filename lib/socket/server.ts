import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'socket.io';
import { setupSocketHandlers } from './handlers';
import { applyMiddleware } from './middleware';
import { SOCKET_SERVER_CONFIG } from './config/server';
import type { SocketServerInstance } from './types/server';

/**
 * Initialize Socket.IO server
 */
export function initSocketServer(httpServer: HTTPServer): SocketServerInstance {
  const io = new SocketServer(httpServer, SOCKET_SERVER_CONFIG);

  // Apply middleware
  io.use(applyMiddleware);

  // Setup connection handler
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    setupSocketHandlers(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return { io, httpServer };
}

// Start standalone socket server if running directly
if (require.main === module) {
  const httpServer = new HTTPServer();
  const server = initSocketServer(httpServer);
  
  const port = process.env.SOCKET_PORT || 3001;
  server.httpServer.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}`);
  });
}