import React, { useState } from 'react';
import { Exam, Topic } from '../../types/competitive';
import { CompetitiveService } from '../../services/competitiveService';
import {
  Globe,
  Award,
  Clock,
  BookOpen,
  CheckCircle,
  FileQuestion,
  Bookmark,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface ExamDetailViewProps {
  exam: Exam;
  onBack: () => void;
  onSelectTopic: (topic: Topic) => void;
  onStartMCQ: () => void;
}

export const ExamDetailView: React.FC<ExamDetailViewProps> = ({
  exam,
  onBack,
  onSelectTopic,
  onStartMCQ,
}) => {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(() =>
    CompetitiveService.isBookmarked('exam', exam.id)
  );

  const handleToggleBookmark = () => {
    const active = CompetitiveService.toggleBookmark({
      type: 'exam',
      itemId: exam.id,
      title: exam.name,
      subtitle: `${exam.country} • ${exam.category}`,
    });
    setIsSaved(active);
    showToast(active ? 'Exam saved to bookmarks!' : 'Exam removed from bookmarks.', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Back & Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Competitive Exams Hub</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{exam.country}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-brand text-slate-900 dark:text-white mt-0.5">
              {exam.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            className={`p-2.5 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700/50'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-amber-500'
            }`}
            title="Bookmark Exam"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <button
            onClick={onStartMCQ}
            className="btn-interactive px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <FileQuestion className="w-4 h-4" /> Start MCQ Test
          </button>
        </div>
      </div>

      {/* Main Info Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            {exam.badge}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> {exam.country}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
            {exam.category}
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
          {exam.description}
        </p>

        {/* Quick Specs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Exam Duration</span>
              <span className="text-xs text-white font-medium">{exam.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Scoring Criteria</span>
              <span className="text-xs text-white font-medium">{exam.scoring}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Eligibility</span>
              <span className="text-xs text-white font-medium truncate max-w-[200px]" title={exam.eligibility}>
                {exam.eligibility}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Exam Subjects List */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" /> Official Exam Subjects Included:
          </h3>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {exam.subjects.length} Official Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exam.subjects.map((sub, idx) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
                  {sub.topics.length} Key Topics
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {sub.name}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Structure & Key Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Exam Structure & Stages
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {exam.structure}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Key Testing Sections
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {exam.sections.map((sec, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"
              >
                {sec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Important Topics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> High-Yield Study Topics & Syllabus Guides
          </h3>
          <span className="text-xs text-slate-500">Click any topic card to read structured AI guides</span>
        </div>

        {exam.subjects.map((sub) => (
          <div key={sub.id} className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Subject: {sub.name}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sub.topics.map((top) => (
                <div
                  key={top.id}
                  onClick={() => onSelectTopic(top)}
                  className="card-hover-effect p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {top.importantPoints.length} Key Concepts
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h5 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {top.name}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {top.overview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span>Quick Flash Notes & AI Diagram</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                      Explore Topic →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
