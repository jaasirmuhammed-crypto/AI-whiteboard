import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle,
  X
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface SessionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionManagementModal: React.FC<SessionManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logoutAllDevices } = useAuth();
  const { showToast } = useToast();

  const sessions = user?.sessions || [
    {
      id: 'sess_cur',
      deviceName: 'Windows PC (Chrome)',
      browser: 'Chrome 122',
      os: 'Windows 11',
      ipAddress: '127.0.0.1 (Current)',
      lastActiveAt: new Date().toISOString(),
      isCurrent: true,
    },
    {
      id: 'sess_mob',
      deviceName: 'Apple iPad Air (Safari)',
      browser: 'Mobile Safari',
      os: 'iPadOS 17',
      ipAddress: '192.168.1.45',
      lastActiveAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      isCurrent: false,
    },
  ];

  const handleLogoutAll = () => {
    if (window.confirm('Are you sure you want to log out from all devices? You will need to sign in again.')) {
      logoutAllDevices();
      showToast('Logged out from all active devices.', 'info');
      onClose();
    }
  };

  const getDeviceIcon = (os: string) => {
    if (os.toLowerCase().includes('ios') || os.toLowerCase().includes('android')) {
      return <Smartphone className="w-5 h-5 text-indigo-500" />;
    }
    if (os.toLowerCase().includes('mac') || os.toLowerCase().includes('windows')) {
      return <Laptop className="w-5 h-5 text-indigo-500" />;
    }
    return <Monitor className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                Active Devices & Session Security
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage where your AI Whiteboard account is currently signed in.
            </p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Current Active Sessions ({sessions.length})
          </span>

          <div className="space-y-2.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  session.isCurrent
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                    {getDeviceIcon(session.os)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {session.deviceName}
                      </span>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          This Device
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {session.ipAddress}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.isCurrent ? 'Active Now' : new Date(session.lastActiveAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Lost a device? Log out everywhere to secure your notebooks.</span>
          </div>

          <button
            type="button"
            onClick={handleLogoutAll}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout From All Devices</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
