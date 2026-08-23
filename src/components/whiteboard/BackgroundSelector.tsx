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
  const patterns: { id: BackgroundPattern; label: string; desc: string }[] = [
    { id: 'blank', label: 'Blank', desc: 'Clean white canvas' },
    { id: 'ruled', label: 'Ruled Notebook', desc: 'Standard lined sheet' },
    { id: 'grid', label: 'Math Grid', desc: 'Square grid for calculations' },
    { id: 'dotted', label: 'Dotted Journal', desc: 'Bullet journal matrix' },
    { id: 'graph', label: 'Graph Paper', desc: 'Engineering graph grid' },
  ];

  return (
    <div className="p-3 w-56 space-y-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
        Canvas Pattern
      </div>
      {patterns.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelectPattern(p.id)}
          className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
            currentPattern === p.id
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div>
            <div className="font-semibold">{p.label}</div>
            <div className="text-[10px] text-slate-400">{p.desc}</div>
          </div>
          {currentPattern === p.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        </button>
      ))}
    </div>
  );
};
