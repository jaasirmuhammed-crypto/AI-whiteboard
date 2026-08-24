import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ShieldAlert,
  HelpCircle,
  X,
  Compass
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Exam, ExamRegion } from '../../types/competitive';
import { CompetitiveService } from '../../services/competitiveService';

interface ExamSelectorModalProps {
  isOpen: boolean;
  selectedExamId: string | null;
  onClose: () => void;
  onSelectExam: (exam: Exam | null) => void;
}

const REGION_TABS: { id: string; label: string; icon: string }[] = [
  { id: 'All', label: 'All Regions', icon: '🌍' },
  { id: 'India', label: 'India', icon: '🇮🇳' },
  { id: 'USA', label: 'USA', icon: '🇺🇸' },
  { id: 'UK', label: 'UK', icon: '🇬🇧' },
  { id: 'Europe', label: 'Europe', icon: '🇪🇺' },
  { id: 'China', label: 'China', icon: '🇨🇳' },
  { id: 'Japan', label: 'Japan', icon: '🇯🇵' },
  { id: 'South Korea', label: 'South Korea', icon: '🇰🇷' },
  { id: 'Singapore', label: 'Singapore', icon: '🇸🇬' },
  { id: 'Australia', label: 'Australia', icon: '🇦🇺' },
  { id: 'Canada', label: 'Canada', icon: '🇨🇦' },
  { id: 'International', label: 'International Certs', icon: '🌐' },
];

export const ExamSelectorModal: React.FC<ExamSelectorModalProps> = ({
  isOpen,
  selectedExamId,
  onClose,
  onSelectExam,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(() => {
    return selectedExamId ? CompetitiveService.getExamById(selectedExamId) || null : null;
  });

  const allExams = useMemo(() => CompetitiveService.getExams(), []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allExams.filter((exam) => {
      const matchesRegion =
        activeRegion === 'All' ||
        exam.region?.toLowerCase() === activeRegion.toLowerCase() ||
        exam.country.toLowerCase() === activeRegion.toLowerCase();

      const matchesSearch =
        !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.category.toLowerCase().includes(q) ||
        exam.country.toLowerCase().includes(q) ||
        exam.badge.toLowerCase().includes(q) ||
        exam.sections.some((s) => s.toLowerCase().includes(q));

      return matchesRegion && matchesSearch;
    });
  }, [allExams, activeRegion, searchQuery]);

  const handleConfirm = () => {
    onSelectExam(selectedExam);
    onClose();
  };

  const handleResetToGeneral = () => {
    setSelectedExam(null);
    onSelectExam(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
                Select Target Competitive Exam
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Whiteboard will adapt slide depth, terminology, question patterns, and formulas specifically for this exam.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams by name, syllabus, country, or category (e.g., UPSC, JEE, SAT, MCAT, Gaokao, CFA)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {REGION_TABS.map((tab) => {
              const active = activeRegion === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRegion(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Grid: List & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[380px] max-h-[460px]">
          {/* Exam List (Left Column) */}
          <div className="md:col-span-6 overflow-y-auto pr-2 space-y-2.5 max-h-[440px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {/* General Mode Option */}
            <div
              onClick={() => setSelectedExam(null)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedExam === null
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      General Academic & University Deck
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Default Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    Standard high-level university lecture slides with clear definitions, diagrams, and textbook formulas.
                  </p>
                </div>
                {selectedExam === null && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                )}
              </div>
            </div>

            {/* Exam Items */}
            {filteredExams.map((exam) => {
              const isSelected = selectedExam?.id === exam.id;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {exam.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          {exam.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{exam.country}</span>
                        <span>•</span>
                        <span>{exam.category}</span>
                        {exam.difficultyTier && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {exam.difficultyTier}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {exam.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}

            {filteredExams.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-medium">No matching competitive exams found.</p>
                <p className="text-[11px] text-slate-500">Try changing your search keywords or region filter.</p>
              </div>
            )}
          </div>

          {/* Exam Profile Preview (Right Column) */}
          <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
            {selectedExam ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <Award className="w-4 h-4" />
                    <span>Target Exam Profile</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedExam.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{selectedExam.country}</span>
                    <span>|</span>
                    <span>{selectedExam.category}</span>
                    <span>|</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                      {selectedExam.difficultyTier || 'Competitive'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    AI Whiteboard Customization Directives:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {selectedExam.examFocusDirectives || selectedExam.description}
                  </p>
                </div>

                {selectedExam.questionStyles && selectedExam.questionStyles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Target Question Patterns:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExam.questionStyles.map((style, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Source Advisory Notice */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Official Source Advisory</span>
                  </div>
                  <p className="leading-relaxed">
                    Syllabi, exam patterns, and notifications change periodically. Always verify against the official exam conducting body.
                  </p>
                  {selectedExam.officialPortal && (
                    <a
                      href={selectedExam.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                    >
                      <span>Visit Official Portal ({new URL(selectedExam.officialPortal).hostname})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Standard Mode</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    General Academic & Lecture Deck
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Universal academic presentation without specific competitive exam constraints.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ideal for standard college courses, school revisions, and general academic learning. To specialize your slides for exams like UPSC, JEE, NEET, SAT, or MCAT, select an exam from the left list.
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>{selectedExam ? `Apply ${selectedExam.badge}` : 'Use General Deck'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
