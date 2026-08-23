import React, { useState } from 'react';
import { Presentation, HelpCircle, Network, Check, Sparkles, ArrowRight, Download } from 'lucide-react';
import { useI18n } from '../../i18n';

interface OutputsShowcaseProps {
  onExploreOutput: (type: 'ppt' | 'mcq' | 'mindmap') => void;
}

export const OutputsShowcase: React.FC<OutputsShowcaseProps> = ({ onExploreOutput }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'ppt' | 'mcq' | 'mindmap'>('ppt');

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Automated Generation Suite
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            {t.outputs.title}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {t.outputs.subtitle}
          </p>

          {/* Interactive Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('ppt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ppt'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Presentation className="w-4 h-4" />
              PowerPoint
            </button>
            <button
              onClick={() => setActiveTab('mcq')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'mcq'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              MCQ Quiz
            </button>
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'mindmap'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" />
              Mind Map
            </button>
          </div>
        </div>

        {/* Dynamic Showcase Card Display */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          {activeTab === 'ppt' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  <Presentation className="w-4 h-4" />
                  Presentation Deck
                </div>
                <h3 className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {t.outputs.pptTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.outputs.pptDesc} Converts handwritten notes, chemical formulas, and diagrams into clean, professional, downloadable .pptx presentations with custom themes.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Title, Concept, and Split-column layouts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Formatted speaker notes for revision</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Native Microsoft PowerPoint (.pptx) export</li>
                </ul>
                <button
                  onClick={() => onExploreOutput('ppt')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.outputs.generatePPT}
                </button>
              </div>

              {/* PPT Preview Box */}
              <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 shadow-xl border border-indigo-700/40 aspect-video flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
                  <span className="text-xs font-bold tracking-wider text-indigo-300 uppercase">Slide 1 of 5</span>
                  <span className="text-[10px] text-slate-400">Theme: Modern Bio</span>
                </div>
                <div className="space-y-2 my-auto">
                  <h4 className="text-2xl sm:text-3xl font-extrabold font-brand text-white">
                    Photosynthesis & Solar Energy
                  </h4>
                  <p className="text-xs sm:text-sm text-indigo-200">
                    Comprehensive Study & Conceptual Breakdown
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-indigo-300/80 border-t border-indigo-800/80 pt-3">
                  <span>AI Whiteboard Generated Deck</span>
                  <span className="font-semibold text-white">Built by SAFA Developers</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mcq' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <HelpCircle className="w-4 h-4" />
                  Active Retention Quiz
                </div>
                <h3 className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {t.outputs.mcqTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.outputs.mcqDesc} Multimodal AI extracts testable facts from your whiteboard and creates calibrated questions with instant grading and clear scientific rationales.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Easy, Medium, and Hard difficulty filters</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant verification with detailed feedback</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Printable PDF & worksheet export</li>
                </ul>
                <button
                  onClick={() => onExploreOutput('mcq')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.outputs.generateMCQ}
                </button>
              </div>

              {/* MCQ Preview Box */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-inner space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Question 1 of 5</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                    Medium Difficulty
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Where do the light-dependent reactions of photosynthesis take place?
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>A) Inside the stroma matrix</span>
                  </div>
                  <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                    <span>B) In the thylakoid membranes & lumen</span>
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <span>C) In outer mitochondrial membrane</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold">
                  <Network className="w-4 h-4" />
                  Visual Ontology
                </div>
                <h3 className="text-2xl font-bold font-brand text-slate-900 dark:text-white">
                  {t.outputs.mindMapTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.outputs.mindMapDesc} Understand high-level relationships with an interactive, zoomable, draggable node network that makes complex topics effortless to review.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Multi-tiered hierarchical branching</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Interactive dragging, panning, and zoom controls</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> High-res SVG and image downloads</li>
                </ul>
                <button
                  onClick={() => onExploreOutput('mindmap')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.outputs.generateMindMap}
                </button>
              </div>

              {/* Mind Map Simulation Graphic */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex items-center justify-center min-h-[260px] relative overflow-hidden">
                <div className="text-center space-y-3 z-10">
                  <div className="inline-block px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-lg">
                    ⚡ Photosynthesis
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="px-3 py-1.5 rounded-xl bg-cyan-600/80 text-white text-[11px] font-semibold">
                      Light Phase
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-600/80 text-white text-[11px] font-semibold">
                      Calvin Cycle
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-amber-600/80 text-white text-[11px] font-semibold">
                      Structures
                    </div>
                  </div>
                </div>
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full text-indigo-500/40 pointer-events-none" viewBox="0 0 400 200">
                  <path d="M 200 80 L 100 130" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M 200 80 L 200 130" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M 200 80 L 300 130" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
