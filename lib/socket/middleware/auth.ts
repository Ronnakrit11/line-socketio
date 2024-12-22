import { Socket } from 'socket.io';
import { verifyToken } from '@/lib/auth/token';

export async function authMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const { isValid } = await verifyToken(token);
    if (!isValid) {
      return next(new Error('Invalid token'));
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Authentication failed'));
  }
}