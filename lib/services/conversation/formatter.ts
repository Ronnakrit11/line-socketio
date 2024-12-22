import { Conversation, Message } from '@prisma/client';

export interface FormattedMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
  platform: string;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  imageBase64: string | null;
}

export interface FormattedConversation {
  id: string;
  platform: string;
  channelId: string;
  userId: string;
  messages: FormattedMessage[];
  createdAt: string;
  updatedAt: string;
  lineAccountId: string | null;
}

export function formatMessageForSocket(message: Message): FormattedMessage {
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

export function formatConversationForSocket(conversation: Conversation & { messages: Message[] }): FormattedConversation {
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