import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types/i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        aria-label="Select Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline-block">{currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            Select Language (15 Available)
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as SupportedLanguage);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors ${
                language === lang.code
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{lang.flag}</span>
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-[11px] text-slate-400">({lang.name})</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
