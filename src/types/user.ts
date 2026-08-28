import { WhiteboardElement, BackgroundPattern } from './whiteboard';
import { StudyMaterialsPackage } from './studyMaterial';
import { UserPlanType, SubscriptionStatus } from './payment';

export interface UserSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  preferredLanguage: string;
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: string;
  authMethod?: 'email' | 'google' | 'guest';
  sessions?: UserSession[];
  // Subscription & Token Allowance
  plan: UserPlanType;
  tokensRemaining: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: string;
}

export interface WhiteboardProject {
  id: string;
  userId: string;
  title: string;
  elements: WhiteboardElement[];
  backgroundPattern: BackgroundPattern;
  thumbnailDataUrl?: string;
  createdAt: string;
  updatedAt: string;
  studyMaterials?: StudyMaterialsPackage;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
}
