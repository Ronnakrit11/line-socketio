import { Socket } from 'socket.io';
import { middlewareConfig } from './config';
import { SocketMiddleware } from './types';

export async function applyMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Get enabled middleware
    const enabledMiddleware = middlewareConfig
      .filter(config => config.enabled)
      .map(config => config.middleware);

    // Execute middleware chain
    for (const middleware of enabledMiddleware) {
      await new Promise<void>((resolve, reject) => {
        try {
          middleware(socket, (err?: Error) => {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Middleware error'));
  }
}

