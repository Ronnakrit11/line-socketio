import { useState, useCallback } from 'react';
import { Message } from '@prisma/client';
import useSocket from '@/lib/hooks/useSocket';

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export function useMessageStore(): MessageStore {
  const [messages, setMessages] = useState<Message[]>([]);
  const { emit, events } = useSocket();

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(msg => 
        msg.id === newMessage.id || 
        (msg.id.startsWith('temp-') && msg.content === newMessage.content)
      );
      
      if (exists) return prev;
      
      // Add new message and sort by timestamp
      const updatedMessages = [...prev, {
        ...newMessage,
        timestamp: new Date(newMessage.timestamp)
      }].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Emit message received event
      emit(events.MESSAGE_RECEIVED, newMessage);

      return updatedMessages;
    });
  }, [emit, events]);

  return { messages, setMessages, addMessage };
}