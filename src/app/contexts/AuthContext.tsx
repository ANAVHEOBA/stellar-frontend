'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { checkToken, getMe, refreshToken, logout } from '../lib/auth/client';
import type { User } from '../lib/auth/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  refreshUserToken: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add debug logging
  useEffect(() => {
    console.log('Auth state changed:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      isLoading 
    });
  }, [user, token, isLoading]);

  // Check token validity on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { valid } = await checkToken(storedToken);
          if (valid) {
            await login(storedToken);
          } else {
            await logoutUser();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          await logoutUser();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Auto refresh token before expiry
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      refreshUserToken();
    }, 6 * 60 * 60 * 1000); // Refresh every 6 hours

    return () => clearInterval(refreshInterval);
  }, [token]);

  const login = async (newToken: string) => {
    try {
      console.log('Attempting login with token');
      const { data: { user } } = await getMe(newToken);
      console.log('User data from server:', user);
      setUser(user);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      console.log('Login successful:', { user });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const refreshUserToken = async () => {
    if (!token) return;
    try {
      const { data: { token: newToken, user: newUser } } = await refreshToken(token);
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      await logoutUser();
    }
  };

  const logoutUser = async () => {
    if (token) {
      try {
        await logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading,
      login,
      refreshUserToken,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 