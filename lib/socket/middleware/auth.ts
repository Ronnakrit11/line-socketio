import { Socket } from 'socket.io';
import { verifyToken } from '../../auth/token';

export async function authMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const { isValid, payload } = await verifyToken(token);
    if (!isValid || !payload) {
      return next(new Error('Invalid token'));
    }

    // Attach user data to socket
    socket.data.user = payload;
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Authentication failed'));
  }
}