// Exam Target Context Definition
export interface ExamTargetContext {
  id: string;
  name: string;
  country: string;
  category: string;
  difficultyLevel?: string;
  questionStyles?: string[];
  officialPortal?: string;
  focusSummary?: string;
  disclaimer?: string;
}

// PPT Slide Definitions
export type SlideFacetType = 
  | 'overview' 
  | 'definition' 
  | 'mechanism' 
  | 'tradeoffs' 
  | 'historical_context' 
  | 'applications' 
  | 'problem_solution' 
  | 'governance_policy' 
  | 'clinical_pathology' 
  | 'formulas_numerical' 
  | 'exam_strategy';

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
  facetType?: SlideFacetType;
  examRelevanceNote?: string;
}

export interface PresentationData {
  id: string;
  title: string;
  topic: string;
  author: string;
  createdAt: string;
  slides: PPTSlide[];
  theme: 'modern' | 'academic' | 'creative' | 'minimal';
  examContext?: ExamTargetContext;
}

// MCQ Question Definitions
export type MCQDifficulty = 'easy' | 'medium' | 'hard';
export type MCQQuestionPattern = 'single_choice' | 'assertion_reason' | 'multi_statement' | 'case_based' | 'data_sufficiency';

export interface MCQQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // 4 options
  correctAnswerIndex: number; // 0 to 3
  explanation: string;
  difficulty: MCQDifficulty;
  conceptTag: string;
  pattern?: MCQQuestionPattern;
  examPatternTag?: string;
}

export interface MCQQuizData {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  questions: MCQQuestion[];
  examContext?: ExamTargetContext;
}

// Mind Map Definitions
export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  category?: string;
  color?: string;
  children?: MindMapNode[];
  examWeightage?: string; // e.g. "High Yield: 15-20% Questions"
}

export interface MindMapData {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  root: MindMapNode;
  examContext?: ExamTargetContext;
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
  examContext?: ExamTargetContext;
}

