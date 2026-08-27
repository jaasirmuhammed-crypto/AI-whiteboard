import { WhiteboardProject } from '../types/user';

export interface OfflineExportJob {
  id: string;
  projectId?: string;
  format: 'pptx' | 'pdf' | 'word_doc' | 'markdown' | 'mcq' | 'mindmap_svg' | 'canvas_png' | 'batch_zip';
  title: string;
  createdAt: number;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const DB_NAME = 'ai_whiteboard_offline_db';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_EXPORTS = 'export_queue';
const LOCAL_STORAGE_FALLBACK_KEY = 'ai_whiteboard_projects_db';

class OfflineStorageManager {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private onlineListeners: Set<(isOnline: boolean) => void> = new Set();
  private isOnlineState: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.isOnlineState = true;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    this.isOnlineState = false;
    this.notifyListeners(false);
  };

  public isOnline(): boolean {
    return this.isOnlineState;
  }

  public subscribeOnlineStatus(callback: (isOnline: boolean) => void): () => void {
    this.onlineListeners.add(callback);
    callback(this.isOnlineState);
    return () => this.onlineListeners.delete(callback);
  }

  private notifyListeners(isOnline: boolean) {
    this.onlineListeners.forEach((listener) => {
      try {
        listener(isOnline);
      } catch (err) {
        console.error('Online status listener error:', err);
      }
    });
  }

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB is not supported in this environment'));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
          db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_EXPORTS)) {
          db.createObjectStore(STORE_EXPORTS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB open failed:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // --- PROJECT STORAGE ---

  public async saveProject(project: WhiteboardProject): Promise<void> {
    const updated: WhiteboardProject = {
      ...project,
      updatedAt: new Date().toISOString(),
      createdAt: project.createdAt || new Date().toISOString(),
    };

    // 1. Always mirror to LocalStorage for instant initial bootstrap
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      let projects: WhiteboardProject[] = localData ? JSON.parse(localData) : [];
      const idx = projects.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        projects[idx] = updated;
      } else {
        projects.unshift(updated);
      }
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save warning (may be quota full with large strokes):', e);
    }

    // 2. Persist full fidelity project into IndexedDB (supports 100MB+ of vector stroke points)
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      await new Promise<void>((resolve, reject) => {
        const req = store.put(updated);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('IndexedDB saveProject failed:', err);
    }
  }

  public async getProjects(): Promise<WhiteboardProject[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);

      const items = await new Promise<WhiteboardProject[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      if (items && items.length > 0) {
        // Sort descending by updatedAt
        return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
    } catch (err) {
      console.warn('IndexedDB getProjects failed, falling back to LocalStorage:', err);
    }

    // Fallback to LocalStorage
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (e) {
      console.error('LocalStorage get fallback failed:', e);
    }

    return this.getDefaultInitialProjects();
  }

  public async getProjectById(projectId: string): Promise<WhiteboardProject | undefined> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);

      const item = await new Promise<WhiteboardProject | undefined>((resolve, reject) => {
        const req = store.get(projectId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (item) return item;
    } catch (err) {
      console.warn('IndexedDB getProjectById fallback:', err);
    }

    const projects = this.getLocalProjectsFallback();
    return projects.find((p) => p.id === projectId);
  }

  public async deleteProject(projectId: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      await new Promise<void>((resolve, reject) => {
        const req = store.delete(projectId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('IndexedDB deleteProject failed:', err);
    }

    try {
      const projects = this.getLocalProjectsFallback().filter((p) => p.id !== projectId);
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('LocalStorage delete mirror failed:', e);
    }
  }

  // --- OFFLINE EXPORT QUEUE ---

  public async queueOfflineExport(job: Omit<OfflineExportJob, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const id = `exp_queue_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullJob: OfflineExportJob = {
      ...job,
      id,
      createdAt: Date.now(),
      status: 'pending',
    };

    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_EXPORTS, 'readwrite');
      const store = tx.objectStore(STORE_EXPORTS);
      await new Promise<void>((resolve, reject) => {
        const req = store.put(fullJob);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Failed to queue offline export in IndexedDB:', err);
    }

    return id;
  }

  public async getPendingOfflineExports(): Promise<OfflineExportJob[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_EXPORTS, 'readonly');
      const store = tx.objectStore(STORE_EXPORTS);
      return await new Promise<OfflineExportJob[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to read offline export queue:', err);
      return [];
    }
  }

  public async removeOfflineExport(jobId: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_EXPORTS, 'readwrite');
      const store = tx.objectStore(STORE_EXPORTS);
      await new Promise<void>((resolve, reject) => {
        const req = store.delete(jobId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Failed to remove offline export job:', err);
    }
  }

  private getLocalProjectsFallback(): WhiteboardProject[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      return data ? JSON.parse(data) : this.getDefaultInitialProjects();
    } catch (e) {
      return this.getDefaultInitialProjects();
    }
  }

  private getDefaultInitialProjects(): WhiteboardProject[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'proj_demo_bio',
        userId: 'guest_student_01',
        title: 'Photosynthesis & Solar Energy',
        elements: [],
        backgroundPattern: 'ruled',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}

export const offlineStorageService = new OfflineStorageManager();
