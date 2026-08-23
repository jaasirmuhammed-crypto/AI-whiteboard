import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CompetitiveService, UserReview } from '../../services/competitiveService';
import { FeedbackModal } from '../common/FeedbackModal';

export const LiveStudentReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<UserReview[]>(() => 
    CompetitiveService.getReviews().filter((r) => r.status === 'approved' && r.rating >= 4)
  );

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleReviewSubmitted = () => {
    // Refresh published live reviews
    const updated = CompetitiveService.getReviews().filter((r) => r.status === 'approved' && r.rating >= 4);
    setReviews(updated);
  };

  return (
    <section className="relative py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Live Student Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
              Student Reviews & Community Ratings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Positive reviews (4–5 ★) update live on the website automatically. Constructive feedback (1–3 ★) is privately sent via personal email directly to the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Admin Support Team</span>.
            </p>
          </div>

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="btn-interactive px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Give Feedback / Submit Review</span>
          </button>
        </div>

        {/* Reviews Display Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rev.rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Verified Live
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-brand">
                    {rev.title || 'Student Review'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.message}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {rev.userName}
                  </span>
                  <span className="text-[11px] font-mono">
                    {rev.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              Be the First to Submit a Live Student Review!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Submit your review above. 4–5 star reviews will automatically appear right here on the website!
            </p>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition-colors mt-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write First Review</span>
            </button>
          </div>
        )}

        {/* Feedback Submission Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmitted={handleReviewSubmitted}
        />
      </div>
    </section>
  );
};
