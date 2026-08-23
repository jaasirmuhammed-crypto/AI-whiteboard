import React from 'react';
import { PenTool, Camera, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

export const HowItWorksSection: React.FC = () => {
  const { t } = useI18n();

  const steps = [
    {
      number: '01',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: PenTool,
      color: 'from-indigo-500 to-blue-500',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      number: '02',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: Camera,
      color: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
      textColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      number: '03',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: Cpu,
      color: 'from-purple-500 to-pink-500',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      number: '04',
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Workflow Architecture
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            {t.howItWorks.title}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold font-brand text-slate-300 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-brand mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
