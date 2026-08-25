import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Lock, 
  Globe, 
  Mail, 
  Sparkles, 
  Radio, 
  UserCheck, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { CollaboratorCursor } from '../../types/whiteboard';
import { useToast } from '../common/Toast';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMultiplayerActive: boolean;
  onToggleMultiplayer: (active: boolean) => void;
  collaborators: CollaboratorCursor[];
  whiteboardTitle: string;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  isMultiplayerActive,
  onToggleMultiplayer,
  collaborators,
  whiteboardTitle,
}) => {
  const { showToast } = useToast();
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('edit');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [invitedList, setInvitedList] = useState<string[]>(['sarah.chen@stanford.edu', 'alex.rivera@mit.edu']);

  const shareableUrl = `https://aiwhiteboard.safa.app/live/${encodeURIComponent(
    whiteboardTitle.toLowerCase().replace(/\s+/g, '-')
  )}?role=${accessLevel}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    showToast('Shareable collaboration link copied to clipboard!', 'info');
  };

  const handleInviteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && !invitedList.includes(emailInput.trim())) {
      setInvitedList([...invitedList, emailInput.trim()]);
      setEmailInput('');
      showToast('Invitation link sent via email! ✉️', 'success');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Multiplayer Whiteboard & Sharing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Invite peers to draw together in real-time or share access links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isMultiplayerActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isMultiplayerActive ? 'Live Sync ON' : 'Solo Mode'}
            </span>
          </div>
        </div>

        {/* Live Multiplayer Mode Toggle Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className={`w-4 h-4 ${isMultiplayerActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span>Real-Time Multi-User Canvas Presence</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Show remote cursors, collaborative drawing, and student presence avatars.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onToggleMultiplayer(!isMultiplayerActive);
              showToast(
                !isMultiplayerActive ? 'Live Multiplayer mode enabled! 🚀' : 'Switched back to Solo mode.',
                'info'
              );
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
              isMultiplayerActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isMultiplayerActive ? 'Multiplayer Active' : 'Enable Live Sync'}
          </button>
        </div>

        {/* Active Collaborators Presence List */}
        {isMultiplayerActive && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Room Participants ({collaborators.length + 1})
            </label>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>You (Host)</span>
              </div>
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shareable Link Generator with Permission Select */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-white">Shareable Whiteboard Link</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAccessLevel('view')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  accessLevel === 'view'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Can View Only
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('edit')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  accessLevel === 'edit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Can Edit & Draw
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 select-all outline-hidden"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{linkCopied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Email Invitation Form */}
        <form onSubmit={handleInviteEmail} className="space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Invite Collaborators by Email
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="colleague@university.edu"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Send Invite
            </button>
          </div>
        </form>

        {/* Close */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  );
};
