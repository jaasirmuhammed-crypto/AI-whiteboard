import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  PenTool, 
  BrainCircuit, 
  Download,
  Presentation,
  Check
} from 'lucide-react';
import { VideoTutorialModal } from '../common/VideoTutorialModal';

interface VideoTutorialSectionProps {
  onStartWriting?: () => void;
}

export const VideoTutorialSection: React.FC<VideoTutorialSectionProps> = ({ onStartWriting }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="py-20 relative overflow-hidden bg-slate-900 text-white" aria-labelledby="video-tutorial-title">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Video Masterclass</span>
          </div>
          <h2 id="video-tutorial-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-brand tracking-tight">
            See How AI Transforms Handwritten Scribbles in Real Time
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Watch our 2-minute masterclass showing how students and educators turn whiteboard formulas and rough diagrams into high-yield slide decks and exam quizzes.
          </p>
        </div>

        {/* Video Player Card Preview */}
        <div className="max-w-4xl mx-auto">
          <div 
            onClick={() => setVideoModalOpen(true)}
            className="group relative aspect-video rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 hover:border-indigo-500 shadow-2xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Top Bar Preview */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">AI Whiteboard Interactive Demo • 1080p 60fps</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                2:00 Walkthrough
              </span>
            </div>

            {/* Center Play Button & Pulsing Glow */}
            <div className="my-auto flex flex-col items-center justify-center space-y-4 text-center z-10">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-indigo-500/30 blur-xl animate-pulse pointer-events-none" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold font-brand text-white">
                  Click to Watch Guided Video Tutorial
                </h3>
                <p className="text-xs text-slate-400">
                  Includes Chapter markers, speed controls & step-by-step guidance
                </p>
              </div>
            </div>

            {/* Bottom Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400 z-10">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> <span>Draw Calculus & Circuits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> <span>99.4% Multimodal OCR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> <span>16:9 Presentation Deck</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> <span>Google Slides & Notion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial Modal */}
        <VideoTutorialModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          onStartWriting={onStartWriting}
        />
      </div>
    </section>
  );
};
