import React from 'react';
import { 
  Sparkles, 
  Camera, 
  FileSearch, 
  BrainCircuit, 
  Layers, 
  FileCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useI18n } from '../../i18n';

interface AIProcessingModalProps {
  isOpen: boolean;
  currentStage: number;
  stageMessage: string;
}

export const AIProcessingModal: React.FC<AIProcessingModalProps> = ({
  isOpen,
  currentStage,
  stageMessage,
}) => {
  const { t } = useI18n();

  const stages = [
    { id: 1, label: t.processing.stage1, icon: Camera },
    { id: 2, label: t.processing.stage2, icon: FileSearch },
    { id: 3, label: t.processing.stage3, icon: BrainCircuit },
    { id: 4, label: t.processing.stage4, icon: Layers },
    { id: 5, label: t.processing.stage5, icon: FileCheck },
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => {}} maxWidth="max-w-lg">
      <div className="text-center space-y-6 py-4">
        
        {/* Animated AI Brain Orb */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-60 animate-pulse-glow" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 animate-spin text-indigo-200" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
            {t.processing.title}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
            {stageMessage || stages[currentStage - 1]?.label || 'Processing...'}
          </p>
        </div>

        {/* 5 Stages Progress Tracker */}
        <div className="space-y-3 text-left max-w-md mx-auto pt-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 shadow-xs scale-[1.02]'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 opacity-80'
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-indigo-900 dark:text-indigo-200 font-bold'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
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

      </div>
    </Modal>
  );
};
