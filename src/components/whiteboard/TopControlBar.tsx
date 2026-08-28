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
  Lightbulb,
  Download,
  Users,
  History,
  Activity,
  Zap,
  Sliders,
  Crown,
  LayoutTemplate,
  HelpCircle,
  Wand2,
  Mic
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
  // New core capability actions
  onOpenExportHub?: () => void;
  onOpenCollaboration?: () => void;
  onOpenVersionHistory?: () => void;
  onOpenLayers?: () => void;
  onOpenTemplates?: () => void;
  onOpenTutorial?: () => void;
  onOpenQuota?: () => void;
  onOpenCustomization?: () => void;
  onOpenAIWritingAssistant?: () => void;
  onToggleVoiceAnnotation?: () => void;
  onOpenAnalytics?: () => void;
  isVoiceAnnotationActive?: boolean;
  isMultiplayerActive?: boolean;
  quotaRemaining?: number;
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
  onOpenExportHub,
  onOpenCollaboration,
  onOpenVersionHistory,
  onOpenLayers,
  onOpenTemplates,
  onOpenTutorial,
  onOpenQuota,
  onOpenCustomization,
  onOpenAIWritingAssistant,
  onToggleVoiceAnnotation,
  onOpenAnalytics,
  isVoiceAnnotationActive = false,
  isMultiplayerActive = false,
  quotaRemaining = 5,
}) => {
  const { currentProject, updateProjectTitle, autoSaveState, lastSavedTime, forceSaveNow, setCurrentView, activeStudyMaterials } = useProject();
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
    <div className="relative z-30 w-full px-3 sm:px-6 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
      
      {/* Left: Back button, Title, Auto-Save & Topic Picker */}
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
            className="px-2.5 py-1 text-sm font-bold font-brand rounded-lg border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden max-w-[180px] sm:max-w-xs"
          />
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <h2 className="text-sm sm:text-base font-bold font-brand text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors max-w-[140px] sm:max-w-xs truncate">
              {currentProject?.title || title}
            </h2>
            <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ✎
            </span>
          </div>
        )}

        {/* 1-Tap Student Sample Topic Picker */}
        <select
          onChange={(e) => e.target.value && handleSelectSampleTopic(e.target.value)}
          defaultValue=""
          className="hidden xl:block px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>💡 Pick Sample Topic...</option>
          {SAMPLE_TOPICS.map((top, i) => (
            <option key={i} value={top}>{top}</option>
          ))}
        </select>

        {/* Interactive Auto-Save & Data Loss Prevention Pill */}
        <button
          type="button"
          onClick={forceSaveNow}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          title={`Click to Save Immediately • Last saved: ${lastSavedTime || 'Recent'}`}
        >
          {autoSaveState === 'saving' ? (
            <>
              <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
              <span className="text-indigo-600 dark:text-indigo-400">Saving...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Autosaved {lastSavedTime ? `• ${lastSavedTime}` : ''}</span>
            </>
          )}
        </button>
      </div>

      {/* Center/Right: Feature Tools and Workflow Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Daily Quota / Premium Badge Trigger */}
        {onOpenQuota && (
          <button
            onClick={onOpenQuota}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              quotaRemaining >= 9000
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shadow-xs'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}
            title="AI Quota & Subscription Status"
          >
            {quotaRemaining >= 9000 ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>⭐ Premium User (Unlimited)</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{quotaRemaining} Left</span>
              </>
            )}
          </button>
        )}

        {/* Version History */}
        {onOpenVersionHistory && (
          <button
            onClick={onOpenVersionHistory}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Version History & Rollback"
          >
            <History className="w-4 h-4" />
          </button>
        )}

        {/* Layers System */}
        {onOpenLayers && (
          <button
            onClick={onOpenLayers}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Canvas Layers"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        {/* AI Writing & Grammar Assistant */}
        {onOpenAIWritingAssistant && (
          <button
            onClick={onOpenAIWritingAssistant}
            className="p-2 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors shadow-xs"
            title="AI Writing & Grammar Assistant (Fix typos, polish explanations, simplify)"
          >
            <Wand2 className="w-4 h-4" />
          </button>
        )}

        {/* Voice Annotation & Lecture Audio Recorder */}
        {onToggleVoiceAnnotation && (
          <button
            onClick={onToggleVoiceAnnotation}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1 ${
              isVoiceAnnotationActive
                ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Voice Annotation (Record audio explanation while drawing)"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {/* Notebook Templates */}
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Notebook Templates (Cornell, Mind Map, STEM, Q&A, Flowchart)"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-500" />
          </button>
        )}

        {/* 30-Second Interactive Tour */}
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Interactive Onboarding Tour & Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </button>
        )}

        {/* Background Pattern Button */}
        <button
          onClick={onOpenBackgrounds}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Change Grid / Theme Pattern"
        >
          <span className="text-xs font-semibold hidden md:inline">{t.whiteboard.background}</span>
          <span className="md:hidden">▦</span>
        </button>

        {/* Multiplayer Collaboration */}
        {onOpenCollaboration && (
          <button
            onClick={onOpenCollaboration}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
              isMultiplayerActive
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Multiplayer Canvas & Sharing"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold hidden lg:inline">
              {isMultiplayerActive ? 'Multiplayer' : 'Share'}
            </span>
          </button>
        )}

        {/* AI Output Customization */}
        {onOpenCustomization && (
          <button
            onClick={onOpenCustomization}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Customize PPT Themes & MCQ Difficulty"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Canvas Performance & Telemetry */}
        {onOpenAnalytics && (
          <button
            onClick={onOpenAnalytics}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Canvas Performance Telemetry & Engine Settings"
          >
            <Activity className="w-4 h-4 text-emerald-500" />
          </button>
        )}

        {/* Export Hub Modal Trigger */}
        {onOpenExportHub && (
          <button
            onClick={onOpenExportHub}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Export to PPTX, PDF, SVG, PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-x border-slate-200 dark:border-slate-800 px-1">
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

        {/* Study Materials Hub Shortcut (When available) */}
        {activeStudyMaterials && (
          <button
            onClick={() => setCurrentView('study_hub')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 shadow-xs animate-pulse"
            title="View Generated Study Suite"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden md:inline">Study Suite Ready</span>
          </button>
        )}

        {/* STOP & PROCESS MAIN AI BUTTON */}
        <button
          onClick={onStopAndProcess}
          className="btn-interactive px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 group shrink-0"
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
