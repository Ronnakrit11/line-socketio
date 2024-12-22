import { EventEmitter } from '@/lib/socket/utils/eventEmitter';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { formatMessageForSocket, formatConversationForSocket } from '../../conversation/formatter';
import { Message, Conversation } from '@prisma/client';
import { SocketEventData } from '@/lib/socket/types';

export async function broadcastLineMessage(message: Message, conversation: Conversation & { messages: Message[] }) {
  try {
    const formattedMessage = formatMessageForSocket(message);
    const formattedConversation = formatConversationForSocket(conversation);

    // Broadcast message and conversation updates using proper types
    await Promise.all([
      EventEmitter.emit<keyof SocketEventData>(SOCKET_EVENTS.MESSAGE_RECEIVED, formattedMessage),
      EventEmitter.emit<keyof SocketEventData>(SOCKET_EVENTS.CONVERSATION_UPDATED, formattedConversation)
    ]);

    return true;
  } catch (error) {
    console.error('Error broadcasting LINE message:', error);
    return false;
  }
}

export async function broadcastLineConversations(conversations: (Conversation & { messages: Message[] })[]) {
  try {
    const formattedConversations = conversations.map(formatConversationForSocket);
    await EventEmitter.emit<keyof SocketEventData>(
      SOCKET_EVENTS.CONVERSATIONS_UPDATED, 
      formattedConversations
    );
    return true;
  } catch (error) {
    console.error('Error broadcasting LINE conversations:', error);
    return false;
  }
}