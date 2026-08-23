import React from 'react';
import { PenType, PencilType } from '../../types/whiteboard';
import { PenTool, Feather, Highlighter, Brush, Pencil, Sparkles, Check } from 'lucide-react';

interface PenSelectorProps {
  currentPen: PenType | PencilType;
  strokeWidth: number;
  opacity: number;
  currentColor: string;
  onSelectPen: (pen: PenType | PencilType) => void;
  onWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
}

export const PenSelector: React.FC<PenSelectorProps> = ({
  currentPen,
  strokeWidth,
  opacity,
  currentColor,
  onSelectPen,
  onWidthChange,
  onOpacityChange,
}) => {
  const pens: { id: PenType; name: string; desc: string; icon: any; defaultWidth: number }[] = [
    { id: 'basic-pen', name: 'Basic Pen', desc: 'Standard handwriting', icon: PenTool, defaultWidth: 3 },
    { id: 'marker', name: 'Marker', desc: 'Bold opaque lines', icon: PenTool, defaultWidth: 8 },
    { id: 'highlighter', name: 'Highlighter', desc: 'Semi-transparent glow', icon: Highlighter, defaultWidth: 20 },
    { id: 'fine-pen', name: 'Fine Pen', desc: 'Thin 0.5mm precision', icon: Feather, defaultWidth: 1.5 },
    { id: 'brush', name: 'Art Brush', desc: 'Fluid tapered strokes', icon: Brush, defaultWidth: 6 },
  ];

  const pencils: { id: PencilType; name: string; desc: string; icon: any; defaultWidth: number }[] = [
    { id: 'hb-pencil', name: 'HB Pencil', desc: 'Standard medium lead', icon: Pencil, defaultWidth: 2 },
    { id: '2b-pencil', name: '2B Soft Pencil', desc: 'Darker textured graphite', icon: Pencil, defaultWidth: 3 },
    { id: 'mechanical-pencil', name: 'Mechanical Pencil', desc: 'Constant 0.5mm lead', icon: Pencil, defaultWidth: 1.2 },
    { id: 'soft-pencil', name: 'Art Soft Pencil', desc: 'Expressive shading', icon: Pencil, defaultWidth: 5 },
  ];

  return (
    <div className="p-4 w-72 space-y-4">
      {/* Pen Styles Section */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Pens & Markers
        </div>
        <div className="space-y-1">
          {pens.map((pen) => {
            const Icon = pen.icon;
            const isSelected = currentPen === pen.id;
            return (
              <button
                key={pen.id}
                onClick={() => {
                  onSelectPen(pen.id);
                  if (pen.id === 'highlighter') {
                    onOpacityChange(0.35);
                  } else {
                    onOpacityChange(1);
                  }
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div className="font-semibold">{pen.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{pen.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graphite Pencils Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Graphite Pencils
        </div>
        <div className="space-y-1">
          {pencils.map((p) => {
            const Icon = p.icon;
            const isSelected = currentPen === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPen(p.id);
                  onOpacityChange(0.85);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{p.desc}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thickness & Opacity Sliders */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Stroke Thickness</span>
            <span className="font-mono text-slate-400">{strokeWidth}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            value={strokeWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Opacity</span>
            <span className="font-mono text-slate-400">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Live Stroke Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-12">
          <div
            style={{
              width: '80%',
              height: `${Math.max(2, strokeWidth)}px`,
              backgroundColor: currentColor,
              opacity: opacity,
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
