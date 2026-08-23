import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'guest_student_01',
  name: 'Alex Rivera',
  email: 'alex.student@aiwhiteboard.io',
  preferredLanguage: 'en',
  preferredTheme: 'light',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('ai_whiteboard_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user,
          isAuthenticated: true,
          token: parsed.token || 'token_' + Date.now(),
        };
      } catch (e) {
        console.error('Failed to parse saved auth', e);
      }
    }
    return {
      user: null,
      isAuthenticated: false,
      token: null,
    };
  });

  const saveAuth = (user: UserProfile, token: string) => {
    const state = { user, isAuthenticated: true, token };
    setAuthState(state);
    localStorage.setItem('ai_whiteboard_auth', JSON.stringify({ user, token }));
  };

  const login = async (email: string, name?: string): Promise<boolean> => {
    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      preferredLanguage: 'en',
      preferredTheme: 'light',
      createdAt: new Date().toISOString(),
    };
    saveAuth(user, 'jwt_token_' + Date.now());
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      preferredLanguage: 'en',
      preferredTheme: 'light',
      createdAt: new Date().toISOString(),
    };
    saveAuth(user, 'jwt_token_' + Date.now());
    return true;
  };

  const guestLogin = () => {
    saveAuth(DEMO_USER, 'guest_token_' + Date.now());
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('ai_whiteboard_auth');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
