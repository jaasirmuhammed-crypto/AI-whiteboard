import React from 'react';
import { FontCategory, FontOption } from '../../types/whiteboard';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface FontPanelProps {
  currentFont: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  align: 'left' | 'center' | 'right';
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onBoldToggle: () => void;
  onItalicToggle: () => void;
  onUnderlineToggle: () => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
}

export const FontPanel: React.FC<FontPanelProps> = ({
  currentFont,
  fontSize,
  isBold,
  isItalic,
  isUnderline,
  align,
  onFontChange,
  onFontSizeChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  onAlignChange,
}) => {
  const fontOptions: FontOption[] = [
    // Basic
    { id: 'sans', name: 'Sans Serif (Inter)', category: 'basic', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    { id: 'serif', name: 'Serif (Playfair)', category: 'basic', fontFamily: "'Playfair Display', serif" },
    { id: 'mono', name: 'Monospace (Code)', category: 'basic', fontFamily: "'Fira Code', monospace" },
    
    // Study
    { id: 'clean', name: 'Academic Clean', category: 'study', fontFamily: "'Outfit', sans-serif" },
    { id: 'notebook', name: 'Notebook Hand', category: 'study', fontFamily: "'Caveat', cursive" },
    { id: 'pencil-study', name: 'Pencil Script', category: 'study', fontFamily: "'Kalam', cursive" },

    // Creative
    { id: 'display', name: 'Brand Display (Syne)', category: 'creative', fontFamily: "'Syne', sans-serif" },
    { id: 'modern', name: 'Space Grotesk', category: 'creative', fontFamily: "'Space Grotesk', sans-serif" },
    { id: 'elegant', name: 'Cinzel Classic', category: 'creative', fontFamily: "'Cinzel', serif" },
  ];

  return (
    <div className="p-4 w-72 space-y-4">
      {/* Font Family Selection */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Typography Style
        </div>
        <select
          value={currentFont}
          onChange={(e) => onFontChange(e.target.value)}
          className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <optgroup label="Basic Fonts">
            {fontOptions.filter(f => f.category === 'basic').map(f => (
              <option key={f.id} value={f.fontFamily}>{f.name}</option>
            ))}
          </optgroup>
          <optgroup label="Study & Notebook">
            {fontOptions.filter(f => f.category === 'study').map(f => (
              <option key={f.id} value={f.fontFamily}>{f.name}</option>
            ))}
          </optgroup>
          <optgroup label="Creative & Display">
            {fontOptions.filter(f => f.category === 'creative').map(f => (
              <option key={f.id} value={f.fontFamily}>{f.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Size</span>
          <span className="font-mono text-slate-400">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="72"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* Formatting & Alignment Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={onBoldToggle}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isBold ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onItalicToggle}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isItalic ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onUnderlineToggle}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isUnderline ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
          <button
            onClick={() => onAlignChange('left')}
            className={`p-2 rounded-xl text-xs ${align === 'left' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignChange('center')}
            className={`p-2 rounded-xl text-xs ${align === 'center' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignChange('right')}
            className={`p-2 rounded-xl text-xs ${align === 'right' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
