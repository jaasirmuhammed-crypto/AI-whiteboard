import React from 'react';
import { 
  Presentation, 
  HelpCircle, 
  Network, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Sparkles,
  FileText
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';

interface ProjectCardProps {
  project: WhiteboardProject;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen, onDelete }) => {
  const hasPPT = !!project.studyMaterials?.presentation;
  const hasMCQ = !!project.studyMaterials?.quiz;
  const hasMindMap = !!project.studyMaterials?.mindMap;

  return (
    <div className="group card-interactive relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs flex flex-col justify-between">
      
      {/* Thumbnail or Icon Preview Header */}
      <div className="space-y-3">
        <div className="relative h-32 rounded-2xl bg-gradient-to-br from-slate-100 to-indigo-50/50 dark:from-slate-800 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden">
          {project.thumbnailDataUrl ? (
            <img 
              src={project.thumbnailDataUrl} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-center space-y-1 p-3">
              <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
              <span className="text-[11px] font-medium text-slate-400">Digital Whiteboard</span>
            </div>
          )}

          {/* AI Generated Pill */}
          {project.studyMaterials && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-indigo-600/90 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-200" />
              <span>AI Synced</span>
            </div>
          )}
        </div>

        {/* Project Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-brand truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <Clock className="w-3 h-3" />
            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Generated Study Materials Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {hasPPT && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold flex items-center gap-1">
              <Presentation className="w-3 h-3" /> PPT
            </span>
          )}
          {hasMCQ && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> MCQs
            </span>
          )}
          {hasMindMap && (
            <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
              <Network className="w-3 h-3" /> Mind Map
            </span>
          )}
          {!hasPPT && !hasMCQ && !hasMindMap && (
            <span className="text-[10px] text-slate-400 italic">No study materials generated yet</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpen(project.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Board</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
