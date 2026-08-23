import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { WhiteboardProject } from '../types/user';
import { StudyMaterialsPackage } from '../types/studyMaterial';
import { WhiteboardElement, BackgroundPattern, AutoSaveState } from '../types/whiteboard';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';

export type AppView =
  | 'landing'
  | 'whiteboard'
  | 'dashboard'
  | 'study_hub'
  | 'competitive'
  | 'exam_detail'
  | 'topic_view'
  | 'mcq_test'
  | 'bookmarks'
  | 'admin';

interface ProjectContextType {
  projects: WhiteboardProject[];
  currentProject: WhiteboardProject | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  autoSaveState: AutoSaveState;
  createProject: (title?: string, pattern?: BackgroundPattern) => WhiteboardProject;
  loadProject: (projectId: string) => void;
  updateCurrentProjectElements: (elements: WhiteboardElement[], thumbnail?: string) => void;
  updateProjectTitle: (title: string) => void;
  updateBackgroundPattern: (pattern: BackgroundPattern) => void;
  setGeneratedMaterials: (pkg: StudyMaterialsPackage) => void;
  deleteProject: (projectId: string) => void;
  activeStudyMaterials: StudyMaterialsPackage | null;
  setActiveStudyMaterials: (pkg: StudyMaterialsPackage | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<WhiteboardProject[]>([]);
  const [currentProject, setCurrentProject] = useState<WhiteboardProject | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>('saved');
  const [activeStudyMaterials, setActiveStudyMaterials] = useState<StudyMaterialsPackage | null>(null);

  const saveTimeoutRef = useRef<any>(null);

  // Load projects from storage on mount
  useEffect(() => {
    const loaded = StorageService.getProjects();
    setProjects(loaded);
    if (loaded.length > 0 && !currentProject) {
      setCurrentProject(loaded[0]);
    }
  }, []);

  // Save current project debounced
  const triggerAutoSave = useCallback((updated: WhiteboardProject) => {
    setAutoSaveState('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        StorageService.saveProject(updated);
        setProjects(StorageService.getProjects());
        setAutoSaveState('saved');
      } catch (err) {
        console.error('Autosave error', err);
        setAutoSaveState('error');
      }
    }, 600);
  }, []);

  const createProject = (title?: string, pattern: BackgroundPattern = 'ruled'): WhiteboardProject => {
    const newProj: WhiteboardProject = {
      id: 'proj_' + Date.now(),
      userId: user?.id || 'guest_user',
      title: title || `Notebook #${projects.length + 1}`,
      elements: [],
      backgroundPattern: pattern,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveProject(newProj);
    setProjects(StorageService.getProjects());
    setCurrentProject(newProj);
    setCurrentView('whiteboard');
    setAutoSaveState('saved');
    return newProj;
  };

  const loadProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId) || StorageService.getProjectById(projectId);
    if (proj) {
      setCurrentProject(proj);
      if (proj.studyMaterials) {
        setActiveStudyMaterials(proj.studyMaterials);
      }
      setCurrentView('whiteboard');
    }
  };

  const updateCurrentProjectElements = (elements: WhiteboardElement[], thumbnail?: string) => {
    if (!currentProject) return;
    const updated: WhiteboardProject = {
      ...currentProject,
      elements,
      thumbnailDataUrl: thumbnail || currentProject.thumbnailDataUrl,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updated);
    triggerAutoSave(updated);
  };

  const updateProjectTitle = (title: string) => {
    if (!currentProject) return;
    const updated: WhiteboardProject = {
      ...currentProject,
      title,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updated);
    triggerAutoSave(updated);
  };

  const updateBackgroundPattern = (pattern: BackgroundPattern) => {
    if (!currentProject) return;
    const updated: WhiteboardProject = {
      ...currentProject,
      backgroundPattern: pattern,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updated);
    triggerAutoSave(updated);
  };

  const setGeneratedMaterials = (pkg: StudyMaterialsPackage) => {
    if (!currentProject) return;
    const updated: WhiteboardProject = {
      ...currentProject,
      studyMaterials: pkg,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updated);
    setActiveStudyMaterials(pkg);
    StorageService.saveProject(updated);
    setProjects(StorageService.getProjects());
  };

  const deleteProject = (projectId: string) => {
    StorageService.deleteProject(projectId);
    const remaining = StorageService.getProjects();
    setProjects(remaining);
    if (currentProject?.id === projectId) {
      if (remaining.length > 0) {
        setCurrentProject(remaining[0]);
      } else {
        setCurrentProject(null);
      }
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        currentView,
        setCurrentView,
        autoSaveState,
        createProject,
        loadProject,
        updateCurrentProjectElements,
        updateProjectTitle,
        updateBackgroundPattern,
        setGeneratedMaterials,
        deleteProject,
        activeStudyMaterials,
        setActiveStudyMaterials,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
