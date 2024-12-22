import { useCallback, useEffect } from 'react';
import useSocket from './useSocket';
import { SocketMessage, SocketConversation } from '../socket/types';

export function useConversationSocket(
  conversationId: string,
  onMessageReceived?: (message: SocketMessage) => void,
  onConversationUpdated?: (conversation: SocketConversation) => void
) {
  const { on, off, events } = useSocket();

  const handleMessage = useCallback((message: SocketMessage) => {
    if (message.conversationId === conversationId && onMessageReceived) {
      onMessageReceived(message);
    }
  }, [conversationId, onMessageReceived]);

  const handleConversationUpdate = useCallback((conversation: SocketConversation) => {
    if (conversation.id === conversationId && onConversationUpdated) {
      onConversationUpdated(conversation);
    }
  }, [conversationId, onConversationUpdated]);

  useEffect(() => {
    on(events.MESSAGE_RECEIVED, handleMessage);
    on(events.CONVERSATION_UPDATED, handleConversationUpdate);

    return () => {
      off(events.MESSAGE_RECEIVED);
      off(events.CONVERSATION_UPDATED);
    };
  }, [events, handleMessage, handleConversationUpdate, on, off]);
}