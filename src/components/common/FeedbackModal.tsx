import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Modal } from './Modal';
import { useToast } from './Toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle?: string;
  onSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  onSubmitted,
}) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(true);
  const [feedbackCategory, setFeedbackCategory] = useState<'accuracy' | 'formatting' | 'diagrams' | 'speed' | 'other'>('accuracy');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Thank you! Your feedback helps calibrate the AI model. 🚀', 'success');
    onSubmitted?.();
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
            Rate AI Study Material Quality
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For: <span className="font-semibold text-slate-700 dark:text-slate-300">{topicTitle || 'Current Generation'}</span>
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Feedback Submitted!</div>
            <p className="text-xs text-slate-500">We appreciate your contribution to model quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Thumbs Up / Down */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsHelpful(true)}
                className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  isHelpful === true
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful Output</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHelpful(false)}
                className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  isHelpful === false
                    ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Needs Improvement</span>
              </button>
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Feedback Category</label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              >
                <option value="accuracy">Concept & Mathematical Accuracy</option>
                <option value="formatting">Slide Layout & Typography</option>
                <option value="diagrams">Handwriting & Diagram Recognition</option>
                <option value="speed">Generation Latency / Speed</option>
                <option value="other">General Suggestion</option>
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Comments</label>
              <textarea
                rows={3}
                placeholder="Share any specifics or features you would like added..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </Modal>
  );
};
