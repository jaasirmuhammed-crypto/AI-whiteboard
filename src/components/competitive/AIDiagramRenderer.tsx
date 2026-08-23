import React from 'react';
import { Topic } from '../../types/competitive';
import { GitCommit, ArrowRight, Layers, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AIDiagramRendererProps {
  topic: Topic;
}

export const AIDiagramRenderer: React.FC<AIDiagramRendererProps> = ({ topic }) => {
  const type = topic.diagramType || 'concept_map';

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-indigo-500/30 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              AI Generated Educational Diagram
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal border border-indigo-500/30">
                {type.toUpperCase().replace('_', ' ')}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Visual mapping for {topic.name}</p>
          </div>
        </div>
      </div>

      {/* Diagram Rendering Area */}
      <div className="relative z-10 py-4 min-h-[220px] flex items-center justify-center">
        {type === 'concept_map' && (
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            {/* Center Core Node */}
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 text-center border border-indigo-300/30 animate-pulse-glow">
              {topic.name}
            </div>

            {/* Connecting Rays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {topic.importantPoints.slice(0, 3).map((pt, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 transition-all flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <GitCommit className="w-3.5 h-3.5" /> Concept #{idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'flowchart' && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-3xl overflow-x-auto py-2">
            {topic.quickRevision.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 min-w-[150px] p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                    Step 0{idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{step}</p>
                </div>
                {idx < topic.quickRevision.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {type === 'comparison' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Core Concepts & Rules
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {topic.importantPoints.slice(0, 3).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4" /> Common Pitfalls
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {topic.commonMistakes.slice(0, 3).map((err, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(type === 'process' || type === 'timeline') && (
          <div className="w-full max-w-2xl space-y-3">
            {topic.importantPoints.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-200 leading-normal">{pt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Interactive SVG Canvas Engine
        </span>
        <span>Auto-generated by AI Whiteboard</span>
      </div>
    </div>
  );
};
