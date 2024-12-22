import { Socket } from 'socket.io';

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void | Promise<void>;

export interface SocketMiddlewareConfig {
  middleware: SocketMiddleware;
  name: string;
  enabled: boolean;
}