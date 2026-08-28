import React from 'react';
import { Keyboard, Command, Sparkles, X, Layers, MousePointer, Edit3, HelpCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  key: string;
  desc: string;
  category: 'Tools' | 'Canvas' | 'AI & Notes';
}

const SHORTCUTS: ShortcutItem[] = [
  { key: 'P', desc: 'Pen Tool / Brush', category: 'Tools' },
  { key: 'E', desc: 'Eraser Tool', category: 'Tools' },
  { key: 'H', desc: 'Highlighter Tool', category: 'Tools' },
  { key: 'T', desc: 'Text & Typography Box', category: 'Tools' },
  { key: 'S', desc: 'Shapes Menu (Rect, Circle, Arrow)', category: 'Tools' },
  { key: 'N', desc: 'Quick Sticky Note', category: 'Tools' },
  { key: 'Ctrl + Z', desc: 'Undo stroke or element', category: 'Canvas' },
  { key: 'Ctrl + Y', desc: 'Redo stroke or element', category: 'Canvas' },
  { key: 'Ctrl + S', desc: 'Instant Auto-Save Flush', category: 'Canvas' },
  { key: 'Ctrl + +', desc: 'Zoom In Canvas', category: 'Canvas' },
  { key: 'Ctrl + -', desc: 'Zoom Out Canvas', category: 'Canvas' },
  { key: 'Ctrl + 0', desc: 'Reset Zoom (100%)', category: 'Canvas' },
  { key: 'Space + Drag', desc: 'Pan / Hand tool', category: 'Canvas' },
  { key: 'Ctrl + Enter', desc: 'Trigger AI Multimodal Synthesis', category: 'AI & Notes' },
  { key: 'Ctrl + E', desc: 'Open Multi-Format Export Hub', category: 'AI & Notes' },
  { key: '?', desc: 'Open Keyboard Shortcuts Guide', category: 'AI & Notes' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const categories: ('Tools' | 'Canvas' | 'AI & Notes')[] = ['Tools', 'Canvas', 'AI & Notes'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Keyboard Shortcuts & Hotkeys
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speed up your note-taking with instant single-key and modifier commands.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                {cat === 'Tools' && <Edit3 className="w-3.5 h-3.5 text-indigo-500" />}
                {cat === 'Canvas' && <MousePointer className="w-3.5 h-3.5 text-purple-500" />}
                {cat === 'AI & Notes' && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{cat}</span>
              </span>

              <div className="space-y-1.5">
                {SHORTCUTS.filter((s) => s.category === cat).map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {sc.desc}
                    </span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs shrink-0">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
          <span>Tip: Press </span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
            ?
          </kbd>
          <span> anytime on canvas to toggle this cheat sheet.</span>
        </div>
      </div>
    </Modal>
  );
};
