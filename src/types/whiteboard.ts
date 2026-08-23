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
  | 'graph';

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
}

export type WhiteboardElement = StrokeElement | ShapeElement | TextElement | StickyElement;

export interface ViewportState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export type AutoSaveState = 'saved' | 'saving' | 'unsaved' | 'error';
