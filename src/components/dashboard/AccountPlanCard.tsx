import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  CreditCard, 
  CheckCircle, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  Cloud,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService, FIXED_PREMIUM_PRICE_INR } from '../../services/paymentService';
import { useToast } from '../common/Toast';
import { triggerSubtleConfetti } from '../../utils/confettiUtil';
import { SessionManagementModal } from '../auth/SessionManagementModal';
import { ProfileCustomizationModal } from './ProfileCustomizationModal';
import { TwoFactorAuthModal } from '../auth/TwoFactorAuthModal';
import { Edit3, Lock } from 'lucide-react';

interface AccountPlanCardProps {
  onOpenUpgradeModal: () => void;
}

export const AccountPlanCard: React.FC<AccountPlanCardProps> = ({ onOpenUpgradeModal }) => {
  const { user, isPremium, upgradeToPremium } = useAuth();
  const { showToast } = useToast();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [verifyPayId, setVerifyPayId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerifyBox, setShowVerifyBox] = useState(false);

  const sub = user ? PaymentService.getSubscriptionByUserId(user.id) : null;
  const expiryDate = sub?.expiresAt || user?.subscriptionExpiresAt;

  const handleRazorpayClick = () => {
    const url = PaymentService.getRazorpayPaymentUrl(user, 'Pro Scholar');
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowVerifyBox(true);
    showToast('Redirected to secure Razorpay payment page! Enter Payment ID below to verify.', 'info');
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Background Accent Glow */}
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              Account & Plan Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User Profile & Subscription Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Edit Profile</span>
          </button>

          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isPremium
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}>
            {isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isPremium ? 'PRO SCHOLAR' : 'FREE STARTER'}</span>
          </span>
        </div>
      </div>

      {/* User Info Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Profile Card */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                {(user?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand truncate">
                  {user?.name || 'Scholar User'}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 truncate mt-0.5">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{user?.email || 'scholar@aiwhiteboard.io'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono text-[11px] font-semibold">{user?.id || 'usr_scholar'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Active
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subscription Tier</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {isPremium ? `₹${FIXED_PREMIUM_PRICE_INR} / Month` : 'Free Plan'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">{isPremium ? 'Active' : 'Free Standard'}</strong></span>
            </div>

            {expiryDate && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Expires: {new Date(expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            {isPremium ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Unlimited Plan Activated</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRazorpayClick}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay ₹${FIXED_PREMIUM_PRICE_INR} on Razorpay</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Session Management & Device Security Bar */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Security Status: {user?.sessions?.length || 1} active device(s)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTwoFactorModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>2FA Security</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSessionModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Manage Sessions</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <SessionManagementModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />

      <ProfileCustomizationModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <TwoFactorAuthModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
      />
    </div>
  );
};
