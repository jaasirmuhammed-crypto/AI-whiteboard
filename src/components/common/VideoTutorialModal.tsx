import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X,
  Layers,
  BookOpen,
  Download,
  BrainCircuit,
  PenTool,
  Clock
} from 'lucide-react';
import { Modal } from './Modal';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWriting?: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
  onStartWriting,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const chapters = [
    {
      title: '1. Sketch & Handwritten Notes',
      timestamp: '0:00',
      duration: 6,
      icon: <PenTool className="w-4 h-4 text-indigo-400" />,
      badge: 'Step 1: Canvas Drawing',
      headline: 'Draw mathematical proofs, circuit diagrams, and handwritten notes freely',
      description: 'Use the pen, pencil, highlighter, or pre-built subject templates. Touch screen stylus, iPad Apple Pencil, and mouse are all supported with ultra-smooth 120 FPS bezier smoothing.',
      animationType: 'drawing',
    },
    {
      title: '2. Multimodal OCR & Recognition',
      timestamp: '0:45',
      duration: 6,
      icon: <BrainCircuit className="w-4 h-4 text-purple-400" />,
      badge: 'Step 2: AI Neural Engine',
      headline: 'AI interprets messy handwriting, chemical formulas, and geometry',
      description: 'Click "Generate Study Materials". The multimodal OCR engine analyzes stroke geometry, formulas, and diagrams, detecting the subject context and syllabus level.',
      animationType: 'ocr',
    },
    {
      title: '3. Slide Deck, Quiz & Mindmap Synthesis',
      timestamp: '1:30',
      duration: 6,
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      badge: 'Step 3: Multi-Artifact Output',
      headline: 'Transform simple doodles into high-yield 16:9 slides and revision tests',
      description: 'Receive a full structured 16:9 widescreen presentation deck with speaker notes, high-yield practice MCQs, and radial mindmaps ready for exam revision.',
      animationType: 'synthesis',
    },
    {
      title: '4. 1-Click Export to Google Slides & Notion',
      timestamp: '2:15',
      duration: 6,
      icon: <Download className="w-4 h-4 text-amber-400" />,
      badge: 'Step 4: Export Hub',
      headline: 'Export seamlessly to PowerPoint, Google Slides, Notion, and PDF',
      description: 'Download native .PPTX, import into Google Slides with 1 click, or paste Notion-ready toggle question blocks and high-res retina PNG drawings.',
      animationType: 'export',
    },
  ];

  const currentChapter = chapters[activeChapterIndex];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveChapterIndex((prevCh) => (prevCh + 1) % chapters.length);
          return 0;
        }
        return prev + 2 * playbackSpeed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, chapters.length]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-5" role="dialog" aria-label="Interactive Video Tutorial Walkthrough">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                  Interactive Video Tutorial & Masterclass
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Guided Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learn how to transform handwritten notes and sketches into polished study materials in under 2 minutes.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Player Container */}
        <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white">
          {/* Animated Visual Canvas Stage */}
          <div className="relative my-auto flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              {currentChapter.badge}
            </span>

            <h2 className="text-xl sm:text-3xl font-extrabold font-brand tracking-tight text-white animate-in fade-in zoom-in-95 duration-300">
              {currentChapter.headline}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg animate-in fade-in duration-300">
              {currentChapter.description}
            </p>

            {/* Interactive Simulation Graphic representation */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {activeChapterIndex === 0 && (
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 shadow-lg">
                  <PenTool className="w-6 h-6 text-indigo-400 animate-bounce" />
                  <span className="font-mono text-xs text-indigo-200">f(x) = ∫ 2x dx = x² + C ✏️</span>
                </div>
              )}
              {activeChapterIndex === 1 && (
                <div className="p-4 rounded-2xl bg-purple-900/40 backdrop-blur-md border border-purple-500/40 flex items-center gap-3 shadow-lg">
                  <BrainCircuit className="w-6 h-6 text-purple-400 animate-spin" />
                  <span className="font-mono text-xs text-purple-200">Neural OCR: 99.4% Accuracy Recognized</span>
                </div>
              )}
              {activeChapterIndex === 2 && (
                <div className="p-4 rounded-2xl bg-emerald-900/40 backdrop-blur-md border border-emerald-500/40 flex items-center gap-3 shadow-lg">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  <span className="font-mono text-xs text-emerald-200">Generated: 6 Slides + 5 MCQs + Mind Map</span>
                </div>
              )}
              {activeChapterIndex === 3 && (
                <div className="p-4 rounded-2xl bg-amber-900/40 backdrop-blur-md border border-amber-500/40 flex items-center gap-3 shadow-lg">
                  <Download className="w-6 h-6 text-amber-400 animate-pulse" />
                  <span className="font-mono text-xs text-amber-200">Exported: .PPTX • Google Slides • Notion</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Player Bottom Controls Overlay */}
          <div className="space-y-3 z-10">
            {/* Timeline Scrubber */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden cursor-pointer">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-100" 
                style={{ width: `${((activeChapterIndex * 25) + (progress * 0.25))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProgress(0);
                    setActiveChapterIndex(0);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Replay from Beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="text-[11px] font-mono text-slate-400">
                  Chapter {activeChapterIndex + 1} of {chapters.length} • {currentChapter.timestamp}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[11px] font-bold transition-colors"
                >
                  {playbackSpeed}x Speed
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {chapters.map((ch, idx) => {
            const isCurrent = activeChapterIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setProgress(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {ch.icon}
                  <span className="font-mono text-[10px] text-slate-400">{ch.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {ch.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
          >
            Close Tutorial
          </button>

          {onStartWriting && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartWriting();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try Whiteboard Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
