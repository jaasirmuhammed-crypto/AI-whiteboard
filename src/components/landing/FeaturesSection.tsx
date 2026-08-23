import React from 'react';
import { 
  PenTool, 
  Presentation, 
  HelpCircle, 
  Network, 
  Languages, 
  Save, 
  Smartphone, 
  FileDown 
} from 'lucide-react';
import { useI18n } from '../../i18n';

export const FeaturesSection: React.FC = () => {
  const { t } = useI18n();

  const features = [
    {
      title: t.features.f1Title,
      desc: t.features.f1Desc,
      icon: PenTool,
      accent: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      title: t.features.f2Title,
      desc: t.features.f2Desc,
      icon: Presentation,
      accent: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: t.features.f3Title,
      desc: t.features.f3Desc,
      icon: HelpCircle,
      accent: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: t.features.f4Title,
      desc: t.features.f4Desc,
      icon: Network,
      accent: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      title: t.features.f5Title,
      desc: t.features.f5Desc,
      icon: Languages,
      accent: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
    {
      title: t.features.f6Title,
      desc: t.features.f6Desc,
      icon: Save,
      accent: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Comprehensive Feature Suite
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            {t.features.title}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {t.features.subtitle}
          </p>
        </div>

        {/* 6 Feature Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.accent} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
