import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { 
  WhiteboardElement, 
  StrokeElement, 
  ShapeElement, 
  TextElement, 
  StickyElement, 
  StrokePoint, 
  ToolType, 
  PenType, 
  PencilType, 
  EraserType, 
  ShapeType, 
  BackgroundPattern 
} from '../../types/whiteboard';
import { useTheme } from '../../context/ThemeContext';

export interface WhiteboardCanvasRef {
  getSnapshotDataUrl: () => string;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface WhiteboardCanvasProps {
  elements: WhiteboardElement[];
  onElementsChange: (elements: WhiteboardElement[], thumbnail?: string) => void;
  backgroundPattern: BackgroundPattern;
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
  scale: number;
  panOffset: { x: number; y: number };
  isPanMode: boolean;
  onPanChange: (offset: { x: number; y: number }) => void;
  onScaleChange: (scale: number) => void;
}

export const WhiteboardCanvas = forwardRef<WhiteboardCanvasRef, WhiteboardCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  // History Stacks
  const [history, setHistory] = useState<WhiteboardElement[][]>([props.elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active interaction states
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<StrokeElement | null>(null);
  const [currentShape, setCurrentShape] = useState<ShapeElement | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Active inline text editing
  const [activeTextInput, setActiveTextInput] = useState<{
    id?: string;
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // Active inline sticky editing
  const [activeStickyInput, setActiveStickyInput] = useState<{
    id: string;
    text: string;
  } | null>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushToHistory = useCallback((newElements: WhiteboardElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);

    // generate thumbnail
    setTimeout(() => {
      if (canvasRef.current) {
        const thumb = canvasRef.current.toDataURL('image/jpeg', 0.5);
        props.onElementsChange(newElements, thumb);
      } else {
        props.onElementsChange(newElements);
      }
    }, 50);
  }, [history, historyIndex, props]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevElements = history[newIndex];
      props.onElementsChange(prevElements);
    }
  }, [canUndo, historyIndex, history, props]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextElements = history[newIndex];
      props.onElementsChange(nextElements);
    }
  }, [canRedo, historyIndex, history, props]);

  // Expose imperative methods to parent
  useImperativeHandle(ref, () => ({
    getSnapshotDataUrl: () => {
      return canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';
    },
    clearCanvas: () => {
      pushToHistory([]);
    },
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  }), [handleUndo, handleRedo, canUndo, canRedo, pushToHistory]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Get coordinate mapped into world space
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - props.panOffset.x) / props.scale;
    const y = (clientY - rect.top - props.panOffset.y) / props.scale;
    return { x, y };
  }, [props.panOffset, props.scale]);

  // Redraw Canvas Main Loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Pattern
    const isDark = theme === 'dark';
    ctx.fillStyle = isDark ? '#090d16' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Apply Viewport Transform
    ctx.translate(props.panOffset.x, props.panOffset.y);
    ctx.scale(props.scale, props.scale);

    // Draw Background Grid/Lines in world space
    const patternColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.09)';
    ctx.strokeStyle = patternColor;
    ctx.lineWidth = 1;

    const startX = -props.panOffset.x / props.scale - 200;
    const endX = (width - props.panOffset.x) / props.scale + 200;
    const startY = -props.panOffset.y / props.scale - 200;
    const endY = (height - props.panOffset.y) / props.scale + 200;

    if (props.backgroundPattern === 'ruled') {
      const step = 32;
      for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
    } else if (props.backgroundPattern === 'grid' || props.backgroundPattern === 'graph') {
      const step = props.backgroundPattern === 'graph' ? 16 : 32;
      for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
    } else if (props.backgroundPattern === 'dotted') {
      const step = 28;
      ctx.fillStyle = patternColor;
      for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
        for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 2. Render All Saved Elements
    const elementsToRender = [...props.elements];
    if (currentStroke) elementsToRender.push(currentStroke);
    if (currentShape) elementsToRender.push(currentShape);

    elementsToRender.forEach((el) => {
      ctx.save();

      if (el.type === 'stroke') {
        if (el.points.length < 2) {
          ctx.restore();
          return;
        }

        ctx.globalAlpha = el.opacity || 1;
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (el.tool === 'highlighter') {
          ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';
          ctx.globalAlpha = el.opacity || 0.35;
        } else if (el.tool.includes('pencil')) {
          ctx.globalAlpha = 0.8;
          ctx.setLineDash([1, 0.5]); // Graphite texture simulation
        }

        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);

        for (let i = 1; i < el.points.length - 1; i++) {
          const xc = (el.points[i].x + el.points[i + 1].x) / 2;
          const yc = (el.points[i].y + el.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, xc, yc);
        }

        if (el.points.length > 1) {
          const last = el.points[el.points.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        ctx.stroke();
      } else if (el.type === 'shape') {
        ctx.globalAlpha = el.opacity || 1;
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.strokeWidth || 3;
        ctx.fillStyle = el.fillColor || 'transparent';

        const { x, y, width: w, height: h, shapeType } = el;

        if (shapeType === 'rectangle') {
          ctx.strokeRect(x, y, w, h);
          if (el.fillColor) ctx.fillRect(x, y, w, h);
        } else if (shapeType === 'circle') {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
          ctx.stroke();
          if (el.fillColor) ctx.fill();
        } else if (shapeType === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(x + w / 2, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.closePath();
          ctx.stroke();
          if (el.fillColor) ctx.fill();
        } else if (shapeType === 'line') {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
        } else if (shapeType === 'arrow') {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(h, w);
          const headLen = 14;
          ctx.beginPath();
          ctx.moveTo(x + w, y + h);
          ctx.lineTo(
            x + w - headLen * Math.cos(angle - Math.PI / 6),
            y + h - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            x + w - headLen * Math.cos(angle + Math.PI / 6),
            y + h - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = el.color;
          ctx.fill();
        } else if (shapeType === 'sticky-note') {
          // Sticky Note Container
          ctx.fillStyle = el.fillColor || '#fef3c7';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 16);
          ctx.fill();
          ctx.stroke();

          // Sticky note header
          ctx.fillStyle = '#92400e';
          ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('📌 Note', x + 12, y + 24);
        }
      } else if (el.type === 'text') {
        const fontStyle = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
        ctx.font = fontStyle;
        ctx.fillStyle = el.color;
        ctx.textAlign = el.align || 'left';
        ctx.fillText(el.text, el.x, el.y);

        if (el.underline) {
          const metrics = ctx.measureText(el.text);
          ctx.beginPath();
          ctx.strokeStyle = el.color;
          ctx.lineWidth = 1.5;
          ctx.moveTo(el.x, el.y + 4);
          ctx.lineTo(el.x + metrics.width, el.y + 4);
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    ctx.restore();
  }, [props, currentStroke, currentShape, theme]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const worldCoord = screenToWorld(e.clientX, e.clientY);
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsPointerDown(true);

    if (props.isPanMode || e.button === 1) {
      return; // Panning handled in pointer move
    }

    if (props.activeTool === 'pen' || props.activeTool === 'pencil' || props.activeTool === 'highlighter') {
      const toolType = props.activeTool === 'pencil' ? props.activePencil : props.activePen;
      setCurrentStroke({
        id: 'stroke_' + Date.now(),
        type: 'stroke',
        tool: toolType,
        points: [{ x: worldCoord.x, y: worldCoord.y, pressure: e.pressure || 0.5 }],
        color: props.color,
        width: props.strokeWidth,
        opacity: props.opacity,
        timestamp: Date.now(),
      });
    } else if (props.activeTool === 'shape') {
      const isSticky = props.activeShape === 'sticky-note';
      setCurrentShape({
        id: 'shape_' + Date.now(),
        type: 'shape',
        shapeType: props.activeShape,
        x: worldCoord.x,
        y: worldCoord.y,
        width: isSticky ? 180 : 0,
        height: isSticky ? 140 : 0,
        color: props.color,
        fillColor: isSticky ? '#fef3c7' : undefined,
        strokeWidth: props.strokeWidth,
        opacity: props.opacity,
      });
    } else if (props.activeTool === 'text') {
      setActiveTextInput({
        x: worldCoord.x,
        y: worldCoord.y,
        text: '',
      });
    } else if (props.activeTool === 'eraser') {
      // Stroke eraser check
      if (props.activeEraser === 'stroke-eraser') {
        const remaining = props.elements.filter((el) => {
          if (el.type === 'stroke') {
            const hit = el.points.some(
              (p) => Math.hypot(p.x - worldCoord.x, p.y - worldCoord.y) < 20
            );
            return !hit;
          }
          return true;
        });
        if (remaining.length !== props.elements.length) {
          pushToHistory(remaining);
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown) return;

    if (props.isPanMode || e.buttons === 4) {
      if (dragStart) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        props.onPanChange({
          x: props.panOffset.x + dx,
          y: props.panOffset.y + dy,
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    const worldCoord = screenToWorld(e.clientX, e.clientY);

    if (currentStroke) {
      setCurrentStroke((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, { x: worldCoord.x, y: worldCoord.y, pressure: e.pressure || 0.5 }],
        };
      });
    } else if (currentShape) {
      setCurrentShape((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          width: worldCoord.x - prev.x,
          height: worldCoord.y - prev.y,
        };
      });
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);

    if (currentStroke) {
      pushToHistory([...props.elements, currentStroke]);
      setCurrentStroke(null);
    } else if (currentShape) {
      pushToHistory([...props.elements, currentShape]);
      setCurrentShape(null);
    }
    setDragStart(null);
  };

  // Wheel Zoom & Trackpad Pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = Math.min(Math.max(props.scale * zoomFactor, 0.2), 4.0);
      props.onScaleChange(newScale);
    } else {
      props.onPanChange({
        x: props.panOffset.x - e.deltaX,
        y: props.panOffset.y - e.deltaY,
      });
    }
  };

  // Save Text Element
  const handleSaveText = () => {
    if (activeTextInput && activeTextInput.text.trim()) {
      const newTextEl: TextElement = {
        id: 'txt_' + Date.now(),
        type: 'text',
        x: activeTextInput.x,
        y: activeTextInput.y,
        text: activeTextInput.text,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        color: props.color,
        bold: props.isBold,
        italic: props.isItalic,
        underline: props.isUnderline,
        align: props.textAlign,
      };
      pushToHistory([...props.elements, newTextEl]);
    }
    setActiveTextInput(null);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={`relative w-full h-[calc(100vh-65px)] overflow-hidden select-none touch-none ${
        props.isPanMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
      }`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block"
      />

      {/* Text Tool Guidance Banner when Text Tool is active */}
      {props.activeTool === 'text' && !activeTextInput && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-indigo-600/90 text-white text-xs font-bold shadow-xl backdrop-blur-md border border-indigo-400/40 animate-in fade-in slide-in-from-top-2 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Text Tool Active: Click or tap anywhere on the whiteboard canvas to start typing!
        </div>
      )}

      {/* Inline Text Input Overlay */}
      {activeTextInput && (
        <div
          className="absolute z-30 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 p-2 rounded-2xl border-2 border-indigo-600 shadow-2xl backdrop-blur-xl animate-in zoom-in-95"
          style={{
            left: `${activeTextInput.x * props.scale + props.panOffset.x}px`,
            top: `${activeTextInput.y * props.scale + props.panOffset.y}px`,
          }}
        >
          <input
            type="text"
            autoFocus
            value={activeTextInput.text}
            onChange={(e) => setActiveTextInput({ ...activeTextInput, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveText();
              if (e.key === 'Escape') setActiveTextInput(null);
            }}
            placeholder="Type your study notes here..."
            className="bg-transparent border-none outline-none px-2 py-1 min-w-[220px] text-slate-900 dark:text-white"
            style={{
              fontFamily: props.fontFamily,
              fontSize: `${Math.max(14, props.fontSize)}px`,
              color: props.color,
              fontWeight: props.isBold ? 'bold' : 'normal',
              fontStyle: props.isItalic ? 'italic' : 'normal',
            }}
          />

          <button
            onMouseDown={(e) => { e.preventDefault(); handleSaveText(); }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors"
          >
            Save ✓
          </button>

          <button
            onMouseDown={(e) => { e.preventDefault(); setActiveTextInput(null); }}
            className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 font-bold text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
});

WhiteboardCanvas.displayName = 'WhiteboardCanvas';
