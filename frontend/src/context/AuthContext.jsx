import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('traveloop_token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('traveloop_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistSession = (payload) => {
    localStorage.setItem('traveloop_token', payload.access_token);
    localStorage.setItem('traveloop_user', JSON.stringify(payload.user));
    setToken(payload.access_token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const payload = await authService.login(credentials);
    persistSession(payload);
    return payload;
  };

  const signup = async (formData) => {
    const payload = await authService.register(formData);
    persistSession(payload);
    return payload;
  };

  const verifyGoogleEmail = (payload) => authService.verifyGoogleEmail(payload);

  const logout = () => {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, signup, verifyGoogleEmail, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
