import React from 'react';
import { Target, Clock, Zap, BookMarked, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';

export const BenefitsSection: React.FC = () => {
  const { t } = useI18n();

  const benefits = [
    {
      title: t.benefits.b1Title,
      desc: t.benefits.b1Desc,
      icon: Target,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      title: t.benefits.b2Title,
      desc: t.benefits.b2Desc,
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: t.benefits.b3Title,
      desc: t.benefits.b3Desc,
      icon: Zap,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: t.benefits.b4Title,
      desc: t.benefits.b4Desc,
      icon: BookMarked,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {t.benefits.badge || 'Pedagogical Advantage'}
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            {t.benefits.title}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {t.benefits.subtitle}
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
