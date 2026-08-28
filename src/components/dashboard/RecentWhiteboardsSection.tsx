import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Clock, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Copy,
  Presentation,
  HelpCircle,
  Network,
  FolderPlus,
  ArrowUpDown,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../common/Toast';
import { EmptyState } from '../common/EmptyState';
import { RenameProjectModal } from './RenameProjectModal';

interface RecentWhiteboardsSectionProps {
  onOpenCreateModal: () => void;
  onOpenNoteDetail?: (proj: WhiteboardProject) => void;
}

export const formatRelativeTime = (isoString?: string): string => {
  if (!isoString) return 'Just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
};

export const RecentWhiteboardsSection: React.FC<RecentWhiteboardsSectionProps> = ({ 
  onOpenCreateModal,
  onOpenNoteDetail
}) => {
  const { projects, loadProject, deleteProject, duplicateProject } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'elements'>('updated');
  const [renameTarget, setRenameTarget] = useState<WhiteboardProject | null>(null);

  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'elements') return (b.elements?.length || 0) - (a.elements?.length || 0);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProject(id);
      showToast('Notebook deleted.', 'info');
    }
  };

  const handleDuplicate = (project: WhiteboardProject) => {
    const copy = duplicateProject(project.id);
    showToast(`Duplicated into "${copy.title}"`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent whiteboards..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Menu */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort whiteboards"
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-semibold outline-hidden pr-2 cursor-pointer"
            >
              <option value="updated">Recently Modified</option>
              <option value="title">Alphabetical</option>
              <option value="elements">Element Count</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Whiteboard Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Whiteboard</span>
          </button>
        </div>
      </div>

      {/* Whiteboards Grid / List Display */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {filteredProjects.map((project) => {
              const hasPPT = !!project.studyMaterials?.presentation;
              const hasMCQ = !!project.studyMaterials?.quiz;
              const hasMindMap = !!project.studyMaterials?.mindMap;

              return (
                <div
                  key={project.id}
                  className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail / Canvas Snapshot */}
                    <div 
                      onClick={() => loadProject(project.id)}
                      className="relative h-36 rounded-2xl bg-gradient-to-br from-slate-100 to-indigo-50/40 dark:from-slate-800 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      {project.thumbnailDataUrl ? (
                        <img
                          src={project.thumbnailDataUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center space-y-1 p-3">
                          <FileText className="w-8 h-8 text-indigo-400 mx-auto opacity-75" />
                          <span className="text-[11px] font-medium text-slate-400">Digital Whiteboard</span>
                        </div>
                      )}

                      {/* Pattern Badge */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono capitalize backdrop-blur-xs">
                        {project.backgroundPattern || 'ruled'}
                      </span>

                      {/* AI Badge */}
                      {project.studyMaterials && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-indigo-600/90 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-200" />
                          <span>AI Synced</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 
                          onClick={() => loadProject(project.id)}
                          className="text-base font-bold text-slate-900 dark:text-white font-brand truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          {project.title}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameTarget(project);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                          title="Rename Notebook"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{formatRelativeTime(project.updatedAt)}</span>
                        </span>
                        <span>{project.elements?.length || 0} elements</span>
                      </div>
                    </div>

                    {/* Material Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {hasPPT && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold flex items-center gap-1">
                          <Presentation className="w-3 h-3" /> PPT
                        </span>
                      )}
                      {hasMCQ && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> MCQ
                        </span>
                      )}
                      {hasMindMap && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
                          <Network className="w-3 h-3" /> Mind Map
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => loadProject(project.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Canvas</span>
                    </button>

                    <button
                      onClick={() => setRenameTarget(project)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                      title="Rename Whiteboard"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(project)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                      title="Duplicate Whiteboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Whiteboard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs animate-in fade-in duration-200">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 
                      onClick={() => loadProject(project.id)}
                      className="text-sm font-bold text-slate-900 dark:text-white font-brand hover:text-indigo-600 cursor-pointer"
                    >
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{project.elements?.length || 0} elements</span>
                      <span>•</span>
                      <span>Pattern: {project.backgroundPattern || 'ruled'}</span>
                      <span>•</span>
                      <span>Edited: {formatRelativeTime(project.updatedAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => loadProject(project.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                  <button
                    onClick={() => setRenameTarget(project)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(project)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <EmptyState
          type={searchQuery ? 'search' : 'notebooks'}
          title="No Whiteboards Found"
          description={searchQuery ? `No notebooks matched "${searchQuery}".` : 'Start writing on a fresh digital whiteboard canvas.'}
          actionText={searchQuery ? undefined : 'Create Whiteboard'}
          onAction={onOpenCreateModal}
          searchQuery={searchQuery}
        />
      )}

      {/* Rename Notebook Modal */}
      <RenameProjectModal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        projectId={renameTarget?.id || null}
        initialTitle={renameTarget?.title || ''}
      />
    </div>
  );
};
