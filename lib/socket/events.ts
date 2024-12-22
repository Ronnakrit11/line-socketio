export const SOCKET_EVENTS = {
  // Message events
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_SENT: 'message:sent',
  
  // Conversation events
  CONVERSATION_UPDATED: 'conversation:updated',
  CONVERSATIONS_UPDATED: 'conversations:updated',
  
  // Typing events
  TYPING_START: 'typing:start',
  TYPING_END: 'typing:end',
  CLIENT_TYPING: 'client:typing',
  
  // Dashboard events
  METRICS_UPDATED: 'metrics:updated',
  
  // Document events
  QUOTATION_CREATED: 'quotation:created',
  QUOTATION_UPDATED: 'quotation:updated',
  QUOTATION_DELETED: 'quotation:deleted',

  // Auth events
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error',
  AUTH_LOGOUT: 'auth:logout'
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];