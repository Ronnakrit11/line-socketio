import { Platform, SenderType } from '@prisma/client';

export interface SocketMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: string;
  platform: Platform;
  platformType: Platform; // Add platformType for compatibility
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  imageBase64: string | null;
}