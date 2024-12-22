import { Conversation, Message } from '@prisma/client';
import { SocketConversation } from '@/lib/socket/types/conversation';
import { SocketMessage } from '@/lib/socket/types/message';

export function formatMessageForSocket(message: Message): SocketMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platformType: message.platform, // Updated to use platformType
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId,
    imageBase64: message.imageBase64
  };
}

export function formatConversationForSocket(
  conversation: Conversation & { messages: Message[] }
): SocketConversation {
  return {
    id: conversation.id,
    platform: conversation.platform,
    channelId: conversation.channelId,
    userId: conversation.userId,
    messages: conversation.messages.map(formatMessageForSocket),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    lineAccountId: conversation.lineAccountId
  };
}