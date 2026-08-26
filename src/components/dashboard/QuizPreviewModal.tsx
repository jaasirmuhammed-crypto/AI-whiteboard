import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Download, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MCQQuizData } from '../../types/studyMaterial';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';
import { useProject } from '../../context/ProjectContext';

interface QuizPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: MCQQuizData | null;
}

export const QuizPreviewModal: React.FC<QuizPreviewModalProps> = ({ isOpen, onClose, quiz }) => {
  const { setCurrentView, setActiveStudyMaterials, currentProject } = useProject();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const currentQ = quiz.questions[currentIndex] || quiz.questions[0];
  const totalQuestions = quiz.questions.length;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const selectedOpt = selectedAnswers[currentIndex];
  const isCorrect = selectedOpt === currentQ.correctAnswerIndex;

  const score = Object.entries(selectedAnswers).reduce((acc, [idxStr, choice]) => {
    const idx = parseInt(idxStr);
    return acc + (quiz.questions[idx]?.correctAnswerIndex === choice ? 1 : 0);
  }, 0);

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    showToast('Quiz reset! Try again.', 'info');
  };

  const handleDownloadPDF = () => {
    ExportService.exportQuizToPDF(quiz);
    showToast('Printable Quiz exported to PDF! 📑', 'success');
  };

  const handleOpenStudyHub = () => {
    if (currentProject?.studyMaterials) {
      setActiveStudyMaterials(currentProject.studyMaterials);
    }
    setCurrentView('study_hub');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-brand truncate max-w-md">
                {quiz.title || `MCQ Practice: ${quiz.topic}`}
              </h2>
              <p className="text-xs text-slate-400">
                Question {currentIndex + 1} of {totalQuestions} • Difficulty: {currentQ.difficulty || 'Medium'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Reset Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress & Score Bar */}
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Progress:</span>
            <div className="flex items-center gap-1">
              {quiz.questions.map((_, i) => {
                const answered = selectedAnswers[i] !== undefined;
                const right = selectedAnswers[i] === quiz.questions[i].correctAnswerIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      currentIndex === i
                        ? 'ring-2 ring-indigo-500 scale-110'
                        : ''
                    } ${
                      !answered
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        : right
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>Score: {score}/{Object.keys(selectedAnswers).length}</span>
          </div>
        </div>

        {/* Question Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {currentIndex + 1}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const letters = ['A', 'B', 'C', 'D'];
              const isPicked = selectedOpt === optIdx;
              const isCorrectOpt = currentQ.correctAnswerIndex === optIdx;

              let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                } else if (isPicked) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20';
                } else {
                  btnStyle = 'opacity-50 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {letters[optIdx]}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isPicked && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation[currentIndex] && (
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1 animate-in fade-in">
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Rationale & Solution:</span>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Controllers */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleOpenStudyHub}
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Study Materials Hub</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
