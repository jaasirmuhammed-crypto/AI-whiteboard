import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile, AuthState } from '../types/user';
import { PaymentService, FIXED_PREMIUM_PRICE_INR } from '../services/paymentService';

interface AuthContextType extends AuthState {
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
  deductToken: () => boolean;
  upgradeToPremium: (paymentId?: string) => void;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'guest_student_01',
  name: 'Alex Rivera',
  email: 'alex.student@aiwhiteboard.io',
  preferredLanguage: 'en',
  preferredTheme: 'light',
  createdAt: new Date().toISOString(),
  plan: 'free',
  tokensRemaining: 5,
  subscriptionStatus: 'inactive',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('ai_whiteboard_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const user = parsed.user;
        // Check if there is an active subscription in the database
        const sub = user ? PaymentService.getSubscriptionByUserId(user.id) : null;
        if (sub && sub.status === 'active') {
          user.plan = 'premium';
          user.tokensRemaining = 999999;
          user.subscriptionStatus = 'active';
          user.subscriptionExpiresAt = sub.expiresAt;
        } else if (!user.plan) {
          user.plan = 'free';
          user.tokensRemaining = user.tokensRemaining !== undefined ? user.tokensRemaining : 5;
          user.subscriptionStatus = 'inactive';
        }
        return {
          user,
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
    const sub = PaymentService.getSubscriptions().find((s) => s.userEmail === email && s.status === 'active');
    const isPrem = !!sub;

    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      preferredLanguage: 'en',
      preferredTheme: 'light',
      createdAt: new Date().toISOString(),
      plan: isPrem ? 'premium' : 'free',
      tokensRemaining: isPrem ? 999999 : 5,
      subscriptionStatus: isPrem ? 'active' : 'inactive',
      subscriptionExpiresAt: sub?.expiresAt,
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
      plan: 'free',
      tokensRemaining: 5,
      subscriptionStatus: 'inactive',
    };
    saveAuth(user, 'jwt_token_' + Date.now());
    return true;
  };

  const guestLogin = () => {
    saveAuth({ ...DEMO_USER, id: 'guest_' + Date.now() }, 'guest_token_' + Date.now());
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('ai_whiteboard_auth');
  };

  const isPremium = authState.user?.plan === 'premium' && authState.user?.subscriptionStatus === 'active';

  /**
   * Deducts 1 token for AI operation if user is on Free plan.
   * Returns true if operation is permitted, false if tokens are exhausted (0).
   */
  const deductToken = useCallback((): boolean => {
    if (!authState.user) return true; // Guest allowed default quota check
    if (authState.user.plan === 'premium') return true; // Unlimited for Premium

    if (authState.user.tokensRemaining <= 0) {
      return false; // Exhausted!
    }

    const updatedUser: UserProfile = {
      ...authState.user,
      tokensRemaining: Math.max(0, authState.user.tokensRemaining - 1),
    };
    saveAuth(updatedUser, authState.token || 'token_active');
    return true;
  }, [authState]);

  /**
   * Upgrades the user account immediately to ⭐ PREMIUM USER with unlimited tokens
   * and saves the active subscription to persistent local/database storage.
   */
  const upgradeToPremium = useCallback((paymentId?: string) => {
    const effectivePaymentId = paymentId || 'pay_rzp_' + Math.random().toString(36).substring(2, 12);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const baseUser = authState.user || {
      id: 'usr_premium_' + Date.now(),
      name: 'Scholar User',
      email: 'student.scholar@aiwhiteboard.io',
      preferredLanguage: 'en',
      preferredTheme: 'light' as const,
      createdAt: new Date().toISOString(),
      plan: 'premium' as const,
      tokensRemaining: 999999,
      subscriptionStatus: 'active' as const,
    };

    const updatedUser: UserProfile = {
      ...baseUser,
      plan: 'premium',
      tokensRemaining: 999999,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiry.toISOString(),
    };

    // Save into Payment & Subscription database
    PaymentService.processSuccessfulUpgrade(updatedUser, effectivePaymentId, FIXED_PREMIUM_PRICE_INR, 'INR');

    saveAuth(updatedUser, authState.token || 'jwt_token_premium_' + Date.now());
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        guestLogin,
        logout,
        deductToken,
        upgradeToPremium,
        isPremium,
      }}
    >
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
