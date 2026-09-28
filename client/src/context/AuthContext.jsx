import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getToken } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setAdmin(me);
      } catch {
        authService.logout();
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = useCallback(async (username, password) => {
    const loggedInAdmin = await authService.login(username, password);
    setAdmin(loggedInAdmin);
    return loggedInAdmin;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, setAdmin, login, logout, loading, isAuthenticated: !!admin }),
    [admin, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
