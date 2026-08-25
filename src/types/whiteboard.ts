export type PenType = 
  | 'basic-pen' 
  | 'marker' 
  | 'highlighter' 
  | 'fine-pen' 
  | 'brush';

export type PencilType = 
  | 'hb-pencil' 
  | '2b-pencil' 
  | 'mechanical-pencil' 
  | 'soft-pencil';

export type EraserType = 
  | 'small-eraser' 
  | 'large-eraser' 
  | 'stroke-eraser';

export type ShapeType = 
  | 'line' 
  | 'arrow' 
  | 'rectangle' 
  | 'rounded-rect' 
  | 'circle' 
  | 'triangle' 
  | 'sticky-note';

export type ToolType = 
  | 'select' 
  | 'pen' 
  | 'pencil' 
  | 'marker' 
  | 'highlighter' 
  | 'eraser' 
  | 'text' 
  | 'shape' 
  | 'pan';

export type BackgroundPattern = 
  | 'blank' 
  | 'ruled' 
  | 'grid' 
  | 'dotted' 
  | 'graph'
  | 'isometric'
  | 'blueprint';

export type FontCategory = 'basic' | 'study' | 'creative';

export interface FontOption {
  id: string;
  name: string;
  category: FontCategory;
  fontFamily: string;
  previewText?: string;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
}

export interface StrokeElement {
  id: string;
  type: 'stroke';
  tool: PenType | PencilType | EraserType;
  points: StrokePoint[];
  color: string;
  width: number;
  opacity: number;
  timestamp: number;
  layerId?: string;
  smoothed?: boolean;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
  layerId?: string;
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
  backgroundColor?: string;
  layerId?: string;
}

export interface StickyElement {
  id: string;
  type: 'sticky';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  title?: string;
  layerId?: string;
}

export interface ImageElement {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  opacity: number;
  layerId?: string;
}

export type WhiteboardElement = StrokeElement | ShapeElement | TextElement | StickyElement | ImageElement;

export interface ViewportState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export type AutoSaveState = 'saved' | 'saving' | 'unsaved' | 'error';

export interface CollaboratorCursor {
  id: string;
  name: string;
  avatar: string;
  color: string;
  x: number;
  y: number;
  action?: string;
  lastActive: number;
}

export type LineSmoothingLevel = 'none' | 'medium' | 'high';
