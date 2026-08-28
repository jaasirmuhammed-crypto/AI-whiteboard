import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

interface SessionTimeoutWarningModalProps {
  idleTimeoutMinutes?: number;
  warningDurationSeconds?: number;
}

export const SessionTimeoutWarningModal: React.FC<SessionTimeoutWarningModalProps> = ({
  idleTimeoutMinutes = 15,
  warningDurationSeconds = 60,
}) => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(warningDurationSeconds);

  useEffect(() => {
    if (!user) return;

    let idleTimer: any;
    let countdownTimer: any;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);
      setRemainingSeconds(warningDurationSeconds);

      // Start idle countdown
      idleTimer = setTimeout(() => {
        setShowWarning(true);
        // Start warning countdown
        let sec = warningDurationSeconds;
        countdownTimer = setInterval(() => {
          sec -= 1;
          setRemainingSeconds(sec);
          if (sec <= 0) {
            clearInterval(countdownTimer);
            logout();
          }
        }, 1000);
      }, (idleTimeoutMinutes * 60 - warningDurationSeconds) * 1000);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer));

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      clearInterval(countdownTimer);
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
    };
  }, [user, idleTimeoutMinutes, warningDurationSeconds, logout]);

  if (!showWarning || !user) return null;

  return (
    <Modal isOpen={showWarning} onClose={() => setShowWarning(false)} maxWidth="max-w-md">
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center animate-pulse">
          <Clock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
            Session Expiring Due to Inactivity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For academic privacy, your session will lock automatically in:
          </p>
          <div className="py-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {remainingSeconds}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={logout}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Now</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWarning(false)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Stay Logged In</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
