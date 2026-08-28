import React, { useState } from 'react';
import { UserAnalyticsRecord } from '../../types/analytics';
import {
  X,
  User,
  Mail,
  Calendar,
  Crown,
  Sparkles,
  Zap,
  Activity,
  CreditCard,
  CheckCircle,
  FileText,
  HelpCircle,
  Network,
  Download,
  AlertCircle,
  Copy,
  Check,
  Send,
  ExternalLink
} from 'lucide-react';

interface UserDetailModalProps {
  user: UserAnalyticsRecord | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const isPrem = user.plan === 'premium';
  const isGmail = user.email.toLowerCase().includes('@gmail.com');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isPrem
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isPrem ? '⭐ PRO SCHOLAR' : 'FREE STARTER'}
                </span>
                {isGmail && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-rose-500" />
                    Gmail
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-mono select-all">{user.email}</span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Copy Email"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`mailto:${user.email}`}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Send Email"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total AI Gens</span>
              <div className="text-xl font-bold font-brand text-slate-900 dark:text-white">
                {user.aiGenerationsCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tokens Used</span>
              <div className="text-xl font-bold font-brand text-indigo-600 dark:text-indigo-400">
                {user.tokensUsed}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Remaining</span>
              <div className="text-xl font-bold font-brand text-emerald-600 dark:text-emerald-400">
                {isPrem ? '∞' : user.tokensRemaining}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Revenue Paid</span>
              <div className="text-xl font-bold font-brand text-slate-900 dark:text-white">
                ₹{user.totalRevenueGenerated}
              </div>
            </div>
          </div>

          {/* Feature Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Feature Synthesis Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">PPT Decks</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.pptCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">MCQ Sets</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{user.mcqCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Mind Maps</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.mindmapCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Study Notes</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{user.studyNotesCount}</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Registration Date:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Active Timestamp:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <span
                className={`font-bold uppercase ${
                  user.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-slate-500'
                }`}
              >
                {user.paymentStatus}
              </span>
            </div>
          </div>

          {/* Chronological Event History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Chronological Activity Log
            </h4>
            {user.recentEvents.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No activity events recorded for this user yet.</p>
            ) : (
              <div className="space-y-2">
                {user.recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{evt.eventType}</span>
                      {evt.feature && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500">
                          {evt.feature}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
