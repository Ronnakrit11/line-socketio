export interface AuthSuccessEvent {
    token: string;
  }
  
  export interface AuthErrorEvent {
    error: string;
  }
  
  export interface AuthEventMap {
    'auth:success': AuthSuccessEvent;
    'auth:error': AuthErrorEvent;
    'auth:logout': void;
  }