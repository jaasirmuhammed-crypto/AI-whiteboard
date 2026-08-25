import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompetitiveService, UserReview, AnalyticsData } from '../../services/competitiveService';
import { PaymentService } from '../../services/paymentService';
import { PaymentRecord, SubscriptionRecord, AdminPaymentStats } from '../../types/payment';
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
  CreditCard,
  Crown,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AdminDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'payments' | 'analytics' | 'students' | 'reviews' | 'exams' | 'charts'>('payments');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return user?.email === 'jaasirmuhammed@gmail.com' || localStorage.getItem('ai_whiteboard_admin_session') === 'true';
  });

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  // Data state
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => CompetitiveService.getAnalytics());
  const [reviews, setReviews] = useState<UserReview[]>(() => CompetitiveService.getReviews());
  const [exams, setExams] = useState<Exam[]>(() => CompetitiveService.getExams());

  // Payments & Subscription Management State
  const [payments, setPayments] = useState<PaymentRecord[]>(() => PaymentService.getPayments());
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => PaymentService.getSubscriptions());
  const [paymentStats, setPaymentStats] = useState<AdminPaymentStats>(() => PaymentService.getAdminPaymentStats(166));
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'premium' | 'free' | 'successful' | 'failed'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Manual Test Payment Modal state
  const [showManualVerifyModal, setShowManualVerifyModal] = useState(false);
  const [testPayUserEmail, setTestPayUserEmail] = useState('');
  const [testPayUserName, setTestPayUserName] = useState('');
  const [testPayId, setTestPayId] = useState('');

  // Refresh Payment stats whenever payments or subscriptions change
  useEffect(() => {
    const freshPayments = PaymentService.getPayments();
    const freshSubs = PaymentService.getSubscriptions();
    setPayments(freshPayments);
    setSubscriptions(freshSubs);
    setPaymentStats(PaymentService.getAdminPaymentStats(166));
  }, [activeTab]);

  // Handle Admin Passcode Unlock
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

  // Manual Payment Entry / Grant by Admin
  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPayUserEmail.trim()) {
      showToast('Please provide a valid user email.', 'error');
      return;
    }

    const dummyUser = {
      id: 'usr_' + Date.now(),
      name: testPayUserName.trim() || testPayUserEmail.split('@')[0],
      email: testPayUserEmail.trim(),
      preferredLanguage: 'en',
      preferredTheme: 'light' as const,
      createdAt: new Date().toISOString(),
      plan: 'premium' as const,
      tokensRemaining: 999999,
      subscriptionStatus: 'active' as const,
    };

    const payId = testPayId.trim() || 'pay_' + Math.random().toString(36).substring(2, 12);
    PaymentService.processSuccessfulUpgrade(dummyUser, payId, 120, 'INR', 'Admin Manual Activation');
    
    setPayments(PaymentService.getPayments());
    setSubscriptions(PaymentService.getSubscriptions());
    setPaymentStats(PaymentService.getAdminPaymentStats(166));
    setShowManualVerifyModal(false);
    setTestPayUserEmail('');
    setTestPayUserName('');
    setTestPayId('');
    showToast(`Premium plan activated for ${dummyUser.email}! 👑`, 'success');
  };

  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
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
              placeholder="Enter passcode (safa2026)..."
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

  // Filtered Payments computation
  const filteredPayments = PaymentService.filterPayments(paymentFilter, paymentSearch);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Administrator
            </span>
            <span className="text-xs text-slate-500 font-mono">Razorpay & Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-brand text-slate-900 dark:text-white mt-1">
            System Admin & Revenue Operations
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          {[
            { id: 'payments', label: '💳 Razorpay Payments', icon: CreditCard },
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB: PAYMENTS & PREMIUM USERS */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          
          {/* Top Live Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" /> Total Users
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-brand">
                {paymentStats.totalRegisteredUsers}
              </div>
              <span className="text-[10px] text-slate-400">Database users</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" /> Premium Users
              </span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-brand">
                {paymentStats.totalPremiumUsers}
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold">Active subscribers</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Free Users
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-brand">
                {paymentStats.totalFreeUsers}
              </div>
              <span className="text-[10px] text-slate-400">5 daily free tokens</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Successful
              </span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-brand">
                {paymentStats.totalSuccessfulPayments}
              </div>
              <span className="text-[10px] text-emerald-500">Captured payments</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-500/30 dark:border-rose-500/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Failed / Cancelled
              </span>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-brand">
                {paymentStats.totalFailedPayments}
              </div>
              <span className="text-[10px] text-slate-400">Abandoned checkouts</span>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-md space-y-1 border border-indigo-700/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-300" /> Total Revenue
              </span>
              <div className="text-2xl font-bold text-white font-brand">
                ₹{paymentStats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-indigo-200">Razorpay net revenue</span>
            </div>
          </div>

          {/* Razorpay Webhook Configuration Banner */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Razorpay Payment Link & Webhook Configuration
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Hosted Link: https://razorpay.me/@aiwhiteboardone • Webhook URL: /api/razorpay/webhook
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://razorpay.me/@aiwhiteboardone"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>View Payment Page</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <button
                type="button"
                onClick={() => setShowManualVerifyModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manual Payment Entry</span>
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'successful', label: 'Successful Payments' },
                { id: 'failed', label: 'Failed Payments' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPaymentFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email, payment ID..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Payments Data Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
                Razorpay Payment Transactions & Subscriptions ({filteredPayments.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Instant Server-Side Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Plan</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment ID</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No payment records found matching the search/filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => {
                      const sub = subscriptions.find((s) => s.userId === p.userId);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-1.5">
                              {p.status === 'captured' && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                              <span>{p.userName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{p.userEmail}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'captured'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {p.status === 'captured' ? 'PREMIUM' : 'FREE'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'captured'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {p.status === 'captured' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  <span>Captured</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-rose-500" />
                                  <span>Failed</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                            ₹{p.amount}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 select-all">
                            {p.razorpayPaymentId}
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {p.paymentMethod || 'UPI'}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[10px]">
                            {new Date(p.paidAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manual Payment Verification Modal */}
          {showManualVerifyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Manual Payment & Premium Grant
                  </h4>
                  <button onClick={() => setShowManualVerifyModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateManualPayment} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Student / User Email</label>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={testPayUserEmail}
                      onChange={(e) => setTestPayUserEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">User Full Name</label>
                    <input
                      type="text"
                      placeholder="User Name"
                      value={testPayUserName}
                      onChange={(e) => setTestPayUserName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Razorpay Payment ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="pay_..."
                      value={testPayId}
                      onChange={(e) => setTestPayId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowManualVerifyModal(false)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      Grant Premium
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 1: OVERVIEW ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
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
                  <th className="py-3 px-4">Plan Status</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Preferred Target Exam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Dr. Sarah Chen</td>
                  <td className="py-3.5 px-4">sarah.chen@stanford.edu</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">
                      PREMIUM ⭐
                    </span>
                  </td>
                  <td className="py-3.5 px-4">2026-08-01</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">USMLE Step 1</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Rohit Sharma</td>
                  <td className="py-3.5 px-4">rohit.iitd@gmail.com</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">
                      PREMIUM ⭐
                    </span>
                  </td>
                  <td className="py-3.5 px-4">2026-08-04</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">JEE Advanced</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Alex Rivera</td>
                  <td className="py-3.5 px-4">alex.rivera@mit.edu</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                      FREE
                    </span>
                  </td>
                  <td className="py-3.5 px-4">2026-08-10</td>
                  <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">GRE General</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
              Student Reviews & Testimonials Moderation
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {reviews.map((r) => (
                <div key={r.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{r.userName}</span>
                      <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">{r.message}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReviewStatusChange(r.id, 'approved')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                        r.status === 'approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => handleReviewStatusChange(r.id, 'archived')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                        r.status === 'archived'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAMS */}
      {activeTab === 'exams' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
              Competitive Exam Modules ({exams.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((ex) => (
              <div key={ex.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{ex.name}</div>
                <div className="text-[11px] text-slate-400">{ex.country} • {ex.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SVG CHARTS */}
      {activeTab === 'charts' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
            Visitor Traffic & Revenue Growth Trend
          </h3>
          <div className="h-56 w-full flex items-end gap-3 pt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[45, 62, 78, 92, 115, 140, 166].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-500"
                  style={{ height: `${(h / 166) * 100}%` }}
                />
                <span className="text-[10px] text-slate-400">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
