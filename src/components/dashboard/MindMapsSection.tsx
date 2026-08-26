import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Layers, 
  Maximize2,
  GitBranch,
  Eye
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';
import { MindMapData } from '../../types/studyMaterial';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../common/Toast';
import { EmptyState } from '../common/EmptyState';

interface MindMapsSectionProps {
  onOpenCreateModal: () => void;
}

export const MindMapsSection: React.FC<MindMapsSectionProps> = ({ onOpenCreateModal }) => {
  const { projects, setCurrentView, setActiveStudyMaterials } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const mindMapProjects = projects.filter((p) => {
    if (!p.studyMaterials?.mindMap) return false;
    const mm = p.studyMaterials.mindMap;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mm.root?.label || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenMindMap = (project: WhiteboardProject) => {
    if (project.studyMaterials) {
      setActiveStudyMaterials(project.studyMaterials);
      setCurrentView('study_hub');
    }
  };

  // Helper to count nodes in tree
  const countNodes = (node?: any): number => {
    if (!node) return 0;
    let count = 1;
    if (node.children) {
      node.children.forEach((c: any) => {
        count += countNodes(c);
      });
    }
    return count;
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Counts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mind maps & concept graphs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Network className="w-4 h-4 text-purple-500" />
          <span>Total Concept Maps: <strong className="text-slate-900 dark:text-white">{mindMapProjects.length} Maps</strong></span>
        </div>
      </div>

      {/* Mind Maps Grid */}
      {mindMapProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {mindMapProjects.map((project) => {
            const mm = project.studyMaterials?.mindMap!;
            const totalNodes = countNodes(mm.root);
            const rootLabel = mm.root?.label || project.title;
            const childNodes = mm.root?.children || [];

            return (
              <div
                key={project.id}
                onClick={() => handleOpenMindMap(project)}
                className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-200 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  {/* Visual Mind Map Concept Visualizer Box */}
                  <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-4 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                    
                    {/* Background Network SVG Nodes */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 300 200">
                      <circle cx="150" cy="100" r="30" fill="#a855f7" />
                      <line x1="150" y1="100" x2="60" y2="50" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="60" cy="50" r="18" fill="#6366f1" />
                      <line x1="150" y1="100" x2="240" y2="50" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="240" cy="50" r="18" fill="#ec4899" />
                      <line x1="150" y1="100" x2="150" y2="170" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="150" cy="170" r="18" fill="#10b981" />
                    </svg>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-purple-200 text-[10px] font-mono backdrop-blur-xs">
                        Concept Tree
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-600/80 text-white text-[10px] font-bold">
                        {totalNodes} Nodes
                      </span>
                    </div>

                    <div className="relative z-10 text-center space-y-1 my-auto px-2">
                      <div className="inline-block px-3 py-1.5 rounded-xl bg-purple-600/90 text-white text-xs font-bold shadow-md border border-purple-400/40">
                        {rootLabel}
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                      <span>Interactive Graph</span>
                      <span>Zoom & Pan Ready</span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h4>

                    {childNodes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {childNodes.slice(0, 3).map((cn: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-medium flex items-center gap-1">
                            <GitBranch className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[100px]">{cn.label}</span>
                          </span>
                        ))}
                        {childNodes.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{childNodes.length - 3} branches
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleOpenMindMap(project)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Mind Map</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          type={searchQuery ? 'search' : 'mindmaps'}
          title="No Mind Maps Found"
          description={searchQuery ? `No mind maps matched "${searchQuery}".` : 'Sketch your lecture notes and trigger the AI Suite to generate hierarchical node mind maps.'}
          actionText={searchQuery ? undefined : 'Create Whiteboard'}
          onAction={onOpenCreateModal}
          searchQuery={searchQuery}
        />
      )}

    </div>
  );
};
