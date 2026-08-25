import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  Layers, 
  Calendar, 
  Sparkles, 
  GitCompare, 
  Clock, 
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { VersionSnapshot } from '../../types/advancedFeatures';
import { useToast } from '../common/Toast';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: VersionSnapshot[];
  currentVersionNumber: number;
  onRestoreVersion: (version: VersionSnapshot) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersionNumber,
  onRestoreVersion,
}) => {
  const { showToast } = useToast();
  const [selectedVersionA, setSelectedVersionA] = useState<VersionSnapshot | null>(
    versions.length > 0 ? versions[versions.length - 1] : null
  );
  const [selectedVersionB, setSelectedVersionB] = useState<VersionSnapshot | null>(
    versions.length > 1 ? versions[versions.length - 2] : null
  );
  const [isComparing, setIsComparing] = useState(false);

  const handleRestore = (ver: VersionSnapshot) => {
    onRestoreVersion(ver);
    showToast(`Restored Whiteboard to Version v${ver.versionNumber}! ↺`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={isComparing ? 'max-w-4xl' : 'max-w-2xl'}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Version History & Rollback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track changes across your whiteboard session, compare drafts, and restore earlier states.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isComparing
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Exit Comparison' : 'Compare Versions'}</span>
          </button>
        </div>

        {/* Side-by-Side Comparison View */}
        {isComparing && selectedVersionA && selectedVersionB ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            {/* Version A Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                  Version v{selectedVersionA.versionNumber}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(selectedVersionA.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="h-44 rounded-xl bg-slate-200 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                {selectedVersionA.thumbnail ? (
                  <img src={selectedVersionA.thumbnail} alt="Version A" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Visual Snapshot</span>
                )}
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">{selectedVersionA.title}</div>
                <div>Elements: {selectedVersionA.elementsCount} items</div>
                {selectedVersionA.studyPackage && (
                  <div className="text-emerald-600 font-medium">✓ AI Materials Generated</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRestore(selectedVersionA)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore This Version</span>
              </button>
            </div>

            {/* Version B Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-600 text-white text-[11px] font-bold">
                  Version v{selectedVersionB.versionNumber}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(selectedVersionB.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="h-44 rounded-xl bg-slate-200 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                {selectedVersionB.thumbnail ? (
                  <img src={selectedVersionB.thumbnail} alt="Version B" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Visual Snapshot</span>
                )}
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">{selectedVersionB.title}</div>
                <div>Elements: {selectedVersionB.elementsCount} items</div>
                {selectedVersionB.studyPackage && (
                  <div className="text-emerald-600 font-medium">✓ AI Materials Generated</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRestore(selectedVersionB)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore This Version</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal List View */
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No previous versions recorded yet for this session.
              </div>
            ) : (
              versions.map((ver) => {
                const isCurrent = ver.versionNumber === currentVersionNumber;
                return (
                  <div
                    key={ver.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                        {ver.thumbnail ? (
                          <img src={ver.thumbnail} alt={`v${ver.versionNumber}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">v{ver.versionNumber}</div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Version v{ver.versionNumber}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                              Current Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {ver.title} • {ver.elementsCount} canvas elements
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(ver.timestamp).toLocaleDateString()} {new Date(ver.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRestore(ver)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

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
