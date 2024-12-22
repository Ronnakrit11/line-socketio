import { Message } from '@prisma/client';

export function formatMessageForSocket(message: Message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId,
    imageBase64: message.imageBase64
  };
}