import { Platform, SenderType } from '@prisma/client';

export interface SocketMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: string;
  messageType?: 'text' | 'image';
  externalId?: string | null;
  chatType?: string | null;
  chatId?: string | null;
  imageBase64?: string | null;
  platformType: Platform; // Renamed from platform to platformType to be more explicit
}