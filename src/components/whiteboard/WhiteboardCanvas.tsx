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
  BackgroundPattern,
  CollaboratorCursor,
  CanvasLayer,
  LineSmoothingLevel
} from '../../types/whiteboard';
import { useTheme } from '../../context/ThemeContext';
import { detectSmartShape, smoothStrokePoints, getStrokeBounds, BoundingBox } from '../../utils/strokeMath';
import { elementsToSVG } from '../../utils/svgExportUtil';
import { Trash2, Move, Check, Sparkles } from 'lucide-react';

export interface WhiteboardCanvasRef {
  getSnapshotDataUrl: () => string;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getSVGString: () => string;
  getHistory: () => WhiteboardElement[][];
  getHistoryIndex: () => number;
  jumpToHistoryIndex: (index: number) => void;
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
  smoothingLevel?: LineSmoothingLevel;
  pressureEnabled?: boolean;
  shapeAutoDetect?: boolean;
  layers?: CanvasLayer[];
  activeLayerId?: string;
  collaborators?: CollaboratorCursor[];
  onTelemetryUpdate?: (fps: number, latencyMs: number, strokeCount: number) => void;
}

export const WhiteboardCanvas = forwardRef<WhiteboardCanvasRef, WhiteboardCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  // History Stacks
  const [history, setHistory] = useState<WhiteboardElement[][]>([props.elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active interaction refs
  const isPointerDownRef = useRef(false);
  const currentStrokeRef = useRef<StrokeElement | null>(null);
  const currentShapeRef = useRef<ShapeElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isBufferDirtyRef = useRef(true);
  const dirtyBoundsRef = useRef<BoundingBox | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const erasedIdsRef = useRef<Set<string>>(new Set());

  // Selected & Dragging Element State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const selectedElementIdRef = useRef(selectedElementId);
  selectedElementIdRef.current = selectedElementId;

  const draggingElementRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    startMouseX: number;
    startMouseY: number;
    currentDx: number;
    currentDy: number;
    hasMoved: boolean;
  } | null>(null);

  const [cursorStyle, setCursorStyle] = useState<string>('default');

  // UI notifications
  const [detectedShapeToast, setDetectedShapeToast] = useState<string | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // High-performance 120Hz Telemetry
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const lastDrawStartRef = useRef(performance.now());

  // Active inline text & sticky note editing
  const [activeTextInput, setActiveTextInput] = useState<{
    id?: string;
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const [activeStickyInput, setActiveStickyInput] = useState<{
    id?: string;
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
  } | null>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Mark buffer dirty whenever external elements or view changes & sync history on load
  const prevElementsLengthRef = useRef(props.elements.length);
  useEffect(() => {
    isBufferDirtyRef.current = true;
    if (history.length <= 1 && props.elements.length > 0 && history[0].length === 0) {
      prevElementsLengthRef.current = props.elements.length;
      setHistory([props.elements]);
      setHistoryIndex(0);
    }
  }, [props.elements, props.backgroundPattern, theme, props.scale, props.panOffset, props.layers, history]);

  const pushToHistory = useCallback((newElements: WhiteboardElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    isBufferDirtyRef.current = true;

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
      isBufferDirtyRef.current = true;
      props.onElementsChange(prevElements);
    }
  }, [canUndo, historyIndex, history, props]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextElements = history[newIndex];
      isBufferDirtyRef.current = true;
      props.onElementsChange(nextElements);
    }
  }, [canRedo, historyIndex, history, props]);

  const jumpToHistoryIndex = useCallback((targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < history.length) {
      setHistoryIndex(targetIndex);
      const targetElements = history[targetIndex];
      isBufferDirtyRef.current = true;
      props.onElementsChange(targetElements);
    }
  }, [history, props]);

  // Multi-Touch Pinch-to-Zoom & Two-Finger Pan Engine
  const touchStateRef = useRef<{
    initialDist: number;
    initialScale: number;
    initialPan: { x: number; y: number };
    initialCenter: { x: number; y: number };
    isMultiTouch: boolean;
  }>({
    initialDist: 0,
    initialScale: 1,
    initialPan: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 },
    isMultiTouch: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const center = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };

        touchStateRef.current = {
          initialDist: dist,
          initialScale: props.scale,
          initialPan: { ...props.panOffset },
          initialCenter: center,
          isMultiTouch: true,
        };

        // Cancel any pending single-finger stroke
        currentStrokeRef.current = null;
        currentShapeRef.current = null;
        isPointerDownRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStateRef.current.isMultiTouch) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const center = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };

        const { initialDist, initialScale, initialPan, initialCenter } = touchStateRef.current;
        if (initialDist > 0) {
          const scaleFactor = dist / initialDist;
          const newScale = Math.min(4.0, Math.max(0.2, initialScale * scaleFactor));
          props.onScaleChange(newScale);

          const dx = center.x - initialCenter.x;
          const dy = center.y - initialCenter.y;
          props.onPanChange({
            x: initialPan.x + dx,
            y: initialPan.y + dy,
          });
        }
      } else if (e.touches.length === 1 && !props.isPanMode) {
        // Prevent accidental browser page scroll while actively drawing strokes
        if (isPointerDownRef.current && (props.activeTool === 'pen' || props.activeTool === 'highlighter' || props.activeTool === 'eraser' || props.activeTool === 'pencil')) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStateRef.current.isMultiTouch = false;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [props.scale, props.panOffset, props.onScaleChange, props.onPanChange, props.isPanMode, props.activeTool]);

  // SVG Export helper
  const getSVGString = useCallback((): string => {
    const isDark = theme === 'dark';
    const bg = isDark ? '#020617' : '#ffffff';
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style="background-color: ${bg};">\n`;

    props.elements.forEach((el) => {
      if (el.type === 'stroke' && el.points.length > 1) {
        const pathData = el.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        svgContent += `<path d="${pathData}" stroke="${el.color}" stroke-width="${el.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${el.opacity || 1}" />\n`;
      } else if (el.type === 'shape') {
        if (el.shapeType === 'rectangle') {
          svgContent += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" stroke="${el.color}" stroke-width="${el.strokeWidth || 2}" fill="${el.fillColor || 'none'}" opacity="${el.opacity || 1}" />\n`;
        } else if (el.shapeType === 'circle') {
          const r = Math.abs(el.width / 2);
          svgContent += `<ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${r}" ry="${Math.abs(el.height / 2)}" stroke="${el.color}" stroke-width="${el.strokeWidth || 2}" fill="${el.fillColor || 'none'}" opacity="${el.opacity || 1}" />\n`;
        } else if (el.shapeType === 'line') {
          svgContent += `<line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y + el.height}" stroke="${el.color}" stroke-width="${el.strokeWidth || 2}" opacity="${el.opacity || 1}" />\n`;
        }
      } else if (el.type === 'text') {
        svgContent += `<text x="${el.x}" y="${el.y}" fill="${el.color}" font-size="${el.fontSize}" font-family="${el.fontFamily}">${el.text}</text>\n`;
      }
    });

    svgContent += `</svg>`;
    return svgContent;
  }, [props.elements, theme]);

  useImperativeHandle(ref, () => ({
    getSnapshotDataUrl: () => {
      return canvasRef.current?.toDataURL('image/png') || '';
    },
    clearCanvas: () => {
      pushToHistory([]);
      setSelectedElementId(null);
    },
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    getSVGString,
    getHistory: () => history,
    getHistoryIndex: () => historyIndex,
    jumpToHistoryIndex,
  }), [handleUndo, handleRedo, canUndo, canRedo, pushToHistory, getSVGString, history, historyIndex, jumpToHistoryIndex]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          const remaining = props.elements.filter((el) => el.id !== selectedElementId);
          pushToHistory(remaining);
          setSelectedElementId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedElementId, props.elements, pushToHistory]);

  // Coordinate mapping
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - props.panOffset.x) / props.scale;
    const y = (clientY - rect.top - props.panOffset.y) / props.scale;
    return { x, y };
  }, [props.panOffset, props.scale]);

  // Hit test helper for text, sticky notes, and shapes
  const hitTestElement = useCallback((worldX: number, worldY: number): WhiteboardElement | null => {
    for (let i = props.elements.length - 1; i >= 0; i--) {
      const el = props.elements[i];
      if (el.type === 'text') {
        const textWidth = Math.max(60, (el.text || 'Text').length * (el.fontSize || 18) * 0.65);
        const textHeight = (el.fontSize || 18) * 1.5;
        if (
          worldX >= el.x - 8 &&
          worldX <= el.x + textWidth + 8 &&
          worldY >= el.y - textHeight &&
          worldY <= el.y + 12
        ) {
          return el;
        }
      } else if (el.type === 'sticky') {
        const w = el.width || 200;
        const h = el.height || 160;
        if (worldX >= el.x && worldX <= el.x + w && worldY >= el.y && worldY <= el.y + h) {
          return el;
        }
      } else if (el.type === 'image') {
        const imgEl = el as any;
        const w = imgEl.width || 200;
        const h = imgEl.height || 150;
        if (worldX >= imgEl.x && worldX <= imgEl.x + w && worldY >= imgEl.y && worldY <= imgEl.y + h) {
          return el;
        }
      } else if (el.type === 'shape') {
        if (el.shapeType === 'sticky-note') {
          const w = el.width || 200;
          const h = el.height || 160;
          if (worldX >= el.x && worldX <= el.x + w && worldY >= el.y && worldY <= el.y + h) {
            return el;
          }
        } else if (props.activeTool === 'select') {
          const minX = Math.min(el.x, el.x + el.width);
          const maxX = Math.max(el.x, el.x + el.width);
          const minY = Math.min(el.y, el.y + el.height);
          const maxY = Math.max(el.y, el.y + el.height);
          if (worldX >= minX - 10 && worldX <= maxX + 10 && worldY >= minY - 10 && worldY <= maxY + 10) {
            return el;
          }
        }
      }
    }
    return null;
  }, [props.elements, props.activeTool]);

  // Render static elements onto Offscreen Buffer Canvas
  const updateBufferCanvas = useCallback((width: number, height: number, dpr: number) => {
    if (!bufferCanvasRef.current) {
      bufferCanvasRef.current = document.createElement('canvas');
    }
    const buffer = bufferCanvasRef.current;
    if (buffer.width !== width * dpr || buffer.height !== height * dpr) {
      buffer.width = width * dpr;
      buffer.height = height * dpr;
    }

    const bCtx = buffer.getContext('2d', { alpha: true });
    if (!bCtx) return;

    bCtx.save();
    bCtx.scale(dpr, dpr);

    // 1. Background Pattern with subtle glassmorphism to show live wave animation
    const isDark = theme === 'dark';
    const isBlueprint = props.backgroundPattern === 'blueprint';
    
    if (isBlueprint) {
      bCtx.fillStyle = '#0a192f';
    } else {
      bCtx.fillStyle = isDark ? 'rgba(9, 13, 22, 0.86)' : 'rgba(255, 255, 255, 0.88)';
    }
    bCtx.fillRect(0, 0, width, height);

    bCtx.translate(props.panOffset.x, props.panOffset.y);
    bCtx.scale(props.scale, props.scale);

    const patternColor = isBlueprint 
      ? 'rgba(56, 189, 248, 0.22)' 
      : isDark 
      ? 'rgba(255,255,255,0.06)' 
      : 'rgba(99,102,241,0.09)';
    bCtx.strokeStyle = patternColor;
    bCtx.lineWidth = 1;

    const startX = -props.panOffset.x / props.scale - 200;
    const endX = (width - props.panOffset.x) / props.scale + 200;
    const startY = -props.panOffset.y / props.scale - 200;
    const endY = (height - props.panOffset.y) / props.scale + 200;

    if (props.backgroundPattern === 'ruled') {
      const step = 32;
      for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
        bCtx.beginPath();
        bCtx.moveTo(startX, y);
        bCtx.lineTo(endX, y);
        bCtx.stroke();
      }
    } else if (props.backgroundPattern === 'grid' || props.backgroundPattern === 'graph' || props.backgroundPattern === 'blueprint') {
      const step = props.backgroundPattern === 'graph' ? 16 : 32;
      for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
        bCtx.beginPath();
        bCtx.moveTo(x, startY);
        bCtx.lineTo(x, endY);
        bCtx.stroke();
      }
      for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
        bCtx.beginPath();
        bCtx.moveTo(startX, y);
        bCtx.lineTo(endX, y);
        bCtx.stroke();
      }
    } else if (props.backgroundPattern === 'dotted') {
      const step = 28;
      bCtx.fillStyle = patternColor;
      for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
        for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
          bCtx.beginPath();
          bCtx.arc(x, y, 1.2, 0, Math.PI * 2);
          bCtx.fill();
        }
      }
    } else if (props.backgroundPattern === 'isometric') {
      const step = 36;
      const angle = Math.PI / 6; // 30 degrees
      const tan = Math.tan(angle);
      // Horizontal lines
      for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
        bCtx.beginPath();
        bCtx.moveTo(startX, y);
        bCtx.lineTo(endX, y);
        bCtx.stroke();
      }
      // Diagonal lines /
      for (let x = Math.floor(startX / step) * step - (endY - startY) * tan; x <= endX + (endY - startY) * tan; x += step * 2) {
        bCtx.beginPath();
        bCtx.moveTo(x, startY);
        bCtx.lineTo(x + (endY - startY) * tan, endY);
        bCtx.stroke();
      }
      // Diagonal lines \
      for (let x = Math.floor(startX / step) * step - (endY - startY) * tan; x <= endX + (endY - startY) * tan; x += step * 2) {
        bCtx.beginPath();
        bCtx.moveTo(x, startY);
        bCtx.lineTo(x - (endY - startY) * tan, endY);
        bCtx.stroke();
      }
    }

    // 2. Render Committed Elements
    props.elements.forEach((el) => {
      // Layer visibility & lock checks
      if (el.layerId && props.layers) {
        const layer = props.layers.find((l) => l.id === el.layerId);
        if (layer && !layer.visible) return;
      }

      bCtx.save();

      if (el.type === 'stroke') {
        const stroke = el as StrokeElement;
        if (stroke.points.length === 1) {
          // Render single tap / dot
          bCtx.globalAlpha = stroke.opacity || 1;
          bCtx.fillStyle = stroke.color;
          bCtx.beginPath();
          bCtx.arc(stroke.points[0].x, stroke.points[0].y, Math.max(1, (stroke.width * (stroke.points[0].pressure || 1)) / 2), 0, Math.PI * 2);
          bCtx.fill();
        } else if (stroke.points.length > 1) {
          bCtx.globalAlpha = stroke.opacity || 1;
          bCtx.strokeStyle = stroke.color;
          bCtx.lineCap = 'round';
          bCtx.lineJoin = 'round';

          if (stroke.tool === 'highlighter') {
            bCtx.globalAlpha = 0.35;
            bCtx.lineWidth = stroke.width * 2.5;
            bCtx.beginPath();
            bCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              bCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            bCtx.stroke();
          } else {
            bCtx.beginPath();
            bCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length - 1; i++) {
              const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
              const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
              bCtx.lineWidth = stroke.width * (stroke.points[i].pressure || 1);
              bCtx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
            }
            const last = stroke.points[stroke.points.length - 1];
            const prev = stroke.points[stroke.points.length - 2];
            bCtx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
            bCtx.stroke();
          }
        }
      } else if (el.type === 'shape') {
        const shapeType = el.shapeType;
        const x = el.x;
        const y = el.y;
        const w = el.width;
        const h = el.height;

        bCtx.globalAlpha = el.opacity || 1;
        bCtx.strokeStyle = el.color;
        bCtx.lineWidth = el.strokeWidth || 2;

        if (shapeType === 'rectangle') {
          bCtx.strokeRect(x, y, w, h);
          if (el.fillColor) bCtx.fillRect(x, y, w, h);
        } else if (shapeType === 'rounded-rect') {
          bCtx.beginPath();
          bCtx.roundRect(x, y, w, h, 14);
          bCtx.stroke();
          if (el.fillColor) bCtx.fill();
        } else if (shapeType === 'circle') {
          bCtx.beginPath();
          bCtx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
          bCtx.stroke();
          if (el.fillColor) bCtx.fill();
        } else if (shapeType === 'triangle') {
          bCtx.beginPath();
          bCtx.moveTo(x + w / 2, y);
          bCtx.lineTo(x + w, y + h);
          bCtx.lineTo(x, y + h);
          bCtx.closePath();
          bCtx.stroke();
          if (el.fillColor) bCtx.fill();
        } else if (shapeType === 'line') {
          bCtx.beginPath();
          bCtx.moveTo(x, y);
          bCtx.lineTo(x + w, y + h);
          bCtx.stroke();
        } else if (shapeType === 'arrow') {
          bCtx.beginPath();
          bCtx.moveTo(x, y);
          bCtx.lineTo(x + w, y + h);
          bCtx.stroke();
          const angle = Math.atan2(h, w);
          const headLen = 14;
          bCtx.beginPath();
          bCtx.moveTo(x + w, y + h);
          bCtx.lineTo(x + w - headLen * Math.cos(angle - Math.PI / 6), y + h - headLen * Math.sin(angle - Math.PI / 6));
          bCtx.lineTo(x + w - headLen * Math.cos(angle + Math.PI / 6), y + h - headLen * Math.sin(angle + Math.PI / 6));
          bCtx.closePath();
          bCtx.fillStyle = el.color;
          bCtx.fill();
        } else if (shapeType === 'sticky-note') {
          const noteWidth = el.width || 200;
          const noteHeight = el.height || 160;
          const noteBg = el.fillColor || '#fef3c7';

          bCtx.shadowColor = 'rgba(0,0,0,0.18)';
          bCtx.shadowBlur = 10;
          bCtx.shadowOffsetY = 4;

          bCtx.fillStyle = noteBg;
          bCtx.strokeStyle = '#f59e0b';
          bCtx.lineWidth = 1.5;
          bCtx.beginPath();
          bCtx.roundRect(x, y, noteWidth, noteHeight, 14);
          bCtx.fill();
          bCtx.stroke();

          bCtx.shadowColor = 'transparent';
          bCtx.fillStyle = '#92400e';
          bCtx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
          bCtx.fillText('📌 Sticky Note', x + 14, y + 26);

          const noteText = (el as any).text || '';
          if (noteText) {
            bCtx.fillStyle = '#1e293b';
            bCtx.font = '13px "Plus Jakarta Sans", sans-serif';
            const words = noteText.split(' ');
            let line = '';
            let lineY = y + 50;
            const maxLineW = noteWidth - 28;
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' ';
              const metrics = bCtx.measureText(testLine);
              if (metrics.width > maxLineW && n > 0) {
                bCtx.fillText(line, x + 14, lineY);
                line = words[n] + ' ';
                lineY += 18;
              } else {
                line = testLine;
              }
            }
            bCtx.fillText(line, x + 14, lineY);
          } else {
            bCtx.fillStyle = 'rgba(146, 64, 14, 0.45)';
            bCtx.font = 'italic 12px "Plus Jakarta Sans", sans-serif';
            bCtx.fillText('Click to drag or edit...', x + 14, y + 52);
          }
        }
      } else if (el.type === 'sticky') {
        const sticky = el as StickyElement;
        const noteWidth = sticky.width || 200;
        const noteHeight = sticky.height || 160;
        const noteBg = sticky.color || '#fef3c7';

        bCtx.shadowColor = 'rgba(0,0,0,0.18)';
        bCtx.shadowBlur = 10;
        bCtx.shadowOffsetY = 4;

        bCtx.fillStyle = noteBg;
        bCtx.strokeStyle = '#f59e0b';
        bCtx.lineWidth = 1.5;
        bCtx.beginPath();
        bCtx.roundRect(sticky.x, sticky.y, noteWidth, noteHeight, 14);
        bCtx.fill();
        bCtx.stroke();

        bCtx.shadowColor = 'transparent';
        bCtx.fillStyle = '#92400e';
        bCtx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        bCtx.fillText(`📌 ${sticky.title || 'Note'}`, sticky.x + 14, sticky.y + 26);

        if (sticky.text) {
          bCtx.fillStyle = '#1e293b';
          bCtx.font = '13px "Plus Jakarta Sans", sans-serif';
          const words = sticky.text.split(' ');
          let line = '';
          let lineY = sticky.y + 50;
          const maxLineW = noteWidth - 28;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = bCtx.measureText(testLine);
            if (metrics.width > maxLineW && n > 0) {
              bCtx.fillText(line, sticky.x + 14, lineY);
              line = words[n] + ' ';
              lineY += 18;
            } else {
              line = testLine;
            }
          }
          bCtx.fillText(line, sticky.x + 14, lineY);
        }
      } else if (el.type === 'text') {
        const fontStyle = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
        bCtx.font = fontStyle;
        bCtx.fillStyle = el.color;
        bCtx.textAlign = el.align || 'left';
        bCtx.fillText(el.text, el.x, el.y);

        if (el.underline) {
          const metrics = bCtx.measureText(el.text);
          bCtx.beginPath();
          bCtx.strokeStyle = el.color;
          bCtx.lineWidth = 1.5;
          bCtx.moveTo(el.x, el.y + 4);
          bCtx.lineTo(el.x + metrics.width, el.y + 4);
          bCtx.stroke();
        }
      } else if (el.type === 'image') {
        const imgEl = el as any;
        let cached = imageCacheRef.current.get(imgEl.src);
        if (!cached) {
          cached = new Image();
          cached.src = imgEl.src;
          cached.onload = () => {
            isBufferDirtyRef.current = true;
          };
          imageCacheRef.current.set(imgEl.src, cached);
        }
        if (cached.complete && cached.naturalWidth > 0) {
          bCtx.globalAlpha = imgEl.opacity || 1;
          bCtx.drawImage(cached, imgEl.x, imgEl.y, imgEl.width, imgEl.height);
        }
      }

      bCtx.restore();
    });

    bCtx.restore();
    isBufferDirtyRef.current = false;
  }, [props.elements, props.backgroundPattern, theme, props.scale, props.panOffset, props.layers]);

  // Ultra-Fast 120 FPS Blit & Active Stroke Render Loop
  const renderCanvasFrame = useCallback(() => {
    lastDrawStartRef.current = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentProps = propsRef.current;
    const currentTheme = themeRef.current;
    const currentSelectedId = selectedElementIdRef.current;

    // Use low-latency desynchronized context with alpha for 120Hz live background waves
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      isBufferDirtyRef.current = true;
    }

    // 1. Update Offscreen Buffer if modified
    if (isBufferDirtyRef.current || !bufferCanvasRef.current) {
      updateBufferCanvas(width, height, dpr);
    }

    // 2. High-Speed Buffer Blit (< 0.2ms GPU memory copy)
    if (bufferCanvasRef.current) {
      ctx.drawImage(bufferCanvasRef.current, 0, 0);
    }

    // 3. Render In-Progress Active Stroke, Dragging Overlay, or Selection Bounding Box
    const activeStroke = currentStrokeRef.current;
    const activeShape = currentShapeRef.current;
    const draggingEl = draggingElementRef.current;

    if (activeStroke || activeShape || currentSelectedId || draggingEl || (currentProps.collaborators && currentProps.collaborators.length > 0)) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.translate(currentProps.panOffset.x, currentProps.panOffset.y);
      ctx.scale(currentProps.scale, currentProps.scale);

      // Draw active stroke
      if (activeStroke) {
        if (activeStroke.points.length === 1) {
          ctx.globalAlpha = activeStroke.opacity || 1;
          ctx.fillStyle = activeStroke.color;
          ctx.beginPath();
          ctx.arc(activeStroke.points[0].x, activeStroke.points[0].y, Math.max(1, (activeStroke.width * (activeStroke.points[0].pressure || 1)) / 2), 0, Math.PI * 2);
          ctx.fill();
        } else if (activeStroke.points.length > 1) {
          ctx.globalAlpha = activeStroke.opacity || 1;
          ctx.strokeStyle = activeStroke.color;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(activeStroke.points[0].x, activeStroke.points[0].y);
          for (let i = 1; i < activeStroke.points.length - 1; i++) {
            const midX = (activeStroke.points[i].x + activeStroke.points[i + 1].x) / 2;
            const midY = (activeStroke.points[i].y + activeStroke.points[i + 1].y) / 2;
            ctx.lineWidth = activeStroke.width * (activeStroke.points[i].pressure || 1);
            ctx.quadraticCurveTo(activeStroke.points[i].x, activeStroke.points[i].y, midX, midY);
          }
          const last = activeStroke.points[activeStroke.points.length - 1];
          const prev = activeStroke.points[activeStroke.points.length - 2];
          ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
          ctx.stroke();
        }
      }

      // Draw active shape preview
      if (activeShape) {
        ctx.globalAlpha = activeShape.opacity || 1;
        ctx.strokeStyle = activeShape.color;
        ctx.lineWidth = activeShape.strokeWidth || 2;

        if (activeShape.shapeType === 'rectangle') {
          ctx.strokeRect(activeShape.x, activeShape.y, activeShape.width, activeShape.height);
        } else if (activeShape.shapeType === 'circle') {
          ctx.beginPath();
          ctx.ellipse(
            activeShape.x + activeShape.width / 2,
            activeShape.y + activeShape.height / 2,
            Math.abs(activeShape.width / 2),
            Math.abs(activeShape.height / 2),
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        } else if (activeShape.shapeType === 'sticky-note') {
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(activeShape.x, activeShape.y, activeShape.width || 200, activeShape.height || 160, 14);
          ctx.fill();
          ctx.stroke();
        }
      }

      // Draw Selection Bounding Box on Selected Element
      if (currentSelectedId) {
        const selectedEl = currentProps.elements.find((el) => el.id === currentSelectedId);
        if (selectedEl && selectedEl.type !== 'stroke') {
          ctx.save();
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1.5 / currentProps.scale;
          ctx.setLineDash([4 / currentProps.scale, 4 / currentProps.scale]);

          let selX = (selectedEl as TextElement | ShapeElement | StickyElement).x;
          let selY = (selectedEl as TextElement | ShapeElement | StickyElement).y;
          let selW = 100;
          let selH = 50;

          if (draggingEl && draggingEl.id === currentSelectedId) {
            selX = draggingEl.startX + draggingEl.currentDx;
            selY = draggingEl.startY + draggingEl.currentDy;
          }

          if (selectedEl.type === 'text') {
            selW = Math.max(60, (selectedEl.text || '').length * (selectedEl.fontSize || 18) * 0.65) + 12;
            selH = (selectedEl.fontSize || 18) * 1.5;
            selX = selX - 6;
            selY = selY - selH + 4;
          } else if (selectedEl.type === 'shape' || selectedEl.type === 'sticky') {
            selW = selectedEl.width || 200;
            selH = selectedEl.height || 160;
          } else if (selectedEl.type === 'image') {
            selW = (selectedEl as any).width || 200;
            selH = (selectedEl as any).height || 150;
          }

          ctx.strokeRect(selX, selY, selW, selH);

          // Corner handles
          ctx.setLineDash([]);
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#4f46e5';
          const handleR = 4 / currentProps.scale;
          [[selX, selY], [selX + selW, selY], [selX, selY + selH], [selX + selW, selY + selH]].forEach(([hx, hy]) => {
            ctx.beginPath();
            ctx.arc(hx, hy, handleR, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });

          ctx.restore();
        }
      }

      // Draw Live Multiplayer Peer Cursors
      if (currentProps.collaborators && currentProps.collaborators.length > 0) {
        currentProps.collaborators.forEach((c) => {
          ctx.save();
          ctx.translate(c.x, c.y);

          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(14, 18);
          ctx.lineTo(8, 18);
          ctx.lineTo(12, 28);
          ctx.lineTo(8, 29);
          ctx.lineTo(4, 19);
          ctx.lineTo(0, 22);
          ctx.closePath();
          ctx.fill();

          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          const pillW = ctx.measureText(c.name).width + 16;
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.roundRect(14, 12, pillW, 20, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText(c.name, 22, 26);
          ctx.restore();
        });
      }

      ctx.restore();
    }

    // 4. Telemetry
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 500) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      const latency = Math.max(1, Math.round(now - lastDrawStartRef.current));
      currentProps.onTelemetryUpdate?.(fps, latency, currentProps.elements.length);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }
  }, [updateBufferCanvas]);

  // Continuous Hardware RAF Loop (Synchronized to 60Hz / 120Hz display refresh)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderCanvasFrame();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    animFrameIdRef.current = animId;

    return () => cancelAnimationFrame(animId);
  }, [renderCanvasFrame]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      isBufferDirtyRef.current = true;
      renderCanvasFrame();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvasFrame]);

  // Pointer Events with Dragging & Creation Facility
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const worldCoord = screenToWorld(e.clientX, e.clientY);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isPointerDownRef.current = true;

    if (props.isPanMode || e.button === 1 || (e.pointerType === 'touch' && props.isPanMode)) {
      return;
    }

    // Check if user clicked on an existing text element or sticky note to drag it
    const hitEl = hitTestElement(worldCoord.x, worldCoord.y);
    if (hitEl && hitEl.type !== 'stroke') {
      const hitTyped = hitEl as TextElement | ShapeElement | StickyElement;
      draggingElementRef.current = {
        id: hitTyped.id,
        startX: hitTyped.x,
        startY: hitTyped.y,
        startMouseX: worldCoord.x,
        startMouseY: worldCoord.y,
        currentDx: 0,
        currentDy: 0,
        hasMoved: false,
      };
      setSelectedElementId(hitTyped.id);
      setCursorStyle('move');
      return;
    }

    // Deselect if clicked on empty canvas
    setSelectedElementId(null);

    // Tool Handlers
    if (props.activeTool === 'pen' || props.activeTool === 'pencil' || props.activeTool === 'highlighter') {
      const isHighlighter = props.activeTool === 'highlighter';
      const toolType = props.activeTool === 'pencil' ? props.activePencil : (isHighlighter ? 'highlighter' : props.activePen);
      currentStrokeRef.current = {
        id: 'stroke_' + Date.now(),
        type: 'stroke',
        tool: toolType,
        points: [{ x: worldCoord.x, y: worldCoord.y, pressure: e.pressure || 0.5, time: Date.now() }],
        color: props.color,
        width: isHighlighter ? Math.max(16, props.strokeWidth * 2.2) : props.strokeWidth,
        opacity: isHighlighter ? 0.35 : (props.opacity || 1),
        timestamp: Date.now(),
        layerId: props.activeLayerId,
      };
    } else if (props.activeTool === 'shape') {
      if (props.activeShape === 'sticky-note') {
        // Create new draggable sticky note directly on click
        const newSticky: ShapeElement = {
          id: 'sticky_' + Date.now(),
          type: 'shape',
          shapeType: 'sticky-note',
          x: worldCoord.x - 100,
          y: worldCoord.y - 40,
          width: 200,
          height: 160,
          color: props.color,
          fillColor: '#fef3c7',
          strokeWidth: 2,
          opacity: 1,
          layerId: props.activeLayerId,
        };
        const updated = [...props.elements, newSticky];
        pushToHistory(updated);
        setSelectedElementId(newSticky.id);
        draggingElementRef.current = {
          id: newSticky.id,
          startX: newSticky.x,
          startY: newSticky.y,
          startMouseX: worldCoord.x,
          startMouseY: worldCoord.y,
          currentDx: 0,
          currentDy: 0,
          hasMoved: false,
        };
        setCursorStyle('move');
      } else {
        currentShapeRef.current = {
          id: 'shape_' + Date.now(),
          type: 'shape',
          shapeType: props.activeShape,
          x: worldCoord.x,
          y: worldCoord.y,
          width: 0,
          height: 0,
          color: props.color,
          fillColor: undefined,
          strokeWidth: props.strokeWidth,
          opacity: props.opacity,
          layerId: props.activeLayerId,
        };
      }
    } else if (props.activeTool === 'text') {
      setActiveTextInput({
        x: worldCoord.x,
        y: worldCoord.y,
        text: '',
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const worldCoord = screenToWorld(e.clientX, e.clientY);

    // Update hover cursor when moving over draggable elements
    if (!isPointerDownRef.current) {
      const hoverHit = hitTestElement(worldCoord.x, worldCoord.y);
      if (hoverHit) {
        setCursorStyle('move');
      } else if (props.activeTool === 'text') {
        setCursorStyle('text');
      } else if (props.isPanMode) {
        setCursorStyle('grab');
      } else if (props.activeTool === 'eraser') {
        setCursorStyle('crosshair');
      } else {
        setCursorStyle('default');
      }
      return;
    }

    // Handle Active Element Dragging (Notes & Text) - Smooth zero-lag RAF tracking
    if (draggingElementRef.current) {
      const { startMouseX, startMouseY } = draggingElementRef.current;
      const dx = worldCoord.x - startMouseX;
      const dy = worldCoord.y - startMouseY;
      draggingElementRef.current.currentDx = dx;
      draggingElementRef.current.currentDy = dy;

      if (Math.hypot(dx, dy) > 3) {
        draggingElementRef.current.hasMoved = true;
      }
      return;
    }

    // Pan canvas if in pan mode
    if (props.isPanMode || e.buttons === 4 || (dragStartRef.current && (props.isPanMode || e.button === 1))) {
      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        props.onPanChange({
          x: props.panOffset.x + dx,
          y: props.panOffset.y + dy,
        });
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        isBufferDirtyRef.current = true;
      }
      return;
    }

    // 120Hz Drawing Strokes
    const targetStroke = currentStrokeRef.current;
    if (targetStroke) {
      const rawNative = e.nativeEvent as PointerEvent;
      const coalescedEvents = (typeof rawNative.getCoalescedEvents === 'function')
        ? rawNative.getCoalescedEvents()
        : [e];

      for (const co of coalescedEvents) {
        const world = screenToWorld(co.clientX, co.clientY);
        targetStroke.points.push({
          x: world.x,
          y: world.y,
          pressure: props.pressureEnabled ? (co.pressure || 0.5) : 1,
          time: Date.now(),
        });
      }
    } else if (currentShapeRef.current && dragStartRef.current) {
      const startWorld = screenToWorld(dragStartRef.current.x, dragStartRef.current.y);
      const width = worldCoord.x - startWorld.x;
      const height = worldCoord.y - startWorld.y;

      currentShapeRef.current = {
        ...currentShapeRef.current,
        x: width < 0 ? worldCoord.x : startWorld.x,
        y: height < 0 ? worldCoord.y : startWorld.y,
        width: Math.abs(width),
        height: Math.abs(height),
      };
    } else if (props.activeTool === 'eraser') {
      const eraserRadius = props.activeEraser === 'large-eraser' ? 24 : 12;

      const remaining = props.elements.filter((el) => {
        if (el.type === 'stroke') {
          return !el.points.some((p) => Math.hypot(p.x - worldCoord.x, p.y - worldCoord.y) < eraserRadius);
        } else if (el.type === 'shape') {
          return !(
            worldCoord.x >= el.x &&
            worldCoord.x <= el.x + el.width &&
            worldCoord.y >= el.y &&
            worldCoord.y <= el.y + el.height
          );
        } else if (el.type === 'text') {
          return !(
            worldCoord.x >= el.x - 10 &&
            worldCoord.x <= el.x + (el.text.length * el.fontSize * 0.65) &&
            worldCoord.y >= el.y - el.fontSize &&
            worldCoord.y <= el.y + 10
          );
        }
        return true;
      });

      if (remaining.length !== props.elements.length) {
        pushToHistory(remaining);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Safe capture release fallback
      }
    }

    isPointerDownRef.current = false;
    dragStartRef.current = null;

    // Handle Dragging Completion
    if (draggingElementRef.current) {
      const { id, startX, startY, currentDx, currentDy, hasMoved } = draggingElementRef.current;
      draggingElementRef.current = null;

      if (hasMoved) {
        const updated = props.elements.map((el) => {
          if (el.id === id && el.type !== 'stroke') {
            return {
              ...el,
              x: Math.round(startX + currentDx),
              y: Math.round(startY + currentDy),
            };
          }
          return el;
        });
        pushToHistory(updated);
      } else {
        // If clicked without dragging, open editor for quick editing
        const clickedEl = props.elements.find((el) => el.id === id);
        if (clickedEl) {
          if (clickedEl.type === 'text') {
            setActiveTextInput({
              id: clickedEl.id,
              x: clickedEl.x,
              y: clickedEl.y,
              text: clickedEl.text,
            });
          } else if (clickedEl.type === 'shape' && clickedEl.shapeType === 'sticky-note') {
            setActiveStickyInput({
              id: clickedEl.id,
              x: clickedEl.x,
              y: clickedEl.y,
              text: (clickedEl as any).text || '',
              width: clickedEl.width || 200,
              height: clickedEl.height || 160,
            });
          } else if (clickedEl.type === 'sticky') {
            setActiveStickyInput({
              id: clickedEl.id,
              x: clickedEl.x,
              y: clickedEl.y,
              text: clickedEl.text || '',
              width: clickedEl.width || 200,
              height: clickedEl.height || 160,
            });
          }
        }
      }
      return;
    }

    // Finalize In-Progress Stroke
    const finalStroke = currentStrokeRef.current;
    if (finalStroke && finalStroke.points.length > 1) {
      currentStrokeRef.current = null;

      if (props.shapeAutoDetect) {
        const detected = detectSmartShape(finalStroke.points);
        if (detected && detected.shapeType) {
          const detectedShapeElement: ShapeElement = {
            id: 'shape_' + Date.now(),
            type: 'shape',
            shapeType: detected.shapeType,
            x: detected.x,
            y: detected.y,
            width: detected.width,
            height: detected.height,
            color: finalStroke.color,
            strokeWidth: finalStroke.width,
            opacity: finalStroke.opacity,
            layerId: props.activeLayerId,
          };
          pushToHistory([...props.elements, detectedShapeElement]);
          setDetectedShapeToast(`✨ Auto-converted to ${detected.shapeType}`);
          setTimeout(() => setDetectedShapeToast(null), 2500);
          return;
        }
      }

      // Smooth stroke with Catmull-Rom spline curves
      const smoothedPoints = smoothStrokePoints(finalStroke.points, props.smoothingLevel || 'medium');
      const smoothedStroke: StrokeElement = {
        ...finalStroke,
        points: smoothedPoints,
        smoothed: true,
      };

      pushToHistory([...props.elements, smoothedStroke]);
    } else {
      currentStrokeRef.current = null;
    }

    // Finalize In-Progress Shape
    const finalShape = currentShapeRef.current;
    if (finalShape && (finalShape.width > 5 || finalShape.height > 5)) {
      currentShapeRef.current = null;
      pushToHistory([...props.elements, finalShape]);
    } else {
      currentShapeRef.current = null;
    }
  };

  // Wheel Zoom with smooth momentum
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = Math.min(4, Math.max(0.25, props.scale * zoomFactor));

      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newOffsetX = mouseX - (mouseX - props.panOffset.x) * (newScale / props.scale);
        const newOffsetY = mouseY - (mouseY - props.panOffset.y) * (newScale / props.scale);

        props.onScaleChange(newScale);
        props.onPanChange({ x: newOffsetX, y: newOffsetY });
        isBufferDirtyRef.current = true;
      }
    } else {
      props.onPanChange({
        x: props.panOffset.x - e.deltaX * 1.2,
        y: props.panOffset.y - e.deltaY * 1.2,
      });
      isBufferDirtyRef.current = true;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-50 dark:bg-slate-950 will-change-transform transform-gpu"
      style={{
        cursor: cursorStyle,
        contain: 'layout paint size',
      }}
    >
      {/* 120 FPS Hardware-Accelerated Canvas Element */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full block touch-none transform-gpu"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Auto-detected Shape Notification */}
      {detectedShapeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-indigo-600/90 text-white text-xs font-bold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 z-30 pointer-events-none">
          {detectedShapeToast}
        </div>
      )}

      {/* Floating Action Controls for Selected Draggable Element */}
      {selectedElementId && (
        (() => {
          const selEl = props.elements.find((el) => el.id === selectedElementId);
          if (!selEl || selEl.type === 'stroke') return null;
          const typedEl = selEl as TextElement | ShapeElement | StickyElement;
          const leftPx = typedEl.x * props.scale + props.panOffset.x;
          const topPx = (typedEl.y - 36) * props.scale + props.panOffset.y;

          return (
            <div
              className="absolute z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 text-white shadow-xl backdrop-blur-md border border-slate-700 animate-in fade-in zoom-in-95 text-xs font-semibold"
              style={{ left: `${leftPx}px`, top: `${topPx}px` }}
            >
              <span className="flex items-center gap-1 text-slate-300">
                <Move className="w-3 h-3 text-indigo-400" />
                <span>Drag to Move</span>
              </span>
              <button
                onClick={() => {
                  const remaining = props.elements.filter((el) => el.id !== selectedElementId);
                  pushToHistory(remaining);
                  setSelectedElementId(null);
                }}
                className="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors ml-1"
                title="Delete Element"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })()
      )}

      {/* Inline Text Editor Popover with Touch Confirm Button */}
      {activeTextInput && (
        <div
          className="absolute z-30 flex items-center gap-1.5 p-1 bg-white/95 dark:bg-slate-800/95 border-2 border-indigo-500 rounded-2xl shadow-2xl backdrop-blur-md"
          style={{
            left: `${activeTextInput.x * props.scale + props.panOffset.x}px`,
            top: `${activeTextInput.y * props.scale + props.panOffset.y}px`,
          }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Type text..."
            value={activeTextInput.text}
            onChange={(e) => setActiveTextInput({ ...activeTextInput, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (activeTextInput.text.trim()) {
                  if (activeTextInput.id) {
                    const updated = props.elements.map((el) =>
                      el.id === activeTextInput.id ? { ...el, text: activeTextInput.text } : el
                    );
                    pushToHistory(updated);
                  } else {
                    const newEl: TextElement = {
                      id: 'text_' + Date.now(),
                      type: 'text',
                      text: activeTextInput.text,
                      x: activeTextInput.x,
                      y: activeTextInput.y,
                      color: props.color,
                      fontSize: props.fontSize,
                      fontFamily: props.fontFamily,
                      bold: props.isBold,
                      italic: props.isItalic,
                      underline: props.isUnderline,
                      align: props.textAlign,
                      layerId: props.activeLayerId,
                    };
                    pushToHistory([...props.elements, newEl]);
                  }
                }
                setActiveTextInput(null);
              } else if (e.key === 'Escape') {
                setActiveTextInput(null);
              }
            }}
            className="px-3 py-1.5 bg-transparent text-slate-900 dark:text-white outline-hidden min-w-[140px]"
            style={{
              fontSize: `${Math.max(16, props.fontSize)}px`,
              fontFamily: props.fontFamily,
              color: props.color,
            }}
          />
          <button
            onClick={() => {
              if (activeTextInput.text.trim()) {
                if (activeTextInput.id) {
                  const updated = props.elements.map((el) =>
                    el.id === activeTextInput.id ? { ...el, text: activeTextInput.text } : el
                  );
                  pushToHistory(updated);
                } else {
                  const newEl: TextElement = {
                    id: 'text_' + Date.now(),
                    type: 'text',
                    text: activeTextInput.text,
                    x: activeTextInput.x,
                    y: activeTextInput.y,
                    color: props.color,
                    fontSize: props.fontSize,
                    fontFamily: props.fontFamily,
                    bold: props.isBold,
                    italic: props.isItalic,
                    underline: props.isUnderline,
                    align: props.textAlign,
                    layerId: props.activeLayerId,
                  };
                  pushToHistory([...props.elements, newEl]);
                }
              }
              setActiveTextInput(null);
            }}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
            title="Done"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Inline Sticky Note Editor Popover */}
      {activeStickyInput && (
        <div
          className="absolute z-30"
          style={{
            left: `${activeStickyInput.x * props.scale + props.panOffset.x}px`,
            top: `${activeStickyInput.y * props.scale + props.panOffset.y}px`,
            width: `${activeStickyInput.width * props.scale}px`,
            minHeight: `${activeStickyInput.height * props.scale}px`,
          }}
        >
          <div className="p-3 bg-amber-100 dark:bg-amber-900/90 border-2 border-amber-500 rounded-2xl shadow-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700 pb-1.5">
              <span>📌 Sticky Note Text</span>
              <button
                onClick={() => {
                  const targetId = activeStickyInput.id;
                  if (targetId) {
                    const updated = props.elements.map((el) => {
                      if (el.id === targetId) {
                        return { ...el, text: activeStickyInput.text };
                      }
                      return el;
                    });
                    pushToHistory(updated);
                  }
                  setActiveStickyInput(null);
                }}
                className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg text-emerald-700 dark:text-emerald-300"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>

            <textarea
              autoFocus
              placeholder="Write your study notes, reminders, or formulas here..."
              value={activeStickyInput.text}
              onChange={(e) => setActiveStickyInput({ ...activeStickyInput, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setActiveStickyInput(null);
                }
              }}
              rows={4}
              className="w-full p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-amber-300 dark:border-amber-700 text-xs text-slate-900 dark:text-slate-100 outline-hidden resize-none font-sans"
            />
          </div>
        </div>
      )}
    </div>
  );
});
