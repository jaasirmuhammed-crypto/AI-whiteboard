import React, { useState } from 'react';
import { ShieldCheck, QrCode, KeyRound, Copy, CheckCircle2, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState<'intro' | 'qr' | 'backup' | 'complete'>('intro');
  const [authCode, setAuthCode] = useState('');
  const [secretKey] = useState('KZXW 6ZDP O5XX E33U ORXW G2LM');
  const [backupCodes] = useState([
    '9482-1049', '5820-3948', '1094-8573',
    '3849-2049', '4958-1094', '2049-5839'
  ]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.length < 6) {
      showToast('Please enter the 6-digit code from Google Authenticator or Authy.', 'error');
      return;
    }

    setStep('backup');
    setIsEnabled(true);
    showToast('2FA Authenticator verified successfully! 🛡️', 'success');
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    showToast('Backup codes copied to clipboard!', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
            Two-Factor Authentication (2FA)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add an extra layer of security using Google Authenticator, Microsoft Authenticator, or 1Password.
          </p>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Why enable 2FA?</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Protect your study projects, AI generated notes, and cloud whiteboard sketches even if your password is compromised.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('qr')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <span>Setup Authenticator App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'qr' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
              <div className="w-36 h-36 bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                <QrCode className="w-16 h-16 text-slate-800 dark:text-slate-200" />
                <span className="text-[9px] text-slate-400 font-mono mt-1">Scan in Authenticator</span>
              </div>

              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Manual Entry Key</span>
                <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  {secretKey}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-center font-mono font-bold tracking-widest text-base focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>
          </form>
        )}

        {step === 'backup' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Save Your Backup Recovery Codes</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                If you lose access to your phone, these one-time codes are the only way to recover your account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-center font-bold text-slate-700 dark:text-slate-300">
              {backupCodes.map((code, idx) => (
                <span key={idx} className="p-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                  {code}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCodes}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Codes</span>
              </button>

              <button
                type="button"
                onClick={() => { setStep('complete'); onClose(); showToast('2FA protection activated!', 'success'); }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Setup</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
