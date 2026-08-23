import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Download, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MCQQuizData, MCQDifficulty } from '../../types/studyMaterial';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface MCQQuizViewerProps {
  quiz: MCQQuizData;
}

export const MCQQuizViewer: React.FC<MCQQuizViewerProps> = ({ quiz }) => {
  const { showToast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | MCQDifficulty>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const filteredQuestions = quiz.questions.filter((q) => {
    if (selectedDifficulty === 'all') return true;
    return q.difficulty === selectedDifficulty;
  });

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (userAnswers[questionId] !== undefined) return; // Answer locked
    const updated = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(updated);

    // Check if all answered
    if (Object.keys(updated).length === filteredQuestions.length) {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('Quiz complete! Fantastic active recall practice.', 'success');
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsCompleted(false);
    showToast('Quiz reset for fresh practice', 'info');
  };

  const handleExportPDF = () => {
    try {
      ExportService.exportQuizToPDF(quiz);
      showToast('MCQ Quiz PDF downloaded! 📄', 'success');
    } catch (e) {
      showToast('Failed to export PDF', 'error');
    }
  };

  // Calculate score
  const correctCount = filteredQuestions.filter(
    (q) => userAnswers[q.id] === q.correctAnswerIndex
  ).length;

  const scorePercentage = Math.round((correctCount / filteredQuestions.length) * 100) || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Difficulty Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-brand text-slate-900 dark:text-white">
              {quiz.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {filteredQuestions.length} Questions • Active Testing Mode
            </p>
          </div>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setSelectedDifficulty('all'); setUserAnswers({}); setIsCompleted(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedDifficulty === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => { setSelectedDifficulty('easy'); setUserAnswers({}); setIsCompleted(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedDifficulty === 'easy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Easy
            </button>
            <button
              onClick={() => { setSelectedDifficulty('medium'); setUserAnswers({}); setIsCompleted(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedDifficulty === 'medium' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Medium
            </button>
            <button
              onClick={() => { setSelectedDifficulty('hard'); setUserAnswers({}); setIsCompleted(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedDifficulty === 'hard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Hard
            </button>
          </div>

          <button
            onClick={handleResetQuiz}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Completion Score Card Banner (if all answered) */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border border-emerald-700/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in zoom-in-95">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shrink-0">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">Quiz Completed</span>
              <h4 className="text-2xl font-bold font-brand">
                Your Score: {scorePercentage}% ({correctCount}/{filteredQuestions.length} Correct)
              </h4>
              <p className="text-xs text-emerald-200">
                {scorePercentage >= 80 ? '🌟 Outstanding mastery of these whiteboard concepts!' : '💪 Great revision effort. Review the explanations below.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuiz}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-lg hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-xs space-y-4"
            >
              {/* Question Header & Difficulty Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase font-mono">
                  Question {idx + 1} • {q.conceptTag}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  q.difficulty === 'easy'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : q.difficulty === 'medium'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                }`}>
                  {q.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-brand">
                {q.question}
              </h4>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, optIdx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = q.correctAnswerIndex === optIdx;

                  let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isThisSelected && !isCorrect) {
                      cardStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                    } else {
                      cardStyle = 'border-slate-200 dark:border-slate-800 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${cardStyle}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {letters[optIdx]}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Rationale / Explanation Drawer (shows after answering) */}
              {isAnswered && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  isCorrect
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                }`}>
                  <span className="font-bold">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
