import { WhiteboardProject } from '../types/user';

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

  public static saveProject(project: WhiteboardProject): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  public static deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
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
