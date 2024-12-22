import { Socket } from 'socket.io';
import { authMiddleware } from './auth';
import { loggingMiddleware } from './logging';
import { errorMiddleware } from './error';

const middlewares = [
  loggingMiddleware,
  process.env.NODE_ENV === 'production' ? authMiddleware : null,
  errorMiddleware
].filter(Boolean) as ((socket: Socket, next: (err?: Error) => void) => void)[];

export async function applyMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    for (const middleware of middlewares) {
      await new Promise<void>((resolve, reject) => {
        middleware(socket, (err?: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Middleware error'));
  }
}

export { authMiddleware } from './auth';
export { loggingMiddleware } from './logging';
export { errorMiddleware } from './error';