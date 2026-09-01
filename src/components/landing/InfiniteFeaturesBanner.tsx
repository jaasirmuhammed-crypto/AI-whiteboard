import React from 'react';
import { 
  Sparkles, 
  PenTool, 
  FileText, 
  HelpCircle, 
  Network, 
  Users, 
  Mic, 
  WifiOff, 
  Cpu, 
  ShieldCheck,
  Zap,
  Globe2
} from 'lucide-react';
import { InfiniteCarousel } from '../common/InfiniteCarousel';

export const InfiniteFeaturesBanner: React.FC = () => {
  const features = [
    { label: '120 FPS Vector Inking', icon: PenTool, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'LaTeX & Formula Parser', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: '1-Click PPTX Slide Decks', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Calibrated MCQ Quiz Engine', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Dynamic Neural Mind Maps', icon: Network, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Zero-Latency Multiplayer', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Voice Lecture Annotations', icon: Mic, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: '100% Offline Local Backup', icon: WifiOff, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'WCAG 2.1 AA Compliant', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '15+ Languages Supported', icon: Globe2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="py-6 bg-slate-100/60 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          State of the Art Intelligent Canvas Capabilities
        </span>
      </div>

      <InfiniteCarousel direction="left" speedSeconds={32} gap="gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all shrink-0 cursor-default"
            >
              <div className={`p-1.5 rounded-xl ${f.bg} ${f.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                {f.label}
              </span>
            </div>
          );
        })}
      </InfiniteCarousel>
    </div>
  );
};
