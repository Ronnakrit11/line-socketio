import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { socket, SOCKET_EVENTS } from '../config/socket';

export function useAuth() {
  const router = useRouter();

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Emit socket event for successful login
        socket.emit(SOCKET_EVENTS.AUTH_SUCCESS);
        return { success: true };
      }

      const data = await response.json();
      socket.emit(SOCKET_EVENTS.AUTH_ERROR, data.error);
      return { success: false, error: data.error };
    } catch (err) {
      const error = 'An error occurred during login';
      socket.emit(SOCKET_EVENTS.AUTH_ERROR, error);
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      socket.emit(SOCKET_EVENTS.AUTH_LOGOUT);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [router]);

  return { login, logout };
}