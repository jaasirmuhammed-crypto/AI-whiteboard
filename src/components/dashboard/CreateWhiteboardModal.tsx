import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Grid, 
  FileText, 
  CircleDot, 
  Layers, 
  Atom, 
  Calculator, 
  Binary, 
  Dna, 
  Compass
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { BackgroundPattern, WhiteboardElement } from '../../types/whiteboard';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../common/Toast';

interface CreateWhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  pattern: BackgroundPattern;
  defaultTitle: string;
}

export const CreateWhiteboardModal: React.FC<CreateWhiteboardModalProps> = ({ isOpen, onClose }) => {
  const { createProject, updateCurrentProjectElements } = useProject();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<BackgroundPattern>('ruled');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');

  const patterns: { id: BackgroundPattern; label: string; icon: any; desc: string }[] = [
    { id: 'ruled', label: 'Ruled Paper', icon: FileText, desc: 'Classic notebook lines for handwriting' },
    { id: 'grid', label: 'Math Grid', icon: Grid, desc: 'Square grid for calculations & geometry' },
    { id: 'dotted', label: 'Dot Matrix', icon: CircleDot, desc: 'Subtle dots for bullet journaling & sketch' },
    { id: 'blank', label: 'Blank Canvas', icon: Layers, desc: 'Infinite white space for free drawing' },
  ];

  const templates: TemplatePreset[] = [
    {
      id: 'blank',
      name: 'Blank Notebook',
      category: 'General',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      pattern: 'ruled',
      defaultTitle: 'My Whiteboard Notes',
    },
    {
      id: 'stem_physics',
      name: 'STEM & Physics',
      category: 'Science',
      icon: Atom,
      color: 'from-cyan-500 to-blue-600',
      pattern: 'grid',
      defaultTitle: 'Quantum & Classical Mechanics',
    },
    {
      id: 'math_calculus',
      name: 'Math & Calculus',
      category: 'Mathematics',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-600',
      pattern: 'grid',
      defaultTitle: 'Derivatives, Integrals & Vectors',
    },
    {
      id: 'cs_algorithms',
      name: 'Computer Science',
      category: 'Engineering',
      icon: Binary,
      color: 'from-violet-500 to-indigo-600',
      pattern: 'dotted',
      defaultTitle: 'Data Structures & Algorithms',
    },
    {
      id: 'biology_med',
      name: 'Biology & Medicine',
      category: 'Life Sciences',
      icon: Dna,
      color: 'from-rose-500 to-pink-600',
      pattern: 'ruled',
      defaultTitle: 'Cellular Biology & Anatomy',
    },
    {
      id: 'history_mindmap',
      name: 'History & Humanities',
      category: 'Humanities',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      pattern: 'ruled',
      defaultTitle: 'World History & Concept Map',
    },
  ];

  const handleSelectTemplate = (template: TemplatePreset) => {
    setSelectedTemplate(template.id);
    setSelectedPattern(template.pattern);
    if (!title || templates.some(t => t.defaultTitle === title)) {
      setTitle(template.defaultTitle);
    }
  };

  const handleCreate = () => {
    const finalTitle = title.trim() || templates.find(t => t.id === selectedTemplate)?.defaultTitle || 'New Whiteboard';
    createProject(finalTitle, selectedPattern);
    
    // If a specialized template was chosen, add helpful starter sticky notes
    if (selectedTemplate !== 'blank') {
      const template = templates.find(t => t.id === selectedTemplate);
      const starterSticky: WhiteboardElement = {
        id: 'sticky_starter_' + Date.now(),
        type: 'sticky',
        x: 100,
        y: 100,
        width: 260,
        height: 180,
        text: `📌 ${template?.name || 'Study Notes'}\n\n• Write your lecture notes here\n• Draw diagrams & formulas\n• Click "AI Suite" when ready to generate PPTs & Quizzes!`,
        color: '#fef08a',
      };
      updateCurrentProjectElements([starterSticky]);
    }

    showToast(`Whiteboard "${finalTitle}" initialized! 🎨`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
              Create New Digital Whiteboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your canvas paper pattern or start with a subject-specific template
            </p>
          </div>
        </div>

        {/* Notebook Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Whiteboard Notebook Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Quantum Mechanics Lecture 04, Organic Chemistry..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all shadow-xs"
            autoFocus
          />
        </div>

        {/* Subject Template Starters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Choose Starter Template
            </label>
            <span className="text-[11px] text-slate-400">Optional preset</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tpl.color} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tpl.name}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {tpl.category}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Background Pattern Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Paper Background Grid Pattern
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {patterns.map((pat) => {
              const Icon = pat.icon;
              const isSelected = selectedPattern === pat.id;
              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => setSelectedPattern(pat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {pat.label}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {pat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start Whiteboard</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
