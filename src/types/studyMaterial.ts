// PPT Slide Definitions
export interface PPTSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  layout: 'title' | 'bullets' | 'split' | 'summary' | 'diagram' | 'quote';
  bulletPoints?: string[];
  leftPoints?: string[];
  rightPoints?: string[];
  diagramDescription?: string;
  notes?: string;
  accentColor?: string;
}

export interface PresentationData {
  id: string;
  title: string;
  topic: string;
  author: string;
  createdAt: string;
  slides: PPTSlide[];
  theme: 'modern' | 'academic' | 'creative' | 'minimal';
}

// MCQ Question Definitions
export type MCQDifficulty = 'easy' | 'medium' | 'hard';

export interface MCQQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // 4 options
  correctAnswerIndex: number; // 0 to 3
  explanation: string;
  difficulty: MCQDifficulty;
  conceptTag: string;
}

export interface MCQQuizData {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  questions: MCQQuestion[];
}

// Mind Map Definitions
export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  category?: string;
  color?: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  root: MindMapNode;
}

// Overall Study Materials Package
export interface StudyMaterialsPackage {
  id: string;
  projectId: string;
  title: string;
  topic: string;
  summary: string;
  createdAt: string;
  presentation: PresentationData;
  quiz: MCQQuizData;
  mindMap: MindMapData;
  extractedKeywords: string[];
  isValidTopic?: boolean;
  errorMessage?: string;
}
