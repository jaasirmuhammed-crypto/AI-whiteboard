import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Hand, MousePointer, Maximize, HelpCircle } from 'lucide-react';
import { useI18n } from '../../i18n';

interface ViewControlsProps {
  scale: number;
  isPanMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onTogglePanMode: () => void;
  onToggleFullscreen: () => void;
  onOpenShortcuts: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  scale,
  isPanMode,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onTogglePanMode,
  onToggleFullscreen,
  onOpenShortcuts,
}) => {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center gap-1 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl scale-90 sm:scale-100 origin-bottom-right">
      {/* Pan Tool */}
      <button
        onClick={onTogglePanMode}
        className={`p-2 rounded-xl text-xs transition-colors ${
          isPanMode
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title="Pan Canvas (Spacebar)"
      >
        <Hand className="w-4 h-4" />
      </button>

      {/* Zoom Controls */}
      <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-1">
        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomReset}
          className="px-2 py-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen & Shortcuts */}
      <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-1">
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
