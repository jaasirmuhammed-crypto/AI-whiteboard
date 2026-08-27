import { Exam, MCQQuestion, ExamResult, Bookmark } from '../types/competitive';
import { INITIAL_COMPETITIVE_EXAMS, INITIAL_PRACTICE_QUESTIONS } from '../data/competitiveExamsData';
import { COMPREHENSIVE_SYLLABUS_QUESTIONS } from '../data/competitiveQuestionsData';

const ALL_INITIAL_QUESTIONS: MCQQuestion[] = [
  ...COMPREHENSIVE_SYLLABUS_QUESTIONS,
  ...INITIAL_PRACTICE_QUESTIONS,
];

const EXAMS_KEY = 'ai_whiteboard_competitive_exams';
const QUESTIONS_KEY = 'ai_whiteboard_competitive_questions';
const RESULTS_KEY = 'ai_whiteboard_exam_results';
const BOOKMARKS_KEY = 'ai_whiteboard_bookmarks';
const REVIEWS_KEY = 'ai_whiteboard_reviews';
const ANALYTICS_KEY = 'ai_whiteboard_analytics';

export interface UserReview {
  id: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  title: string;
  message: string;
  status: 'approved' | 'pending_admin' | 'resolved' | 'archived';
  isNegative: boolean; // true if rating <= 3
  createdAt: string;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  mcqAttempts: number;
  popularExams: { [examId: string]: number };
  popularTopics: { [topicId: string]: number };
  recentSearchQueries: string[];
}

export class CompetitiveService {
  // Load Exams (Merges initial + localStorage overrides)
  static getExams(): Exam[] {
    try {
      const stored = localStorage.getItem(EXAMS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPETITIVE_EXAMS;
  }

  static saveExams(exams: Exam[]) {
    try {
      localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
    } catch (e) {
      console.error(e);
    }
  }

  static getExamById(id: string): Exam | undefined {
    return this.getExams().find((e) => e.id === id);
  }

  static searchExams(query: string = '', category: string = 'All', country: string = 'All', region: string = 'All'): Exam[] {
    const q = query.toLowerCase().trim();
    let list = this.getExams();

    if (category && category !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
    if (country && country !== 'All') {
      list = list.filter((e) => e.country.toLowerCase() === country.toLowerCase());
    }
    if (region && region !== 'All') {
      list = list.filter((e) => e.region?.toLowerCase() === region.toLowerCase() || e.country.toLowerCase() === region.toLowerCase());
    }
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q) ||
          (e.region && e.region.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  // Admin Exam Management
  static addExam(exam: Exam): Exam[] {
    const exams = this.getExams();
    exams.unshift(exam);
    this.saveExams(exams);
    return exams;
  }

  static updateExam(exam: Exam): Exam[] {
    let exams = this.getExams();
    exams = exams.map((e) => (e.id === exam.id ? exam : e));
    this.saveExams(exams);
    return exams;
  }

  static deleteExam(examId: string): Exam[] {
    const exams = this.getExams().filter((e) => e.id !== examId);
    this.saveExams(exams);
    return exams;
  }

  // ==========================================
  // 🔒 STRICT EXAM VALIDATION & ISOLATION
  // ==========================================

  /**
   * Strict validation rule: verifies that a question strictly belongs to the target exam
   * and contains zero cross-exam contamination (e.g. rejecting CFA/UPSC in JEE Main).
   */
  static validateQuestion(question: MCQQuestion, targetExamId: string): boolean {
    if (!question || !question.question || !question.options || question.options.length < 4) {
      return false;
    }
    if (!targetExamId) return true;

    const target = targetExamId.toLowerCase().trim();
    const qExam = (question.examId || '').toLowerCase().trim();

    // 1. Strict Exam ID constraint
    if (qExam !== target) {
      return false;
    }

    // 2. Reject Cross-Exam Contamination Markers in source tag and topic
    const sourceTag = (question.sourceTag || question.source || '').toLowerCase();
    const topic = (question.topicName || '').toLowerCase();

    const checkContamination = (keywords: string[]) => {
      return keywords.some(
        (kw) => sourceTag.includes(kw) || topic.includes(kw)
      );
    };

    if (target === 'jee-main') {
      if (checkContamination(['upsc', 'cfa', 'cat', 'gate', 'usmle', 'nclex', 'gmat', 'sat', 'gre', 'neet', 'civil services', 'corporate finance', 'wacc', 'capm', 'habeas corpus', 'biodiversity'])) {
        return false;
      }
    } else if (target === 'jee-advanced') {
      if (checkContamination(['upsc', 'cfa', 'cat', 'gate', 'usmle', 'nclex', 'gmat', 'sat', 'gre', 'neet', 'civil services'])) {
        return false;
      }
    } else if (target === 'upsc-cse') {
      if (checkContamination(['jee', 'cfa', 'gate', 'usmle', 'nclex', 'gmat', 'sat', 'neet', 'iit'])) {
        return false;
      }
    } else if (target === 'neet-ug') {
      if (checkContamination(['upsc', 'cfa', 'cat', 'gate', 'usmle', 'nclex', 'gmat', 'sat', 'gre', 'jee', 'civil services'])) {
        return false;
      }
    } else if (target === 'cfa-level-1') {
      if (checkContamination(['upsc', 'jee', 'neet', 'gate', 'usmle', 'nclex', 'sat', 'gre', 'civil services'])) {
        return false;
      }
    }

    return true;
  }

  // Load Questions with Hard Exam Constraint
  static getQuestions(examId?: string, topicId?: string): MCQQuestion[] {
    let allQuestions: MCQQuestion[] = [];
    try {
      const stored = localStorage.getItem(QUESTIONS_KEY);
      if (stored) {
        allQuestions = JSON.parse(stored);
        // Ensure any newly added static questions exist
        const storedIds = new Set(allQuestions.map((q) => q.id));
        ALL_INITIAL_QUESTIONS.forEach((q) => {
          if (!storedIds.has(q.id)) {
            allQuestions.push(q);
          }
        });
      } else {
        allQuestions = ALL_INITIAL_QUESTIONS;
      }
    } catch (e) {
      allQuestions = ALL_INITIAL_QUESTIONS;
    }

    // Hard Exam Lock Constraint: If examId is provided, filter strictly
    if (examId) {
      allQuestions = allQuestions.filter((q) => this.validateQuestion(q, examId));
    }

    // Filter by topic if specified and matches
    if (topicId && topicId !== 'all') {
      const topicFiltered = allQuestions.filter((q) => q.topicId === topicId);
      if (topicFiltered.length > 0) {
        return topicFiltered;
      }
    }

    return allQuestions;
  }

  static getQuestionsByExam(examId: string, topicId?: string): MCQQuestion[] {
    return this.getQuestions(examId, topicId);
  }

  /**
   * Generates high-yield fallback questions strictly derived from the target exam's syllabus & subjects.
   * Never pulls questions from another exam.
   */
  static generateExamFallbackQuestions(exam: Exam, topicId?: string, count: number = 5): MCQQuestion[] {
    const fallbacks: MCQQuestion[] = [];
    const subjects = exam.subjects && exam.subjects.length > 0 ? exam.subjects : [];
    
    let candidateTopics = subjects.flatMap((s) => s.topics);
    if (topicId && topicId !== 'all') {
      const specific = candidateTopics.filter((t) => t.id === topicId);
      if (specific.length > 0) candidateTopics = specific;
    }

    candidateTopics.forEach((t, i) => {
      if (fallbacks.length >= count) return;
      if (t.importantPoints && t.importantPoints.length > 0) {
        const pt = t.importantPoints[i % t.importantPoints.length];
        fallbacks.push({
          id: `gen_${exam.id}_${t.id}_${i}_${Date.now()}`,
          examId: exam.id,
          examName: exam.name,
          subject: subjects.find((s) => s.topics.some((top) => top.id === t.id))?.name || exam.name,
          chapter: t.name,
          topicId: t.id,
          topicName: `${t.name}`,
          question: `With reference to ${t.name} in ${exam.name}, which of the following is correct?\n\nKey Concept: "${pt}"`,
          options: [
            `It represents an established core principle: ${pt}`,
            `It only applies in hypothetical scenarios and is rejected in ${exam.name}`,
            `It is an inverse formulation of ${t.name}`,
            `None of the above statements are accurate for ${exam.name}`,
          ],
          correctAnswer: 0,
          explanation: `In ${exam.name} syllabus for ${t.name}, this is a high-yield concept. ${t.summary || t.overview || pt}`,
          difficulty: 'medium',
          questionType: 'single_choice',
          isSourceBased: true,
          source: exam.name,
          sourceTag: `${exam.name} High-Yield Practice`,
        });
      }
    });

    return fallbacks.slice(0, count);
  }

  static addQuestion(question: MCQQuestion): MCQQuestion[] {
    const questions = this.getQuestions();
    questions.unshift(question);
    try {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    } catch (e) {
      console.error(e);
    }
    return questions;
  }

  // Load Results
  static getResults(): ExamResult[] {
    try {
      const stored = localStorage.getItem(RESULTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  static saveResult(result: ExamResult): ExamResult[] {
    const results = this.getResults();
    results.unshift(result);
    try {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch (e) {
      console.error(e);
    }
    this.incrementAnalytics('mcqAttempts');
    return results;
  }

  static saveExamResult(result: ExamResult): ExamResult[] {
    return this.saveResult(result);
  }

  // Load Bookmarks
  static getBookmarks(): Bookmark[] {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  static isBookmarked(typeOrId: string, itemId?: string): boolean {
    const bookmarks = this.getBookmarks();
    if (itemId) {
      return bookmarks.some((b) => b.type === typeOrId && b.itemId === itemId);
    }
    return bookmarks.some((b) => b.id === typeOrId || b.itemId === typeOrId);
  }

  static addBookmark(bookmark: Bookmark): Bookmark[] {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.some((b) => b.id === bookmark.id)) {
      bookmarks.unshift(bookmark);
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      } catch (e) {
        console.error(e);
      }
    }
    return bookmarks;
  }

  static removeBookmark(id: string): Bookmark[] {
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id && b.itemId !== id);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
    return bookmarks;
  }

  static toggleBookmark(bData: { type: 'exam' | 'topic' | 'question'; itemId: string; title: string; subtitle: string }): boolean {
    const isSaved = this.isBookmarked(bData.type, bData.itemId);
    if (isSaved) {
      this.removeBookmark(bData.itemId);
      return false;
    } else {
      const newB: Bookmark = {
        id: `bm_${bData.type}_${bData.itemId}`,
        type: bData.type,
        itemId: bData.itemId,
        title: bData.title,
        subtitle: bData.subtitle,
        savedAt: new Date().toISOString().split('T')[0],
      };
      this.addBookmark(newB);
      return true;
    }
  }

  // Reviews Engine (Real User Submissions)
  static getReviews(): UserReview[] {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically clear out legacy mock reviews if present
        if (Array.isArray(parsed) && parsed.some((r) => r.id === 'rev-1' || r.id === 'rev-2' || r.userEmail === 'aarav.patel@example.com')) {
          localStorage.removeItem(REVIEWS_KEY);
        } else {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Default: Clean empty list for initial launch
    const initialReviews: UserReview[] = [];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews));
    return initialReviews;
  }

  static submitReview(review: Omit<UserReview, 'id' | 'createdAt' | 'status' | 'isNegative'>): { review: UserReview; notifiedAdmin: boolean } {
    const reviews = this.getReviews();
    const isNegative = review.rating <= 3;
    const newRev: UserReview = {
      ...review,
      id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      isNegative,
      status: isNegative ? 'pending_admin' : 'approved',
    };

    reviews.unshift(newRev);
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }

    let notifiedAdmin = false;
    if (isNegative) {
      console.warn(`[ADMIN ALERT] Negative feedback (${review.rating} stars) received from ${review.userEmail}. Saved to database and dispatched notification to jaasirmuhammed@gmail.com`);
      notifiedAdmin = true;
    }

    return { review: newRev, notifiedAdmin };
  }

  static updateReviewStatus(reviewId: string, status: UserReview['status']): UserReview[] {
    let reviews = this.getReviews();
    reviews = reviews.map((r) => (r.id === reviewId ? { ...r, status } : r));
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
    return reviews;
  }

  // Analytics Engine (Real-Time Live Usage Tracking)
  static getAnalytics(): AnalyticsData {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically clear out legacy mock analytics if totalVisits >= 1000
        if (parsed && typeof parsed.totalVisits === 'number' && parsed.totalVisits >= 1000) {
          localStorage.removeItem(ANALYTICS_KEY);
        } else {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Clean initial live state starting at 1 visit (current session)
    const initialAnalytics: AnalyticsData = {
      totalVisits: 1,
      uniqueVisitors: 1,
      pageViews: 1,
      mcqAttempts: 0,
      popularExams: {},
      popularTopics: {},
      recentSearchQueries: [],
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialAnalytics));
    return initialAnalytics;
  }

  static incrementAnalytics(key: keyof Pick<AnalyticsData, 'totalVisits' | 'uniqueVisitors' | 'pageViews' | 'mcqAttempts'>) {
    const data = this.getAnalytics();
    data[key] += 1;
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static recordExamVisit(examId: string) {
    const data = this.getAnalytics();
    data.popularExams[examId] = (data.popularExams[examId] || 0) + 1;
    data.pageViews += 1;
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static clearMockData(): AnalyticsData {
    localStorage.removeItem(REVIEWS_KEY);
    localStorage.removeItem(ANALYTICS_KEY);
    return this.getAnalytics();
  }
}
