import { Message } from '@prisma/client';
import { SocketMessage } from '@/lib/socket/types/message';

export function mapSocketMessageToMessage(msg: SocketMessage): Message {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender,
    timestamp: new Date(msg.timestamp),
    platform: msg.platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId,
    imageBase64: msg.imageBase64
  };
}

export function mapMessageToSocketMessage(msg: Message): SocketMessage {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp.toISOString(),
    platform: msg.platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId,
    imageBase64: msg.imageBase64
  };
}