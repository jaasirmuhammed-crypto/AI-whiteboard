import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  PenTool, 
  FileText, 
  HelpCircle, 
  Network,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProject } from '../../context/ProjectContext';

interface HeroSectionProps {
  onStartWriting: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartWriting }) => {
  const { t } = useI18n();
  const { setCurrentView } = useProject();

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 backdrop-blur-md shadow-xs animate-subtle-float">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {t.hero.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {t.hero.title}{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartWriting}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <PenTool className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span>{t.hero.startWriting}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base backdrop-blur-md transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                <span>{t.hero.howItWorks}</span>
              </a>
            </div>

            {/* Quick Metrics / Guarantees */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Latency Drawing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>PPTX, PDF & Mind Map</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>15 Languages Supported</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Live Whiteboard Preview Simulation */}
          <div className="lg:col-span-6 relative">
            
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />

            {/* Glass Container Mockup */}
            <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-5 backdrop-blur-xl animate-subtle-float">
              
              {/* Window Controls Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-semibold text-slate-400 ml-2">
                    AI Whiteboard Canvas (Live Preview)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  AI Active
                </div>
              </div>

              {/* Simulated Canvas Body */}
              <div className="relative mt-4 h-72 sm:h-80 rounded-2xl bg-amber-50/30 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 p-4 overflow-hidden select-none">
                
                {/* Ruled Grid Lines Simulation */}
                <div 
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px)',
                    backgroundSize: '100% 28px'
                  }}
                />

                {/* Handwritten Simulation Content */}
                <div className="relative z-10 space-y-3">
                  {/* Sticky Note */}
                  <div className="inline-block p-3 rounded-xl bg-amber-100/90 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 shadow-md transform -rotate-1 max-w-[260px]">
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-200 font-brand">
                      ⚡ {t.hero.demoNoteTitle}
                    </div>
                    <div className="text-[11px] font-handwriting text-amber-800 dark:text-amber-300 mt-1 leading-snug">
                      {t.hero.demoBullet1}
                    </div>
                  </div>

                  {/* Handwritten Diagram & Notes */}
                  <div className="pt-2 pl-4 border-l-2 border-indigo-400/80 space-y-2">
                    <p className="text-sm font-handwriting font-bold text-indigo-900 dark:text-indigo-200">
                      • {t.hero.demoBullet2}
                    </p>
                    <p className="text-sm font-handwriting font-bold text-purple-900 dark:text-purple-200">
                      • {t.hero.demoBullet3}
                    </p>
                  </div>

                  {/* SVG Hand-drawn arrow & cycle */}
                  <svg className="w-48 h-16 text-indigo-500 opacity-80" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M 20 40 Q 90 10 160 35" strokeDasharray="4 2" />
                    <polygon points="160,35 150,30 152,42" fill="currentColor" />
                    <text x="70" y="55" className="text-[10px] font-handwriting" fill="currentColor">ATP + NADPH Cycle</text>
                  </svg>
                </div>

                {/* Floating AI Output Badges */}
                <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-20">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-bounce duration-1000">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>PPT Generated (5 Slides)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>5 MCQs Ready</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <Network className="w-3.5 h-3.5 text-purple-500" />
                    <span>Interactive Mind Map</span>
                  </div>
                </div>
              </div>

              {/* Toolbar Simulation on Bottom */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 ring-2 ring-indigo-300" />
                  <span className="w-6 h-6 rounded-full bg-purple-500" />
                  <span className="w-6 h-6 rounded-full bg-emerald-500" />
                  <span className="w-6 h-6 rounded-full bg-amber-500" />
                </div>
                <button
                  onClick={onStartWriting}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  Try Canvas
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
