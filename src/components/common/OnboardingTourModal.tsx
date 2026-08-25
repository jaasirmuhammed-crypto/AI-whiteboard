import React, { useState } from 'react';
import { 
  Sparkles, 
  PenTool, 
  StickyNote, 
  Presentation, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Layers,
  LayoutTemplate
} from 'lucide-react';
import { Modal } from './Modal';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bulletPoints: string[];
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: 'Welcome to AI Whiteboard',
      badge: 'Getting Started',
      description: 'The multimodal AI workspace that transforms handwritten diagrams, equations, and lecture notes into executive slide decks, practice quizzes, and mind maps in seconds.',
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-600 to-purple-600',
      bulletPoints: [
        '120 FPS high-refresh rate canvas engine',
        'Support for stylus, Apple Pencil, and touch',
        'Zero registration required to begin sketching',
      ],
    },
    {
      title: 'Drawing, Pens & Interactive Notes',
      badge: 'Step 1: Write Naturally',
      description: 'Choose from 10 calibrated pens and pencils. Place draggable sticky notes and type text annotations anywhere on the board.',
      icon: <PenTool className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-600 to-blue-600',
      bulletPoints: [
        '📌 Sticky Notes: Click anywhere to place, drag to move & edit',
        '🔤 Text Tool: Click to type anywhere with custom font styling',
        '📐 Smart Shapes: Auto-converts hand-drawn sketches to geometry',
      ],
    },
    {
      title: 'One-Tap AI Synthesis Pipeline',
      badge: 'Step 2: Generate',
      description: 'When your sketch is ready, click "Generate Study Materials". Multimodal AI reads your handwriting, extracts formulas, and crafts interactive study materials.',
      icon: <Presentation className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-600 to-pink-600',
      bulletPoints: [
        '📊 Full PowerPoint Decks (.pptx) with presenter notes',
        '📝 High-Yield Practice Quizzes with answer keys & rationale',
        '🧠 Radial Concept Mind Maps with infinite zoom',
      ],
    },
    {
      title: 'Exports & Notebook Templates',
      badge: 'Step 3: Study Anywhere',
      description: 'Export to PowerPoint, Word DOCX, PDF, Markdown, or SVG. Load pre-drawn Cornell Notes, Q&A grids, and STEM matrices with 1 tap.',
      icon: <Download className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-600',
      bulletPoints: [
        '📄 Microsoft Word (.docx) & Markdown (.md) exports',
        '📑 Pre-drawn Cornell Notes and Exam Revision grids',
        '👑 Lifetime Unlimited Generation with ₹120 Fixed Premium',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('has_seen_onboarding_tour', 'true');
      onClose();
    }
  };

  const current = steps[currentStep];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-6">
        
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-8 bg-indigo-600'
                    : idx < currentStep
                    ? 'w-3 bg-indigo-400/60'
                    : 'w-3 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Hero Visual Card */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center shadow-lg`}>
              {current.icon}
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {current.badge}
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-brand">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-200/60 dark:border-slate-800">
            {current.bulletPoints.map((pt, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              localStorage.setItem('has_seen_onboarding_tour', 'true');
              onClose();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Skip Tutorial
          </button>

          <button
            onClick={handleNext}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all group"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Whiteboard 🚀' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
