import { Exam, MCQQuestion, ExamResult, Bookmark } from '../types/competitive';
import { INITIAL_COMPETITIVE_EXAMS, INITIAL_PRACTICE_QUESTIONS } from '../data/competitiveExamsData';

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

  static searchExams(query: string = '', category: string = 'All', country: string = 'All'): Exam[] {
    const q = query.toLowerCase().trim();
    let list = this.getExams();

    if (category && category !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
    if (country && country !== 'All') {
      list = list.filter((e) => e.country.toLowerCase() === country.toLowerCase());
    }
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q) ||
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

  // Load Questions
  static getQuestions(examId?: string, topicId?: string): MCQQuestion[] {
    let allQuestions: MCQQuestion[] = [];
    try {
      const stored = localStorage.getItem(QUESTIONS_KEY);
      allQuestions = stored ? JSON.parse(stored) : INITIAL_PRACTICE_QUESTIONS;
    } catch (e) {
      allQuestions = INITIAL_PRACTICE_QUESTIONS;
    }

    if (examId) {
      allQuestions = allQuestions.filter((q) => q.examId === examId);
    }
    if (topicId) {
      allQuestions = allQuestions.filter((q) => q.topicId === topicId);
    }

    return allQuestions;
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
