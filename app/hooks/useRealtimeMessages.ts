import { useState, useEffect } from 'react';
import { Message } from '@prisma/client';
import useSocket from '@/lib/hooks/useSocket';
import { useMessageStore } from './useMessageStore';
import { SerializedMessage } from '../types/chat';

interface UseRealtimeMessagesResult {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
}

export function useRealtimeMessages(conversationId: string): UseRealtimeMessagesResult {
  const { messages, setMessages, addMessage } = useMessageStore();
  const [isLoading, setIsLoading] = useState(true);
  const { on, off, events } = useSocket();

  // Handle real-time message updates
  useEffect(() => {
    const handleMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        addMessage(message);
      }
    };

    on(events.MESSAGE_RECEIVED, handleMessage);

    return () => {
      off(events.MESSAGE_RECEIVED);
    };
  }, [conversationId, addMessage, on, off, events]);

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const allMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: SerializedMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, setMessages]);

  return { messages, isLoading, addMessage };
}