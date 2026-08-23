import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  recentColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorChange,
  recentColors = ['#1e293b', '#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
}) => {
  const defaultColors = [
    { name: 'Black', hex: '#0f172a' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Brown', hex: '#78350f' },
    { name: 'Teal', hex: '#14b8a6' },
  ];

  const [customColor, setCustomColor] = useState(currentColor);

  return (
    <div className="p-3.5 w-64 space-y-3">
      {/* Palette Swatches */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Color Palette
        </div>
        <div className="grid grid-cols-6 gap-2">
          {defaultColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onColorChange(c.hex)}
              title={c.name}
              className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs ${
                currentColor === c.hex
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 border-transparent'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {currentColor === c.hex && (
                <Check className={`w-3.5 h-3.5 ${c.hex === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker Input */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Color</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onColorChange(e.target.value);
            }}
            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0"
          />
          <span className="text-[11px] font-mono text-slate-500 uppercase">{currentColor}</span>
        </div>
      </div>

      {/* Recently Used Bar */}
      {recentColors && recentColors.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Recent Colors
          </div>
          <div className="flex items-center gap-1.5">
            {recentColors.slice(0, 7).map((hex, idx) => (
              <button
                key={idx}
                onClick={() => onColorChange(hex)}
                className="w-5 h-5 rounded-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
