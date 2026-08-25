import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useI18n } from '../../i18n';

export const FAQSection: React.FC = () => {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: t.faq?.q1 || 'How does the handwriting and diagram recognition work?',
      a: t.faq?.a1 || 'When you click "Stop & Process", high-resolution vector and bitmap snapshots of your whiteboard canvas are analyzed by our multimodal neural pipeline. It transcribes natural handwriting, chemical formulas, mathematical proofs, and flowcharts into semantic text and relationships.',
    },
    {
      q: t.faq?.q2 || 'Can I export presentations to standard Microsoft PowerPoint (.pptx)?',
      a: t.faq?.a2 || 'Yes! The PowerPoint generator outputs fully editable native .pptx files formatted with professional color palettes, bullet points, speaker notes, and slide headers.',
    },
    {
      q: t.faq?.q3 || 'Does it support international languages like Tamil, Hindi, Arabic, or French?',
      a: t.faq?.a3 || 'Absolutely. AI Whiteboard supports 15+ international languages with native character rendering, multilingual OCR extraction, and bidirectional RTL formatting for Arabic.',
    },
    {
      q: t.faq?.q4 || 'Will my notes be saved if I accidentally refresh the page?',
      a: t.faq?.a4 || 'Yes, our smart continuous auto-save engine buffers your strokes and elements locally and securely in real time, so your work is always preserved.',
    },
    {
      q: t.faq?.q5 || 'Can I use a stylus like Apple Pencil or Wacom tablet?',
      a: t.faq?.a5 || 'Yes! The canvas utilizes unified Pointer Events API with full pressure sensitivity and palm-rejection support for iPad, tablet, touchscreen, and stylus workflows.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {t.faq?.badge || 'Frequently Asked Questions'}
          </h2>
          <p className="text-3xl font-extrabold font-brand text-slate-900 dark:text-white">
            {t.faq?.title || 'Everything You Need to Know'}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-brand">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
