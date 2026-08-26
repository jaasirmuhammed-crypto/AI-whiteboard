import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3500) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-xl transition-all animate-in slide-in-from-bottom-3 duration-200 overflow-hidden ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/40'
                : 'bg-slate-900/90 dark:bg-slate-800/95 border-indigo-500/30 text-slate-100 shadow-slate-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {toast.type === 'success' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 animate-in zoom-in-50 duration-150" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Subtle bottom progress timer line */}
            <div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                toast.type === 'success' ? 'bg-emerald-400/60' : toast.type === 'error' ? 'bg-rose-400/60' : 'bg-indigo-400/60'
              }`}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
