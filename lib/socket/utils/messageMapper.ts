import { Message } from '@prisma/client';
import { SocketMessage } from '../types/message';

export function mapMessageToSocket(message: Message): SocketMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
    platformType: message.platform, // Include both for compatibility
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId,
    imageBase64: message.imageBase64
  };
}

export function mapSocketToMessage(socketMessage: SocketMessage): Message {
  return {
    id: socketMessage.id,
    conversationId: socketMessage.conversationId,
    content: socketMessage.content,
    sender: socketMessage.sender,
    timestamp: new Date(socketMessage.timestamp),
    platform: socketMessage.platform || socketMessage.platformType!, // Use platform or platformType
    externalId: socketMessage.externalId,
    chatType: socketMessage.chatType,
    chatId: socketMessage.chatId,
    imageBase64: socketMessage.imageBase64
  };
}