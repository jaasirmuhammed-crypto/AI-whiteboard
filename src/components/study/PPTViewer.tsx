import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Layers,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Award,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { PresentationData, PPTSlide } from '../../types/studyMaterial';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface PPTViewerProps {
  presentation: PresentationData;
}

export const PPTViewer: React.FC<PPTViewerProps> = ({ presentation }) => {
  const { showToast } = useToast();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const slides = presentation.slides || [];
  const currentSlide: PPTSlide | undefined = slides[currentSlideIndex];
  const examContext = presentation.examContext;

  const isUnknownTopic = presentation.title.includes("don't have an idea") || 
                         presentation.title.includes("Unknown Topic") ||
                         (slides.length === 1 && slides[0].title.includes("don't have an idea"));

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleExportPPTX = async () => {
    if (isUnknownTopic) {
      showToast("Cannot generate PPT for an unknown topic. Please specify a valid academic subject!", "error");
      return;
    }
    try {
      showToast('Generating PowerPoint (.pptx) file...', 'info');
      await ExportService.exportToPPTX(presentation);
      showToast('PowerPoint presentation downloaded successfully! 🎉', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PowerPoint presentation', 'error');
    }
  };

  const handleExportPDF = () => {
    if (isUnknownTopic) {
      showToast("Cannot generate PDF for an unknown topic. Please specify a valid academic subject!", "error");
      return;
    }
    try {
      showToast('Generating Printable PDF document...', 'info');
      ExportService.exportPresentationToPDF(presentation);
      showToast('PDF study document downloaded successfully! 📄', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PDF document', 'error');
    }
  };

  if (isUnknownTopic) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 shadow-xl max-w-3xl mx-auto space-y-6 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center mx-auto shadow-md">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-brand text-rose-900 dark:text-rose-200">
            I don't have an idea on that topic
          </h2>
          <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed max-w-xl mx-auto">
            The topic <span className="font-bold underline">"{presentation.topic}"</span> was not recognized as a valid academic, scientific, or competitive exam subject. No PDF or PowerPoint file can be generated.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-left space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Try searching for valid topics like:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['Photosynthesis', 'Machine Learning', 'Newton\'s Laws', 'Calculus', 'Database Systems', 'Indian Constitution', 'Microeconomics'].map((top, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {top}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentSlide) {
    return <div className="p-8 text-center text-slate-500">No slides available.</div>;
  }

  // Helper for facet label
  const getFacetBadge = (slide: PPTSlide) => {
    switch (slide.facetType) {
      case 'overview': return 'Executive Overview';
      case 'definition': return 'Core Definitions';
      case 'mechanism': return 'Process Architecture';
      case 'tradeoffs': return 'Advantages & Disadvantages';
      case 'governance_policy': return 'Constitutional & Policy Focus';
      case 'clinical_pathology': return 'Clinical Pathology & Diagnostics';
      case 'formulas_numerical': return 'Theorems & Formulas';
      case 'applications': return 'Real-World Applications';
      case 'historical_context': return 'Historical Evolution';
      case 'problem_solution': return 'Analytical Breakdown';
      case 'exam_strategy': return 'Exam Revision Rules';
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Target Exam Banner if applicable */}
      {examContext && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span>{examContext.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px]">
                  {examContext.difficultyLevel || 'Exam Focus'}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">({examContext.country})</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {examContext.focusSummary || 'Tailored to official exam syllabus, depth, and question patterns.'}
              </p>
            </div>
          </div>

          {examContext.officialPortal && (
            <a
              href={examContext.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Top Controls & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-brand text-slate-900 dark:text-white">
              {presentation.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              Slide {currentSlideIndex + 1} of {slides.length} • {examContext ? `${examContext.name} Deck` : 'Academic Topic'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              showNotes
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/50 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download .PDF</span>
          </button>

          <button
            onClick={handleExportPPTX}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .PPTX</span>
          </button>
        </div>
      </div>

      {/* Main Slide Deck Canvas Player */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-12 aspect-video flex flex-col justify-between overflow-hidden text-white">
        
        {/* Subtle Slide Accent Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase font-mono">
              {presentation.title}
            </span>
            {getFacetBadge(currentSlide) && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                {getFacetBadge(currentSlide)}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Slide {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Dynamic Slide Body Layouts */}
        <div className="my-auto py-6 z-10 space-y-6 max-w-4xl">
          {currentSlide.layout === 'title' && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                AI Whiteboard Academic Synthesis
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-brand tracking-tight text-white leading-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="text-base sm:text-xl text-indigo-200/90 font-light">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>
          )}

          {currentSlide.layout === 'split' && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-brand text-white">
                {currentSlide.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  {currentSlide.leftPoints?.map((pt, idx) => (
                    <p key={idx} className={`text-xs sm:text-sm leading-relaxed ${idx === 0 ? 'font-bold text-indigo-300' : 'text-slate-300'}`}>
                      {pt}
                    </p>
                  ))}
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  {currentSlide.rightPoints?.map((pt, idx) => (
                    <p key={idx} className={`text-xs sm:text-sm leading-relaxed ${idx === 0 ? 'font-bold text-emerald-300' : 'text-slate-300'}`}>
                      {pt}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSlide.layout === 'diagram' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-brand text-white">
                {currentSlide.title}
              </h2>

              {/* Visual Flowchart Nodes Box */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-indigo-500/40 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Visual Process Architecture Diagram
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-3 overflow-x-auto">
                  <div className="flex-1 min-w-[170px] p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/50 text-center shadow-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                      Step 01 • Input Phase
                    </span>
                    <p className="text-xs text-white font-bold">Input Ingestion & Boundary State</p>
                  </div>

                  <div className="text-indigo-400 font-bold text-lg hidden md:block">➔</div>

                  <div className="flex-1 min-w-[170px] p-4 rounded-2xl bg-purple-900/40 border border-purple-500/50 text-center shadow-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1">
                      Step 02 • Core Process
                    </span>
                    <p className="text-xs text-white font-bold">Transformation & Mechanism Engine</p>
                  </div>

                  <div className="text-purple-400 font-bold text-lg hidden md:block">➔</div>

                  <div className="flex-1 min-w-[170px] p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-center shadow-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                      Step 03 • Output Phase
                    </span>
                    <p className="text-xs text-white font-bold">Stabilized Product & Equilibrium</p>
                  </div>
                </div>

                {currentSlide.diagramDescription && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentSlide.diagramDescription}
                  </div>
                )}
              </div>

              {currentSlide.bulletPoints && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {currentSlide.bulletPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(currentSlide.layout === 'bullets' || currentSlide.layout === 'summary') && (
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-brand text-white">
                {currentSlide.title}
              </h2>
              <ul className="space-y-3.5 text-xs sm:text-base text-slate-300">
                {currentSlide.bulletPoints?.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500 z-10">
          <span>AI Whiteboard Presentation Deck</span>
          <span className="font-semibold text-slate-400">Built by SAFA Developers</span>
        </div>

      </div>

      {/* Slide Navigation Bar & Thumbnails */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Thumbnails dots/selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                currentSlideIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md scale-110'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && currentSlide.notes && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Speaker & Revision Notes:</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            {currentSlide.notes}
          </p>
        </div>
      )}

    </div>
  );
};
