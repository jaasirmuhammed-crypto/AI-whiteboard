import { WhiteboardElement, BackgroundPattern } from './whiteboard';
import { StudyMaterialsPackage } from './studyMaterial';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferredLanguage: string;
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: string;
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
