import React from 'react';
import { 
  Zap, 
  Crown, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Presentation, 
  HelpCircle, 
  Network,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UsageTokenBalanceCardProps {
  onOpenUpgradeModal: () => void;
}

export const UsageTokenBalanceCard: React.FC<UsageTokenBalanceCardProps> = ({ onOpenUpgradeModal }) => {
  const { user, isPremium } = useAuth();

  const totalQuota = isPremium ? 999999 : 5;
  const remainingTokens = user?.tokensRemaining !== undefined ? user.tokensRemaining : (isPremium ? 999999 : 5);
  const usedTokens = isPremium ? 0 : Math.max(0, 5 - remainingTokens);
  const usedPercent = isPremium ? 100 : Math.min(100, (remainingTokens / 5) * 100);

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Background Accent Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isPremium ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
          }`}>
            {isPremium ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              Usage & Token Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Generation Quotas & Rate Limits
            </p>
          </div>
        </div>

        {isPremium ? (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>UNLIMITED</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            Free Tier Quota
          </span>
        )}
      </div>

      {/* Token Gauge Balance Display */}
      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-extrabold font-brand text-slate-900 dark:text-white tracking-tight">
              {isPremium ? '∞' : remainingTokens}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
              {isPremium ? 'Generations Available' : `of ${totalQuota} Daily Tokens Remaining`}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isPremium ? 'No expiration' : 'Resets at midnight'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPremium
                ? 'w-full bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600'
                : usedPercent <= 20
                ? 'bg-rose-500'
                : usedPercent <= 40
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}
            style={{ width: `${isPremium ? 100 : Math.max(5, usedPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
          <span>Speed: {isPremium ? '⚡ Instant Priority Lane' : 'Standard Queue'}</span>
          <span>{isPremium ? 'Active Plan: Pro Scholar' : `${usedTokens} token used today`}</span>
        </div>
      </div>

      {/* Feature Breakdown Metrics */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Token Consumption Breakdown
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <Presentation className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">PPT Deck</p>
            <span className="text-[10px] text-slate-400">{isPremium ? 'Included' : '1 Token / Full Set'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <HelpCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">MCQ Quizzes</p>
            <span className="text-[10px] text-slate-400">{isPremium ? 'Included' : 'Bundled with AI'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <Network className="w-4 h-4 text-purple-500 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Mind Maps</p>
            <span className="text-[10px] text-slate-400">{isPremium ? 'Included' : 'Bundled with AI'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">OCR Synthesis</p>
            <span className="text-[10px] text-slate-400">{isPremium ? 'Unlimited' : 'Fast Pass'}</span>
          </div>
        </div>
      </div>

      {/* Upgrade Callout */}
      {!isPremium && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Need Unlimited AI Generation?</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Upgrade to Pro Scholar for only ₹120/month with zero rate limits & priority speed.
            </p>
          </div>

          <button
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Upgrade Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
