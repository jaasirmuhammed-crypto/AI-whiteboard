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
    { 
      label: '120 FPS Vector Inking', 
      icon: PenTool, 
      color: 'text-indigo-600 dark:text-indigo-400', 
      bg: 'bg-indigo-500/20 dark:bg-indigo-950/70',
      border: 'border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600',
      cardBg: 'bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-white dark:from-indigo-950/50 dark:via-purple-950/20 dark:to-slate-900/90',
      textColor: 'text-indigo-950 dark:text-indigo-200'
    },
    { 
      label: 'LaTeX & Formula Parser', 
      icon: Cpu, 
      color: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-500/20 dark:bg-purple-950/70',
      border: 'border-purple-200 dark:border-purple-800/80 hover:border-purple-400 dark:hover:border-purple-600',
      cardBg: 'bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-white dark:from-purple-950/50 dark:via-fuchsia-950/20 dark:to-slate-900/90',
      textColor: 'text-purple-950 dark:text-purple-200'
    },
    { 
      label: '1-Click PPTX Slide Decks', 
      icon: FileText, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-500/20 dark:bg-emerald-950/70',
      border: 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600',
      cardBg: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/50 dark:via-teal-950/20 dark:to-slate-900/90',
      textColor: 'text-emerald-950 dark:text-emerald-200'
    },
    { 
      label: 'Calibrated MCQ Quiz Engine', 
      icon: HelpCircle, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-500/20 dark:bg-amber-950/70',
      border: 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-600',
      cardBg: 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white dark:from-amber-950/50 dark:via-orange-950/20 dark:to-slate-900/90',
      textColor: 'text-amber-950 dark:text-amber-200'
    },
    { 
      label: 'Dynamic Neural Mind Maps', 
      icon: Network, 
      color: 'text-pink-600 dark:text-pink-400', 
      bg: 'bg-pink-500/20 dark:bg-pink-950/70',
      border: 'border-pink-200 dark:border-pink-800/80 hover:border-pink-400 dark:hover:border-pink-600',
      cardBg: 'bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-white dark:from-pink-950/50 dark:via-rose-950/20 dark:to-slate-900/90',
      textColor: 'text-pink-950 dark:text-pink-200'
    },
    { 
      label: 'Zero-Latency Multiplayer', 
      icon: Users, 
      color: 'text-cyan-600 dark:text-cyan-400', 
      bg: 'bg-cyan-500/20 dark:bg-cyan-950/70',
      border: 'border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400 dark:hover:border-cyan-600',
      cardBg: 'bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-white dark:from-cyan-950/50 dark:via-sky-950/20 dark:to-slate-900/90',
      textColor: 'text-cyan-950 dark:text-cyan-200'
    },
    { 
      label: 'Voice Lecture Annotations', 
      icon: Mic, 
      color: 'text-rose-600 dark:text-rose-400', 
      bg: 'bg-rose-500/20 dark:bg-rose-950/70',
      border: 'border-rose-200 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-600',
      cardBg: 'bg-gradient-to-r from-rose-500/10 via-red-500/5 to-white dark:from-rose-950/50 dark:via-red-950/20 dark:to-slate-900/90',
      textColor: 'text-rose-950 dark:text-rose-200'
    },
    { 
      label: '100% Offline Local Backup', 
      icon: WifiOff, 
      color: 'text-teal-600 dark:text-teal-400', 
      bg: 'bg-teal-500/20 dark:bg-teal-950/70',
      border: 'border-teal-200 dark:border-teal-800/80 hover:border-teal-400 dark:hover:border-teal-600',
      cardBg: 'bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-white dark:from-teal-950/50 dark:via-emerald-950/20 dark:to-slate-900/90',
      textColor: 'text-teal-950 dark:text-teal-200'
    },
    { 
      label: 'WCAG 2.1 AA Compliant', 
      icon: ShieldCheck, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-500/20 dark:bg-blue-950/70',
      border: 'border-blue-200 dark:border-blue-800/80 hover:border-blue-400 dark:hover:border-blue-600',
      cardBg: 'bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-white dark:from-blue-950/50 dark:via-indigo-950/20 dark:to-slate-900/90',
      textColor: 'text-blue-950 dark:text-blue-200'
    },
    { 
      label: '15+ Languages Supported', 
      icon: Globe2, 
      color: 'text-violet-600 dark:text-violet-400', 
      bg: 'bg-violet-500/20 dark:bg-violet-950/70',
      border: 'border-violet-200 dark:border-violet-800/80 hover:border-violet-400 dark:hover:border-violet-600',
      cardBg: 'bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-white dark:from-violet-950/50 dark:via-fuchsia-950/20 dark:to-slate-900/90',
      textColor: 'text-violet-950 dark:text-violet-200'
    },
  ];

  return (
    <div className="py-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          State of the Art Intelligent Canvas Capabilities
        </span>
      </div>

      <InfiniteCarousel direction="left" speedSeconds={32} gap="gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl ${f.cardBg} border ${f.border} shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 shrink-0 cursor-default backdrop-blur-sm`}
            >
              <div className={`p-1.5 rounded-xl ${f.bg} ${f.color} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${f.textColor} whitespace-nowrap`}>
                {f.label}
              </span>
            </div>
          );
        })}
      </InfiniteCarousel>
    </div>
  );
};
