import { SocketMiddlewareConfig } from './types';
import { authMiddleware } from './auth';
import { loggingMiddleware } from './logging';
import { errorMiddleware } from './error';

export const middlewareConfig: SocketMiddlewareConfig[] = [
  {
    middleware: loggingMiddleware,
    name: 'logging',
    enabled: true
  },
  {
    middleware: authMiddleware,
    name: 'auth',
    enabled: process.env.NODE_ENV === 'production'
  },
  {
    middleware: errorMiddleware,
    name: 'error',
    enabled: true
  }
];