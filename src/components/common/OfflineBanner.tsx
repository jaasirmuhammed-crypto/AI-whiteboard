import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSyncedToast, setShowSyncedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncedToast(true);
      setTimeout(() => setShowSyncedToast(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showSyncedToast) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
        <Wifi className="w-4 h-4" />
        <span>Connection Restored: All whiteboard drafts synced to local storage! ✅</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-amber-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 border border-amber-400/40">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode Active: Whiteboard is auto-saving locally to IndexedDB & LocalStorage.</span>
    </div>
  );
};
