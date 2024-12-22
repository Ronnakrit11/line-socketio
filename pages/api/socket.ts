import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { setupSocketHandlers } from '@/lib/socket/handlers';
import { applyMiddleware } from '@/lib/socket/middleware';

let httpServer: HTTPServer;
let socketServer: SocketServer;

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!socketServer) {
    httpServer = new HTTPServer();
    socketServer = new SocketServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_APP_URL
          : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    socketServer.use(applyMiddleware);

    socketServer.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      setupSocketHandlers(socket);
    });

    httpServer.listen(3001);
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};