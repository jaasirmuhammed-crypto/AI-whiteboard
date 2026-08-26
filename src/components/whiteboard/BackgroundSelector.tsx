import React from 'react';
import { BackgroundPattern } from '../../types/whiteboard';
import { Check } from 'lucide-react';

interface BackgroundSelectorProps {
  currentPattern: BackgroundPattern;
  onSelectPattern: (pattern: BackgroundPattern) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentPattern,
  onSelectPattern,
}) => {
  const patterns: { id: BackgroundPattern; label: string; desc: string; icon: string }[] = [
    { id: 'blank', label: 'Blank Canvas', desc: 'Infinite white workspace', icon: '◻️' },
    { id: 'ruled', label: 'Lined / Ruled Paper', desc: 'Classic notebook handwriting lines', icon: '📝' },
    { id: 'grid', label: 'Math Grid', desc: '32px square grid for calculations', icon: '▦' },
    { id: 'dotted', label: 'Dot Matrix / Dotted', desc: 'Bullet journal matrix dots', icon: '⁖' },
    { id: 'graph', label: 'Engineering Graph', desc: 'Fine 16px technical graph paper', icon: '⊞' },
    { id: 'isometric', label: 'Isometric Grid', desc: '30° isometric grid for 3D sketching', icon: '📐' },
    { id: 'blueprint', label: 'Architect Blueprint', desc: 'Deep navy background with cyan grid', icon: '🏗️' },
  ];

  return (
    <div className="p-3 w-64 space-y-1.5 shadow-xl">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>Background Themes</span>
        <span className="text-[9px] text-indigo-500 font-bold">7 Patterns</span>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPattern(p.id)}
            className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
              currentPattern === p.id
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-500/30 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{p.icon}</span>
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{p.label}</div>
                <div className="text-[10px] text-slate-400">{p.desc}</div>
              </div>
            </div>
            {currentPattern === p.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};
