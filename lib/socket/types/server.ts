import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket, ServerOptions } from 'socket.io';

export interface SocketServerConfig extends Partial<ServerOptions> {
  cors: {
    origin: string | string[];
    methods?: string[];
    credentials?: boolean;
  };
  path: string;
  addTrailingSlash: boolean;
}

export interface SocketServerInstance {
  io: SocketServer;
  httpServer: HTTPServer;
}

export type SocketHandler = (socket: Socket) => void;