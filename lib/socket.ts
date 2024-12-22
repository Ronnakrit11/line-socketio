import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type SocketServer = SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
export type SocketClient = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;

let io: SocketServer | undefined;

export const SOCKET_EVENTS = {
  MESSAGE_RECEIVED: 'message-received',
  CONVERSATION_UPDATED: 'conversation-updated',
  CONVERSATIONS_UPDATED: 'conversations-updated',
  TYPING_START: 'typing-start',
  TYPING_END: 'typing-end',
  CLIENT_TYPING: 'client-typing',
  METRICS_UPDATED: 'metrics-updated',
  QUOTATION_CREATED: 'quotation-created',
  QUOTATION_UPDATED: 'quotation-updated',
  QUOTATION_DELETED: 'quotation-deleted'
} as const;

export function initSocket(httpServer: HTTPServer) {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket: SocketClient) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}

// Helper function to emit events
export function emitEvent(event: string, data: any) {
  const socketServer = getIO();
  socketServer.emit(event, data);
}