import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';

export type EmptyStateType = 'notebooks' | 'notes' | 'ppts' | 'quizzes' | 'mindmaps' | 'search';

interface EmptyStateProps {
  type: EmptyStateType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  searchQuery,
}) => {
  const renderIllustration = () => {
    switch (type) {
      case 'notebooks':
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-3xl rotate-6 transition-transform duration-300 group-hover:rotate-12" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 shadow-md flex flex-col items-center justify-center p-3">
              {/* Notebook lines */}
              <div className="w-full h-1.5 bg-indigo-500/30 rounded-full mb-1.5" />
              <div className="w-4/5 h-1.5 bg-indigo-500/20 rounded-full mb-1.5 self-start" />
              <div className="w-full h-1.5 bg-indigo-500/20 rounded-full mb-1.5" />
              <div className="w-2/3 h-1.5 bg-indigo-500/20 rounded-full self-start" />
              {/* Pen symbol */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-3xl -rotate-6" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-cyan-200 dark:border-cyan-800/80 shadow-md flex flex-col justify-between p-3.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-cyan-500/40" />
                <div className="h-1.5 w-10 bg-cyan-500/30 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-1.5 w-3/5 bg-cyan-500/40 rounded-full" />
              </div>
              <div className="h-2 w-2 rounded-full bg-cyan-500 self-end" />
            </div>
          </div>
        );

      case 'ppts':
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-3xl rotate-3" />
            <div className="relative w-24 h-20 bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 shadow-md p-3 flex flex-col justify-between">
              <div className="h-1.5 w-12 bg-indigo-600/40 rounded-full" />
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50" />
                <div className="h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50" />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <div className="h-1 w-6 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        );

      case 'quizzes':
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-3xl -rotate-3" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-md p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Q?</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-600" />
                  </div>
                  <div className="h-1.5 w-12 bg-emerald-500/40 rounded-full" />
                </div>
              </div>
              <div className="h-1.5 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </div>
        );

      case 'mindmaps':
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 rounded-3xl rotate-6" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-purple-200 dark:border-purple-800/80 shadow-md p-2.5 flex items-center justify-center">
              <svg className="w-16 h-16 text-purple-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="14" fill="#a855f7" className="text-purple-600 fill-current" />
                <line x1="50" y1="36" x2="30" y2="20" strokeWidth="3" strokeDasharray="3 3" />
                <circle cx="30" cy="20" r="8" fill="#c084fc" className="text-purple-400 fill-current" />
                <line x1="50" y1="36" x2="70" y2="20" strokeWidth="3" strokeDasharray="3 3" />
                <circle cx="70" cy="20" r="8" fill="#c084fc" className="text-purple-400 fill-current" />
                <line x1="50" y1="64" x2="50" y2="82" strokeWidth="3" strokeDasharray="3 3" />
                <circle cx="50" cy="82" r="8" fill="#c084fc" className="text-purple-400 fill-current" />
              </svg>
            </div>
          </div>
        );

      case 'search':
      default:
        return (
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-500/10 rounded-3xl" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="text-center py-12 sm:py-16 px-4 rounded-3xl border border-dashed border-slate-300/80 dark:border-slate-800 space-y-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
      {renderIllustration()}

      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-base font-bold text-slate-900 dark:text-white font-brand">
          {searchQuery ? `No results for "${searchQuery}"` : title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
