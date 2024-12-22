export const AUTH_EVENTS = {
    AUTH_SUCCESS: 'auth:success',
    AUTH_ERROR: 'auth:error', 
    AUTH_LOGOUT: 'auth:logout'
  } as const;
  
  export type AuthEventType = keyof typeof AUTH_EVENTS;