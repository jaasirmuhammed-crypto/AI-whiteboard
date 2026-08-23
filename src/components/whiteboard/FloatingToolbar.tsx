import React, { useState, useRef, useEffect } from 'react';
import { 
  MousePointer, 
  PenTool, 
  Pencil, 
  Eraser, 
  Palette, 
  Type, 
  Shapes, 
  StickyNote, 
  ChevronUp,
  Hand
} from 'lucide-react';
import { ToolType, PenType, PencilType, EraserType, ShapeType } from '../../types/whiteboard';
import { PenSelector } from './PenSelector';
import { ColorPicker } from './ColorPicker';
import { FontPanel } from './FontPanel';
import { ShapeSelector } from './ShapeSelector';

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
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = (props) => {
  const [activePopover, setActivePopover] = useState<'pen' | 'color' | 'text' | 'shape' | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const togglePopover = (popover: 'pen' | 'color' | 'text' | 'shape') => {
    setActivePopover(activePopover === popover ? null : popover);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={toolbarRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center select-none"
    >
      {/* Popovers Container */}
      {activePopover === 'pen' && (
        <div className="mb-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <PenSelector
            currentPen={props.activeTool === 'pencil' ? props.activePencil : props.activePen}
            strokeWidth={props.strokeWidth}
            opacity={props.opacity}
            currentColor={props.color}
            onSelectPen={(pen) => {
              props.onSelectPen(pen);
              setActivePopover(null);
            }}
            onWidthChange={props.onStrokeWidthChange}
            onOpacityChange={props.onOpacityChange}
          />
        </div>
      )}

      {activePopover === 'color' && (
        <div className="mb-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <ColorPicker
            currentColor={props.color}
            onColorChange={(color) => {
              props.onColorChange(color);
            }}
          />
        </div>
      )}

      {activePopover === 'text' && (
        <div className="mb-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
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

      {activePopover === 'shape' && (
        <div className="mb-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
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

      {/* Main Floating Tool Dock */}
      <div className="flex items-center gap-1 p-1.5 sm:p-2 max-w-[92vw] overflow-x-auto rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl scrollbar-none">
        
        {/* Select / Pointer Tool */}
        <button
          onClick={() => {
            props.onSelectTool('select');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeTool === 'select'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Select & Move (V)"
        >
          <MousePointer className="w-5 h-5" />
        </button>

        {/* Pens & Markers Tool */}
        <div className="relative">
          <button
            onClick={() => {
              props.onSelectTool('pen');
              togglePopover('pen');
            }}
            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1 ${
              props.activeTool === 'pen' || props.activeTool === 'highlighter' || props.activeTool === 'marker'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pens & Brushes (P)"
          >
            <PenTool className="w-5 h-5" />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: props.color }} />
          </button>
        </div>

        {/* Graphite Pencil Tool */}
        <button
          onClick={() => {
            props.onSelectTool('pencil');
            togglePopover('pen');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeTool === 'pencil'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Pencil Styles (HB, 2B)"
        >
          <Pencil className="w-5 h-5 text-amber-500" />
        </button>

        {/* Eraser Tool */}
        <button
          onClick={() => {
            props.onSelectTool('eraser');
            setActivePopover(null);
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeTool === 'eraser'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-5 h-5" />
        </button>

        {/* Color Picker Swatch */}
        <button
          onClick={() => togglePopover('color')}
          className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
          title="Color Swatches"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
            style={{ backgroundColor: props.color }}
          />
        </button>

        {/* Shapes Menu */}
        <button
          onClick={() => {
            props.onSelectTool('shape');
            togglePopover('shape');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeTool === 'shape'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Geometric Shapes & Sticky Notes (S)"
        >
          <Shapes className="w-5 h-5" />
        </button>

        {/* Text Tool */}
        <button
          onClick={() => {
            props.onSelectTool('text');
            togglePopover('text');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeTool === 'text'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Typography & Notes (T)"
        >
          <Type className="w-5 h-5" />
        </button>

        {/* Sticky Note Quick Add */}
        <button
          onClick={() => {
            props.onSelectShape('sticky-note');
            props.onSelectTool('shape');
          }}
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
            props.activeShape === 'sticky-note' && props.activeTool === 'shape'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
          title="Add Sticky Note"
        >
          <StickyNote className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
