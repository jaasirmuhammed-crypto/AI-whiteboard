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
  Filter,
  Zap,
  User,
  Crown,
  LayoutDashboard,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useI18n } from '../../i18n';
import { useToast } from '../common/Toast';
import { WhiteboardProject } from '../../types/user';
import { PresentationData, MCQQuizData } from '../../types/studyMaterial';

// Modals & Section Components
import { CreateWhiteboardModal } from './CreateWhiteboardModal';
import { RecentWhiteboardsSection } from './RecentWhiteboardsSection';
import { SavedNotesSection } from './SavedNotesSection';
import { GeneratedPPTsSection } from './GeneratedPPTsSection';
import { GeneratedQuizzesSection } from './GeneratedQuizzesSection';
import { MindMapsSection } from './MindMapsSection';
import { UsageTokenBalanceCard } from './UsageTokenBalanceCard';
import { AccountPlanCard } from './AccountPlanCard';
import { NoteDetailModal } from './NoteDetailModal';
import { PPTPreviewModal } from './PPTPreviewModal';
import { QuizPreviewModal } from './QuizPreviewModal';
import { TokensExhaustedModal } from '../common/TokensExhaustedModal';

export type DashboardTab = 
  | 'overview' 
  | 'whiteboards' 
  | 'notes' 
  | 'ppts' 
  | 'quizzes' 
  | 'mindmaps' 
  | 'usage' 
  | 'account';

export const DashboardView: React.FC = () => {
  const { user, isPremium } = useAuth();
  const { t } = useI18n();
  const { projects, createProject, loadProject, deleteProject } = useProject();
  const { showToast } = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedNoteProject, setSelectedNoteProject] = useState<WhiteboardProject | null>(null);
  const [selectedPPT, setSelectedPPT] = useState<PresentationData | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<MCQQuizData | null>(null);

  // Computed Metrics
  const totalNotebooks = projects.length;
  const totalNotes = projects.filter(p => p.studyMaterials?.summary || p.elements.some(el => el.type === 'text' || el.type === 'sticky')).length;
  const totalPPTs = projects.filter(p => p.studyMaterials?.presentation).length;
  const totalQuizzes = projects.filter(p => p.studyMaterials?.quiz).length;
  const totalMindMaps = projects.filter(p => p.studyMaterials?.mindMap).length;

  const tabs: { id: DashboardTab; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'whiteboards', label: 'My Whiteboards', icon: BookOpen, count: totalNotebooks, badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { id: 'notes', label: 'Saved Notes', icon: FileText, count: totalNotes, badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { id: 'ppts', label: 'Generated PPTs', icon: Presentation, count: totalPPTs, badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { id: 'quizzes', label: 'Generated Quizzes', icon: HelpCircle, count: totalQuizzes, badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { id: 'mindmaps', label: 'Mind Maps', icon: Network, count: totalMindMaps, badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { id: 'usage', label: 'Usage / Tokens', icon: Zap },
    { id: 'account', label: 'Account & Plan', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-indigo-700/40">
        
        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                Command Center Dashboard
              </span>
              {isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>PRO SCHOLAR ACTIVE</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-[10px] font-semibold">
                  Free Starter Plan
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-brand tracking-tight">
              Welcome back, {user?.name || 'Scholar'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              Manage your whiteboards, review generated PowerPoint decks, practice quizzes, explore concept mind maps, and monitor your AI token usage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600 group-hover:rotate-90 transition-transform" />
              <span>Create New Whiteboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl overflow-x-auto shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Router */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Quick Metrics Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div 
                onClick={() => setActiveTab('whiteboards')}
                className="card-interactive p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Notebooks</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-brand text-slate-900 dark:text-white">
                  {totalNotebooks}
                </p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View notebooks</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('ppts')}
                className="card-interactive p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Generated PPTs</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Presentation className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-brand text-indigo-600 dark:text-indigo-400">
                  {totalPPTs}
                </p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Export PPTX decks</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('quizzes')}
                className="card-interactive p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">MCQ Quizzes</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-brand text-emerald-600 dark:text-emerald-400">
                  {totalQuizzes}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Practice questions</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('mindmaps')}
                className="card-interactive p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Concept Mind Maps</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Network className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-brand text-purple-600 dark:text-purple-400">
                  {totalMindMaps}
                </p>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore graphs</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

            </div>

            {/* Side-by-side Usage Card & Account Card Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageTokenBalanceCard onOpenUpgradeModal={() => setUpgradeModalOpen(true)} />
              <AccountPlanCard onOpenUpgradeModal={() => setUpgradeModalOpen(true)} />
            </div>

            {/* Recent Whiteboards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                    Recent Whiteboards
                  </h3>
                  <p className="text-xs text-slate-500">Continue where you left off</p>
                </div>
                <button
                  onClick={() => setActiveTab('whiteboards')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({totalNotebooks})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <RecentWhiteboardsSection 
                onOpenCreateModal={() => setCreateModalOpen(true)}
                onOpenNoteDetail={(proj) => setSelectedNoteProject(proj)}
              />
            </div>

          </div>
        )}

        {/* RECENT WHITEBOARDS TAB */}
        {activeTab === 'whiteboards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  All Whiteboard Notebooks
                </h3>
                <p className="text-xs text-slate-500">Open, rename, duplicate, or delete your digital notebooks</p>
              </div>
            </div>

            <RecentWhiteboardsSection 
              onOpenCreateModal={() => setCreateModalOpen(true)}
              onOpenNoteDetail={(proj) => setSelectedNoteProject(proj)}
            />
          </div>
        )}

        {/* SAVED NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  Saved Notes & Synthesized Summaries
                </h3>
                <p className="text-xs text-slate-500">Read, copy, and export your lecture notes and concept breakdowns</p>
              </div>
            </div>

            <SavedNotesSection
              onOpenNoteDetail={(proj) => setSelectedNoteProject(proj)}
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          </div>
        )}

        {/* GENERATED PPTS TAB */}
        {activeTab === 'ppts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  Generated PowerPoint Presentations
                </h3>
                <p className="text-xs text-slate-500">Preview slides and download real .pptx PowerPoint presentations</p>
              </div>
            </div>

            <GeneratedPPTsSection
              onPreviewPPT={(pres) => setSelectedPPT(pres)}
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          </div>
        )}

        {/* GENERATED QUIZZES TAB */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  Generated MCQ Practice Quizzes
                </h3>
                <p className="text-xs text-slate-500">Test your understanding with instant feedback and rationale</p>
              </div>
            </div>

            <GeneratedQuizzesSection
              onTakeQuiz={(qz) => setSelectedQuiz(qz)}
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          </div>
        )}

        {/* MIND MAPS TAB */}
        {activeTab === 'mindmaps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  Generated Concept Mind Maps
                </h3>
                <p className="text-xs text-slate-500">Explore interactive nodes and visual hierarchical connections</p>
              </div>
            </div>

            <MindMapsSection
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          </div>
        )}

        {/* USAGE / TOKEN BALANCE TAB */}
        {activeTab === 'usage' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <UsageTokenBalanceCard onOpenUpgradeModal={() => setUpgradeModalOpen(true)} />
          </div>
        )}

        {/* ACCOUNT & PLAN TAB */}
        {activeTab === 'account' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <AccountPlanCard onOpenUpgradeModal={() => setUpgradeModalOpen(true)} />
          </div>
        )}

      </div>

      {/* Global Modals */}
      <CreateWhiteboardModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <NoteDetailModal
        isOpen={!!selectedNoteProject}
        onClose={() => setSelectedNoteProject(null)}
        project={selectedNoteProject}
      />

      <PPTPreviewModal
        isOpen={!!selectedPPT}
        onClose={() => setSelectedPPT(null)}
        presentation={selectedPPT}
      />

      <QuizPreviewModal
        isOpen={!!selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
        quiz={selectedQuiz}
      />

      <TokensExhaustedModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

    </div>
  );
};
