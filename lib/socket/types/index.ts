export * from './message';
export * from './conversation';
export * from './events';

import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../events';
import { SocketMessage } from './message';
import { SocketConversation } from './conversation';
import { DashboardMetrics } from '@/app/types/dashboard';

export interface SocketEventData {
  [SOCKET_EVENTS.MESSAGE_RECEIVED]: SocketMessage;
  [SOCKET_EVENTS.MESSAGE_SENT]: SocketMessage;
  [SOCKET_EVENTS.CONVERSATION_UPDATED]: SocketConversation;
  [SOCKET_EVENTS.CONVERSATIONS_UPDATED]: SocketConversation[];
  [SOCKET_EVENTS.TYPING_START]: { conversationId: string; isTyping: boolean };
  [SOCKET_EVENTS.TYPING_END]: { conversationId: string; isTyping: boolean };
  [SOCKET_EVENTS.CLIENT_TYPING]: { conversationId: string; isTyping: boolean };
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