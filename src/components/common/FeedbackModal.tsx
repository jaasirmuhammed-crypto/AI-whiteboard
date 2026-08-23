import React, { useState } from 'react';
import { Star, Send, Heart, Mail, CheckCircle2, MessageSquare, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { Modal } from './Modal';
import { CompetitiveService } from '../../services/competitiveService';
import { useToast } from './Toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { showToast } = useToast();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<{ isPositive: boolean; emailSent: boolean } | null>(null);

  const ADMIN_EMAIL = 'jaasirmuhammed@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Call CompetitiveService submitReview
    const { review, notifiedAdmin } = CompetitiveService.submitReview({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      rating,
      title: title.trim() || `${rating}-Star Student Feedback`,
      message: message.trim(),
    });

    setIsSubmitting(false);
    const isPositive = rating >= 4;
    setSubmittedStatus({ isPositive, emailSent: notifiedAdmin });

    if (isPositive) {
      showToast('🌟 Thank you! Your review has been published live on the website automatically.', 'success');
    } else {
      // Trigger mailto fallback so user can send email directly if client permits
      const mailSubject = encodeURIComponent(`[NEGATIVE FEEDBACK ${rating}/5] ${title || 'User Review'}`);
      const mailBody = encodeURIComponent(`Student Name: ${userName}\nEmail: ${userEmail}\nRating: ${rating}/5 Stars\nTitle: ${title}\n\nFeedback Message:\n${message}\n\n---\nSent from AI Whiteboard App`);
      const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

      // Open mail client silently
      try {
        window.open(mailtoUrl, '_blank');
      } catch (err) {
        console.log('Mailto dispatch initiated');
      }

      showToast(`📩 Thank you. Your feedback was sent directly to the Admin Support Team.`, 'info');
    }

    if (onSubmitted) onSubmitted();
  };

  const handleResetForm = () => {
    setSubmittedStatus(null);
    setUserName('');
    setUserEmail('');
    setRating(5);
    setTitle('');
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="relative">
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedStatus ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              {submittedStatus.isPositive ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Mail className="w-8 h-8 text-amber-500 animate-bounce" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
                {submittedStatus.isPositive ? 'Review Published Live!' : 'Private Mail Sent to Admin'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                {submittedStatus.isPositive ? (
                  <>Your <strong>{rating}-star review</strong> was automatically published to the website for all students to see.</>
                ) : (
                  <>Because your rating was <strong>{rating} stars</strong>, your feedback was routed as a <strong>private personal message directly to the Admin Support Team</strong> to improve our service.</>
                )}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleResetForm}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-1 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-1">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                Submit Student Feedback & Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Positive reviews (4–5 ★) update live on the site automatically. Constructive feedback (1–3 ★) sends a private message directly to Admin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Interactive Star Rating */}
              <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transform hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                  {rating >= 4 ? '🟢 4–5 Stars: Auto-publishes on website' : '📩 1–3 Stars: Dispatches private mail to Admin Inbox'}
                </span>
              </div>

              {/* User Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Muhammed Jaasir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Review Headline / Summary
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Amazing study tool for exam revision!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Feedback Message */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Feedback Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your feedback, feature request, or review comments..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Privacy note */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Admin Target: <strong className="text-slate-700 dark:text-slate-200">Admin Support Team (Direct Mail Enabled)</strong></span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{rating >= 4 ? 'Publish Review Live' : 'Send Private Mail to Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};
