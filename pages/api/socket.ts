import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { setupSocketHandlers } from '@/lib/socket/handlers';
import { applyMiddleware } from '@/lib/socket/middleware';

let io: SocketServer;

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!io) {
    // Create new Socket.IO server if it doesn't exist
    if (!(res.socket as any).server.io) {
      const httpServer = (res.socket as any).server as HTTPServer;
      io = new SocketServer(httpServer, {
        path: '/api/socket.io',
        addTrailingSlash: false,
        cors: {
          origin: process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_APP_URL
            : 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['websocket', 'polling']
      });

      io.use(applyMiddleware);

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        setupSocketHandlers(socket);
      });

      (res.socket as any).server.io = io;
    }
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
