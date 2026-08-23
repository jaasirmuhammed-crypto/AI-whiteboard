export interface Topic {
  id: string;
  name: string;
  overview: string;
  importantPoints: string[];
  definitions: { term: string; definition: string }[];
  formulas?: { name: string; formula: string; explanation?: string }[];
  commonMistakes: string[];
  examTips: string[];
  quickRevision: string[];
  summary: string;
  diagramType?: 'flowchart' | 'concept_map' | 'timeline' | 'comparison' | 'process';
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Exam {
  id: string;
  name: string;
  country: string;
  category: string; // e.g. Engineering, Civil Services, Medicine, Business, Law, Higher Education
  badge: string;
  description: string;
  eligibility: string;
  structure: string;
  duration: string;
  scoring: string;
  sections: string[];
  subjects: Subject[];
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId?: string;
  topicName?: string;
  examId?: string;
  isSourceBased: boolean; // True for Previous Year/Source Questions, False for AI-Generated Practice
  sourceTag?: string; // e.g. "UPSC Prelims 2024" or "JEE Advanced 2023 Paper 1"
}

export interface ExamResult {
  id: string;
  examName: string;
  topicName?: string;
  score: number;
  total: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeTakenSeconds: number;
  weakTopics: string[];
  strongTopics: string[];
  date: string;
}

export interface Bookmark {
  id: string;
  type: 'exam' | 'topic' | 'question';
  itemId: string;
  title: string;
  subtitle: string;
  savedAt: string;
}
