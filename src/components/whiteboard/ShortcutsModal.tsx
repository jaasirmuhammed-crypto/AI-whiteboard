import React from 'react';
import { Keyboard } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'P', desc: 'Select Pen Tool' },
    { key: 'E', desc: 'Select Eraser Tool' },
    { key: 'T', desc: 'Select Text Tool' },
    { key: 'S', desc: 'Select Shapes' },
    { key: 'H / Space', desc: 'Pan / Hand Mode' },
    { key: 'Ctrl + Z', desc: 'Undo' },
    { key: 'Ctrl + Y', desc: 'Redo' },
    { key: '+ / -', desc: 'Zoom In / Zoom Out' },
    { key: '0', desc: 'Reset Zoom (100%)' },
    { key: 'Esc', desc: 'Close Modals / Deselect' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" maxWidth="max-w-md">
      <div className="space-y-3">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
