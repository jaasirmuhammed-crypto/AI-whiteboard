import React from 'react';
import { Sparkles, PenTool, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

interface CTASectionProps {
  onStartWriting: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartWriting }) => {
  const { t } = useI18n();

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-indigo-700/50">
          
          {/* Ambient background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Ready for Next-Level Studying?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight">
              Start Converting Your Notes Today
            </h2>

            <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
              Join thousands of students and teachers transforming handwritten sketches into PowerPoint decks, quizzes, and mind maps in seconds.
            </p>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onStartWriting}
                className="px-8 py-4 rounded-2xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 group"
              >
                <PenTool className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span>Launch AI Whiteboard Now</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
