import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  FileSearch, 
  BrainCircuit, 
  Layers, 
  FileCheck,
  CheckCircle2,
  Loader2,
  XCircle,
  RotateCcw,
  Clock,
  Presentation,
  HelpCircle,
  Network,
  AlertTriangle,
  FileEdit
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useI18n } from '../../i18n';

interface AIProcessingModalProps {
  isOpen: boolean;
  currentStage: number;
  stageMessage: string;
  onCancel?: () => void;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onManualFallback?: () => void;
}

export const AIProcessingModal: React.FC<AIProcessingModalProps> = ({
  isOpen,
  currentStage,
  stageMessage,
  onCancel,
  isError = false,
  errorMessage,
  onRetry,
  onManualFallback,
}) => {
  const { t } = useI18n();

  // Progress metrics calculation
  const progressPercent = Math.min(100, Math.max(10, (currentStage / 5) * 100));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streamLog, setStreamLog] = useState<string[]>([
    'Initializing neural parser...',
    'Analyzing stroke pressure & geometry...',
  ]);

  useEffect(() => {
    if (!isOpen || isError) {
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isError]);

  useEffect(() => {
    if (stageMessage && !streamLog.includes(stageMessage)) {
      setStreamLog((prev) => [...prev.slice(-4), stageMessage]);
    }
  }, [stageMessage, streamLog]);

  const stages = [
    { id: 1, label: t.processing?.stage1 || 'Capturing Whiteboard Notes', icon: Camera },
    { id: 2, label: t.processing?.stage2 || 'Parsing Handwriting & Diagrams', icon: FileSearch },
    { id: 3, label: t.processing?.stage3 || 'Synthesizing 6 Comprehensive Slides', icon: Presentation },
    { id: 4, label: t.processing?.stage4 || 'Generating High-Yield MCQs & Explanations', icon: HelpCircle },
    { id: 5, label: t.processing?.stage5 || 'Building Interactive Mind Map Hierarchy', icon: Network },
  ];

  const estimatedTotal = 8;
  const remainingSec = Math.max(1, estimatedTotal - elapsedSeconds);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} maxWidth="max-w-lg">
      <div className="text-center space-y-5 py-2">
        
        {isError ? (
          /* Error State UI */
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                Generation Encountered an Issue
              </h3>
              <p className="text-xs text-rose-500 font-medium mt-1">
                {errorMessage || 'Network timeout or handwriting recognition ambiguity.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Suggested Action Steps:</span>
              <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-1">
                <li>Check your network connection and retry with exponential backoff.</li>
                <li>Switch to manual topic entry if handwriting recognition has low contrast.</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
              {onManualFallback && (
                <button
                  type="button"
                  onClick={onManualFallback}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Manual Input</span>
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal Processing State UI */
          <>
            {/* Animated AI Brain Orb with Live Progress Ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-60 animate-pulse-glow" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl">
                <Sparkles className="w-9 h-9 animate-spin text-indigo-200" style={{ animationDuration: '5s' }} />
              </div>
            </div>

            {/* Title & ETA */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-brand text-slate-900 dark:text-white">
                  {t.processing?.title || 'AI Synthesis Engine'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  {progressPercent}%
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3 text-indigo-500" />
                <span>Elapsed: {elapsedSeconds}s</span>
                <span>•</span>
                <span>Est. remaining: ~{remainingSec}s</span>
              </div>
            </div>

            {/* Visual Progress Bar (0% -> 100%) */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 5 Stages Progress Tracker */}
            <div className="space-y-2 text-left max-w-md mx-auto">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isCompleted = currentStage > stage.id;
                const isCurrent = currentStage === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 shadow-xs scale-[1.01]'
                        : isCompleted
                        ? 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 opacity-80'
                        : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-xs ${
                        isCurrent
                          ? 'text-indigo-900 dark:text-indigo-200 font-bold'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200 font-semibold'
                          : 'text-slate-400'
                      }`}>
                        {stage.label}
                      </span>
                    </div>

                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isCurrent && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Live Generation Output Sub-Progress Bars */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-left">
                <div className="text-[10px] font-bold text-slate-400">PowerPoint</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {currentStage >= 3 ? '6 / 6 Slides' : 'Queued'}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-left">
                <div className="text-[10px] font-bold text-slate-400">MCQs</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {currentStage >= 4 ? '5 / 5 Quizzes' : 'Queued'}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-left">
                <div className="text-[10px] font-bold text-slate-400">Mind Map</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {currentStage >= 5 ? 'Hierarchical' : 'Queued'}
                </div>
              </div>
            </div>

            {/* Cancel Operation Button */}
            {onCancel && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Generation</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </Modal>
  );
};
