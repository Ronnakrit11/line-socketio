import { ConversationWithMessages } from '@/app/types/chat';
import { SocketConversation } from '../types/conversation';
import { mapSocketToMessage } from './message';

export function mapSocketToConversation(socketConversation: SocketConversation): ConversationWithMessages {
  return {
    id: socketConversation.id,
    platform: socketConversation.platform,
    channelId: socketConversation.channelId,
    userId: socketConversation.userId,
    messages: socketConversation.messages.map(mapSocketToMessage),
    createdAt: new Date(socketConversation.createdAt),
    updatedAt: new Date(socketConversation.updatedAt),
    lineAccountId: socketConversation.lineAccountId,
    lineAccount: socketConversation.lineAccount || null
  };
}

export function mapConversationToSocket(conversation: ConversationWithMessages): SocketConversation {
  return {
    id: conversation.id,
    platform: conversation.platform,
    channelId: conversation.channelId,
    userId: conversation.userId,
    messages: conversation.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    })),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    lineAccountId: conversation.lineAccountId,
    lineAccount: conversation.lineAccount
  };
}