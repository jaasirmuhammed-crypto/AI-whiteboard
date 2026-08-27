import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhiteboardElement } from '../../types/whiteboard';
import { useToast } from '../common/Toast';

interface UndoHistoryTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: WhiteboardElement[][];
  currentIndex: number;
  onJumpToIndex: (index: number) => void;
}

export const UndoHistoryTimelineModal: React.FC<UndoHistoryTimelineModalProps> = ({
  isOpen,
  onClose,
  history,
  currentIndex,
  onJumpToIndex,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(currentIndex);
  const { showToast } = useToast();

  const handleApply = (idx: number) => {
    onJumpToIndex(idx);
    showToast(`Jumped to Step #${idx + 1} in session timeline! ↺`, 'success');
    onClose();
  };

  const getStepSummary = (stepElements: WhiteboardElement[], stepIdx: number) => {
    const strokes = stepElements.filter((e) => e.type === 'stroke').length;
    const shapes = stepElements.filter((e) => e.type === 'shape').length;
    const texts = stepElements.filter((e) => e.type === 'text' || e.type === 'sticky').length;

    if (stepIdx === 0 && stepElements.length === 0) return 'Initial Empty Whiteboard';
    return `${stepElements.length} elements (${strokes} strokes, ${shapes} shapes, ${texts} notes/text)`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Interactive Undo History Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual timeline scrubber of every stroke, shape, and edit made in this session.
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold border border-indigo-200 dark:border-indigo-800">
            Step {selectedIndex + 1} of {history.length}
          </div>
        </div>

        {/* Timeline Slider Control */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span>Scrub Across Drawing Steps:</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={selectedIndex <= 0}
                onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                type="button"
                disabled={selectedIndex >= history.length - 1}
                onClick={() => setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1))}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, history.length - 1)}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Start (#1)</span>
            <span>Current Step (#{currentIndex + 1})</span>
            <span>Latest (#{history.length})</span>
          </div>
        </div>

        {/* List of Historical Steps */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {history.map((stepElements, idx) => {
            const isSelected = selectedIndex === idx;
            const isCurrent = currentIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Step #{idx + 1}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                          Active State
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {getStepSummary(stepElements, idx)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(idx);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleApply(selectedIndex)}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Selected Step (#{selectedIndex + 1})</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
