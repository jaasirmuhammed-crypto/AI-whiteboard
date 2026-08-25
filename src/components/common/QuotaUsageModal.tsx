import React, { useState } from 'react';
import { 
  Crown, 
  Zap, 
  Clock, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Gauge,
  ExternalLink,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Modal } from './Modal';
import { UserQuotaState } from '../../types/advancedFeatures';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/paymentService';
import { useToast } from './Toast';

interface QuotaUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotaState: UserQuotaState;
  onUpgrade?: () => void;
}

export const QuotaUsageModal: React.FC<QuotaUsageModalProps> = ({
  isOpen,
  onClose,
  quotaState,
  onUpgrade,
}) => {
  const { user, isPremium, upgradeToPremium } = useAuth();
  const { showToast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualPayId, setManualPayId] = useState('');
  const [showVerifyInput, setShowVerifyInput] = useState(false);

  const remaining = isPremium
    ? 'Unlimited'
    : Math.max(0, quotaState.dailyGenerationsAllowed - quotaState.generationsUsedToday);
  const usedPercent = isPremium
    ? 100
    : Math.min(100, (quotaState.generationsUsedToday / quotaState.dailyGenerationsAllowed) * 100);

  const razorpayUrl = PaymentService.getRazorpayPaymentUrl(user, 'Pro Scholar');

  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      features: [
        '5 AI Generations / Day',
        'Standard PowerPoint & PDF Exports',
        'Basic Stroke Recognition',
        'Local Canvas Autosave',
      ],
      current: !isPremium && !quotaState.isProUser,
      cta: 'Current Plan',
    },
    {
      name: 'Pro Scholar',
      price: '₹120',
      period: 'per month',
      popular: true,
      features: [
        'Unlimited AI Generations',
        'Ultra 4K PPTX & Vector SVG Exports',
        'Instant Priority Generation Queue',
        'Cloud Drive Auto-Sync (Google Drive & OneDrive)',
        'Full Version History & Compare',
      ],
      current: isPremium || quotaState.isProUser,
      cta: isPremium ? 'Active Plan' : 'Pay Fixed ₹120 on Razorpay',
    },
    {
      name: 'Campus / Team',
      price: '₹2499 / $29',
      period: 'per team / mo',
      features: [
        'Everything in Pro',
        'Unlimited Live Multiplayer Rooms',
        'Custom Institutional Themes & Watermarks',
        'Dedicated SLA & Admin Dashboards',
      ],
      current: false,
      cta: 'Contact Sales',
    },
  ];

  const handleRazorpayUpgrade = () => {
    window.open(razorpayUrl, '_blank', 'noopener,noreferrer');
    setShowVerifyInput(true);
    showToast('Redirected to Razorpay secure payment link. Complete payment to activate! 💳', 'info');
  };

  const handleManualVerify = async () => {
    if (!user) {
      showToast('Please log in first.', 'error');
      return;
    }

    setIsVerifying(true);
    const payId = manualPayId.trim() || 'pay_' + Math.random().toString(36).substring(2, 12);

    try {
      const result = await PaymentService.verifyPaymentWithBackend(payId, user);
      setIsVerifying(false);

      if (result.success) {
        upgradeToPremium(payId);
        showToast('Payment confirmed! Premium plan activated. 🎉', 'success');
        onUpgrade?.();
        onClose();
      } else {
        showToast(result.message || 'Payment not completed or verified.', 'error');
      }
    } catch (e) {
      setIsVerifying(false);
      showToast('Payment verification error.', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
            <Crown className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-brand text-slate-900 dark:text-white">
            Daily AI Generation Quota & Plans
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isPremium
              ? 'You have an active Premium plan with unlimited high-priority generations.'
              : 'Monitor your daily usage or upgrade via Razorpay for unlimited high-priority generations.'}
          </p>
        </div>

        {/* Usage Gauge Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
              <Gauge className="w-4 h-4 text-indigo-500" />
              <span>Today's Generation Balance</span>
            </div>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {isPremium ? 'Unlimited Generations Active ⭐' : `${remaining} of ${quotaState.dailyGenerationsAllowed} Left`}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isPremium ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : usedPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${isPremium ? 100 : usedPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{isPremium ? 'Active Plan: Premium Unlimited' : `Resets in ${quotaState.resetHoursRemaining} hours`}</span>
            </div>
            <span>Priority Queue: {isPremium || quotaState.priorityQueueActive ? '⚡ High-Speed Active' : 'Standard'}</span>
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                tier.current && isPremium
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                  : tier.popular
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{tier.name}</span>
                  {tier.current && isPremium && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase">
                      ACTIVE
                    </span>
                  )}
                  {tier.popular && !isPremium && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold uppercase">
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xl font-extrabold font-brand text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-[10px] text-slate-400"> /{tier.period}</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={tier.current}
                onClick={tier.popular ? handleRazorpayUpgrade : undefined}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  tier.current
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-default'
                    : tier.popular
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700'
                }`}
              >
                <span>{tier.cta}</span>
                {tier.popular && !tier.current && <ExternalLink className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>

        {/* Verification Box */}
        {showVerifyInput && !isPremium && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2 text-left animate-in fade-in">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verify Razorpay Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Razorpay Payment ID (e.g. pay_Nx1234...)"
                value={manualPayId}
                onChange={(e) => setManualPayId(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleManualVerify}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {isVerifying ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Verify & Activate</span>
              </button>
            </div>
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
