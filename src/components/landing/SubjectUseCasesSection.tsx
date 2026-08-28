import React, { useState } from 'react';
import { 
  Sigma, 
  Zap, 
  FlaskConical, 
  Landmark, 
  Binary, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Presentation, 
  HelpCircle,
  Clock,
  Eye
} from 'lucide-react';

interface UseCase {
  id: string;
  subject: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
  roughInputTitle: string;
  roughInputPreview: string;
  roughInputTags: string[];
  transformedOutputTitle: string;
  transformedSlidesCount: number;
  transformedQuizCount: number;
  outputHighlights: string[];
  keyOutcome: string;
}

interface SubjectUseCasesSectionProps {
  onExploreOutput?: () => void;
}

export const SubjectUseCasesSection: React.FC<SubjectUseCasesSectionProps> = ({ onExploreOutput }) => {
  const [activeSubject, setActiveSubject] = useState<string>('math');

  const useCases: UseCase[] = [
    {
      id: 'math',
      subject: 'Mathematics & Calculus',
      icon: <Sigma className="w-5 h-5" />,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Calculus & Algebra',
      roughInputTitle: 'Messy Integration by Parts & Limit Sketch',
      roughInputPreview: '∫ u(x) v\'(x) dx = u(x)v(x) - ∫ u\'(x)v(x) dx\n+ quick doodle of curve y = e^(-x²)',
      roughInputTags: ['Handwritten LaTeX', 'Graph sketch', 'Rough algebra'],
      transformedOutputTitle: 'Formal Integration Masterclass & Cartesian Graph Deck',
      transformedSlidesCount: 6,
      transformedQuizCount: 5,
      outputHighlights: [
        'Rigorous step-by-step theorem statement & given boundary conditions',
        'Interactive 4-quadrant Cartesian curve analysis with inflection points',
        '5 High-yield competitive exam MCQs with detailed step rationales',
      ],
      keyOutcome: '90% faster presentation prep for professors & 4x clearer revision for students.',
    },
    {
      id: 'physics',
      subject: 'Physics & Classical Mechanics',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-amber-500 to-red-600',
      badge: 'Equilibrium & Dynamics',
      roughInputTitle: 'Inclined Plane Free-Body Diagram & Friction Vectors',
      roughInputPreview: 'Mass m on incline θ, arrows for N, mg sin θ, mg cos θ, friction f_k\nΣ F_x = m*a',
      roughInputTags: ['Vector arrows', 'Force equations', 'Hand-drawn angles'],
      transformedOutputTitle: 'Engineering Dynamics Deck & Equilibrium Proof Matrix',
      transformedSlidesCount: 7,
      transformedQuizCount: 6,
      outputHighlights: [
        'High-contrast vector diagram showing normal force, gravity components, and friction',
        'Derivation of critical slipping angle θ_c = arctan(μ_s)',
        'Exam trap breakdown & numerical problem solving shortcuts',
      ],
      keyOutcome: 'Turns whiteboard mechanical doodles into publication-grade lecture slides.',
    },
    {
      id: 'biology',
      subject: 'Biology & Medical Pathology',
      icon: <FlaskConical className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-700',
      badge: 'Cell Pathways & Clinical',
      roughInputTitle: 'Cellular Receptor Signaling Cascade & Drug Inhibition',
      roughInputPreview: 'GPCR receptor -> cAMP -> PKA activation -> Gene transcription\nRough arrow pointing to Beta-blocker antagonist',
      roughInputTags: ['Biochem pathway', 'Drug mechanism', 'Cell diagram'],
      transformedOutputTitle: 'Comprehensive Medical Pathology & Pharmacokinetics Deck',
      transformedSlidesCount: 8,
      transformedQuizCount: 8,
      outputHighlights: [
        'Signal transduction step breakdown from extracellular ligand to nuclear response',
        'Clinical differential diagnosis & pharmacology mechanism chart',
        'USMLE / NEET-PG high-yield flashcard questions with explanations',
      ],
      keyOutcome: 'Medical students synthesize entire pharmacology chapters in minutes.',
    },
    {
      id: 'history',
      subject: 'History, Polity & UPSC Civil Services',
      icon: <Landmark className="w-5 h-5" />,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Governance & Case Law',
      roughInputTitle: 'Article 21 & Landmark Supreme Court Rulings',
      roughInputPreview: 'Right to Life -> AK Gopalan (1950) vs Maneka Gandhi (1978) -> Puttaswamy (Privacy 2017)',
      roughInputTags: ['Timeline scribbles', 'Judicial precedents', 'Constitutional notes'],
      transformedOutputTitle: 'Constitutional Jurisprudence & Landmark Precedent Deck',
      transformedSlidesCount: 6,
      transformedQuizCount: 5,
      outputHighlights: [
        'Chronological cause-effect ladder illustrating the evolution of "Procedure Established by Law" vs "Due Process"',
        'Comparative matrix of landmark rulings with constitutional impact',
        'UPSC Mains answer-writing framework & analytical summary notes',
      ],
      keyOutcome: 'Aspirants transform revision notes into structured civil service answers.',
    },
    {
      id: 'cs',
      subject: 'Computer Science & Algorithms',
      icon: <Binary className="w-5 h-5" />,
      color: 'from-cyan-600 to-blue-700',
      badge: 'Data Structures & OOP',
      roughInputTitle: 'Binary Search Tree Balancing & Recursion Trace',
      roughInputPreview: 'Tree nodes (8 -> 3, 10), AVL rotation diagram\nO(log n) average vs O(n) worst case',
      roughInputTags: ['Tree nodes', 'Complexity big-O', 'Pseudocode doodle'],
      transformedOutputTitle: 'Algorithm Complexity Architecture & Clean Code Deck',
      transformedSlidesCount: 6,
      transformedQuizCount: 5,
      outputHighlights: [
        'Widescreen architectural flowchart of recursive BST insertion and rotation',
        'Time & Space complexity analysis table across Best, Average, and Worst cases',
        'Clean Python / C++ implementations with unit test edge case slides',
      ],
      keyOutcome: 'Software engineers & CS students prepare technical interview slides effortlessly.',
    },
  ];

  const currentCase = useCases.find((c) => c.id === activeSubject) || useCases[0];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800" aria-labelledby="use-cases-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Disciplinary Transformation Engine</span>
          </div>
          <h2 id="use-cases-title" className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            From Any Subject Doodle to Complete Masterclass
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            See real examples of how students and educators transform handwritten formulas, biology pathways, and historical timelines into publication-ready study decks.
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {useCases.map((uc) => {
            const isSelected = activeSubject === uc.id;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setActiveSubject(uc.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {uc.icon}
                <span>{uc.subject}</span>
              </button>
            );
          })}
        </div>

        {/* Before vs After Interactive Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Raw Handwritten Input */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold">
                  BEFORE: Whiteboard Scribble
                </span>
                <span className="text-xs text-slate-400 font-semibold">{currentCase.badge}</span>
              </div>

              <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
                {currentCase.roughInputTitle}
              </h3>

              {/* Simulated Whiteboard Canvas Box */}
              <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-slate-900/90 border border-amber-200/60 dark:border-slate-800 font-handwriting text-slate-800 dark:text-slate-200 text-lg leading-relaxed shadow-inner min-h-[160px] flex items-center justify-center text-center whitespace-pre-line">
                "{currentCase.roughInputPreview}"
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentCase.roughInputTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Drawn on canvas in ~30 seconds</span>
            </div>
          </div>

          {/* Right Column: AI Transformed Masterpiece */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 text-white shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AFTER: AI Masterclass Output
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                  <Presentation className="w-3.5 h-3.5" />
                  <span>{currentCase.transformedSlidesCount} Slides</span>
                  <span>•</span>
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{currentCase.transformedQuizCount} MCQs</span>
                </div>
              </div>

              <h3 className="text-xl font-bold font-brand text-white">
                {currentCase.transformedOutputTitle}
              </h3>

              {/* Highlights Checklist */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                {currentCase.outputHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                💡 <span className="font-bold">Impact:</span> {currentCase.keyOutcome}
              </div>
            </div>

            {onExploreOutput && (
              <button
                type="button"
                onClick={onExploreOutput}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Create a {currentCase.subject.split('&')[0]} Whiteboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
