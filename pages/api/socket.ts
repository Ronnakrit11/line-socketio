import { Server as SocketServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { setupSocketHandlers } from '@/lib/socket/handlers';
import { applyMiddleware } from '@/lib/socket/middleware';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server.io) {
    console.log('Initializing Socket.IO server...');
    
    const io = new SocketServer((res.socket as any).server, {
      path: '/api/socket.io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.use(applyMiddleware);

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      setupSocketHandlers(socket);
    });

    (res.socket as any).server.io = io;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};