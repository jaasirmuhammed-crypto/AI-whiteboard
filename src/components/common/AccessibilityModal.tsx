import React from 'react';
import { 
  Eye, 
  Sparkles, 
  Zap, 
  Type, 
  Volume2, 
  Keyboard, 
  Check, 
  Sliders, 
  SunMoon, 
  X,
  Contrast,
  Smile
} from 'lucide-react';
import { Modal } from './Modal';
import { useAccessibility, FontSizeScale } from '../../context/AccessibilityContext';

export const AccessibilityModal: React.FC = () => {
  const {
    accessibilityModalOpen,
    setAccessibilityModalOpen,
    highContrast,
    setHighContrast,
    fontSizeScale,
    setFontSizeScale,
    reducedMotion,
    setReducedMotion,
    dyslexicFont,
    setDyslexicFont,
    announceToScreenReader,
  } = useAccessibility();

  const handleToggle = (name: string, currentVal: boolean, setter: (val: boolean) => void) => {
    setter(!currentVal);
    announceToScreenReader(`${name} is now ${!currentVal ? 'enabled' : 'disabled'}`);
  };

  return (
    <Modal
      isOpen={accessibilityModalOpen}
      onClose={() => setAccessibilityModalOpen(false)}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6" role="dialog" aria-labelledby="acc-modal-title">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="acc-modal-title" className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Accessibility & Assistive Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                WCAG 2.1 AA Compliant tools for low vision, dyslexia, and keyboard navigation.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAccessibilityModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close Accessibility Settings Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accessibility Features List */}
        <div className="space-y-4">
          {/* 1. High Contrast Mode */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  High Contrast Mode
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  WCAG AAA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance edge clarity with stark contrast borders, pure dark backgrounds, and vibrant text.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => handleToggle('High Contrast', highContrast, setHighContrast)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                highContrast ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Text Scaling */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Font & Interface Scaling
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">Current: {fontSizeScale}</span>
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Font scale options">
              {[
                { scale: 'normal' as FontSizeScale, label: '100% (Default)', desc: 'Standard UI' },
                { scale: 'large' as FontSizeScale, label: '125% (Large)', desc: 'Easier Reading' },
                { scale: 'xlarge' as FontSizeScale, label: '150% (X-Large)', desc: 'Maximum Clarity' },
              ].map((opt) => (
                <button
                  key={opt.scale}
                  type="button"
                  role="radio"
                  aria-checked={fontSizeScale === opt.scale}
                  onClick={() => setFontSizeScale(opt.scale)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    fontSizeScale === opt.scale
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-75 font-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dyslexia-Friendly Typography */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Dyslexia-Friendly Typography
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjusts letter tracking, word spacing, and weighted fonts to reduce character inversion.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={dyslexicFont}
              onClick={() => handleToggle('Dyslexia-Friendly Font', dyslexicFont, setDyslexicFont)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                dyslexicFont ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Reduced Motion */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Reduced Motion & No Flashing
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disables animated backgrounds, floating elements, and transitions for vestibular safety.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={reducedMotion}
              onClick={() => handleToggle('Reduced Motion', reducedMotion, setReducedMotion)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                reducedMotion ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyboard Navigation Shortcuts Helper Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Essential Keyboard Navigation Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Tab</kbd> Move next focusable element</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Shift+Tab</kbd> Move previous focus</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Enter / Space</kbd> Activate buttons</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> Close current dialog</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Settings are auto-saved to your browser.</span>
          <button
            type="button"
            onClick={() => setAccessibilityModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
