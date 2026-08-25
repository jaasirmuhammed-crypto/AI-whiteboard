import React from 'react';
import { Keyboard, Sparkles, Command } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcutGroups = [
    {
      category: 'Drawing & Tool Selection',
      items: [
        { key: 'P', desc: 'Select Pen / Drawing Brush' },
        { key: 'E', desc: 'Select Eraser Tool' },
        { key: 'T', desc: 'Select Text Annotation Tool' },
        { key: 'S', desc: 'Select Shapes (Circle, Box, Arrow)' },
        { key: 'C', desc: 'Open Color Palette' },
        { key: 'H / Space + Drag', desc: 'Pan / Hand Navigation Mode' },
      ],
    },
    {
      category: 'Canvas Actions & Workflow',
      items: [
        { key: 'Ctrl + Z', desc: 'Undo Stroke / Action' },
        { key: 'Ctrl + Y / Ctrl + Shift + Z', desc: 'Redo Action' },
        { key: 'Ctrl + E', desc: 'Quick Export Hub (PPTX, PDF, SVG)' },
        { key: 'Shift + S', desc: 'Instant Canvas Snapshot' },
        { key: 'Ctrl + Enter', desc: 'Save & Commit Typed Text' },
        { key: 'Esc', desc: 'Deselect Tool / Dismiss Modal' },
      ],
    },
    {
      category: 'Viewport & Zoom Controls',
      items: [
        { key: 'Ctrl + Scroll', desc: 'Smooth Zoom In / Out' },
        { key: '+ / -', desc: 'Step Zoom In / Step Zoom Out' },
        { key: '0', desc: 'Reset Canvas Viewport to 100%' },
        { key: '?', desc: 'Open Keyboard Shortcuts Guide' },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
              Power User Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Work faster with ergonomic single-key and modifier shortcuts.
            </p>
          </div>
        </div>

        {/* Categorized Shortcuts */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {group.category}
              </h4>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200/60 dark:divide-slate-700/60">
                {group.items.map((s, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{s.desc}</span>
                    <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold shadow-xs">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
