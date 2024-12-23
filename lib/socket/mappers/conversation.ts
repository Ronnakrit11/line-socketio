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
    lineAccountId: socketConversation.lineAccountId
  };
}