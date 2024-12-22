```typescript
import { useEffect } from 'react';
import useSocket from '@/lib/hooks/useSocket';
import { SOCKET_EVENTS } from '../events';

export function useSocketAuth(token: string) {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, token]);
}
```