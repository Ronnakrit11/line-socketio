import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';

export interface SocketMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
}

export interface SocketConversation {
  id: string;
  updatedAt: string;
  lastMessage?: SocketMessage;
}

export interface SocketTypingEvent {
  conversationId: string;
  isTyping: boolean;
}

export type SocketEventCallback<T = any> = (data: T) => void;

export interface SocketHook {
  socket: Socket | undefined;
  emit: (event: keyof typeof SOCKET_EVENTS, data: any) => void;
  on: <T>(event: keyof typeof SOCKET_EVENTS, callback: SocketEventCallback<T>) => void;
  off: (event: keyof typeof SOCKET_EVENTS) => void;
  events: typeof SOCKET_EVENTS;
}