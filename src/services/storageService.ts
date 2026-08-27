import { WhiteboardProject } from '../types/user';
import { offlineStorageService } from './offlineStorageService';

const STORAGE_KEY = 'ai_whiteboard_projects_db';

export class StorageService {
  public static getProjects(): WhiteboardProject[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return this.getDefaultInitialProjects();
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse projects', e);
      return this.getDefaultInitialProjects();
    }
  }

  public static async getProjectsAsync(): Promise<WhiteboardProject[]> {
    return await offlineStorageService.getProjects();
  }

  public static saveProject(project: WhiteboardProject): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
      createdAt: project.createdAt || new Date().toISOString(),
    };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage limit exceeded, relying on IndexedDB:', e);
    }

    // Also persist full fidelity to IndexedDB asynchronously
    offlineStorageService.saveProject(updated).catch(console.error);
  }

  public static deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    offlineStorageService.deleteProject(projectId).catch(console.error);
  }

  public static getProjectById(projectId: string): WhiteboardProject | undefined {
    return this.getProjects().find(p => p.id === projectId);
  }

  private static getDefaultInitialProjects(): WhiteboardProject[] {
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
      }
    ];
  }
}
