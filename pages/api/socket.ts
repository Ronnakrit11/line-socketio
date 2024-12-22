import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { initSocket } from '@/lib/socket';

const httpServer = createServer();
const io = initSocket(httpServer);

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle WebSocket upgrade
    res.end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};