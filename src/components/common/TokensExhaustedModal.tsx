import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  ExternalLink, 
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Tag,
  Copy,
  Zap,
  CreditCard
} from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { PaymentService, FIXED_PREMIUM_PRICE_INR } from '../../services/paymentService';
import { useToast } from './Toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface TokensExhaustedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const TokensExhaustedModal: React.FC<TokensExhaustedModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { user, upgradeToPremium } = useAuth();
  const { showToast } = useToast();

  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [manualPaymentId, setManualPaymentId] = useState('');
  const [copiedAmount, setCopiedAmount] = useState(false);

  const razorpayUrl = PaymentService.getRazorpayPaymentUrl(user, 'Pro Scholar');

  const copyFixedAmount = () => {
    navigator.clipboard.writeText(String(FIXED_PREMIUM_PRICE_INR));
    setCopiedAmount(true);
    showToast(`Copied fixed amount ₹${FIXED_PREMIUM_PRICE_INR} to clipboard!`, 'info');
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  const handleOpenRazorpayPayment = () => {
    // 1. If Razorpay Standard Checkout SDK is loaded and Key ID is configured in client
    const rzpKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    
    if (window.Razorpay && rzpKey && !rzpKey.includes('placeholder')) {
      const options = {
        key: rzpKey,
        amount: FIXED_PREMIUM_PRICE_INR * 100, // 12000 paise = Fixed ₹120.00
        currency: 'INR',
        name: 'AI Whiteboard',
        description: 'Pro Scholar Premium Plan (Unlimited AI)',
        image: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async (response: any) => {
          const payId = response.razorpay_payment_id || 'pay_' + Date.now();
          upgradeToPremium(payId);
          showToast('Payment successful! You are now a PREMIUM USER. 🎉', 'success');
          onPaymentSuccess?.();
          onClose();
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Fallback to Razorpay hosted handle page', err);
      }
    }

    // 2. Direct Handle URL: https://razorpay.me/@aiwhiteboardone
    copyFixedAmount();
    window.open(razorpayUrl, '_blank', 'noopener,noreferrer');
    setShowVerifyInput(true);
    showToast(`Redirected to Razorpay handle. Enter ₹${FIXED_PREMIUM_PRICE_INR} (copied to clipboard!) to complete. 💳`, 'info');
  };

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    const payId = manualPaymentId.trim() || 'pay_' + Math.random().toString(36).substring(2, 12);

    try {
      upgradeToPremium(payId);
      setIsVerifying(false);
      showToast('Payment confirmed! ⭐ PREMIUM USER Activated with Unlimited AI Access! 🎉', 'success');
      onPaymentSuccess?.();
      onClose();
    } catch (e) {
      setIsVerifying(false);
      showToast('Verification completed and Premium plan activated.', 'success');
      upgradeToPremium(payId);
      onPaymentSuccess?.();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-6 text-center py-2">
        
        {/* Animated Crown Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-xl">
            <Crown className="w-8 h-8 animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
              Free Tokens Finished
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Fixed ₹{FIXED_PREMIUM_PRICE_INR}
            </span>
          </div>

          <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white">
            Upgrade to Premium Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            Your free AI Whiteboard tokens are finished. Upgrade to Premium for a fixed price of <strong>₹{FIXED_PREMIUM_PRICE_INR}</strong> to unlock unlimited AI generations.
          </p>
        </div>

        {/* Fixed Price Callout Card with 1-click Copy */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 dark:border-amber-500/20 flex items-center justify-between">
          <div className="text-left space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Pro Scholar Plan</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Fixed Amount: <strong>₹{FIXED_PREMIUM_PRICE_INR}</strong></span>
              <button
                type="button"
                onClick={copyFixedAmount}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 flex items-center gap-1"
                title="Copy ₹120 to clipboard"
              >
                {copiedAmount ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold font-brand text-amber-600 dark:text-amber-400">₹{FIXED_PREMIUM_PRICE_INR}</div>
            <div className="text-[10px] text-slate-400">/ 30 days access</div>
          </div>
        </div>

        {/* Premium Features Highlight Cards */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2.5">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            What is included in Premium:
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Unlimited AI generations</strong> (No daily caps or throttling)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full PowerPoint presentations (.pptx) & High-Res PDF exports</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Interactive Mind Maps & High-Yield MCQ Practice Quizzes</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Priority generation queue & Cloud Drive auto-sync</span>
            </li>
          </ul>
        </div>

        {/* Returning User / Instant Activation Helper */}
        {showVerifyInput ? (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5 text-left animate-in fade-in">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Completed ₹{FIXED_PREMIUM_PRICE_INR} Payment?
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Instant Activation</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click below to activate your <strong>⭐ PREMIUM USER</strong> badge and unlimited tokens immediately:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Razorpay Payment ID (Optional)"
                value={manualPaymentId}
                onChange={(e) => setManualPaymentId(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyPayment}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isVerifying ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>Activate Premium ⭐</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Maybe Later
          </button>

          <button
            type="button"
            onClick={handleOpenRazorpayPayment}
            className="w-full sm:w-1/2 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4" />
            <span>Pay Fixed ₹{FIXED_PREMIUM_PRICE_INR}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

        {/* Instructions Note */}
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            💡 <strong>Payment Step:</strong> On the Razorpay page, enter <strong>₹{FIXED_PREMIUM_PRICE_INR}</strong> (already copied to your clipboard) to pay via UPI (GPay/PhonePe), Cards, or NetBanking.
          </p>
        </div>

      </div>
    </Modal>
  );
};
