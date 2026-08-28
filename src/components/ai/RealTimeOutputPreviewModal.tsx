import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Palette,
  Eye,
  HelpCircle,
  Network,
  X
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Exam } from '../../types/competitive';
import { PPTSlide } from '../../types/studyMaterial';

interface RealTimeOutputPreviewModalProps {
  isOpen: boolean;
  topic: string;
  targetExam?: Exam | null;
  onClose: () => void;
  onConfirmGenerate: (topic: string, theme: string, slideCount: number) => void;
}

export const RealTimeOutputPreviewModal: React.FC<RealTimeOutputPreviewModalProps> = ({
  isOpen,
  topic,
  targetExam,
  onClose,
  onConfirmGenerate,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'indigo' | 'academic' | 'cyberpunk' | 'minimal' | 'emerald'>('indigo');
  const [slideCountOption, setSlideCountOption] = useState<number>(6);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [previewTab, setPreviewTab] = useState<'slides' | 'quiz' | 'mindmap'>('slides');

  const themes = [
    { id: 'indigo', name: 'Modern Indigo', bg: 'from-slate-900 via-indigo-950 to-slate-900', cardBg: 'bg-indigo-950/40 border-indigo-500/30', accent: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'academic', name: 'Academic Formal', bg: 'from-slate-900 via-blue-950 to-slate-950', cardBg: 'bg-blue-950/40 border-blue-500/30', accent: 'text-sky-400', badge: 'bg-blue-500/20 text-blue-300' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', bg: 'from-slate-950 via-purple-950 to-slate-900', cardBg: 'bg-purple-950/40 border-purple-500/30', accent: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
    { id: 'minimal', name: 'Minimal Slate', bg: 'from-slate-950 via-slate-900 to-slate-950', cardBg: 'bg-slate-900/60 border-slate-700/50', accent: 'text-slate-200', badge: 'bg-slate-800 text-slate-300' },
    { id: 'emerald', name: 'Emerald Forest', bg: 'from-slate-950 via-emerald-950 to-slate-900', cardBg: 'bg-emerald-950/40 border-emerald-500/30', accent: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  ];

  const currentThemeConfig = themes.find((t) => t.id === selectedTheme) || themes[0];

  // Dynamic preview slides based on topic
  const cleanTopic = topic.trim() || 'Academic Study Concepts';
  const previewSlides: PPTSlide[] = [
    {
      id: 'prev_slide_1',
      slideNumber: 1,
      title: cleanTopic,
      subtitle: targetExam ? `Target Curriculum: ${targetExam.name} (${targetExam.badge})` : 'Comprehensive Multi-Disciplinary Masterclass',
      layout: 'title',
      notes: `Introduction and foundational roadmap for ${cleanTopic}.`,
    },
    {
      id: 'prev_slide_2',
      slideNumber: 2,
      title: 'Core Conceptual Foundations & Principles',
      layout: 'bullets',
      bulletPoints: [
        `Fundamental theoretical framework governing ${cleanTopic}`,
        'Key governing laws, definitions, and mathematical relations',
        'Standard boundary conditions, assumptions, and physical interpretations',
        'Essential terminology frequently tested in competitive examinations',
      ],
      notes: 'Focus on clear definitions and first-principles reasoning.',
    },
    {
      id: 'prev_slide_3',
      slideNumber: 3,
      title: 'Detailed Analytical Breakdown & Mechanism',
      layout: 'split',
      leftPoints: [
        'Component Analysis & Variables',
        'Direct relationship between primary input factors and resulting outputs',
        'Critical governing equations & derivations',
      ],
      rightPoints: [
        'Experimental / Practical Evidence',
        'Observed anomalies and counter-intuitive edge cases',
        'Standard exam pitfalls and problem-solving shortcuts',
      ],
      notes: 'Contrast theoretical models with empirical real-world behavior.',
    },
    {
      id: 'prev_slide_4',
      slideNumber: 4,
      title: 'Practical Applications & Cross-Domain Impact',
      layout: 'bullets',
      bulletPoints: [
        `High-yield industrial and academic use cases of ${cleanTopic}`,
        'Integration with modern technology, engineering, and policy decision-making',
        'Comparative matrix vs alternative methodologies and historical paradigms',
      ],
      diagramDescription: 'Source Concept -> Process Transformations -> Final Measurable Outcome',
      notes: 'Highlight real-world relevance and modern advances.',
    },
    {
      id: 'prev_slide_5',
      slideNumber: 5,
      title: 'Executive Summary & High-Yield Takeaways',
      layout: 'bullets',
      bulletPoints: [
        `1. Master core definition: The pivotal essence of ${cleanTopic}`,
        '2. Remember key governing equations and conservation laws',
        '3. Focus on application questions in competitive evaluations',
        '4. Review practice questions in the generated MCQ quiz deck',
      ],
      notes: 'Quick 60-second review for last-minute exam prep.',
    },
  ];

  const activeSlide = previewSlides[Math.min(activeSlideIndex, previewSlides.length - 1)];

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev < previewSlides.length - 1 ? prev + 1 : prev));
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                  Real-Time Output & Presentation Preview
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect slide design, layout hierarchy, and theme styling before generating the final material.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Themes & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'slides', label: 'PowerPoint Deck', icon: Presentation },
              { id: 'quiz', label: 'MCQ Quiz', icon: HelpCircle },
              { id: 'mindmap', label: 'Mind Map', icon: Network },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = previewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Selector Pills */}
          {previewTab === 'slides' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Theme:
              </span>
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSelectedTheme(th.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedTheme === th.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Preview Screen */}
        {previewTab === 'slides' && (
          <div className="space-y-3">
            {/* 16:9 Presentation Canvas Container */}
            <div className={`w-full aspect-video rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${currentThemeConfig.bg} text-white shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
              {/* Subtle slide decorative glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${currentThemeConfig.badge}`}>
                    SLIDE {activeSlide.slideNumber} OF {previewSlides.length}
                  </span>
                  {targetExam && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {targetExam.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  AI Whiteboard • 16:9 HD
                </span>
              </div>

              {/* Slide Body Content */}
              <div className="my-auto py-4 space-y-4">
                {activeSlide.layout === 'title' ? (
                  <div className="space-y-3 text-center sm:text-left py-4">
                    <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${currentThemeConfig.accent}`}>
                      {activeSlide.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                ) : activeSlide.layout === 'split' ? (
                  <div className="space-y-4">
                    <h3 className={`text-xl sm:text-2xl font-bold ${currentThemeConfig.accent}`}>
                      {activeSlide.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className={`p-4 rounded-2xl ${currentThemeConfig.cardBg} border space-y-2`}>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Analysis</span>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                          {activeSlide.leftPoints?.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={`p-4 rounded-2xl ${currentThemeConfig.cardBg} border space-y-2`}>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Applications</span>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                          {activeSlide.rightPoints?.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className={`text-xl sm:text-2xl font-bold ${currentThemeConfig.accent}`}>
                      {activeSlide.title}
                    </h3>
                    <div className={`p-5 rounded-2xl ${currentThemeConfig.cardBg} border space-y-2`}>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                        {activeSlide.bulletPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                      {activeSlide.diagramDescription && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-mono text-indigo-300">
                          ⚡ Flow: {activeSlide.diagramDescription}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2">
                <span>{topic}</span>
                <span>Generated by AI Multimodal Engine</span>
              </div>
            </div>

            {/* Slide Navigation Strip */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {previewSlides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeSlideIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevSlide}
                  disabled={activeSlideIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  disabled={activeSlideIndex === previewSlides.length - 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MCQ Quiz Tab Preview */}
        {previewTab === 'quiz' && (
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample High-Yield Question Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">5 Questions Total</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Q1. In the context of {cleanTopic}, which of the following statements represents the primary governing principle?
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">(A) Direct linear proportionality under standard thermodynamic conditions</div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">✓ (B) Primary conservation theorem with invariant boundary conditions</div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">(C) Randomized stochastic decay independent of input parameters</div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">(D) Inverse asymptotic divergence across non-homogeneous mediums</div>
              </div>
            </div>
          </div>
        )}

        {/* Mind Map Tab Preview */}
        {previewTab === 'mindmap' && (
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interactive Radial Mind Map Outline</span>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4">
              <div className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md">
                {cleanTopic}
              </div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-lg text-xs">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold">
                  1. Foundations & Laws
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                  2. Derivations & Logic
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  3. Exam Applications
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Selected Theme: <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedTheme}</span> • ~{slideCountOption} Slides Deck
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmGenerate(cleanTopic, selectedTheme, slideCountOption);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Generate Everything</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
