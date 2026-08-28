import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile, AuthState, UserSession } from '../types/user';
import { PaymentService, FIXED_PREMIUM_PRICE_INR } from '../services/paymentService';
import { AnalyticsTrackingService } from '../services/analyticsTrackingService';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string, name?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
  logoutAllDevices: () => void;
  deductToken: () => boolean;
  upgradeToPremium: (paymentId?: string) => void;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCurrentDeviceSession = (): UserSession => {
  const userAgent = navigator.userAgent;
  let browser = 'Chrome';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edg')) browser = 'Edge';

  let os = 'Windows';
  if (userAgent.includes('Macintosh')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

  return {
    id: 'sess_' + Date.now(),
    deviceName: `${os} PC (${browser})`,
    browser,
    os,
    ipAddress: '127.0.0.1 (Local Verified)',
    lastActiveAt: new Date().toISOString(),
    isCurrent: true,
  };
};

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
  authMethod: 'guest',
  sessions: [getCurrentDeviceSession()],
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
        if (!user.sessions || user.sessions.length === 0) {
          user.sessions = [getCurrentDeviceSession()];
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
    const currentSession = getCurrentDeviceSession();
    const existingSessions = user.sessions || [];
    const updatedSessions = [
      currentSession,
      ...existingSessions.filter(s => s.id !== currentSession.id).map(s => ({ ...s, isCurrent: false })),
    ].slice(0, 5);

    const updatedUser = { ...user, sessions: updatedSessions };
    const state = { user: updatedUser, isAuthenticated: true, token };
    setAuthState(state);
    localStorage.setItem('ai_whiteboard_auth', JSON.stringify({ user: updatedUser, token }));
    PaymentService.saveRegisteredUser(updatedUser);
  };

  const login = async (email: string, password?: string, name?: string): Promise<boolean> => {
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
      authMethod: 'email',
    };
    saveAuth(user, 'jwt_token_' + Date.now());
    AnalyticsTrackingService.trackEvent('USER_LOGIN', {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: { method: 'email' },
    });
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Simulate real Google OAuth identity payload with high reliability
    const googleEmail = 'scholar.google@gmail.com';
    const googleName = 'Scholar Google User';
    const sub = PaymentService.getSubscriptions().find((s) => s.userEmail === googleEmail && s.status === 'active');
    const isPrem = !!sub;

    const user: UserProfile = {
      id: 'usr_g_' + Date.now(),
      name: googleName,
      email: googleEmail,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      preferredLanguage: 'en',
      preferredTheme: 'light',
      createdAt: new Date().toISOString(),
      plan: isPrem ? 'premium' : 'free',
      tokensRemaining: isPrem ? 999999 : 5,
      subscriptionStatus: isPrem ? 'active' : 'inactive',
      subscriptionExpiresAt: sub?.expiresAt,
      authMethod: 'google',
    };
    saveAuth(user, 'google_oauth_token_' + Date.now());
    AnalyticsTrackingService.trackEvent('USER_LOGIN', {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: { method: 'google' },
    });
    return true;
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
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
      authMethod: 'email',
    };
    saveAuth(user, 'jwt_token_' + Date.now());
    AnalyticsTrackingService.trackEvent('USER_REGISTERED', {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
    });
    return true;
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    // Record password reset request in analytics & telemetry
    AnalyticsTrackingService.trackEvent('SETTINGS_CHANGED' as any, {
      userEmail: email,
      metadata: { action: 'PASSWORD_RESET_REQUESTED' },
    });
    return true;
  };

  const guestLogin = () => {
    saveAuth({ ...DEMO_USER, id: 'guest_' + Date.now() }, 'guest_token_' + Date.now());
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('ai_whiteboard_auth');
  };

  const logoutAllDevices = () => {
    if (authState.user) {
      const revokedUser: UserProfile = {
        ...authState.user,
        sessions: [],
      };
      PaymentService.saveRegisteredUser(revokedUser);
    }
    setAuthState({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('ai_whiteboard_auth');
    localStorage.removeItem('ai_whiteboard_active_proj_id');
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

    AnalyticsTrackingService.trackEvent('PAYMENT_SUCCESS', {
      userId: updatedUser.id,
      userEmail: updatedUser.email,
      userName: updatedUser.name,
      metadata: { paymentId: effectivePaymentId, amount: FIXED_PREMIUM_PRICE_INR },
    });

    AnalyticsTrackingService.trackEvent('PLAN_UPGRADED', {
      userId: updatedUser.id,
      userEmail: updatedUser.email,
      userName: updatedUser.name,
      metadata: { plan: 'premium', expiry: expiry.toISOString() },
    });
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithGoogle,
        register,
        sendPasswordReset,
        guestLogin,
        logout,
        logoutAllDevices,
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
