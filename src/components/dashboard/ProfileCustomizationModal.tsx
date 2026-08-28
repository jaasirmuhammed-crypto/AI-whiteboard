import React, { useState } from 'react';
import { User, Sparkles, Check, Globe, Palette, BookOpen, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface ProfileCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  '🎓', '🚀', '🔬', '💡', '🤖', '📐', '🧠', '🧬', '⚡', '💻', '📚', '🌟'
];

const PREFERRED_SUBJECTS = [
  'General Science & STEM',
  'Mathematics & Calculus',
  'Physics & Mechanics',
  'Chemistry & Biology',
  'Computer Science & AI',
  'UPSC / Competitive Exams',
  'Humanities & History'
];

export const ProfileCustomizationModal: React.FC<ProfileCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState(user?.name || 'Scholar User');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🎓');
  const [preferredSubject, setPreferredSubject] = useState(PREFERRED_SUBJECTS[0]);
  const [preferredTheme, setPreferredTheme] = useState<'system' | 'dark' | 'light'>('system');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile preferences updated successfully! 🌟', 'success');
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            {selectedAvatar}
          </div>
          <div>
            <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
              Profile & Learning Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your student avatar, display name, and academic subjects.
            </p>
          </div>
        </div>

        {/* Avatar Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setSelectedAvatar(av)}
                className={`p-3 rounded-2xl text-xl transition-all flex items-center justify-center cursor-pointer ${
                  selectedAvatar === av
                    ? 'bg-indigo-600/15 border-2 border-indigo-600 scale-110 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Display Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Academic Focus */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Primary Study Focus / Subject Area
          </label>
          <select
            value={preferredSubject}
            onChange={(e) => setPreferredSubject(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
          >
            {PREFERRED_SUBJECTS.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Visual Theme */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Interface Theme Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'system', label: '🌓 Auto System' },
              { id: 'dark', label: '🌙 OLED Dark' },
              { id: 'light', label: '☀️ Pure Light' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setPreferredTheme(th.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  preferredTheme === th.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
