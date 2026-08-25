/**
 * Firebase Authentication & Firestore Drawing Synchronization Service
 * 
 * Provides direct cloud persistence for user accounts and drawings:
 * - Firebase Google OAuth & Email/Password Authentication
 * - Firestore collection('users').doc(uid).collection('drawings') auto-save
 * - Offline-first resilience with local storage fallback
 */

import { WhiteboardProject } from '../types/user';
import { StorageService } from './storageService';

// Optional Firebase initialization from environment variables
let firebaseApp: any = null;
let firebaseAuth: any = null;
let firestoreDb: any = null;

const initFirebase = async () => {
  if (firebaseApp) return { auth: firebaseAuth, db: firestoreDb };

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');

      const firebaseConfig = {
        apiKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      firebaseApp = initializeApp(firebaseConfig);
      firebaseAuth = getAuth(firebaseApp);
      firestoreDb = getFirestore(firebaseApp);
      console.log('🔥 Firebase initialized successfully for AI Whiteboard');
    } catch (e) {
      console.warn('Firebase initialization skipped or failed, using local cloud sync engine:', e);
    }
  }

  return { auth: firebaseAuth, db: firestoreDb };
};

export class FirebaseService {
  /**
   * Save a drawing to Firestore cloud collection
   * collection('users').doc(userId).collection('drawings').doc(drawingId).set(...)
   */
  public static async saveDrawingToCloud(
    user: { id?: string; uid?: string; email?: string } | null,
    canvasDataUrl: string,
    project: WhiteboardProject
  ): Promise<string> {
    const userId = user?.uid || user?.id || 'guest_user';
    const drawingId = project.id || 'drawing_' + Date.now();

    const drawingData = {
      id: drawingId,
      userId,
      title: project.title || 'Untitled Whiteboard',
      image: canvasDataUrl,
      elements: project.elements || [],
      backgroundPattern: project.backgroundPattern || 'ruled',
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { db } = await initFirebase();
      if (db) {
        const { doc, setDoc, collection } = await import('firebase/firestore');
        const drawingRef = doc(collection(doc(collection(db, 'users'), userId), 'drawings'), drawingId);
        await setDoc(drawingRef, drawingData, { merge: true });
        console.log(`☁️ Synced drawing "${drawingData.title}" to Firestore doc: ${drawingId}`);
      }
    } catch (err) {
      console.warn('Firestore cloud sync fallback to local store:', err);
    }

    // Always mirror to local persistence for offline-first reliability
    StorageService.saveProject({
      ...project,
      id: drawingId,
      userId,
      thumbnailDataUrl: canvasDataUrl,
      updatedAt: new Date().toISOString(),
    });

    return drawingId;
  }

  /**
   * Load all saved drawings for a user from Firestore
   */
  public static async getUserDrawingsFromCloud(
    user: { id?: string; uid?: string } | null
  ): Promise<WhiteboardProject[]> {
    const userId = user?.uid || user?.id;
    if (!userId) return StorageService.getProjects();

    try {
      const { db } = await initFirebase();
      if (db) {
        const { collection, getDocs, doc, query, orderBy } = await import('firebase/firestore');
        const drawingsCol = collection(doc(collection(db, 'users'), userId), 'drawings');
        const q = query(drawingsCol, orderBy('updatedAt', 'desc'));
        const snapshot = await getDocs(q);

        const cloudProjects: WhiteboardProject[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          cloudProjects.push({
            id: data.id || d.id,
            userId: data.userId || userId,
            title: data.title || 'Saved Drawing',
            elements: data.elements || [],
            backgroundPattern: data.backgroundPattern || 'ruled',
            thumbnailDataUrl: data.image,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });

        if (cloudProjects.length > 0) {
          return cloudProjects;
        }
      }
    } catch (err) {
      console.warn('Error fetching Firestore drawings, loading local store:', err);
    }

    return StorageService.getProjects();
  }
}
