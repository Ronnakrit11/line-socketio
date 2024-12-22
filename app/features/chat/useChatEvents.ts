import { useEffect } from 'react';
import { ConversationWithMessages, MessageWithChat } from '@/app/types/chat';
import useSocket from '@/lib/hooks/useSocket';
import { useChatState } from './useChatState';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { SocketMessage } from '@/lib/socket/types/message';
import { SocketConversation } from '@/lib/socket/types/conversation';
import { SocketEventCallback } from '@/lib/socket/types/events';

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
    const handleConversationUpdate: SocketEventCallback<SocketConversation> = (socketConversation) => {
      const updatedConversation: ConversationWithMessages = {
        ...socketConversation,
        messages: socketConversation.messages.map((msg: SocketMessage) => ({
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
        } as MessageWithChat)),
        createdAt: new Date(socketConversation.createdAt),
        updatedAt: new Date(socketConversation.updatedAt)
      };
      updateConversation(updatedConversation);
    };

    const handleConversationsUpdate: SocketEventCallback<SocketConversation[]> = (socketConversations) => {
      const formattedConversations = socketConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map((msg: SocketMessage) => ({
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
        } as MessageWithChat)),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      }));
      setConversations(formattedConversations);
    };

    // Subscribe to events with proper typing
    on(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
    on(SOCKET_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      off(SOCKET_EVENTS.CONVERSATION_UPDATED);
      off(SOCKET_EVENTS.CONVERSATIONS_UPDATED);
    };
  }, [updateConversation, setConversations, on, off]);
}