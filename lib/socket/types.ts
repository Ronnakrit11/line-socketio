import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';
import { Message, Platform } from '@prisma/client';
import { DashboardMetrics } from '@/app/types/dashboard';

// Base message type
export interface SocketMessage {
  [x: string]: string | null;
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
}

// Base conversation type
export interface SocketConversation {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  messages: SocketMessage[];
  createdAt: string;
  updatedAt: string;
  lineAccountId?: string | null;
}

export interface SocketTypingEvent {
  conversationId: string;
  isTyping: boolean;
}

// Map event names to their data types
export interface SocketEventData {
  [SOCKET_EVENTS.MESSAGE_RECEIVED]: Message;
  [SOCKET_EVENTS.MESSAGE_SENT]: Message;
  [SOCKET_EVENTS.CONVERSATION_UPDATED]: SocketConversation;
  [SOCKET_EVENTS.CONVERSATIONS_UPDATED]: SocketConversation[];
  [SOCKET_EVENTS.TYPING_START]: SocketTypingEvent;
  [SOCKET_EVENTS.TYPING_END]: SocketTypingEvent;
  [SOCKET_EVENTS.CLIENT_TYPING]: SocketTypingEvent;
  [SOCKET_EVENTS.METRICS_UPDATED]: DashboardMetrics;
}

export type SocketEventCallback<T> = (data: T) => void;

export interface SocketHook {
  socket: Socket | undefined;
  emit: <K extends keyof SocketEventData>(event: K, data: SocketEventData[K]) => void;
  on: <K extends keyof SocketEventData>(event: K, callback: SocketEventCallback<SocketEventData[K]>) => void;
  off: <K extends keyof SocketEventData>(event: K) => void;
  events: typeof SOCKET_EVENTS;
}