import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  Highlighter, 
  Eraser, 
  Type, 
  Image as ImageIcon, 
  Undo2, 
  Redo2, 
  Trash2, 
  Shapes, 
  StickyNote,
  Check,
  Plus,
  Minus,
  Sliders,
  ChevronUp,
  History,
  Palette
} from 'lucide-react';
import { ToolType, PenType, PencilType, EraserType, ShapeType } from '../../types/whiteboard';
import { ShapeSelector } from './ShapeSelector';
import { FontPanel } from './FontPanel';
import { ColorPicker } from './ColorPicker';

interface FloatingToolbarProps {
  activeTool: ToolType;
  activePen: PenType;
  activePencil: PencilType;
  activeEraser: EraserType;
  activeShape: ShapeType;
  color: string;
  strokeWidth: number;
  opacity: number;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: 'left' | 'center' | 'right';
  onSelectTool: (tool: ToolType) => void;
  onSelectPen: (pen: PenType | PencilType) => void;
  onSelectEraser: (eraser: EraserType) => void;
  onSelectShape: (shape: ShapeType) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onBoldToggle: () => void;
  onItalicToggle: () => void;
  onUnderlineToggle: () => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onImageUpload?: (file: File) => void;
  onOpenTimelineHistory?: () => void;
  scale?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = (props) => {
  const [activePopover, setActivePopover] = useState<'pens' | 'color' | 'stroke' | 'text' | 'shape' | null>(null);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePopover = (popover: 'pens' | 'color' | 'stroke' | 'text' | 'shape') => {
    setActivePopover(activePopover === popover ? null : popover);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const PALETTE_COLORS = [
    '#1e293b', // Slate
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#ffffff', // White
  ];

  const STROKE_PRESETS = [
    { label: 'Fine', width: 2 },
    { label: 'Medium', width: 4 },
    { label: 'Bold', width: 8 },
    { label: 'Marker', width: 16 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && props.onImageUpload) {
      props.onImageUpload(file);
    }
    if (e.target) e.target.value = '';
  };

  if (isMobileCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-40 sm:hidden flex items-center gap-2">
        {props.onClear && (
          <button
            onClick={props.onClear}
            className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl shadow-rose-600/40 flex items-center justify-center border-2 border-white dark:border-slate-800 transition-transform active:scale-95"
            title="Clear Whiteboard"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setIsMobileCollapsed(false)}
          className="p-3.5 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-600/50 flex items-center justify-center border-2 border-white dark:border-slate-800"
          title="Expand Whiteboard Tools"
        >
          <PenTool className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={toolbarRef}
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center select-none max-w-[calc(100vw-1rem)] px-2"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Popovers Container */}

      {/* 🖌️ Pens & Brushes Popover */}
      {activePopover === 'pens' && (
        <div className="mb-3 p-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl w-64 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pen & Brush Type
            </div>
            <button
              onClick={() => setActivePopover('color')}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              title="Open Full Color Palette"
            >
              <Palette className="w-3 h-3" />
              <span>Palette</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'basic-pen', name: 'Ink Pen', tool: 'pen' },
              { id: 'fine-pen', name: 'Fine Tip', tool: 'pen' },
              { id: 'brush', name: 'Art Brush', tool: 'pen' },
              { id: 'highlighter', name: 'Highlighter', tool: 'highlighter' },
              { id: 'hb-pencil', name: 'HB Pencil', tool: 'pencil' },
              { id: '2b-pencil', name: '2B Soft', tool: 'pencil' },
            ].map((p) => {
              const isSelected = props.activePen === p.id || (p.tool === 'highlighter' && props.activeTool === 'highlighter');
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (p.tool === 'highlighter') {
                      props.onSelectTool('highlighter');
                    } else if (p.tool === 'pencil') {
                      props.onSelectTool('pencil');
                      props.onSelectPen(p.id as any);
                    } else {
                      props.onSelectTool('pen');
                      props.onSelectPen(p.id as any);
                    }
                    setActivePopover(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 🎨 Color Picker Popover */}
      {activePopover === 'color' && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
          <ColorPicker
            currentColor={props.color}
            onColorChange={(newColor) => {
              props.onColorChange(newColor);
            }}
            onClose={() => setActivePopover(null)}
          />
        </div>
      )}

      {/* 📏 Stroke Thickness Popover */}
      {activePopover === 'stroke' && (
        <div className="mb-3 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl w-64 space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Stroke Width
            </span>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {props.strokeWidth}px
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {STROKE_PRESETS.map((preset) => (
              <button
                key={preset.width}
                type="button"
                onClick={() => props.onStrokeWidthChange(preset.width)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center border transition-all ${
                  props.strokeWidth === preset.width
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={32}
            value={props.strokeWidth}
            onChange={(e) => props.onStrokeWidthChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Opacity: {Math.round(props.opacity * 100)}%</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={props.opacity}
              onChange={(e) => props.onOpacityChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* 📝 Text Typography Popover */}
      {activePopover === 'text' && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
          <FontPanel
            currentFont={props.fontFamily}
            fontSize={props.fontSize}
            isBold={props.isBold}
            isItalic={props.isItalic}
            isUnderline={props.isUnderline}
            align={props.textAlign}
            onFontChange={props.onFontChange}
            onFontSizeChange={props.onFontSizeChange}
            onBoldToggle={props.onBoldToggle}
            onItalicToggle={props.onItalicToggle}
            onUnderlineToggle={props.onUnderlineToggle}
            onAlignChange={props.onAlignChange}
          />
        </div>
      )}

      {/* 🔷 Shapes Popover */}
      {activePopover === 'shape' && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
          <ShapeSelector
            currentShape={props.activeShape}
            onSelectShape={(shape) => {
              props.onSelectShape(shape);
              setActivePopover(null);
            }}
          />
        </div>
      )}

      {/* 🚀 Main Glassmorphism Floating Dock */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/10">
        
        {/* 1. 🖌️ Pen & Brush Group */}
        <button
          onClick={() => {
            props.onSelectTool('pen');
            togglePopover('pens');
          }}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1 ${
            props.activeTool === 'pen' || props.activeTool === 'pencil' || props.activeTool === 'highlighter'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Pen & Brush Tools (P)"
        >
          <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
          <ChevronUp className="w-3 h-3 opacity-70" />
        </button>

        {/* 2. 🧹 Eraser */}
        <button
          onClick={() => {
            props.onSelectTool('eraser');
            setActivePopover(null);
          }}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'eraser'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 3. 📝 Text tool */}
        <button
          onClick={() => {
            props.onSelectTool('text');
            togglePopover('text');
          }}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'text'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Text Tool (T)"
        >
          <Type className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 4. 📌 Sticky Note Quick Button */}
        <button
          onClick={() => {
            props.onSelectShape('sticky-note');
            props.onSelectTool('shape');
            setActivePopover(null);
          }}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeShape === 'sticky-note' && props.activeTool === 'shape'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
          title="Sticky Note (N)"
        >
          <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 5. 🔷 Shapes Menu */}
        <button
          onClick={() => {
            props.onSelectTool('shape');
            togglePopover('shape');
          }}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'shape' && props.activeShape !== 'sticky-note'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Shapes (S)"
        >
          <Shapes className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 6. 🖼️ Image upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-center"
          title="Image Upload"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* 7. 🎨 Color Picker */}
        <button
          onClick={() => togglePopover('color')}
          className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center ${
            activePopover === 'color'
              ? 'bg-slate-200 dark:bg-slate-800'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Color Palette"
        >
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            style={{ backgroundColor: props.color }}
          />
        </button>

        {/* 8. 📏 Stroke Size */}
        <button
          onClick={() => togglePopover('stroke')}
          className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center gap-1 text-slate-600 dark:text-slate-300 ${
            activePopover === 'stroke'
              ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Stroke Thickness"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px] font-bold hidden sm:inline font-mono">
            {props.strokeWidth}px
          </span>
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* 9. ↩️ Undo */}
        {props.onUndo && (
          <button
            onClick={props.onUndo}
            disabled={!props.canUndo}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}

        {/* 10. ↪️ Redo */}
        {props.onRedo && (
          <button
            onClick={props.onRedo}
            disabled={!props.canRedo}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        )}

        {/* 11. ⏱️ Visual Timeline History Scrubber Trigger */}
        {props.onOpenTimelineHistory && (
          <button
            onClick={props.onOpenTimelineHistory}
            className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
            title="Visual Undo Timeline History"
          >
            <History className="w-4 h-4" />
          </button>
        )}

        {/* 12. 🗑️ Clear */}
        {props.onClear && (
          <button
            onClick={props.onClear}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* 13. 🔍 Zoom Controls */}
        {(props.onZoomIn || props.onZoomOut) && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 ml-0.5">
            <button
              onClick={props.onZoomOut}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="Zoom Out (-)"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={props.onResetZoom}
              className="px-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors font-mono"
              title="Reset Zoom (100%)"
            >
              {Math.round((props.scale || 1) * 100)}%
            </button>
            <button
              onClick={props.onZoomIn}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="Zoom In (+)"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
