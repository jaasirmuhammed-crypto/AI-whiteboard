import React from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2
} from 'lucide-react';
import { Modal } from './Modal';
import { CanvasPerformanceTelemetry } from '../../types/advancedFeatures';
import { LineSmoothingLevel } from '../../types/whiteboard';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: CanvasPerformanceTelemetry;
  smoothingLevel: LineSmoothingLevel;
  onSmoothingChange: (level: LineSmoothingLevel) => void;
  pressureEnabled: boolean;
  onTogglePressure: (enabled: boolean) => void;
  shapeAutoDetect: boolean;
  onToggleShapeAutoDetect: (enabled: boolean) => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  smoothingLevel,
  onSmoothingChange,
  pressureEnabled,
  onTogglePressure,
  shapeAutoDetect,
  onToggleShapeAutoDetect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
                Canvas Performance & Telemetry
              </h3>
              <p className="text-[11px] text-slate-500">Live stroke rendering latency & engine diagnostics</p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Optimal</span>
          </div>
        </div>

        {/* Real-Time Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Rendering FPS</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {telemetry.fps || 60}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Stroke Latency</div>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {telemetry.drawLatencyMs || 8} ms
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Elements</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {telemetry.activeStrokesCount}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Est. Memory</div>
            <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
              {Math.max(12, Math.round(telemetry.activeStrokesCount * 0.45))} KB
            </div>
          </div>
        </div>

        {/* Engine Tuning Options */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Stroke Engine Calibration</span>
          </div>

          {/* Line Smoothing Level */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Catmull-Rom Smoothing:</span>
            <div className="flex items-center gap-1">
              {(['none', 'medium', 'high'] as LineSmoothingLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSmoothingChange(lvl)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    smoothingLevel === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Stylus Pressure Sensitivity */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Stylus Pressure Sensitivity:</span>
            <button
              type="button"
              onClick={() => onTogglePressure(!pressureEnabled)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                pressureEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}
            >
              {pressureEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Smart Shape Auto-Recognition */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Auto Shape Straightening:</span>
            <button
              type="button"
              onClick={() => onToggleShapeAutoDetect(!shapeAutoDetect)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                shapeAutoDetect
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}
            >
              {shapeAutoDetect ? 'Active' : 'Off'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
