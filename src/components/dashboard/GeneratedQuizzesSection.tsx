import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Play, 
  Download, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  Flame,
  FileDown
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';
import { MCQQuizData } from '../../types/studyMaterial';
import { useProject } from '../../context/ProjectContext';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface GeneratedQuizzesSectionProps {
  onTakeQuiz: (quiz: MCQQuizData) => void;
  onOpenCreateModal: () => void;
}

export const GeneratedQuizzesSection: React.FC<GeneratedQuizzesSectionProps> = ({ 
  onTakeQuiz,
  onOpenCreateModal
}) => {
  const { projects, setCurrentView, setActiveStudyMaterials } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const quizProjects = projects.filter((p) => {
    if (!p.studyMaterials?.quiz) return false;
    const qz = p.studyMaterials.quiz;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qz.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qz.topic || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedDifficulty !== 'all') {
      return qz.questions.some(q => q.difficulty?.toLowerCase() === selectedDifficulty);
    }
    return true;
  });

  const totalQuestionsAcrossAll = projects.reduce((acc, p) => acc + (p.studyMaterials?.quiz?.questions?.length || 0), 0);

  const handleDownloadPDF = (quiz: MCQQuizData, e: React.MouseEvent) => {
    e.stopPropagation();
    ExportService.exportQuizToPDF(quiz);
    showToast('Printable Quiz exported to PDF! 📑', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes & question topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md shadow-xs"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      {quizProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizProjects.map((project) => {
            const quiz = project.studyMaterials?.quiz!;
            const totalQ = quiz.questions?.length || 0;
            const hardCount = quiz.questions.filter(q => q.difficulty === 'hard').length;
            const targetExam = project.studyMaterials?.examContext;

            return (
              <div
                key={project.id}
                onClick={() => onTakeQuiz(quiz)}
                className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand truncate max-w-[180px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {quiz.title || project.title}
                      </h4>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold shrink-0">
                      {totalQ} MCQs
                    </span>
                  </div>

                  {/* Target Exam Context (if present) */}
                  {targetExam && (
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                      <span>🎯 Targeted for <strong>{targetExam.name}</strong></span>
                    </div>
                  )}

                  {/* Sample Question Preview */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sample Question</span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2 italic">
                      "{quiz.questions[0]?.question || 'High yield test questions'}"
                    </p>
                  </div>

                  {/* Difficulty Breakdown */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {hardCount > 0 ? `${hardCount} Hard Questions` : 'Balanced Difficulty'}
                    </span>
                    <span>•</span>
                    <span>100% Verified Solutions</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleDownloadPDF(quiz, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      title="Download Printable PDF"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onTakeQuiz(quiz)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Take Quiz</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4 bg-white/40 dark:bg-slate-900/40">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              No Generated Quizzes Found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run the AI Suite from any whiteboard to generate instant interactive MCQ practice quizzes.
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Create Whiteboard</span>
          </button>
        </div>
      )}

    </div>
  );
};
