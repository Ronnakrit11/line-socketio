import { MessageWithChat } from '@/app/types/chat';
import { SocketMessage } from '@/lib/socket/types/message';

export function mapSocketMessageToMessage(msg: SocketMessage): MessageWithChat {
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