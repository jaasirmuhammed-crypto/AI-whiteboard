import { StudyMaterialsPackage, PresentationData, MCQQuizData, MindMapData } from './studyMaterial';
import { WhiteboardElement } from './whiteboard';

export interface OCRDetectedElement {
  id: string;
  type: 'text' | 'formula' | 'diagram' | 'sketch' | 'table';
  content: string;
  confidence: number; // 0 to 100
  box?: { x: number; y: number; width: number; height: number };
}

export interface OCRResult {
  rawText: string;
  confidence: number;
  language: string;
  detectedElements: OCRDetectedElement[];
  detectedDiagramsCount: number;
  detectedFormulasCount: number;
  spatialHierarchy: {
    title: string;
    sections: string[];
    keyTerms: string[];
  };
}

export interface OutputCustomizationSettings {
  pptTheme: 'modern' | 'academic' | 'creative' | 'minimal' | 'cyberpunk';
  mcqDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  mindMapStyle: 'circular' | 'hierarchical' | 'linear' | 'radial';
  contentDepth: 'summary' | 'detailed' | 'comprehensive';
  includeSlides: boolean;
  includeMCQs: boolean;
  includeMindMap: boolean;
  targetLanguage: string;
  includeFormulas: boolean;
  includeHistoricalContext: boolean;
}

export interface ExportSettings {
  format: 'pptx' | 'pdf' | 'mcq_json' | 'mindmap_svg' | 'mindmap_png' | 'canvas_png' | 'canvas_svg';
  compressionLevel: 'standard' | 'high_compression' | 'ultra_hd';
  selectedSlideIndices?: number[];
  selectedMCQIndices?: number[];
  includeNotes: boolean;
  includeWatermark: boolean;
}

export interface VersionSnapshot {
  id: string;
  versionNumber: number;
  timestamp: string;
  title: string;
  elementsCount: number;
  thumbnail: string;
  elements: WhiteboardElement[];
  studyPackage?: StudyMaterialsPackage;
  note?: string;
}

export interface UserQuotaState {
  dailyGenerationsAllowed: number;
  generationsUsedToday: number;
  resetHoursRemaining: number;
  isProUser: boolean;
  tierName: 'Free Starter' | 'Pro Scholar' | 'Team Educator';
  priorityQueueActive: boolean;
}

export interface UserFeedbackReport {
  packageId: string;
  rating: number; // 1 to 5
  isHelpful: boolean;
  comment?: string;
  reportedCategory?: 'accuracy' | 'formatting' | 'diagram_recognition' | 'speed' | 'other';
  timestamp: string;
}

export interface CanvasPerformanceTelemetry {
  fps: number;
  drawLatencyMs: number;
  activeStrokesCount: number;
  memoryEstimateKB: number;
  smoothingEnabled: boolean;
  deviceType: 'stylus' | 'touch' | 'mouse';
}
