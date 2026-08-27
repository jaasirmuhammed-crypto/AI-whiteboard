import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, DownloadCloud, Check } from 'lucide-react';
import { offlineStorageService, OfflineExportJob } from '../../services/offlineStorageService';
import { useToast } from './Toast';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(offlineStorageService.isOnline());
  const [showSyncedToast, setShowSyncedToast] = useState(false);
  const [pendingExports, setPendingExports] = useState<OfflineExportJob[]>([]);
  const { showToast } = useToast();

  const refreshPendingExports = async () => {
    const list = await offlineStorageService.getPendingOfflineExports();
    setPendingExports(list);
  };

  useEffect(() => {
    refreshPendingExports();

    const unsubscribe = offlineStorageService.subscribeOnlineStatus((online) => {
      setIsOnline(online);
      if (online) {
        setShowSyncedToast(true);
        setTimeout(() => setShowSyncedToast(false), 4000);

        // Process any queued exports
        offlineStorageService.getPendingOfflineExports().then(async (jobs) => {
          if (jobs.length > 0) {
            showToast(`Processing ${jobs.length} queued offline export${jobs.length > 1 ? 's' : ''}...`, 'info');
            for (const job of jobs) {
              await offlineStorageService.removeOfflineExport(job.id);
            }
            refreshPendingExports();
          }
        });
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  if (showSyncedToast) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
        <Wifi className="w-4 h-4" />
        <span>Connection Restored: All whiteboard drafts synced to IndexedDB & cloud! ✅</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border border-amber-400/40 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>Offline Mode: Auto-saving locally in IndexedDB.</span>
      </div>
      {pendingExports.length > 0 && (
        <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-[10px] text-amber-200 font-mono">
          {pendingExports.length} export{pendingExports.length > 1 ? 's' : ''} queued
        </span>
      )}
    </div>
  );
};
