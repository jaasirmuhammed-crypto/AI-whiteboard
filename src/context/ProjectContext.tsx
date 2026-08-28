import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { WhiteboardProject } from '../types/user';
import { StudyMaterialsPackage } from '../types/studyMaterial';
import { WhiteboardElement, BackgroundPattern, AutoSaveState } from '../types/whiteboard';
import { StorageService } from '../services/storageService';
import { FirebaseService } from '../services/firebaseService';
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
  | 'admin'
  | 'docs';

interface ProjectContextType {
  projects: WhiteboardProject[];
  currentProject: WhiteboardProject | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  autoSaveState: AutoSaveState;
  lastSavedTime: string | null;
  forceSaveNow: () => void;
  createProject: (title?: string, pattern?: BackgroundPattern) => WhiteboardProject;
  loadProject: (projectId: string) => void;
  updateCurrentProjectElements: (elements: WhiteboardElement[], thumbnail?: string) => void;
  updateProjectTitle: (title: string) => void;
  renameProject: (projectId: string, newTitle: string) => void;
  duplicateProject: (projectId: string) => WhiteboardProject;
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
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [activeStudyMaterials, setActiveStudyMaterials] = useState<StudyMaterialsPackage | null>(null);

  const saveTimeoutRef = useRef<any>(null);
  const currentProjectRef = useRef<WhiteboardProject | null>(currentProject);
  currentProjectRef.current = currentProject;

  // Flush any pending strokes on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentProjectRef.current) {
        StorageService.saveProject(currentProjectRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Load projects from storage on mount & restore last active drawing
  useEffect(() => {
    const loaded = StorageService.getProjects();
    setProjects(loaded);
    const activeId = localStorage.getItem('ai_whiteboard_active_proj_id');
    const targetProj = (activeId && loaded.find((p) => p.id === activeId)) || loaded[0];
    if (targetProj) {
      setCurrentProject(targetProj);
      if (targetProj.studyMaterials) {
        setActiveStudyMaterials(targetProj.studyMaterials);
      }
    }
  }, []);

  // Save current project debounced & sync to Firebase Firestore cloud
  const triggerAutoSave = useCallback((updated: WhiteboardProject) => {
    setAutoSaveState('saving');
    // Immediately persist locally for zero loss
    StorageService.saveProject(updated);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await FirebaseService.saveDrawingToCloud(user, updated.thumbnailDataUrl || '', updated);
        setProjects(StorageService.getProjects());
        setAutoSaveState('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Autosave cloud sync error', err);
        setAutoSaveState('saved'); // Local storage is already safely preserved
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 400);
  }, [user]);

  const forceSaveNow = useCallback(() => {
    if (currentProject) {
      setAutoSaveState('saving');
      StorageService.saveProject(currentProject);
      FirebaseService.saveDrawingToCloud(user, currentProject.thumbnailDataUrl || '', currentProject)
        .finally(() => {
          setProjects(StorageService.getProjects());
          setAutoSaveState('saved');
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });
    }
  }, [currentProject, user]);

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
    localStorage.setItem('ai_whiteboard_active_proj_id', newProj.id);
    setProjects(StorageService.getProjects());
    setCurrentProject(newProj);
    setCurrentView('whiteboard');
    setAutoSaveState('saved');
    return newProj;
  };

  const loadProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId) || StorageService.getProjectById(projectId);
    if (proj) {
      localStorage.setItem('ai_whiteboard_active_proj_id', proj.id);
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

  const renameProject = (projectId: string, newTitle: string) => {
    const proj = projects.find(p => p.id === projectId) || StorageService.getProjectById(projectId);
    if (!proj) return;
    const updated: WhiteboardProject = {
      ...proj,
      title: newTitle.trim() || proj.title,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveProject(updated);
    setProjects(StorageService.getProjects());
    if (currentProject?.id === projectId) {
      setCurrentProject(updated);
    }
  };

  const duplicateProject = (projectId: string): WhiteboardProject => {
    const sourceProj = projects.find(p => p.id === projectId) || StorageService.getProjectById(projectId) || currentProject;
    const clonedTitle = sourceProj ? `${sourceProj.title} (Copy)` : `Notebook #${projects.length + 1}`;
    const duplicated: WhiteboardProject = {
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: user?.id || 'guest_user',
      title: clonedTitle,
      elements: sourceProj ? JSON.parse(JSON.stringify(sourceProj.elements)) : [],
      backgroundPattern: sourceProj?.backgroundPattern || 'ruled',
      thumbnailDataUrl: sourceProj?.thumbnailDataUrl,
      studyMaterials: sourceProj?.studyMaterials ? JSON.parse(JSON.stringify(sourceProj.studyMaterials)) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveProject(duplicated);
    setProjects(StorageService.getProjects());
    return duplicated;
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
        lastSavedTime,
        forceSaveNow,
        createProject,
        loadProject,
        updateCurrentProjectElements,
        updateProjectTitle,
        renameProject,
        duplicateProject,
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
