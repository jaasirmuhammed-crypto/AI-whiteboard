import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Presentation, 
  HelpCircle, 
  Network, 
  Sparkles, 
  FolderPlus,
  BookOpen,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useI18n } from '../../i18n';
import { ProjectCard } from './ProjectCard';
import { useToast } from '../common/Toast';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { projects, createProject, loadProject, deleteProject, setCurrentView } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ppt' | 'mcq' | 'mindmap'>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'ppt') return !!p.studyMaterials?.presentation;
    if (filterType === 'mcq') return !!p.studyMaterials?.quiz;
    if (filterType === 'mindmap') return !!p.studyMaterials?.mindMap;
    return true;
  });

  const totalPPTs = projects.filter(p => p.studyMaterials?.presentation).length;
  const totalMCQs = projects.filter(p => p.studyMaterials?.quiz).length;
  const totalMindMaps = projects.filter(p => p.studyMaterials?.mindMap).length;

  const handleCreateNew = () => {
    createProject();
    showToast('New digital whiteboard notebook initialized!', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this whiteboard project?')) {
      deleteProject(id);
      showToast('Project deleted', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Section Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-indigo-700/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-brand tracking-tight">
              Welcome back, {user?.name || 'Scholar'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-lg leading-relaxed">
              Transform your raw notes into structured knowledge. Create new whiteboards or review your generated presentations and quizzes.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-6 py-3.5 rounded-2xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 text-indigo-600 group-hover:rotate-90 transition-transform" />
            <span>{t.whiteboard.newBoard}</span>
          </button>
        </div>
      </div>

      {/* Stats / Quick Action Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => setFilterType('all')}
          className={`p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterType === 'all'
              ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md'
              : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Notebooks</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-brand text-slate-900 dark:text-white mt-2">
            {projects.length}
          </p>
        </div>

        <div 
          onClick={() => setFilterType('ppt')}
          className={`p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterType === 'ppt'
              ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md'
              : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Generated PPTs</span>
            <Presentation className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-brand text-indigo-600 dark:text-indigo-400 mt-2">
            {totalPPTs}
          </p>
        </div>

        <div 
          onClick={() => setFilterType('mcq')}
          className={`p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterType === 'mcq'
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
              : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">MCQ Quizzes</span>
            <HelpCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-brand text-emerald-600 dark:text-emerald-400 mt-2">
            {totalMCQs}
          </p>
        </div>

        <div 
          onClick={() => setFilterType('mindmap')}
          className={`p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterType === 'mindmap'
              ? 'bg-purple-500/10 border-purple-500/50 shadow-md'
              : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mind Maps</span>
            <Network className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-brand text-purple-600 dark:text-purple-400 mt-2">
            {totalMindMaps}
          </p>
        </div>
      </div>

      {/* Projects Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notebook notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setFilterType('ppt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'ppt'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            With PPT
          </button>
          <button
            onClick={() => setFilterType('mcq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'mcq'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            With MCQs
          </button>
          <button
            onClick={() => setFilterType('mindmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === 'mindmap'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            With Mind Maps
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={loadProject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <FolderPlus className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
              No Notebooks Found
            </h3>
            <p className="text-xs text-slate-500">
              Start writing on a fresh digital whiteboard canvas.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Whiteboard
          </button>
        </div>
      )}

    </div>
  );
};
