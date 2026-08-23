import React, { useState } from 'react';
import { 
  Lightbulb, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  Activity, 
  Cpu, 
  ArrowRight,
  X,
  BookOpen
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface TopicSearchGuideCardProps {
  onSelectTopic?: (topic: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

export const TopicSearchGuideCard: React.FC<TopicSearchGuideCardProps> = ({ 
  onSelectTopic, 
  onClose,
  compact = false 
}) => {
  const { updateProjectTitle } = useProject();
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);

  const sampleTopics = [
    { title: 'The Solar System & Planets', icon: '🪐', category: 'Astronomy' },
    { title: 'Blood Problems & Hematology', icon: '🩸', category: 'Medicine' },
    { title: 'Calculus Integrals & Derivatives', icon: '📐', category: 'Math' },
    { title: 'Python Programming & OOP', icon: '🐍', category: 'CS' },
    { title: 'Indian Constitution & Rights', icon: '⚖️', category: 'Polity' },
    { title: 'Photosynthesis & Plant Biology', icon: '🌿', category: 'Biology' },
    { title: 'Database Systems & SQL', icon: '💾', category: 'Tech' },
  ];

  const handlePickTopic = (topic: string) => {
    updateProjectTitle(topic);
    setCopiedTopic(topic);
    if (onSelectTopic) onSelectTopic(topic);
    setTimeout(() => setCopiedTopic(null), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-4 sm:p-6 shadow-2xl border border-indigo-500/40 backdrop-blur-xl animate-in fade-in zoom-in duration-300 w-full">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 space-y-4">
        
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold font-brand tracking-tight text-white">
                  How to Search About Any Topic
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/30">
                  Search Guide
                </span>
              </div>
              <p className="text-xs text-indigo-200 leading-normal mt-0.5">
                Learn how to search for any exam or subject to generate textbook-grade study packages.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3-Step Guided Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/50 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/30 text-indigo-300 text-xs font-bold font-mono flex items-center justify-center border border-indigo-400/30">
                Step 1
              </span>
              <Search className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold text-white">1. Type Topic Name</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Type the exact subject in the top search bar (e.g. <span className="text-indigo-300 font-semibold font-mono">"Blood Problems"</span>, <span className="text-indigo-300 font-semibold font-mono">"Newton's Laws"</span>, <span className="text-indigo-300 font-semibold font-mono">"Calculus"</span>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/50 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-purple-500/30 text-purple-300 text-xs font-bold font-mono flex items-center justify-center border border-purple-400/30">
                Step 2
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs font-bold text-white">2. Topic Category Rules</h4>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Calculator className="w-3.5 h-3.5 shrink-0" />
                <span>Math: Gives exact formulas</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span>Medicine: Gives symptoms</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>Tech: Gives Pros & Cons</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/50 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center border border-emerald-400/30">
                Step 3
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-white">3. Generate Full Package</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Click <span className="text-emerald-300 font-bold">"Stop & Process"</span>. AI fetches live web facts to create a <span className="text-emerald-300 font-semibold">6-Slide Deck, PDF, PPTX, MCQs & Mind Map</span>.
            </p>
          </div>
        </div>

        {/* Clickable Quick Sample Topics */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Click Any Topic Below to Search Immediately:</span>
            </span>
            {copiedTopic && (
              <span className="text-emerald-400 font-bold text-[11px] animate-in fade-in">
                ✓ Loaded: "{copiedTopic}"
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleTopics.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickTopic(sample.title)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600 border border-white/15 hover:border-indigo-400 text-white text-xs font-semibold backdrop-blur-md transition-all group active:scale-95"
              >
                <span>{sample.icon}</span>
                <span>{sample.title}</span>
                <ArrowRight className="w-3 h-3 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
