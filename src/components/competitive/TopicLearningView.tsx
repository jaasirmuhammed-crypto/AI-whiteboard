import React, { useState } from 'react';
import { Topic, Exam } from '../../types/competitive';
import { AIDiagramRenderer } from './AIDiagramRenderer';
import { CompetitiveService } from '../../services/competitiveService';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Bookmark,
  Share2,
  Sparkles,
  ArrowLeft,
  FileQuestion,
  Layers,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface TopicLearningViewProps {
  topic: Topic;
  exam: Exam;
  onBack: () => void;
  onTakeMCQ: (topicId: string) => void;
}

export const TopicLearningView: React.FC<TopicLearningViewProps> = ({
  topic,
  exam,
  onBack,
  onTakeMCQ,
}) => {
  const { showToast } = useToast();
  const [showDiagram, setShowDiagram] = useState(false);
  const [isSaved, setIsSaved] = useState(() =>
    CompetitiveService.isBookmarked('topic', topic.id)
  );

  const handleToggleBookmark = () => {
    const active = CompetitiveService.toggleBookmark({
      type: 'topic',
      itemId: topic.id,
      title: topic.name,
      subtitle: `${exam.name} • ${topic.importantPoints.length} Key Concepts`,
    });
    setIsSaved(active);
    showToast(active ? 'Topic saved to bookmarks!' : 'Topic removed from bookmarks.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Back to Exam Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{exam.name}</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{exam.country}</span>
            </div>
            <h1 className="text-2xl font-bold font-brand text-slate-900 dark:text-white mt-0.5">
              {topic.name}
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowDiagram(!showDiagram)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showDiagram
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            {showDiagram ? 'Hide AI Diagram' : 'View AI Diagram'}
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`p-2.5 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700/50'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-amber-500'
            }`}
            title="Bookmark Topic"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onTakeMCQ(topic.id)}
            className="btn-interactive flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25"
          >
            <FileQuestion className="w-4 h-4" />
            Take MCQ Test
          </button>
        </div>
      </div>

      {/* Interactive AI Diagram View (Toggleable) */}
      {showDiagram && (
        <div className="animate-in zoom-in-95 duration-300">
          <AIDiagramRenderer topic={topic} />
        </div>
      )}

      {/* Main Topic Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide on desktop): Core Topic Knowledge */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Topic Overview
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {topic.overview}
            </p>
          </div>

          {/* Card 2: Key Definitions */}
          {topic.definitions && topic.definitions.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Essential Definitions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {topic.definitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {def.term}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {def.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 3: Important Points & Concepts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Important Points & High-Yield Concepts
            </h3>
            <ul className="space-y-3">
              {topic.importantPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Formulas & Mathematical Rules (If applicable) */}
          {topic.formulas && topic.formulas.length > 0 && (
            <div className="p-6 rounded-3xl bg-indigo-950/20 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Formulas & Governing Laws
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {topic.formulas.map((form, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{form.name}</span>
                    </div>
                    <code className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-300 block py-1">
                      {form.formula}
                    </code>
                    {form.explanation && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{form.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tips, Common Mistakes, and Quick Revision */}
        <div className="space-y-6">
          
          {/* Card 5: Common Mistakes */}
          <div className="p-6 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Common Exam Mistakes
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {topic.commonMistakes.map((err, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{err}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 6: Exam Tips & Hacks */}
          <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Exam Strategy Tips
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              {topic.examTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 7: Quick Revision Flash Notes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Quick Revision Flash Points
            </h3>
            <div className="space-y-2">
              {topic.quickRevision.map((rev, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 font-medium border border-slate-100 dark:border-slate-800"
                >
                  ⚡ {rev}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl space-y-4">
            <h4 className="font-bold text-base">Ready to test your knowledge?</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Take an instant 5-question practice test tailored specifically for {topic.name}.
            </p>
            <button
              onClick={() => onTakeMCQ(topic.id)}
              className="w-full py-3 rounded-2xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors"
            >
              Start MCQ Practice Test →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
