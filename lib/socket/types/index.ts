import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../events';
import { SocketMessage } from './message';
import { SocketConversation } from './conversation';
import { DashboardMetrics } from '@/app/types/dashboard';
import { QuotationEventData } from './quotation';
import { RoomEvent } from './room';

// Socket event data mapping
export interface SocketEventData {
  [SOCKET_EVENTS.MESSAGE_RECEIVED]: SocketMessage;
  [SOCKET_EVENTS.MESSAGE_SENT]: SocketMessage;
  [SOCKET_EVENTS.CONVERSATION_UPDATED]: SocketConversation;
  [SOCKET_EVENTS.CONVERSATIONS_UPDATED]: SocketConversation[];
  [SOCKET_EVENTS.TYPING_START]: { conversationId: string; isTyping: boolean };
  [SOCKET_EVENTS.TYPING_END]: { conversationId: string; isTyping: boolean };
  [SOCKET_EVENTS.CLIENT_TYPING]: { conversationId: string; isTyping: boolean };
  [SOCKET_EVENTS.METRICS_UPDATED]: DashboardMetrics;
  [SOCKET_EVENTS.QUOTATION_CREATED]: QuotationEventData;
  [SOCKET_EVENTS.QUOTATION_UPDATED]: QuotationEventData;
  [SOCKET_EVENTS.QUOTATION_DELETED]: QuotationEventData;
  [SOCKET_EVENTS.ROOM_JOIN]: RoomEvent;
  [SOCKET_EVENTS.ROOM_LEAVE]: RoomEvent;
}

export type SocketEventCallback<T> = (data: T) => void;

export interface SocketHook {
  socket: Socket | undefined;
  emit: <K extends keyof SocketEventData>(event: K, data: SocketEventData[K]) => void;
  on: <K extends keyof SocketEventData>(event: K, callback: SocketEventCallback<SocketEventData[K]>) => void;
  off: <K extends keyof SocketEventData>(event: K) => void;
  events: typeof SOCKET_EVENTS;
}

// Re-export specific types
export type { SocketMessage } from './message';
export type { SocketConversation } from './conversation';
export type { QuotationEventData } from './quotation';
export type { RoomEvent } from './room';