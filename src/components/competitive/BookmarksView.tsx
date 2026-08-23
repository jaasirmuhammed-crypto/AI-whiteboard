import React, { useState } from 'react';
import { Bookmark } from '../../types/competitive';
import { CompetitiveService } from '../../services/competitiveService';
import { Bookmark as BookmarkIcon, Trash2, ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { useToast } from '../common/Toast';

interface BookmarksViewProps {
  onBack: () => void;
  onSelectExam: (examId: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onBack, onSelectExam }) => {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => CompetitiveService.getBookmarks());

  const handleRemove = (b: Bookmark) => {
    CompetitiveService.toggleBookmark({ type: b.type, itemId: b.itemId, title: b.title, subtitle: b.subtitle });
    setBookmarks(CompetitiveService.getBookmarks());
    showToast('Bookmark removed.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-brand text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkIcon className="w-6 h-6 text-amber-500 fill-amber-500" /> Saved Bookmarks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your saved exams, topics, and practice items anytime.
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookmarkIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No saved bookmarks yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any exam or topic page to quickly save it for quick revision.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                  {b.type.toUpperCase()}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{b.title}</h4>
                <p className="text-xs text-slate-500">{b.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                {b.type === 'exam' && (
                  <button
                    onClick={() => onSelectExam(b.itemId)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Open Exam →
                  </button>
                )}
                <button
                  onClick={() => handleRemove(b)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
