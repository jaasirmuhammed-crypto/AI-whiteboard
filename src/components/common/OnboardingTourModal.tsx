import React, { useState } from 'react';
import { 
  Sparkles, 
  School, 
  GraduationCap, 
  Target, 
  Lightbulb, 
  FileText, 
  Presentation, 
  BrainCircuit, 
  Network, 
  ArrowRight, 
  CheckCircle2, 
  Check,
  Zap,
  PenTool,
  Download
} from 'lucide-react';
import { Modal } from './Modal';

export type StudyCategory = 'school' | 'college' | 'competitive' | 'self_learning';
export type CreationType = 'notes' | 'ppt' | 'quiz' | 'mindmap';

export interface OnboardingPreferences {
  studyCategory: StudyCategory;
  creations: CreationType[];
}

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompletePreferences?: (prefs: OnboardingPreferences) => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onCompletePreferences,
}) => {
  const savedPrefs = localStorage.getItem('user_onboarding_preferences');
  const initialPrefs: OnboardingPreferences = savedPrefs
    ? JSON.parse(savedPrefs)
    : { studyCategory: 'college', creations: ['notes', 'ppt'] };

  const [step, setStep] = useState<'personalize' | 'features'>('personalize');
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory>(initialPrefs.studyCategory);
  const [selectedCreations, setSelectedCreations] = useState<CreationType[]>(initialPrefs.creations);
  const [featureTourStep, setFeatureTourStep] = useState(0);

  const STUDY_CATEGORIES: {
    id: StudyCategory;
    title: string;
    description: string;
    icon: any;
    badge: string;
    gradient: string;
  }[] = [
    {
      id: 'school',
      title: 'School',
      description: 'Grades 6–12, CBSE, ICSE, State Boards & Foundations',
      icon: School,
      badge: 'K-12 & Foundations',
      gradient: 'from-sky-500 to-blue-600',
    },
    {
      id: 'college',
      title: 'College',
      description: 'Engineering, Medical, Commerce, Sciences & Arts',
      icon: GraduationCap,
      badge: 'University & Degrees',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'competitive',
      title: 'Competitive Exams',
      description: 'GATE, NEET, JEE, UPSC, GRE, CAT, Bank PO & Government',
      icon: Target,
      badge: 'Rank Preparation',
      gradient: 'from-amber-500 to-rose-600',
    },
    {
      id: 'self_learning',
      title: 'Self Learning',
      description: 'Coding, Languages, Career Upskilling & Curiosity',
      icon: Lightbulb,
      badge: 'Skills & Growth',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const CREATION_TYPES: {
    id: CreationType;
    label: string;
    icon: any;
    description: string;
    color: string;
  }[] = [
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      description: 'Cornell format & lecture takeaways',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    {
      id: 'ppt',
      label: 'PPT',
      icon: Presentation,
      description: 'PowerPoint decks with speaker notes',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: BrainCircuit,
      description: 'High-yield practice MCQs & flashcards',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    },
    {
      id: 'mindmap',
      label: 'Mind Map',
      icon: Network,
      description: 'Radial concept diagrams & trees',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
  ];

  const toggleCreation = (id: CreationType) => {
    if (selectedCreations.includes(id)) {
      if (selectedCreations.length > 1) {
        setSelectedCreations(selectedCreations.filter((c) => c !== id));
      }
    } else {
      setSelectedCreations([...selectedCreations, id]);
    }
  };

  const handleCompletePersonalization = () => {
    const prefs: OnboardingPreferences = {
      studyCategory: selectedCategory,
      creations: selectedCreations,
    };
    localStorage.setItem('user_onboarding_preferences', JSON.stringify(prefs));
    localStorage.setItem('has_completed_onboarding', 'true');
    localStorage.setItem('has_seen_onboarding_tour', 'true');

    if (onCompletePreferences) {
      onCompletePreferences(prefs);
    }
    setStep('features');
  };

  const FEATURE_STEPS = [
    {
      title: '1. Sketch, Draw & Note Down',
      badge: 'Step 1: Canvas',
      description: 'Write formulas, sketch diagrams, or paste sticky notes. The 120 FPS canvas supports fingers, Apple Pencil, and stylus with real-time pressure smoothing.',
      icon: <PenTool className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: '2. Generate Instant Study Packages',
      badge: 'Step 2: AI Engine',
      description: 'Click "Stop & Process". Multimodal AI reads your handwriting, extracts concepts, and automatically builds your selected outputs (Notes, PPTs, Quizzes, Mind Maps).',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: '3. Export & Study Anywhere',
      badge: 'Step 3: Export',
      description: 'Download full PowerPoint presentations (.pptx), Markdown notes (.md), vector SVGs, and practice interactive quizzes directly on your phone or laptop.',
      icon: <Download className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  const handleFinishAll = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      {step === 'personalize' ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Personalized Setup</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-brand tracking-tight">
              Welcome to AI Whiteboard 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Tell us what you're working on so we can tailor your canvas templates, AI depth, and study tools.
            </p>
          </div>

          {/* Section 1: What are you studying? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>📚 What are you studying?</span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">(Pick one)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STUDY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center shrink-0 shadow-sm text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                          {cat.title}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug truncate">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: What do you want to create? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>✨ What do you want to create?</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(Select all that apply)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CREATION_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCreations.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCreation(item.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleCompletePersonalization}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Personalize My Whiteboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Interactive Micro-Tour */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              {FEATURE_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setFeatureTourStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === featureTourStep
                      ? 'w-8 bg-indigo-600'
                      : idx < featureTourStep
                      ? 'w-3 bg-indigo-400/60'
                      : 'w-3 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">
              {featureTourStep + 1} of {FEATURE_STEPS.length}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${FEATURE_STEPS[featureTourStep].color} flex items-center justify-center shadow-lg`}>
                {FEATURE_STEPS[featureTourStep].icon}
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {FEATURE_STEPS[featureTourStep].badge}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-brand">
                {FEATURE_STEPS[featureTourStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {FEATURE_STEPS[featureTourStep].description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep('personalize')}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors"
            >
              Back to Preferences
            </button>

            {featureTourStep < FEATURE_STEPS.length - 1 ? (
              <button
                onClick={() => setFeatureTourStep(featureTourStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Next Tip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishAll}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Start Drawing Now</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
