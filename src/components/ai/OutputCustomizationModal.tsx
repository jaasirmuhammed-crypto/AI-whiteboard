import React, { useState } from 'react';
import { 
  Sliders, 
  Palette, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Presentation, 
  HelpCircle, 
  Network, 
  BookOpen,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { OutputCustomizationSettings } from '../../types/advancedFeatures';

interface OutputCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OutputCustomizationSettings;
  onSaveSettings: (settings: OutputCustomizationSettings) => void;
}

export const OutputCustomizationModal: React.FC<OutputCustomizationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [current, setCurrent] = useState<OutputCustomizationSettings>(settings);

  const pptThemes = [
    { id: 'modern', name: 'Modern Indigo', desc: 'Vibrant indigo gradients with glassmorphic cards', color: '#4f46e5' },
    { id: 'academic', name: 'Academic Formal', desc: 'Serif typography with structured footnotes and citations', color: '#1e3a8a' },
    { id: 'creative', name: 'Creative Gradient', desc: 'High-contrast energetic colors with bold callouts', color: '#ec4899' },
    { id: 'minimal', name: 'Minimal Monochrome', desc: 'Clean slate and crisp whitespace layout', color: '#334155' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Dark synthwave aesthetic with glowing cyan accents', color: '#06b6d4' },
  ];

  const difficulties = [
    { id: 'easy', label: 'Easy (Foundations)', desc: 'Direct recall and concept definitions' },
    { id: 'medium', label: 'Medium (Standard)', desc: 'Application questions and process logic' },
    { id: 'hard', label: 'Hard (Competitive)', desc: 'Assertion-reason, multi-statement and tricky edge-cases' },
    { id: 'adaptive', label: 'Adaptive Blend', desc: 'Progressive mixture from beginner to advanced' },
  ];

  const mindMapStyles = [
    { id: 'circular', label: 'Radial / Circular', desc: 'Central core concept with orbiting nodes' },
    { id: 'hierarchical', label: 'Hierarchical Tree', desc: 'Top-down organizational taxonomy' },
    { id: 'linear', label: 'Linear Flowchart', desc: 'Left-to-right chronological process stages' },
  ];

  const depthLevels = [
    { id: 'summary', label: 'Quick Summary', desc: 'Compact high-yield review in ~3-4 slides' },
    { id: 'detailed', label: 'Detailed Standard', desc: 'Balanced 6-slide deck with full explanations' },
    { id: 'comprehensive', label: 'Comprehensive Deep-Dive', desc: '8+ exhaustive slides, formulas and case-studies' },
  ];

  const handleSave = () => {
    onSaveSettings(current);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
              AI Output Customization & Styling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize presentation aesthetics, quiz difficulty, and depth of generated materials.
            </p>
          </div>
        </div>

        {/* 1. PowerPoint Theme Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Presentation className="w-4 h-4 text-indigo-500" />
            <span>PowerPoint Visual Theme</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {pptThemes.map((theme) => {
              const isSelected = current.pptTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setCurrent({ ...current, pptTheme: theme.id as any })}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.color }} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{theme.name}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{theme.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MCQ Difficulty & Mind Map Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>MCQ Quiz Difficulty</span>
            </label>
            <div className="space-y-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setCurrent({ ...current, mcqDifficulty: diff.id as any })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    current.mcqDifficulty === diff.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-900 dark:text-amber-200 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div>{diff.label}</div>
                    <div className="text-[10px] font-normal text-slate-500 opacity-80">{diff.desc}</div>
                  </div>
                  {current.mcqDifficulty === diff.id && <Check className="w-4 h-4 text-amber-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-purple-500" />
              <span>Mind Map Layout Style</span>
            </label>
            <div className="space-y-1.5">
              {mindMapStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setCurrent({ ...current, mindMapStyle: style.id as any })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    current.mindMapStyle === style.id
                      ? 'bg-purple-500/10 border-purple-500/50 text-purple-900 dark:text-purple-200 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div>{style.label}</div>
                    <div className="text-[10px] font-normal text-slate-500 opacity-80">{style.desc}</div>
                  </div>
                  {current.mindMapStyle === style.id && <Check className="w-4 h-4 text-purple-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Content Depth & Output Toggles */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Content Depth & Detail Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {depthLevels.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setCurrent({ ...current, contentDepth: lvl.id as any })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  current.contentDepth === lvl.id
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="text-xs">{lvl.label}</div>
                <div className="text-[9px] opacity-75 mt-0.5">{lvl.desc.split(' in ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Filters */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="font-bold text-slate-800 dark:text-white">Content Inclusion Filters</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={current.includeSlides}
                onChange={(e) => setCurrent({ ...current, includeSlides: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">PowerPoint Deck</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={current.includeMCQs}
                onChange={(e) => setCurrent({ ...current, includeMCQs: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">MCQ Quizzes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={current.includeMindMap}
                onChange={(e) => setCurrent({ ...current, includeMindMap: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Mind Map</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={current.includeFormulas}
                onChange={(e) => setCurrent({ ...current, includeFormulas: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Formulas & Math</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            Apply Settings
          </button>
        </div>

      </div>
    </Modal>
  );
};
