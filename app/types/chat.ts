import { Conversation as PrismaConversation, Message as PrismaMessage, Platform } from '@prisma/client';

// Base types from Prisma with proper message fields
export interface MessageWithChat extends PrismaMessage {
  chatType: string | null;
  chatId: string | null;
}

// Conversation with messages including chat fields
export type ConversationWithMessages = Omit<PrismaConversation, 'lineAccountId'> & {
  messages: MessageWithChat[];
  lineAccountId?: string | null;
};

// Serialized types for API/JSON
export interface SerializedMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'USER' | 'BOT';
  timestamp: string;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  imageBase64: string | null;
}

export interface SerializedConversation {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
  lineAccountId?: string | null;
}