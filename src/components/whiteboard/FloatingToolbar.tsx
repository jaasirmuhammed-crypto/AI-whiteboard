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
  Sliders
} from 'lucide-react';
import { ToolType, PenType, PencilType, EraserType, ShapeType } from '../../types/whiteboard';
import { ShapeSelector } from './ShapeSelector';
import { FontPanel } from './FontPanel';

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
  // Core Requested Tools
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onImageUpload?: (file: File) => void;
  scale?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = (props) => {
  const [activePopover, setActivePopover] = useState<'color' | 'stroke' | 'text' | 'shape' | null>(null);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePopover = (popover: 'color' | 'stroke' | 'text' | 'shape') => {
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

  // If collapsed on mobile, render minimal floating toggle pill
  if (isMobileCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
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
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Popovers Container */}

      {/* 🎨 Color Picker Popover */}
      {activePopover === 'color' && (
        <div className="mb-3 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl w-64 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Color
            </span>
            <input
              type="color"
              value={props.color}
              onChange={(e) => props.onColorChange(e.target.value)}
              className="w-5 h-5 rounded-full cursor-pointer border-0 bg-transparent p-0"
              title="Custom Color Picker"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {PALETTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  props.onColorChange(c);
                }}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs"
                style={{ backgroundColor: c }}
              >
                {props.color.toLowerCase() === c.toLowerCase() && (
                  <Check className={`w-4 h-4 ${c === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📏 Stroke Size Popover */}
      {activePopover === 'stroke' && (
        <div className="mb-3 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl w-64 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="uppercase tracking-wider">Stroke Size</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{props.strokeWidth}px</span>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="range"
              min="1"
              max="40"
              value={props.strokeWidth}
              onChange={(e) => props.onStrokeWidthChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div
              className="rounded-full bg-indigo-600 shrink-0"
              style={{
                width: Math.min(22, Math.max(4, props.strokeWidth)),
                height: Math.min(22, Math.max(4, props.strokeWidth)),
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {STROKE_PRESETS.map((preset) => (
              <button
                key={preset.width}
                onClick={() => props.onStrokeWidthChange(preset.width)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                  props.strokeWidth === preset.width
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📝 Text Typography Popover */}
      {activePopover === 'text' && (
        <div className="mb-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
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
        <div className="mb-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <ShapeSelector
            currentShape={props.activeShape}
            onSelectShape={(shape) => {
              props.onSelectShape(shape);
              props.onSelectTool('shape');
              setActivePopover(null);
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MAIN FLOATING TOOLBAR DOCK */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 p-1.5 sm:p-2 max-w-[95vw] overflow-x-auto rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-950/20 scrollbar-none">
        
        {/* 1. ✏️ Pen */}
        <button
          onClick={() => {
            props.onSelectTool('pen');
            props.onSelectPen('basic-pen');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'pen'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="✏️ Pen (P)"
        >
          <PenTool className="w-5 h-5" />
        </button>

        {/* 2. 🖊️ Highlighter */}
        <button
          onClick={() => {
            props.onSelectTool('highlighter');
            props.onSelectPen('highlighter');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'highlighter'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="🖊️ Highlighter (H)"
        >
          <Highlighter className="w-5 h-5" />
        </button>

        {/* 3. 🧹 Eraser */}
        <button
          onClick={() => {
            props.onSelectTool('eraser');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'eraser'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="🧹 Eraser (E)"
        >
          <Eraser className="w-5 h-5" />
        </button>

        {/* 4. 📝 Text tool */}
        <button
          onClick={() => {
            props.onSelectTool('text');
            togglePopover('text');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'text'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="📝 Text Tool (T)"
        >
          <Type className="w-5 h-5" />
        </button>

        {/* 5. 🖼️ Image upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-center"
          title="🖼️ Image Upload (Insert Image)"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Sticky Note Quick Button */}
        <button
          onClick={() => {
            props.onSelectShape('sticky-note');
            props.onSelectTool('shape');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeShape === 'sticky-note' && props.activeTool === 'shape'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
          title="Sticky Note (N)"
        >
          <StickyNote className="w-5 h-5" />
        </button>

        {/* Shapes Menu */}
        <button
          onClick={() => {
            props.onSelectTool('shape');
            togglePopover('shape');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            props.activeTool === 'shape' && props.activeShape !== 'sticky-note'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Shapes (S)"
        >
          <Shapes className="w-5 h-5" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* 6. 🎨 Color Picker */}
        <button
          onClick={() => togglePopover('color')}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center ${
            activePopover === 'color'
              ? 'bg-slate-200 dark:bg-slate-800'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="🎨 Color Picker"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            style={{ backgroundColor: props.color }}
          />
        </button>

        {/* 7. 📏 Stroke Size */}
        <button
          onClick={() => togglePopover('stroke')}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1 text-slate-600 dark:text-slate-300 ${
            activePopover === 'stroke'
              ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="📏 Stroke Size"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[11px] font-bold hidden sm:inline font-mono">
            {props.strokeWidth}px
          </span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* 8. ↩️ Undo */}
        {props.onUndo && (
          <button
            onClick={props.onUndo}
            disabled={!props.canUndo}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="↩️ Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* 9. ↪️ Redo */}
        {props.onRedo && (
          <button
            onClick={props.onRedo}
            disabled={!props.canRedo}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="↪️ Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* 10. 🗑️ Clear */}
        {props.onClear && (
          <button
            onClick={props.onClear}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
            title="🗑️ Clear Canvas"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Separator */}
        {(props.onZoomIn || props.onZoomOut) && (
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5" />
        )}

        {/* 11. 🔍 Zoom */}
        {(props.onZoomIn || props.onZoomOut) && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-0.5">
            <button
              onClick={props.onZoomOut}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="🔍 Zoom Out (-)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={props.onResetZoom}
              className="px-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors font-mono"
              title="🔍 Reset Zoom (100%)"
            >
              {Math.round((props.scale || 1) * 100)}%
            </button>
            <button
              onClick={props.onZoomIn}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="🔍 Zoom In (+)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
