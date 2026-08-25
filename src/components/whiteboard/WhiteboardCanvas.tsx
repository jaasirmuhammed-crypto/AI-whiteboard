import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { 
  WhiteboardElement, 
  StrokeElement, 
  ShapeElement, 
  TextElement, 
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
import { detectSmartShape } from '../../utils/strokeMath';

export interface WhiteboardCanvasRef {
  getSnapshotDataUrl: () => string;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getSVGString: () => string;
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
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null); // Double-buffer for 120 FPS blitting
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  // History Stacks
  const [history, setHistory] = useState<WhiteboardElement[][]>([props.elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active interaction refs to avoid 120Hz React state thrashing during drawing
  const isPointerDownRef = useRef(false);
  const currentStrokeRef = useRef<StrokeElement | null>(null);
  const currentShapeRef = useRef<ShapeElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isBufferDirtyRef = useRef(true);
  const animFrameIdRef = useRef<number | null>(null);

  // UI notifications
  const [detectedShapeToast, setDetectedShapeToast] = useState<string | null>(null);

  // High-performance 120Hz Telemetry
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const lastDrawStartRef = useRef(performance.now());

  // Active inline text editing
  const [activeTextInput, setActiveTextInput] = useState<{
    id?: string;
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Mark buffer dirty whenever external elements or view changes
  useEffect(() => {
    isBufferDirtyRef.current = true;
  }, [props.elements, props.backgroundPattern, theme, props.scale, props.panOffset, props.layers]);

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

  // Export SVG utility
  const getSVGString = useCallback(() => {
    const width = 1920;
    const height = 1080;
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
    svgContent += `<rect width="100%" height="100%" fill="${theme === 'dark' ? '#090d16' : '#ffffff'}"/>\n`;

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
    },
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    getSVGString,
  }), [handleUndo, handleRedo, canUndo, canRedo, pushToHistory, getSVGString]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Coordinate mapping
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - props.panOffset.x) / props.scale;
    const y = (clientY - rect.top - props.panOffset.y) / props.scale;
    return { x, y };
  }, [props.panOffset, props.scale]);

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
    bCtx.fillStyle = isDark ? 'rgba(9, 13, 22, 0.86)' : 'rgba(255, 255, 255, 0.88)';
    bCtx.fillRect(0, 0, width, height);

    bCtx.translate(props.panOffset.x, props.panOffset.y);
    bCtx.scale(props.scale, props.scale);

    const patternColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.09)';
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
    } else if (props.backgroundPattern === 'grid' || props.backgroundPattern === 'graph') {
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
    }

    // 2. Render Committed Elements
    const hiddenLayers = new Set((props.layers || []).filter(l => !l.visible).map(l => l.id));
    const elementsToRender = props.elements.filter(el => !el.layerId || !hiddenLayers.has(el.layerId));

    elementsToRender.forEach((el) => {
      bCtx.save();

      if (el.type === 'stroke') {
        if (el.points.length < 2) {
          bCtx.restore();
          return;
        }

        bCtx.globalAlpha = el.opacity || 1;
        bCtx.strokeStyle = el.color;
        bCtx.lineCap = 'round';
        bCtx.lineJoin = 'round';

        // Optimized Quadratic Curve rendering for strokes
        bCtx.beginPath();
        bCtx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length - 1; i++) {
          const midX = (el.points[i].x + el.points[i + 1].x) / 2;
          const midY = (el.points[i].y + el.points[i + 1].y) / 2;
          bCtx.lineWidth = el.width * (el.points[i].pressure || 1);
          bCtx.quadraticCurveTo(el.points[i].x, el.points[i].y, midX, midY);
        }
        const last = el.points[el.points.length - 1];
        bCtx.lineTo(last.x, last.y);
        bCtx.stroke();
      } else if (el.type === 'shape') {
        bCtx.globalAlpha = el.opacity || 1;
        bCtx.strokeStyle = el.color;
        bCtx.lineWidth = el.strokeWidth || 2;
        bCtx.fillStyle = el.fillColor || 'transparent';

        const { x, y, width: w, height: h, shapeType } = el;

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
          bCtx.fillStyle = el.fillColor || '#fef3c7';
          bCtx.strokeStyle = '#f59e0b';
          bCtx.lineWidth = 1.5;
          bCtx.beginPath();
          bCtx.roundRect(x, y, w, h, 16);
          bCtx.fill();
          bCtx.stroke();

          bCtx.fillStyle = '#92400e';
          bCtx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
          bCtx.fillText('📌 Note', x + 12, y + 24);
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

    // 3. Render In-Progress Active Stroke on top with subpixel precision
    const activeStroke = currentStrokeRef.current;
    const activeShape = currentShapeRef.current;

    if (activeStroke || activeShape || (props.collaborators && props.collaborators.length > 0)) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.translate(props.panOffset.x, props.panOffset.y);
      ctx.scale(props.scale, props.scale);

      if (activeStroke && activeStroke.points.length > 1) {
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
        const lastPt = activeStroke.points[activeStroke.points.length - 1];
        ctx.lineTo(lastPt.x, lastPt.y);
        ctx.stroke();
      }

      if (activeShape) {
        ctx.globalAlpha = activeShape.opacity || 1;
        ctx.strokeStyle = activeShape.color;
        ctx.lineWidth = activeShape.strokeWidth || 2;
        ctx.fillStyle = activeShape.fillColor || 'transparent';

        const { x, y, width: w, height: h, shapeType } = activeShape;
        if (shapeType === 'rectangle') {
          ctx.strokeRect(x, y, w, h);
        } else if (shapeType === 'circle') {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shapeType === 'line') {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
        }
      }

      // Render Remote Collaborator Cursors
      if (props.collaborators && props.collaborators.length > 0) {
        props.collaborators.forEach((c) => {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 16);
          ctx.lineTo(4, 12);
          ctx.lineTo(9, 18);
          ctx.lineTo(12, 16);
          ctx.lineTo(7, 10);
          ctx.lineTo(13, 10);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          const textMetrics = ctx.measureText(c.name);
          const pillW = textMetrics.width + 16;
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

    // 4. Telemetry (Frames per second & sub-millisecond draw latency)
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 500) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      const latency = Math.max(1, Math.round(now - lastDrawStartRef.current));
      props.onTelemetryUpdate?.(fps, latency, props.elements.length);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }
  }, [props, updateBufferCanvas]);

  // Request Animation Frame Loop for continuous 120Hz tracking
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

  // High-Polling Pointer Events (with 120Hz/240Hz Coalesced Event capture)
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

    if (props.activeTool === 'pen' || props.activeTool === 'pencil' || props.activeTool === 'highlighter') {
      const toolType = props.activeTool === 'pencil' ? props.activePencil : props.activePen;
      currentStrokeRef.current = {
        id: 'stroke_' + Date.now(),
        type: 'stroke',
        tool: toolType,
        points: [{ x: worldCoord.x, y: worldCoord.y, pressure: e.pressure || 0.5, time: Date.now() }],
        color: props.color,
        width: props.strokeWidth,
        opacity: props.opacity,
        timestamp: Date.now(),
        layerId: props.activeLayerId,
      };
    } else if (props.activeTool === 'shape') {
      const isSticky = props.activeShape === 'sticky-note';
      currentShapeRef.current = {
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
        layerId: props.activeLayerId,
      };
    } else if (props.activeTool === 'text') {
      setActiveTextInput({
        x: worldCoord.x,
        y: worldCoord.y,
        text: '',
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;

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

    // 120Hz Coalesced Subpixel Events for Apple Pencil / Stylus / High-DPI Mouse
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
      const currentWorld = screenToWorld(e.clientX, e.clientY);
      const width = currentWorld.x - startWorld.x;
      const height = currentWorld.y - startWorld.y;

      currentShapeRef.current = {
        ...currentShapeRef.current,
        x: width < 0 ? currentWorld.x : startWorld.x,
        y: height < 0 ? currentWorld.y : startWorld.y,
        width: Math.abs(width),
        height: Math.abs(height),
      };
    } else if (props.activeTool === 'eraser') {
      const world = screenToWorld(e.clientX, e.clientY);
      const eraserRadius = props.activeEraser === 'large-eraser' ? 24 : 12;

      const remaining = props.elements.filter((el) => {
        if (el.type === 'stroke') {
          return !el.points.some((p) => Math.hypot(p.x - world.x, p.y - world.y) < eraserRadius);
        } else if (el.type === 'shape') {
          return !(
            world.x >= el.x &&
            world.x <= el.x + el.width &&
            world.y >= el.y &&
            world.y <= el.y + el.height
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

    // Finalize In-Progress Stroke
    const finalStroke = currentStrokeRef.current;
    if (finalStroke && finalStroke.points.length > 1) {
      currentStrokeRef.current = null;

      // Smart Shape Recognition check
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

      pushToHistory([...props.elements, finalStroke]);
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
        cursor: props.isPanMode ? 'grab' : props.activeTool === 'eraser' ? 'crosshair' : 'default',
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

      {/* Inline Text Editor */}
      {activeTextInput && (
        <div
          className="absolute z-30"
          style={{
            left: `${activeTextInput.x * props.scale + props.panOffset.x}px`,
            top: `${activeTextInput.y * props.scale + props.panOffset.y}px`,
          }}
        >
          <input
            autoFocus
            type="text"
            placeholder="Type text..."
            value={activeTextInput.text}
            onChange={(e) => setActiveTextInput({ ...activeTextInput, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (activeTextInput.text.trim()) {
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
                setActiveTextInput(null);
              } else if (e.key === 'Escape') {
                setActiveTextInput(null);
              }
            }}
            onBlur={() => {
              if (activeTextInput.text.trim()) {
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
              setActiveTextInput(null);
            }}
            className="px-2 py-1 bg-white/90 dark:bg-slate-800/90 border border-indigo-500 rounded-lg shadow-lg text-slate-900 dark:text-white outline-hidden"
            style={{
              fontSize: `${props.fontSize}px`,
              fontFamily: props.fontFamily,
              color: props.color,
            }}
          />
        </div>
      )}
    </div>
  );
});
