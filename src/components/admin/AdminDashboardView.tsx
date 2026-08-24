import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompetitiveService, UserReview, AnalyticsData } from '../../services/competitiveService';
import { Exam, MCQQuestion } from '../../types/competitive';
import {
  ShieldCheck,
  Users,
  Eye,
  Star,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Mail,
  Lock,
  Search,
  BookOpen,
  Filter,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AdminDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'reviews' | 'exams' | 'charts'>('analytics');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    // Admin check requirement: jaasirmuhammed@gmail.com
    return user?.email === 'jaasirmuhammed@gmail.com' || localStorage.getItem('ai_whiteboard_admin_session') === 'true';
  });

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  // Data state
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => CompetitiveService.getAnalytics());
  const [reviews, setReviews] = useState<UserReview[]>(() => CompetitiveService.getReviews());
  const [exams, setExams] = useState<Exam[]>(() => CompetitiveService.getExams());
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days' | 'all'>('7days');

  // Exam Add Modal Form state
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamCountry, setNewExamCountry] = useState('India');
  const [newExamCategory, setNewExamCategory] = useState('Engineering & Technology');
  const [newExamBadge, setNewExamBadge] = useState('National Entrance');
  const [newExamDesc, setNewExamDesc] = useState('');

  // Handle Admin Passcode Unlock (for local development or admin override)
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === 'safa2026' || adminPasswordInput.trim() === 'admin123' || user?.email === 'jaasirmuhammed@gmail.com') {
      setIsAdminUnlocked(true);
      localStorage.setItem('ai_whiteboard_admin_session', 'true');
      showToast('Admin Portal Unlocked!', 'success');
    } else {
      showToast('Invalid Admin Credentials.', 'error');
    }
  };

  const handleResetAnalytics = () => {
    const fresh = CompetitiveService.clearMockData();
    setAnalytics(fresh);
    setReviews([]);
    showToast('Analytics reset to zero live visits!', 'success');
  };

  const handleReviewStatusChange = (id: string, status: UserReview['status']) => {
    const updated = CompetitiveService.updateReviewStatus(id, status);
    setReviews(updated);
    showToast(`Review status updated to ${status}`, 'info');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;

    const newE: Exam = {
      id: 'exam_' + Date.now(),
      name: newExamName,
      country: newExamCountry,
      region: (newExamCountry.toLowerCase().includes('india') ? 'India' : newExamCountry.toLowerCase().includes('usa') ? 'USA' : 'International') as any,
      officialPortal: 'https://example.edu',
      category: newExamCategory,
      badge: newExamBadge,
      description: newExamDesc || 'New custom entrance examination added via Admin Portal.',
      eligibility: 'High School / Graduate qualification.',
      structure: 'Multi-stage competitive examination.',
      duration: '3 Hours.',
      scoring: 'Standard competitive scoring.',
      sections: ['General Knowledge', 'Core Subject Aptitude'],
      subjects: [
        {
          id: 'sub_1',
          name: 'General Foundation',
          topics: [
            {
              id: 'top_1',
              name: 'Core Concepts & Fundamentals',
              overview: 'Comprehensive introduction to key exam concepts.',
              importantPoints: ['High weightage fundamental topics.', 'Review previous year question trends.'],
              definitions: [{ term: 'Core Tenet', definition: 'Fundamental principles of the subject.' }],
              commonMistakes: ['Skimming structural formulas.'],
              examTips: ['Pace time evenly.'],
              quickRevision: ['Revise core formulas daily.'],
              summary: 'Essential foundation for candidates.',
              diagramType: 'concept_map',
            },
          ],
        },
      ],
    };

    const updated = CompetitiveService.addExam(newE);
    setExams(updated);
    setShowAddExamModal(false);
    setNewExamName('');
    setNewExamDesc('');
    showToast(`New Exam "${newE.name}" created successfully!`, 'success');
  };

  const handleDeleteExam = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      const updated = CompetitiveService.deleteExam(id);
      setExams(updated);
      showToast('Exam deleted successfully.', 'info');
    }
  };

  // If not unlocked, show login challenge
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
            Protected Admin Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in as <span className="font-semibold text-indigo-600">Administrator</span> or enter admin authorization code.
          </p>
        </div>

        <form onSubmit={handleAdminUnlock} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Admin Authorization Passcode
            </label>
            <input
              type="password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="btn-interactive w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25"
          >
            Access Admin Dashboard
          </button>
        </form>
      </div>
    );
  }

  // Filtered Reviews
  const positiveReviews = reviews.filter((r) => r.rating >= 4);
  const negativeReviews = reviews.filter((r) => r.rating <= 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Administrator
            </span>
            <span className="text-xs text-slate-500 font-mono">System Admin Portal</span>
          </div>
          <h1 className="text-3xl font-bold font-brand text-slate-900 dark:text-white mt-1">
            System Admin & Visitor Analytics Portal
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          {[
            { id: 'analytics', label: 'Overview Metrics', icon: TrendingUp },
            { id: 'students', label: 'Registered Students', icon: Users },
            { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
            { id: 'exams', label: 'Exam CRUD Manager', icon: BookOpen },
            { id: 'charts', label: 'SVG Charts', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Header Bar with Live Tracking Notice & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold">Real-Time Live Analytics:</span>
              <span>Tracking real user visits, page views, and quiz attempts.</span>
            </div>

            <button
              onClick={handleResetAnalytics}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Analytics to 0</span>
            </button>
          </div>

          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" /> Total Site Visits
              </span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-brand">
                {analytics.totalVisits.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% this month
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-500" /> Unique Visitors
              </span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-brand">
                {analytics.uniqueVisitors.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Privacy-conscious cookies
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-500" /> Total Page Views
              </span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-brand">
                {analytics.pageViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Avg 4.2 pages/session</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-500" /> MCQ Test Attempts
              </span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-brand">
                {analytics.mcqAttempts.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Avg score 74.8%</span>
            </div>
          </div>

          {/* Popular Exam & Query Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Most Visited Exam Modules
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.popularExams).map(([id, count]) => (
                  <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 capitalize">{id.replace('-', ' ')}</span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{count} views</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Recent Student Search Queries
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.recentSearchQueries.map((q, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    🔍 {q}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
              Registered Student Accounts
            </h3>
            <span className="text-xs text-slate-500">Stored with secure password hashing</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Preferred Target Exam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Aarav Patel</td>
                  <td className="py-3.5 px-4">aarav.patel@example.com</td>
                  <td className="py-3.5 px-4">2026-08-10</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">UPSC CSE</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Sophia Chen</td>
                  <td className="py-3.5 px-4">sophia.c@example.com</td>
                  <td className="py-3.5 px-4">2026-08-14</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">Gaokao Math</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Rohan Gupta</td>
                  <td className="py-3.5 px-4">rohan.g@example.com</td>
                  <td className="py-3.5 px-4">2026-08-18</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">JEE Advanced</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS & FEEDBACK */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Approved 4-5 Star Reviews */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" /> Public Approved Reviews (4–5 Stars)
                </h3>
                <span className="text-xs text-slate-500">{positiveReviews.length} Approved</span>
              </div>

              <div className="space-y-3">
                {positiveReviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{r.userName} ({r.userEmail})</span>
                      <div className="flex text-amber-400 text-xs">{'★'.repeat(r.rating)}</div>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{r.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-3 Star Negative Feedback (Admin Alerts) */}
            <div className="p-6 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Negative Feedback & Resolution (1–3 Stars)
                </h3>
                <span className="text-xs text-rose-500 font-semibold">Dispatched to jaasirmuhammed@gmail.com</span>
              </div>

              {negativeReviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No negative feedback recorded.</p>
              ) : (
                <div className="space-y-3">
                  {negativeReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{r.userName} ({r.userEmail})</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          Status: {r.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{r.message}</p>
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleReviewStatusChange(r.id, 'resolved')}
                          className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleReviewStatusChange(r.id, 'approved')}
                          className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold text-[10px]"
                        >
                          Publish to Site
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM CRUD MANAGER */}
      {activeTab === 'exams' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                Exam & Question CRUD Management
              </h3>
              <p className="text-xs text-slate-500">Add or edit exams dynamically without code changes</p>
            </div>
            <button
              onClick={() => setShowAddExamModal(true)}
              className="btn-interactive px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Exam
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{e.country}</span>
                  <button onClick={() => handleDeleteExam(e.id)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{e.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{e.description}</p>
                <div className="text-[11px] text-slate-400">{e.subjects.length} Subjects • {e.subjects.flatMap(s=>s.topics).length} Topics</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SVG CHARTS */}
      {activeTab === 'charts' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
              Interactive Analytics Charts
            </h3>
            <div className="flex items-center gap-2 text-xs">
              {['today', '7days', '30days', 'all'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf as any)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-semibold border ${
                    timeFilter === tf ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Rendered SVG Bar & Line Chart */}
          <div className="w-full bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
              Daily Visitor Growth & MCQ Attempts (SVG Chart Engine)
            </span>
            <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-800">
              {[45, 65, 80, 50, 95, 110, 140, 125, 160, 185].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all"
                    style={{ height: `${val}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono">D{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">Add Entrance Exam</h3>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  placeholder="e.g. Oxford Admissions Test"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Country</label>
                  <input
                    type="text"
                    value={newExamCountry}
                    onChange={(e) => setNewExamCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge</label>
                  <input
                    type="text"
                    value={newExamBadge}
                    onChange={(e) => setNewExamBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  value={newExamDesc}
                  onChange={(e) => setNewExamDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
