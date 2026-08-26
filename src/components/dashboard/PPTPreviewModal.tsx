import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Sparkles,
  Maximize2,
  FileDown
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { PresentationData } from '../../types/studyMaterial';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';
import { useProject } from '../../context/ProjectContext';

interface PPTPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentation: PresentationData | null;
}

export const PPTPreviewModal: React.FC<PPTPreviewModalProps> = ({ isOpen, onClose, presentation }) => {
  const { setCurrentView, setActiveStudyMaterials, currentProject } = useProject();
  const { showToast } = useToast();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  if (!presentation || !presentation.slides || presentation.slides.length === 0) return null;

  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];
  const totalSlides = presentation.slides.length;

  const handleNext = () => {
    setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleDownloadPPTX = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportToPPTX(presentation, presentation.title);
      showToast(`PowerPoint deck "${presentation.title}.pptx" exported successfully! 📊`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to export PPTX presentation.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = () => {
    ExportService.exportPresentationToPDF(presentation, presentation.title);
    showToast('Presentation exported as PDF! 📑', 'success');
  };

  const handleOpenStudyHub = () => {
    if (currentProject?.studyMaterials) {
      setActiveStudyMaterials(currentProject.studyMaterials);
    }
    setCurrentView('study_hub');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-brand truncate max-w-md">
                {presentation.title}
              </h2>
              <p className="text-xs text-slate-400">
                Slide {currentSlideIndex + 1} of {totalSlides} • {presentation.theme || 'Modern'} Theme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download formatted PDF slides"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleDownloadPPTX}
              disabled={isExporting}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Download .PPTX'}</span>
            </button>
          </div>
        </div>

        {/* Slide Display Canvas */}
        <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between shadow-2xl border border-indigo-500/30 overflow-hidden select-none">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Slide Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-mono uppercase tracking-wider">
              <span>{presentation.title}</span>
              <span>Slide {currentSlide.slideNumber || currentSlideIndex + 1}</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold font-brand tracking-tight text-white leading-tight">
              {currentSlide.title}
            </h3>

            {currentSlide.subtitle && (
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Bullets */}
            {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-200 max-h-48 overflow-y-auto">
                {currentSlide.bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Split layout left & right */}
            {currentSlide.layout === 'split' && (
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-200">
                {currentSlide.leftPoints && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <span className="font-bold text-emerald-400 uppercase text-[10px]">Key Pillars</span>
                    {currentSlide.leftPoints.map((p, i) => (
                      <p key={i} className="text-slate-300">• {p}</p>
                    ))}
                  </div>
                )}
                {currentSlide.rightPoints && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <span className="font-bold text-purple-400 uppercase text-[10px]">Applications</span>
                    {currentSlide.rightPoints.map((p, i) => (
                      <p key={i} className="text-slate-300">• {p}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
            <span>Generated by AI Whiteboard</span>
            <span>Built by SAFA Developers</span>
          </div>

        </div>

        {/* Carousel Navigation Controller */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Slide Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
            {presentation.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-indigo-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleOpenStudyHub}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Full Screen PPT Viewer in Study Hub</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
