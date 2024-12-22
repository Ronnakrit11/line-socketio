import { useEffect } from 'react';
import { ConversationWithMessages, MessageWithChat } from '@/app/types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from './useChatState';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { SocketEventData } from '@/lib/socket/types';

export function useConversationEvents(initialConversations: ConversationWithMessages[]) {
  const { setConversations, updateConversation } = useChatState();
  const { on, off } = useSocket();

  // Initialize conversations
  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
    }
  }, [initialConversations, setConversations]);

  // Setup Socket.IO event handlers
  useEffect(() => {
    const handleConversationUpdate = (socketConversation: SocketEventData[typeof SOCKET_EVENTS.CONVERSATION_UPDATED]) => {
      const updatedConversation: ConversationWithMessages = {
        ...socketConversation,
        messages: socketConversation.messages.map(msg => ({
          id: msg.id,
          conversationId: msg.conversationId,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          platform: msg.platformType,
          externalId: msg.externalId || null,
          chatType: msg.chatType || null,
          chatId: msg.chatId || null,
          imageBase64: msg.imageBase64 || null
        } as MessageWithChat)),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt)
      };
      updateConversation(updatedConversation);
    };

    const handleConversationsUpdate = (socketConversations: SocketEventData[typeof SOCKET_EVENTS.CONVERSATIONS_UPDATED]) => {
      const formattedConversations = socketConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          id: msg.id,
          conversationId: msg.conversationId,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          platform: msg.platformType,
          externalId: msg.externalId || null,
          chatType: msg.chatType || null,
          chatId: msg.chatId || null,
          imageBase64: msg.imageBase64 || null
        } as MessageWithChat)),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      }));
      setConversations(formattedConversations);
    };

    // Type-safe event subscriptions
    on(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
    on(SOCKET_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(SOCKET_EVENTS.CONVERSATION_UPDATED);
      off(SOCKET_EVENTS.CONVERSATIONS_UPDATED);
    };
  }, [updateConversation, setConversations, on, off]);
}