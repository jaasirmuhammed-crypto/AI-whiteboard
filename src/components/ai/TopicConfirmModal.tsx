import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Lightbulb, Compass, Award, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';
import { TopicSearchGuideCard } from '../common/TopicSearchGuideCard';
import { ExamSelectorModal } from '../competitive/ExamSelectorModal';
import { Exam } from '../../types/competitive';
import { CompetitiveService } from '../../services/competitiveService';

interface TopicConfirmModalProps {
  isOpen: boolean;
  initialTopic: string;
  initialExamId?: string | null;
  onClose: () => void;
  onConfirm: (topic: string, targetExam?: Exam | null) => void;
}

export const TopicConfirmModal: React.FC<TopicConfirmModalProps> = ({
  isOpen,
  initialTopic,
  initialExamId,
  onClose,
  onConfirm,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [showGuide, setShowGuide] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [targetExam, setTargetExam] = useState<Exam | null>(() => {
    return initialExamId ? CompetitiveService.getExamById(initialExamId) || null : null;
  });

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (initialExamId) {
      setTargetExam(CompetitiveService.getExamById(initialExamId) || null);
    }
  }, [initialExamId]);

  const quickPicks = [
    { label: '🪐 Solar System & Planets', val: 'The Solar System & Planetary Science' },
    { label: '🩸 Blood Disorders & Pathology', val: 'Blood Problems & Hematology' },
    { label: '⚡ Physics & Mechanics', val: 'Newtonian Physics & Classical Mechanics' },
    { label: '📐 Calculus & Integrals', val: 'Calculus Integrals & Derivatives' },
    { label: '💻 Computer Science', val: 'Data Structures & Algorithms' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onConfirm(topic.trim(), targetExam);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
              Confirm Study Material Topic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI will synthesize unique presentation slides, practice quiz, and interactive mind map.
            </p>
          </div>

          {/* Target Exam Selection Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Exam Focus
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {targetExam ? `${targetExam.name} (${targetExam.badge})` : 'General Academic & University Deck'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExamModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <span>{targetExam ? 'Change Exam' : 'Select Target Exam'}</span>
            </button>
          </div>

          {/* Toggleable Search Guide Card */}
          {showGuide ? (
            <TopicSearchGuideCard 
              onClose={() => setShowGuide(false)}
              onSelectTopic={(selected) => {
                setTopic(selected);
                setShowGuide(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>💡 Need help? View "How to Search Any Topic" Guide Card</span>
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Open Guide ➔</span>
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Main Topic / Subject</span>
                <span className="text-[10px] text-indigo-500 font-medium">Editable</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Solar System, Blood Problems, Calculus..."
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>

            {/* Quick Subject Suggestion Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Suggestions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPicks.map((pick, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(pick.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      topic.toLowerCase().includes(pick.val.toLowerCase().split(' ')[0])
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate Study Materials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Target Exam Selection Modal */}
      <ExamSelectorModal
        isOpen={examModalOpen}
        selectedExamId={targetExam?.id || null}
        onClose={() => setExamModalOpen(false)}
        onSelectExam={(selected) => setTargetExam(selected)}
      />
    </>
  );
};

