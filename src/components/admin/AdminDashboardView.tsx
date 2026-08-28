import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AnalyticsTrackingService } from '../../services/analyticsTrackingService';
import { PaymentService, FIXED_PREMIUM_PRICE_INR } from '../../services/paymentService';
import { CompetitiveService, UserReview } from '../../services/competitiveService';
import {
  DateRangePreset,
  OverviewMetrics,
  UserGrowthDataPoint,
  AIUsageMetrics,
  FeatureUsageMetric,
  TokenAnalyticsData,
  ConversionFunnelStage,
  SystemHealthItem,
  UserAnalyticsRecord,
  AnalyticsEvent,
} from '../../types/analytics';
import { PaymentRecord, SubscriptionRecord } from '../../types/payment';
import { DynamicLineChart, FunnelBarChart, FeatureDistributionBars } from './AnalyticsCharts';
import { UserDetailModal } from './UserDetailModal';
import {
  ShieldCheck,
  Users,
  Sparkles,
  Zap,
  TrendingUp,
  CreditCard,
  Crown,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Download,
  AlertTriangle,
  Activity,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Server,
  Lock,
  ChevronRight,
  Eye,
  Check,
  AlertCircle,
  HelpCircle,
  FileText,
  Sliders,
  ChevronLeft,
  Calendar,
  Mail,
  Copy,
  Send,
  UserCheck
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AdminDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Admin Passcode Access Gate
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return user?.email === 'jaasirmuhammed@gmail.com' || localStorage.getItem('ai_whiteboard_admin_session') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Active Tab & Navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'user_analytics' | 'ai_usage' | 'features' | 'tokens' | 'payments' | 'funnel' | 'users_table' | 'system_health' | 'reviews'
  >('overview');

  // Global Date Filter Preset
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Data States
  const [overview, setOverview] = useState<OverviewMetrics>(() => AnalyticsTrackingService.getOverviewMetrics('30d'));
  const [userGrowth, setUserGrowth] = useState<UserGrowthDataPoint[]>(() => AnalyticsTrackingService.getUserGrowth('30d'));
  const [activeUsersStats, setActiveUsersStats] = useState(() => AnalyticsTrackingService.getActiveUserMetrics());
  const [aiUsage, setAiUsage] = useState<AIUsageMetrics>(() => AnalyticsTrackingService.getAIUsageMetrics('30d'));
  const [features, setFeatures] = useState<FeatureUsageMetric[]>(() => AnalyticsTrackingService.getFeatureUsage('30d'));
  const [tokenAnalytics, setTokenAnalytics] = useState<TokenAnalyticsData>(() => AnalyticsTrackingService.getTokenAnalytics());
  const [funnel, setFunnel] = useState<ConversionFunnelStage[]>(() => AnalyticsTrackingService.getConversionFunnel('30d'));
  const [userRecords, setUserRecords] = useState<UserAnalyticsRecord[]>(() => AnalyticsTrackingService.getUserAnalyticsRecords());
  const [recentActivity, setRecentActivity] = useState<AnalyticsEvent[]>(() => AnalyticsTrackingService.getRecentActivity(15));
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>(() => PaymentService.getPayments());
  const [reviews, setReviews] = useState<UserReview[]>(() => CompetitiveService.getReviews());

  // User Table Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState<'all' | 'premium' | 'free' | 'gmail'>('all');
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 8;

  // Payments Search & Filter
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'successful' | 'failed'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Individual User Inspection Modal
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserAnalyticsRecord | null>(null);

  // Manual Grant Modal
  const [showManualGrantModal, setShowManualGrantModal] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPayId, setManualPayId] = useState('');

  // Load and refresh all analytics
  const refreshAllData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      setOverview(AnalyticsTrackingService.getOverviewMetrics(datePreset));
      setUserGrowth(AnalyticsTrackingService.getUserGrowth(datePreset));
      setActiveUsersStats(AnalyticsTrackingService.getActiveUserMetrics());
      setAiUsage(AnalyticsTrackingService.getAIUsageMetrics(datePreset));
      setFeatures(AnalyticsTrackingService.getFeatureUsage(datePreset));
      setTokenAnalytics(AnalyticsTrackingService.getTokenAnalytics());
      setFunnel(AnalyticsTrackingService.getConversionFunnel(datePreset));
      setUserRecords(AnalyticsTrackingService.getUserAnalyticsRecords());
      setRecentActivity(AnalyticsTrackingService.getRecentActivity(15));
      setPayments(PaymentService.getPayments());
      setReviews(CompetitiveService.getReviews());
      const health = await AnalyticsTrackingService.getSystemHealth();
      setSystemHealth(health);
    } catch (err: any) {
      setErrorMsg('Unable to refresh analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [datePreset, activeTab]);

  // Handle Admin Passcode Unlock
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminPasswordInput.trim() === 'safa2026' ||
      adminPasswordInput.trim() === 'admin123' ||
      user?.email === 'jaasirmuhammed@gmail.com'
    ) {
      setIsAdminUnlocked(true);
      localStorage.setItem('ai_whiteboard_admin_session', 'true');
      showToast('Admin session unlocked successfully 🛡️', 'success');
    } else {
      showToast('Invalid Admin Passcode! Access Denied.', 'error');
    }
  };

  const handleAdminLock = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('ai_whiteboard_admin_session');
    showToast('Admin session locked.', 'info');
  };

  // Manual Premium Grant Handler
  const handleManualGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) {
      showToast('Please enter a student email', 'error');
      return;
    }
    const payId = manualPayId.trim() || `pay_manual_${Date.now()}`;
    const targetUser = userRecords.find((u) => u.email.toLowerCase() === manualEmail.toLowerCase().trim()) || {
      id: `usr_${Date.now()}`,
      name: manualName.trim() || manualEmail.split('@')[0],
      email: manualEmail.trim(),
      preferredLanguage: 'en',
      preferredTheme: 'light',
      createdAt: new Date().toISOString(),
      plan: 'premium' as const,
      tokensRemaining: 999999,
      subscriptionStatus: 'active' as const,
    };

    PaymentService.processSuccessfulUpgrade(
      targetUser as any,
      payId,
      FIXED_PREMIUM_PRICE_INR,
      'INR',
      'Admin Manual Grant'
    );

    AnalyticsTrackingService.trackEvent('PLAN_UPGRADED', {
      userId: targetUser.id,
      userEmail: targetUser.email,
      userName: targetUser.name,
      metadata: { reason: 'Admin Manual Grant', payId },
    });

    showToast(`⭐ Premium plan granted to ${manualEmail}!`, 'success');
    setShowManualGrantModal(false);
    setManualEmail('');
    setManualName('');
    setManualPayId('');
    refreshAllData();
  };

  // Filtered Users Table Data
  const gmailCount = useMemo(() => userRecords.filter((u) => u.email.toLowerCase().includes('@gmail.com')).length, [userRecords]);
  const proCount = useMemo(() => userRecords.filter((u) => u.plan === 'premium').length, [userRecords]);
  const freeCount = useMemo(() => userRecords.filter((u) => u.plan === 'free').length, [userRecords]);

  const handleCopyEmail = (email: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard! 📋`, 'success');
  };

  const filteredUsers = useMemo(() => {
    return userRecords.filter((u) => {
      const term = userSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term);

      const matchesPlan =
        userPlanFilter === 'all' ||
        (userPlanFilter === 'premium' && u.plan === 'premium') ||
        (userPlanFilter === 'free' && u.plan === 'free') ||
        (userPlanFilter === 'gmail' && u.email.toLowerCase().includes('@gmail.com'));

      return matchesSearch && matchesPlan;
    });
  }, [userRecords, userSearch, userPlanFilter]);

  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  // Filtered Payments Data
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const term = paymentSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.userName.toLowerCase().includes(term) ||
        p.userEmail.toLowerCase().includes(term) ||
        p.razorpayPaymentId.toLowerCase().includes(term);

      const matchesFilter =
        paymentFilter === 'all' ||
        (paymentFilter === 'successful' && p.status === 'captured') ||
        (paymentFilter === 'failed' && p.status === 'failed');

      return matchesSearch && matchesFilter;
    });
  }, [payments, paymentSearch, paymentFilter]);

  // Render Passcode Gate if Locked
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-brand text-slate-900 dark:text-white">Admin Operations Portal</h2>
            <p className="text-xs text-slate-500">Authorized personnel only. Authenticate with your administrative credentials.</p>
          </div>
          <form onSubmit={handleAdminUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter access passcode..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Unlock Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Individual User Deep Dive Modal */}
      <UserDetailModal user={selectedUserForModal} onClose={() => setSelectedUserForModal(null)} />

      {/* Manual Grant Modal */}
      {showManualGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Grant ⭐ Pro Scholar Plan
              </h3>
              <button onClick={() => setShowManualGrantModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualGrantSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Student Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Student Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Payment / Reference ID (Optional)</label>
                <input
                  type="text"
                  placeholder="pay_manual_grant"
                  value={manualPayId}
                  onChange={(e) => setManualPayId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualGrantModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Confirm Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 ADMIN SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Brand & Badge */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm font-brand leading-none text-slate-900 dark:text-white">
                  Admin Portal
                </h1>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Stream Active
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Layers },
              { id: 'users_table', label: 'Registered Users & Gmail', icon: Users, badge: userRecords.length },
              { id: 'user_analytics', label: 'User Growth & DAU', icon: TrendingUp },
              { id: 'ai_usage', label: 'AI Usage & Synthesis', icon: Sparkles },
              { id: 'features', label: 'Feature Analytics', icon: Sliders },
              { id: 'tokens', label: 'Tokens & Limits', icon: Zap },
              { id: 'payments', label: 'Revenue & Razorpay', icon: CreditCard },
              { id: 'funnel', label: 'Conversion Funnel', icon: Activity },
              { id: 'system_health', label: 'System Health', icon: Server },
              { id: 'reviews', label: 'Reviews & Feedback', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'users_table' && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {userRecords.length}
                    </span>
                  )}
                  {tab.id === 'tokens' && tokenAnalytics.usersAtLimit.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                      {tokenAnalytics.usersAtLimit.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <button
            onClick={() => setShowManualGrantModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            Grant Pro Plan
          </button>

          <button
            onClick={handleAdminLock}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Admin Session
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 🚀 MAIN ADMIN DASHBOARD CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl overflow-y-auto">
        {/* Top Control Bar with Date Range Selector & CSV Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold font-brand text-slate-900 dark:text-white capitalize">
              {activeTab.replace('_', ' ')}
            </h2>
            <p className="text-xs text-slate-500">
              Live enterprise telemetry and verified revenue metrics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Global Date Range Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
              {[
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: '90d', label: '90D' },
                { id: 'this_month', label: 'This Month' },
                { id: 'this_year', label: 'This Year' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDatePreset(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    datePreset === p.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* CSV Export Dropdown */}
            <div className="relative group">
              <button className="px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-30 space-y-1 text-xs">
                <button
                  onClick={() => AnalyticsTrackingService.exportToCSV('users')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Export Users CSV
                </button>
                <button
                  onClick={() => AnalyticsTrackingService.exportToCSV('ai_usage')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Export AI Usage CSV
                </button>
                <button
                  onClick={() => AnalyticsTrackingService.exportToCSV('payments')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Export Payments CSV
                </button>
                <button
                  onClick={() => AnalyticsTrackingService.exportToCSV('activity')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Export Activity Log CSV
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshAllData}
              disabled={isLoading}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-between text-xs font-semibold">
            <span>{errorMsg}</span>
            <button onClick={refreshAllData} className="underline font-bold">
              Retry
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 11 Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Users */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.totalUsers.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{overview.totalUsers.percentageChange}% vs prev period</span>
                </div>
              </div>

              {/* Card 2: Active Users */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Users</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.activeUsers.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <span>DAU: {activeUsersStats.dau} • WAU: {activeUsersStats.wau}</span>
                </div>
              </div>

              {/* Card 3: AI Generations */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Generations</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.totalAIGenerations.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{overview.totalAIGenerations.percentageChange}% this period</span>
                </div>
              </div>

              {/* Card 4: Total Revenue */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  ₹{overview.totalRevenue.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                  <span>₹120 / Pro Subscriber</span>
                </div>
              </div>

              {/* Card 5: Conversion Rate */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Rate</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.conversionRate.value}%
                </div>
                <div className="text-[11px] text-slate-400">
                  {overview.paidUsers.value} Paid / {overview.totalUsers.value} Total
                </div>
              </div>

              {/* Card 6: Paid Users */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Subscribers</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-amber-600">
                  {overview.paidUsers.value}
                </div>
                <div className="text-[11px] text-slate-400">
                  Unlimited Token Tier
                </div>
              </div>

              {/* Card 7: Free Users */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Tier Users</span>
                  <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.freeUsers.value}
                </div>
                <div className="text-[11px] text-slate-400">
                  5 Quota / day
                </div>
              </div>

              {/* Card 8: Total Tokens Used */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tokens Consumed</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {overview.totalTokensUsed.value}
                </div>
                <div className="text-[11px] text-slate-400">
                  Avg {aiUsage.avgTokensPerUser} / user
                </div>
              </div>
            </div>

            {/* User Growth Chart Preview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">User Growth & Activity Stream</h3>
                  <p className="text-xs text-slate-400">Total registered vs active users over the selected time range</p>
                </div>
              </div>
              <DynamicLineChart
                data={userGrowth.map((dp) => ({
                  label: dp.formattedDate,
                  value: dp.totalUsers,
                  secondaryValue: dp.activeUsers,
                }))}
                primaryColor="#6366f1"
                secondaryColor="#10b981"
                primaryLegend="Total Users"
                secondaryLegend="Active Users"
              />
            </div>

            {/* Two Column Section: Live Activity Feed & System Health Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Activity Feed */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Live Activity Stream
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Recent Actions
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {recentActivity.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {evt.userName || evt.userEmail || evt.userId}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {evt.eventType.replace(/_/g, ' ')} {evt.feature ? `• ${evt.feature}` : ''}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health Monitor */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-500" />
                    Verified System Health
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                    ● All Operational
                  </span>
                </div>

                <div className="space-y-3">
                  {systemHealth.map((sh) => (
                    <div
                      key={sh.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {sh.name}
                        </div>
                        <p className="text-[11px] text-slate-400">{sh.details}</p>
                      </div>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        {sh.latencyMs}ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registered Users & Gmail Quick Directory Preview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Users & Gmail Accounts</h3>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
                        {userRecords.length} Total Users
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {gmailCount} Gmail
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Recently registered student profiles, emails, and account status</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('users_table')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>View All {userRecords.length} Users</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Registered Gmail / Email</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {userRecords.slice(0, 5).map((u) => {
                      const isGmail = u.email.toLowerCase().includes('@gmail.com');
                      return (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUserForModal(u)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{u.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-medium select-all">
                                {u.email}
                              </span>
                              {isGmail && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-bold border border-rose-500/20">
                                  Gmail
                                </span>
                              )}
                              <button
                                onClick={(e) => handleCopyEmail(u.email, e)}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Copy Email"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <a
                                href={`mailto:${u.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Send Email"
                              >
                                <Send className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.plan === 'premium'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              {u.plan === 'premium' ? 'PRO ⭐' : 'FREE'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold">
                            {u.plan === 'premium' ? '∞' : `${u.tokensRemaining} left`}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserForModal(u);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[10px] font-bold transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USER ANALYTICS & DAU/WAU/MAU */}
        {/* ========================================================================= */}
        {activeTab === 'user_analytics' && (
          <div className="space-y-6">
            {/* DAU / WAU / MAU Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DAU (Daily Active Users)</span>
                <div className="text-3xl font-bold font-brand text-indigo-600 dark:text-indigo-400">
                  {activeUsersStats.dau}
                </div>
                <p className="text-[11px] text-slate-400">Unique active user actions past 24 hours</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WAU (Weekly Active Users)</span>
                <div className="text-3xl font-bold font-brand text-emerald-600 dark:text-emerald-400">
                  {activeUsersStats.wau}
                </div>
                <p className="text-[11px] text-slate-400">Unique active user actions past 7 days</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">MAU (Monthly Active Users)</span>
                <div className="text-3xl font-bold font-brand text-sky-600 dark:text-sky-400">
                  {activeUsersStats.mau}
                </div>
                <p className="text-[11px] text-slate-400">Unique active user actions past 30 days</p>
              </div>
            </div>

            {/* Interactive Growth Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historical User Growth & Retention Curves
              </h3>
              <DynamicLineChart
                data={userGrowth.map((dp) => ({
                  label: dp.formattedDate,
                  value: dp.totalUsers,
                  secondaryValue: dp.returningUsers,
                }))}
                primaryColor="#6366f1"
                secondaryColor="#f59e0b"
                primaryLegend="Cumulative Users"
                secondaryLegend="Returning Users"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AI USAGE ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'ai_usage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total AI Requests</span>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">{aiUsage.totalRequests}</div>
                <span className="text-[11px] text-emerald-500 font-semibold">{aiUsage.successRate}% Success Rate</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Requests Today</span>
                <div className="text-2xl font-bold font-brand text-indigo-600">{aiUsage.requestsToday}</div>
                <span className="text-[11px] text-slate-400">{aiUsage.requestsThisWeek} This Week</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Gens / User</span>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">{aiUsage.avgGenerationsPerUser}</div>
                <span className="text-[11px] text-slate-400">Across active cohorts</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tokens</span>
                <div className="text-2xl font-bold font-brand text-purple-600">{aiUsage.totalTokensConsumed}</div>
                <span className="text-[11px] text-slate-400">Avg {aiUsage.avgTokensPerUser} / user</span>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Request Volume & Token Velocity</h3>
              <DynamicLineChart
                data={aiUsage.timeSeries.map((ts) => ({
                  label: ts.date,
                  value: ts.requests,
                  secondaryValue: ts.tokens,
                }))}
                primaryColor="#0ea5e9"
                secondaryColor="#8b5cf6"
                primaryLegend="AI Requests"
                secondaryLegend="Tokens Consumed"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FEATURE USAGE */}
        {/* ========================================================================= */}
        {activeTab === 'features' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Feature Adoption & Synthesis Share</h3>
              <p className="text-xs text-slate-400">Real usage events categorized across AI generators, drawing canvas, and tools</p>
            </div>
            <FeatureDistributionBars features={features} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TOKEN & CREDIT ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Credits Consumed</span>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">{tokenAnalytics.totalConsumed}</div>
                <span className="text-[11px] text-slate-400">{tokenAnalytics.consumedToday} today</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Credits / User</span>
                <div className="text-2xl font-bold font-brand text-indigo-600">{tokenAnalytics.avgCreditsPerUser}</div>
                <span className="text-[11px] text-slate-400">Out of 5 free quota</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Users At Limit</span>
                <div className="text-2xl font-bold font-brand text-rose-600">{tokenAnalytics.usersAtLimit.length}</div>
                <span className="text-[11px] text-rose-500 font-semibold">100% quota exhausted</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Users Near Limit</span>
                <div className="text-2xl font-bold font-brand text-amber-600">{tokenAnalytics.usersNearLimit.length}</div>
                <span className="text-[11px] text-amber-600 font-semibold">&gt;80% quota consumed</span>
              </div>
            </div>

            {/* Users at Limit Alert Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Upgrade Candidate Alerts (Quota Exhausted)
                </h3>
                <span className="text-xs text-slate-400">Prime candidates for Pro Scholar upgrade</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Used / Total</th>
                      <th className="py-3 px-4">Usage %</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {[...tokenAnalytics.usersAtLimit, ...tokenAnalytics.usersNearLimit].map((u) => (
                      <tr key={u.userId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.userName}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{u.userEmail}</td>
                        <td className="py-3 px-4 font-semibold">{u.tokensUsed} / {u.tokensTotal}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.percentageUsed >= 100
                                ? 'bg-rose-500/10 text-rose-600'
                                : 'bg-amber-500/10 text-amber-600'
                            }`}
                          >
                            {u.percentageUsed}% Exhausted
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setManualEmail(u.userEmail);
                              setManualName(u.userName);
                              setShowManualGrantModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 transition-colors"
                          >
                            Upgrade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PAYMENTS & REVENUE */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
                <div className="text-2xl font-bold font-brand text-slate-900 dark:text-white">₹{overview.totalRevenue.value}</div>
                <span className="text-[11px] text-emerald-500 font-semibold">100% Captured</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Successful Checkouts</span>
                <div className="text-2xl font-bold font-brand text-emerald-600">
                  {payments.filter((p) => p.status === 'captured').length}
                </div>
                <span className="text-[11px] text-slate-400">Razorpay Verified</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Failed / Abandoned</span>
                <div className="text-2xl font-bold font-brand text-rose-600">
                  {payments.filter((p) => p.status === 'failed').length}
                </div>
                <span className="text-[11px] text-slate-400">Declined cards / UPI</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Plan Price</span>
                <div className="text-2xl font-bold font-brand text-amber-600">₹{FIXED_PREMIUM_PRICE_INR}</div>
                <span className="text-[11px] text-slate-400">30-day Validity</span>
              </div>
            </div>

            {/* Payments Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Razorpay Verified Transaction Stream
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={paymentSearch}
                      onChange={(e) => setPaymentSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Statuses</option>
                    <option value="successful">Captured Only</option>
                    <option value="failed">Failed Only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Transaction / Razorpay ID</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          {p.razorpayPaymentId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{p.userName}</div>
                          <div className="text-[10px] text-slate-400">{p.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          ₹{p.amount || FIXED_PREMIUM_PRICE_INR}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'captured'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-rose-500/10 text-rose-600'
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{p.paymentMethod || 'UPI / Card'}</td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {p.paidAt ? new Date(p.paidAt).toLocaleString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CONVERSION FUNNEL */}
        {/* ========================================================================= */}
        {activeTab === 'funnel' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                9-Stage User Conversion Funnel
              </h3>
              <p className="text-xs text-slate-400">
                Identifies friction and user drop-off points from initial visit to active paid subscriber
              </p>
            </div>
            <FunnelBarChart stages={funnel} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: REGISTERED USERS & GMAIL DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'users_table' && (
          <div className="space-y-6">
            {/* Top Quick Stats Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
                <div className="text-2xl font-bold font-brand text-indigo-600 dark:text-indigo-400">{userRecords.length}</div>
                <span className="text-[11px] text-slate-400">Verified Database Profiles</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gmail Accounts (@gmail)</span>
                <div className="text-2xl font-bold font-brand text-rose-600 dark:text-rose-400">{gmailCount}</div>
                <span className="text-[11px] text-rose-500 font-semibold">Google Auth / Gmail</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pro Scholars</span>
                <div className="text-2xl font-bold font-brand text-amber-600">{proCount}</div>
                <span className="text-[11px] text-amber-500 font-semibold">Active Unlimited Plan</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Tier Starters</span>
                <div className="text-2xl font-bold font-brand text-slate-700 dark:text-slate-300">{freeCount}</div>
                <span className="text-[11px] text-slate-400">5 Daily AI Credits</span>
              </div>
            </div>

            {/* Users Directory Table Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Registered Users & Gmail Directory
                  </h3>
                  <p className="text-xs text-slate-400">Complete student roster with registered emails, Gmail badges, plan tiers, and usage telemetry</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, gmail..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                      }}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white w-48 sm:w-60"
                    />
                  </div>
                  <button
                    onClick={() => AnalyticsTrackingService.exportToCSV('users')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Filter Chips Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold text-[11px] mr-1">Filter:</span>
                {[
                  { id: 'all', label: `All Users (${userRecords.length})` },
                  { id: 'gmail', label: `Gmail Only (${gmailCount})`, icon: Mail },
                  { id: 'premium', label: `⭐ Pro Plan (${proCount})` },
                  { id: 'free', label: `Free Tier (${freeCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setUserPlanFilter(f.id as any);
                      setUserPage(1);
                    }}
                    className={`px-3 py-1 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                      userPlanFilter === f.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {f.icon && <f.icon className="w-3 h-3" />}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Registered Gmail / Email</th>
                      <th className="py-3 px-4">Plan Tier</th>
                      <th className="py-3 px-4">AI Generations</th>
                      <th className="py-3 px-4">Credits Remaining</th>
                      <th className="py-3 px-4">Total Revenue</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                          No registered users found matching your search or filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => {
                        const isGmail = u.email.toLowerCase().includes('@gmail.com');
                        return (
                          <tr
                            key={u.id}
                            onClick={() => setSelectedUserForModal(u)}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  {u.plan === 'premium' && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                  <span>{u.name}</span>
                                </div>
                                <span className="font-mono text-[10px] text-slate-400 font-normal">{u.id}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 font-medium select-all">
                                  {u.email}
                                </span>
                                {isGmail ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1">
                                    <Mail className="w-2.5 h-2.5 text-rose-500" />
                                    Gmail
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">
                                    {u.email.includes('@') ? u.email.split('@')[1] : 'Email'}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => handleCopyEmail(u.email, e)}
                                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                  title="Copy Email"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={`mailto:${u.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors"
                                  title="Send Email"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.plan === 'premium'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                {u.plan === 'premium' ? 'PRO ⭐' : 'FREE'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold">{u.aiGenerationsCount}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {u.plan === 'premium' ? '∞' : u.tokensRemaining}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              ₹{u.totalRevenueGenerated}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(u.lastActive).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserForModal(u);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-bold"
                                >
                                  Inspect
                                </button>
                                {u.plan !== 'premium' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setManualEmail(u.email);
                                      setManualName(u.name);
                                      setShowManualGrantModal(true);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition-colors text-[10px] font-bold border border-amber-500/20"
                                  >
                                    Grant Pro
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">
                  Showing {paginatedUsers.length} of {filteredUsers.length} users ({gmailCount} Gmail accounts)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {userPage} / {totalUserPages}
                  </span>
                  <button
                    disabled={userPage >= totalUserPages}
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: SYSTEM HEALTH */}
        {/* ========================================================================= */}
        {activeTab === 'system_health' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">System Health & Live Infrastructure</h3>
              <p className="text-xs text-slate-400">Automated latency and operational status verification across platform services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemHealth.map((sh) => (
                <div
                  key={sh.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{sh.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      OPERATIONAL
                    </span>
                  </div>
                  <p className="text-slate-500">{sh.details}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Response Latency:</span>
                    <span className="font-mono font-bold text-emerald-500">{sh.latencyMs} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 10: REVIEWS & FEEDBACK */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Reviews & Moderation Queue</h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{r.userName}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">({r.userEmail})</span>
                    </div>
                    <span className="text-amber-500 font-bold">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{r.title}</p>
                  <p className="text-slate-500 text-xs">{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
