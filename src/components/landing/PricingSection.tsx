import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  School, 
  ArrowRight, 
  HelpCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface PricingSectionProps {
  onSelectPlan?: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      id: 'free',
      name: 'Free Scholar',
      priceMonthly: 0,
      priceYearly: 0,
      badge: 'Free Forever',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      description: 'Essential multimodal canvas tools for individual students and casual self-study.',
      buttonText: 'Current Plan',
      isPopular: false,
      features: [
        '5 AI Study Deck generations per day',
        'Full Interactive Whiteboard with 120 FPS drawing',
        'Pre-built Math, Science & History subject templates',
        'PDF & High-Res PNG canvas exports',
        'Local Offline storage with autosave',
        'Basic Cornell notes & Quiz practice tests',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Scholar',
      priceMonthly: 9,
      priceYearly: 6,
      badge: 'Most Popular ⭐',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm',
      description: 'Unlimited AI multimodal synthesis, PowerPoint, Google Slides, and Notion exports.',
      buttonText: 'Upgrade to Pro Scholar',
      isPopular: true,
      features: [
        'Unlimited AI Study Deck & Quiz generations',
        'Native PowerPoint (.PPTX) with custom themes',
        '1-Click Google Slides optimized exports',
        'Notion Page (.notion.md) with toggle questions',
        'Advanced Multimodal OCR for handwriting & formulas',
        'Voice lecture annotation & recording',
        'Cloud sync across iPad, Mac, Windows & mobile',
        'Zero ads & priority neural compute engine',
      ],
    },
    {
      id: 'campus',
      name: 'Campus / Institutional Lab',
      priceMonthly: 29,
      priceYearly: 20,
      badge: 'Universities & Teams',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      description: 'Multiplayer collaboration, custom university branding, and LMS classroom sharing.',
      buttonText: 'Get Campus License',
      isPopular: false,
      features: [
        'Everything in Pro Scholar for up to 10 team seats',
        'Real-time multiplayer whiteboard collaboration',
        'Custom institution branding & logo watermarks',
        'Google Classroom & Canvas LMS direct sharing',
        'Admin dashboard for student license management',
        'Dedicated 24/7 academic priority support',
        'Custom competitive exam syllabus ingestion',
      ],
    },
  ];

  const handlePlanClick = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      showToast(`Selected ${planId.toUpperCase()} plan! Redirecting to checkout... ✨`, 'success');
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800" aria-labelledby="pricing-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Toggle */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 id="pricing-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            Choose the Perfect Plan for Your Study Goals
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Free forever for basic study notes. Upgrade to Pro for unlimited AI generation, Google Slides, and Notion exports.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Monthly
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === 'yearly'}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Save 33% 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-white dark:bg-slate-850 border-2 border-indigo-600 shadow-2xl shadow-indigo-600/10 scale-105 relative'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Popular Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md">
                    Recommended for Serious Students
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold font-brand text-slate-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      / month {billingCycle === 'yearly' && price > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 text-center">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span><b>30-Day Money-Back Guarantee:</b> If AI Whiteboard doesn't save you hours of study time, cancel anytime for a 100% full refund with zero questions asked.</span>
        </div>
      </div>
    </section>
  );
};
