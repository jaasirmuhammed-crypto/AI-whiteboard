import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  Sparkles, 
  Check, 
  Loader2, 
  Settings2,
  ChevronLeft,
  PenTool,
  StopCircle,
  FileCheck2,
  Layers,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useI18n } from '../../i18n';
import { Modal } from '../common/Modal';
import { TopicSearchGuideCard } from '../common/TopicSearchGuideCard';

interface TopControlBarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenClearModal: () => void;
  onOpenAISettings: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  onStopAndProcess: () => void;
  onOpenBackgrounds: (e: React.MouseEvent) => void;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenClearModal,
  onOpenAISettings,
  isRecording,
  onToggleRecording,
  onStopAndProcess,
  onOpenBackgrounds,
}) => {
  const { currentProject, updateProjectTitle, autoSaveState, setCurrentView, activeStudyMaterials } = useProject();
  const { t } = useI18n();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(currentProject?.title || 'Machine Learning & AI');
  const [showSearchGuideModal, setShowSearchGuideModal] = useState(false);

  const SAMPLE_TOPICS = [
    '🤖 Machine Learning & AI',
    '⚡ Newton\'s Laws of Motion',
    '💾 Database Systems & SQL',
    '🧬 Photosynthesis & Cell Biology',
    '🐍 Python Programming & OOP',
    '📐 Calculus & Rates of Change',
    '⚖️ Indian Constitution & Rights',
  ];

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (title.trim()) {
      updateProjectTitle(title.trim());
    }
  };

  const handleSelectSampleTopic = (sample: string) => {
    const clean = sample.replace(/^[^\w]+/, '').trim();
    setTitle(clean);
    updateProjectTitle(clean);
  };

  return (
    <div className="relative z-30 w-full px-3 sm:px-6 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      
      {/* Left: Back button, Title & Quick Topic Preset Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Back to Dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="px-2.5 py-1 text-sm font-bold font-brand rounded-lg border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden max-w-[200px] sm:max-w-xs"
          />
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <h2 className="text-sm sm:text-base font-bold font-brand text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors max-w-[160px] sm:max-w-xs truncate">
              {currentProject?.title || title}
            </h2>
            <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ✎ rename
            </span>
          </div>
        )}

        {/* How to Search Guide Button */}
        <button
          onClick={() => setShowSearchGuideModal(true)}
          className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          title="How to Search Any Topic"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">How to Search</span>
        </button>

        {/* 1-Tap Student Sample Topic Picker */}
        <select
          onChange={(e) => e.target.value && handleSelectSampleTopic(e.target.value)}
          defaultValue=""
          className="hidden lg:block px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>💡 Pick Sample Topic...</option>
          {SAMPLE_TOPICS.map((top, i) => (
            <option key={i} value={top}>{top}</option>
          ))}
        </select>

        {/* Auto-Save Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {autoSaveState === 'saving' && (
            <>
              <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
              <span>{t.whiteboard.saving}</span>
            </>
          )}
          {autoSaveState === 'saved' && (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{t.whiteboard.saved}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Workflow Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Background Pattern Button */}
        <button
          onClick={onOpenBackgrounds}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Change Pattern"
        >
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">{t.whiteboard.background}</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-x border-slate-200 dark:border-slate-800 px-1 sm:px-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenClearModal}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Study Materials Hub Shortcut */}
        {activeStudyMaterials && (
          <button
            onClick={() => setCurrentView('study_hub')}
            className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 shadow-xs animate-pulse"
            title="View Generated Study Suite"
          >
            <FileCheck2 className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">Study Suite Ready</span>
          </button>
        )}

        {/* STOP & PROCESS MAIN AI BUTTON */}
        <button
          onClick={onStopAndProcess}
          className="btn-interactive px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2 group"
        >
          <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>{t.whiteboard.stopAndProcess}</span>
        </button>

        {/* AI Key & Settings */}
        <button
          onClick={onOpenAISettings}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title="AI & API Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>

      </div>

      {/* How to Search Guide Modal */}
      {showSearchGuideModal && (
        <Modal isOpen={showSearchGuideModal} onClose={() => setShowSearchGuideModal(false)} maxWidth="max-w-3xl">
          <TopicSearchGuideCard 
            onClose={() => setShowSearchGuideModal(false)} 
            onSelectTopic={(selected) => {
              setTitle(selected);
              setShowSearchGuideModal(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
