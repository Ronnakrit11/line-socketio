import { Platform } from '@prisma/client';
import { SocketMessage } from './message';

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