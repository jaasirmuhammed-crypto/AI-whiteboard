import React from 'react';
import { Sparkles, Shield, Code2, Globe2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProject } from '../../context/ProjectContext';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const { setCurrentView } = useProject();

  return (
    <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20 transition-colors duration-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-brand tracking-tight text-slate-900 dark:text-white">
                {t.brand.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.brand.tagline}. Write naturally, capture with one tap, and let multimodal AI synthesize lecture decks, quizzes, and mind maps.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Private & Secure</span>
              <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5 text-indigo-500" /> 15 Languages</span>
              <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-purple-500" /> Production-Ready</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('landing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('whiteboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t.nav.whiteboard}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t.nav.dashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Study Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              AI Generators
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">PowerPoint Slides (.pptx)</span></li>
              <li><span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Interactive MCQ Quizzes</span></li>
              <li><span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Concept Mind Maps</span></li>
              <li><span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Multi-language OCR Notes</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Signature Line */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} AI Whiteboard. {t.footer.rights}
          </div>

          {/* EXACT BRANDING SIGNATURE */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Crafted for Students & Educators •</span>
            <span className="font-brand font-bold text-sm tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-xs">
              Built by SAFA Developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
