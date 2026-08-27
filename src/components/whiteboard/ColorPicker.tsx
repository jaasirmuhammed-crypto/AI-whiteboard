import React, { useState, useMemo } from 'react';
import { Check, Search, Copy, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { 
  COLOR_PALETTE_FAMILIES, 
  ALL_PALETTE_COLORS, 
  PaletteColor, 
  ColorFamily,
  hexToRgbString 
} from '../../data/colorPalettes';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose?: () => void;
  recentColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorChange,
  onClose,
  recentColors = ['#0f172a', '#4f46e5', '#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
}) => {
  const [selectedFamily, setSelectedFamily] = useState<ColorFamily>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customColor, setCustomColor] = useState(currentColor);
  const [copiedHex, setCopiedHex] = useState(false);

  // Find currently active color details or fallback
  const activeColorDetail = useMemo(() => {
    const found = ALL_PALETTE_COLORS.find(
      (c) => c.hex.toLowerCase() === currentColor.toLowerCase()
    );
    if (found) return found;
    return {
      name: 'Custom Pen Color',
      hex: currentColor.toUpperCase(),
      rgb: hexToRgbString(currentColor),
      family: 'all' as ColorFamily,
    };
  }, [currentColor]);

  // Filtered list of families/colors based on selection and search
  const filteredFamilies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return COLOR_PALETTE_FAMILIES.map((family) => {
      if (selectedFamily !== 'all' && family.id !== selectedFamily) {
        return null;
      }
      
      const matchingColors = family.colors.filter((c) => {
        if (!query) return true;
        return (
          c.name.toLowerCase().includes(query) ||
          c.hex.toLowerCase().includes(query) ||
          c.rgb.toLowerCase().includes(query)
        );
      });

      if (matchingColors.length === 0) return null;

      return {
        ...family,
        colors: matchingColors,
      };
    }).filter(Boolean) as typeof COLOR_PALETTE_FAMILIES;
  }, [selectedFamily, searchQuery]);

  const handleSelectColor = (hex: string) => {
    setCustomColor(hex);
    onColorChange(hex);
  };

  const handleCopyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1500);
  };

  return (
    <div className="w-[94vw] sm:w-[620px] md:w-[740px] lg:w-[840px] max-h-[78vh] flex flex-col rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150">
      
      {/* 🌟 Header & Current Color Badge */}
      <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          {/* Active Color Preview Box */}
          <div 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center relative overflow-hidden transition-transform hover:scale-105"
            style={{ backgroundColor: currentColor }}
          >
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onColorChange(e.target.value);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Click to pick custom hex color"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-brand">
                {activeColorDetail.name}
              </span>
              <button
                onClick={(e) => handleCopyHex(currentColor, e)}
                className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Copy HEX Code"
              >
                <span>{currentColor.toUpperCase()}</span>
                <Copy className="w-2.5 h-2.5 opacity-70" />
              </button>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-400">
              {activeColorDetail.rgb}
            </span>
          </div>
        </div>

        {/* Search Bar & Custom Input */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search shade or #hex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 sm:w-48 pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Close Color Palette"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 🏷️ Color Family Filter Tabs */}
      <div className="px-3 sm:px-4 py-2 border-b border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
        <button
          onClick={() => setSelectedFamily('all')}
          className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedFamily === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>All Families ({ALL_PALETTE_COLORS.length})</span>
        </button>

        {COLOR_PALETTE_FAMILIES.map((family) => {
          const isSelected = selectedFamily === family.id;
          return (
            <button
              key={family.id}
              onClick={() => setSelectedFamily(family.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20" 
                style={{ backgroundColor: family.accent }} 
              />
              <span>{family.name}</span>
            </button>
          );
        })}
      </div>

      {/* 🎨 Organized Color Grid Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-5 custom-scrollbar">
        {filteredFamilies.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No colors match &ldquo;{searchQuery}&rdquo;. Try another name or hex code.
          </div>
        ) : (
          filteredFamilies.map((family) => (
            <div key={family.id} className="space-y-2">
              {/* Family Section Title */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-xs" 
                  style={{ backgroundColor: family.accent }} 
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {family.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ({family.colors.length} shades)
                </span>
              </div>

              {/* Grid of Color Swatches with detailed Name, HEX, and RGB */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5">
                {family.colors.map((colorItem) => {
                  const isSelected = currentColor.toLowerCase() === colorItem.hex.toLowerCase();
                  return (
                    <button
                      key={colorItem.hex}
                      type="button"
                      onClick={() => handleSelectColor(colorItem.hex)}
                      className={`group flex flex-col p-1.5 rounded-xl border text-left transition-all hover:scale-[1.03] active:scale-[0.98] ${
                        isSelected
                          ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 border-transparent bg-indigo-50/80 dark:bg-indigo-950/50 shadow-md'
                          : 'border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs'
                      }`}
                    >
                      {/* Square Swatch Preview */}
                      <div
                        className="w-full aspect-square rounded-lg border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center relative shadow-2xs transition-transform group-hover:scale-102"
                        style={{ backgroundColor: colorItem.hex }}
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-md animate-in zoom-in-75">
                            <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Color Information: Name, HEX, RGB */}
                      <div className="mt-1.5 flex flex-col min-w-0">
                        <span 
                          className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                          title={colorItem.name}
                        >
                          {colorItem.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-tight mt-0.5">
                          {colorItem.hex}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 dark:text-slate-400 truncate">
                          {colorItem.rgb}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ⏳ Footer with Quick Recent Colors & Notification */}
      {recentColors && recentColors.length > 0 && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Recent Inks:
            </span>
            <div className="flex items-center gap-1.5">
              {recentColors.slice(0, 8).map((hex, idx) => (
                <button
                  key={`${hex}-${idx}`}
                  type="button"
                  onClick={() => handleSelectColor(hex)}
                  className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 active:scale-95 shadow-2xs ${
                    currentColor.toLowerCase() === hex.toLowerCase()
                      ? 'ring-2 ring-indigo-500 border-transparent scale-105'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {copiedHex && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                HEX Copied!
              </span>
            )}
            <span className="text-[10px] text-slate-400">
              Click any swatch to apply to active pen
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
