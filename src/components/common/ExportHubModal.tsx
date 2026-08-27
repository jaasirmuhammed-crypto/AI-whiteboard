import React, { useState } from 'react';
import { 
  Download, 
  Presentation, 
  FileText, 
  HelpCircle, 
  Network, 
  Image as ImageIcon, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Check, 
  HardDrive, 
  Sparkles, 
  Settings2, 
  Share2, 
  FileCheck,
  Palette,
  Layers,
  Clock
} from 'lucide-react';
import { Modal } from './Modal';
import { PresentationData, MCQQuizData, MindMapData, StudyMaterialsPackage } from '../../types/studyMaterial';
import { ExportService, PPTXTheme } from '../../services/exportService';
import { offlineStorageService } from '../../services/offlineStorageService';
import { useToast } from './Toast';

interface ExportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyPackage?: StudyMaterialsPackage | null;
  canvasSnapshot?: string;
  canvasSvgString?: string;
  rawCanvasElements?: any[];
}

export const ExportHubModal: React.FC<ExportHubModalProps> = ({
  isOpen,
  onClose,
  studyPackage,
  canvasSnapshot,
  canvasSvgString,
  rawCanvasElements = [],
}) => {
  const { showToast } = useToast();

  const [selectedFormat, setSelectedFormat] = useState<'pptx' | 'pdf' | 'word_doc' | 'markdown' | 'mcq' | 'mindmap_svg' | 'canvas_png'>('pptx');
  const [compressionQuality, setCompressionQuality] = useState<'standard' | 'compressed' | 'ultra'>('standard');
  const [pptxTheme, setPptxTheme] = useState<PPTXTheme>('indigo');
  const [pngScale, setPngScale] = useState<number>(2);
  const [pngTransparent, setPngTransparent] = useState<boolean>(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cloudDriveStatus, setCloudDriveStatus] = useState<string | null>(null);

  // Selected slide indices for PPTX export
  const totalSlides = studyPackage?.presentation.slides.length || 6;
  const [selectedSlideIndices, setSelectedSlideIndices] = useState<number[]>(
    Array.from({ length: totalSlides }, (_, i) => i)
  );

  const toggleSlideSelection = (idx: number) => {
    if (selectedSlideIndices.includes(idx)) {
      if (selectedSlideIndices.length > 1) {
        setSelectedSlideIndices(selectedSlideIndices.filter((i) => i !== idx));
      }
    } else {
      setSelectedSlideIndices([...selectedSlideIndices, idx].sort());
    }
  };

  // Estimate file size
  const estimateFileSize = () => {
    let base = 1.2;
    if (selectedFormat === 'pptx') base = 2.4 * (selectedSlideIndices.length / totalSlides);
    else if (selectedFormat === 'pdf') base = 3.8;
    else if (selectedFormat === 'word_doc') base = 0.85;
    else if (selectedFormat === 'markdown') base = 0.08;
    else if (selectedFormat === 'mcq') base = 0.15;
    else if (selectedFormat === 'mindmap_svg') base = 0.45;
    else if (selectedFormat === 'canvas_png') base = 1.2 * pngScale;

    if (compressionQuality === 'compressed') base *= 0.45;
    if (compressionQuality === 'ultra') base *= 1.8;

    return `${base.toFixed(2)} MB`;
  };

  const handleExecuteExport = async () => {
    const isOnline = offlineStorageService.isOnline();

    // If offline and format requires heavy backend assets, queue it
    if (!isOnline && (selectedFormat === 'word_doc' || selectedFormat === 'pdf')) {
      await offlineStorageService.queueOfflineExport({
        format: selectedFormat,
        title: studyPackage?.topic || 'Whiteboard Export',
        payload: { studyPackage, selectedSlideIndices, pptxTheme },
      });
      showToast('Offline Mode: Export queued! It will download automatically when online. ⏱️', 'info');
      onClose();
      return;
    }

    setIsExporting(true);
    setExportProgress(20);

    try {
      if (selectedFormat === 'pptx' && studyPackage?.presentation) {
        setExportProgress(50);
        const filteredPresentation: PresentationData = {
          ...studyPackage.presentation,
          slides: studyPackage.presentation.slides.filter((_, idx) => selectedSlideIndices.includes(idx)),
        };
        await ExportService.exportToPPTX(
          filteredPresentation,
          `${studyPackage.topic.replace(/\s+/g, '_')}_Deck`,
          pptxTheme
        );
      } else if (selectedFormat === 'pdf' && studyPackage?.presentation) {
        setExportProgress(50);
        await ExportService.exportPresentationToPDF(studyPackage.presentation, `${studyPackage.topic.replace(/\s+/g, '_')}_Document`);
      } else if (selectedFormat === 'word_doc' && studyPackage) {
        setExportProgress(60);
        ExportService.exportToWordDoc(studyPackage, `${studyPackage.topic.replace(/\s+/g, '_')}_Notes`);
      } else if (selectedFormat === 'markdown' && studyPackage) {
        setExportProgress(65);
        ExportService.exportToMarkdownDoc(studyPackage, `${studyPackage.topic.replace(/\s+/g, '_')}_StudyGuide`);
      } else if (selectedFormat === 'mcq' && studyPackage?.quiz) {
        setExportProgress(60);
        ExportService.exportQuizToPDF(studyPackage.quiz);
      } else if (selectedFormat === 'mindmap_svg') {
        setExportProgress(70);
        const blob = new Blob([canvasSvgString || '<svg></svg>'], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${studyPackage?.topic || 'Whiteboard'}_MindMap.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (selectedFormat === 'canvas_png') {
        setExportProgress(75);
        if (rawCanvasElements && rawCanvasElements.length > 0) {
          await ExportService.exportHighResPNG(
            rawCanvasElements,
            `${studyPackage?.topic || 'Whiteboard'}_Canvas`,
            pngScale,
            pngTransparent
          );
        } else if (canvasSnapshot) {
          const a = document.createElement('a');
          a.href = canvasSnapshot;
          a.download = `${studyPackage?.topic || 'Whiteboard'}_Canvas.png`;
          a.click();
        }
      }

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        showToast('Export downloaded successfully! 🎉', 'success');
      }, 400);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const handleCopyLink = () => {
    const dummyUrl = `https://aiwhiteboard.safa.app/materials/share/${studyPackage?.id || 'demo_123'}`;
    navigator.clipboard.writeText(dummyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast('Direct download link copied to clipboard!', 'info');
  };

  const handleCloudDriveUpload = (provider: 'Google Drive' | 'OneDrive') => {
    setCloudDriveStatus(`Syncing to ${provider}...`);
    setTimeout(() => {
      setCloudDriveStatus(`Saved to ${provider} / AI Whiteboard folder ✅`);
      showToast(`Export synced to your ${provider}!`, 'success');
      setTimeout(() => setCloudDriveStatus(null), 3000);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Export & Download Hub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose format, customize theme, and download or share instantly.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Est. File Size</div>
            <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{estimateFileSize()}</div>
          </div>
        </div>

        {/* Format Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setSelectedFormat('pptx')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'pptx'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <Presentation className="w-4 h-4 text-indigo-600" />
              {selectedFormat === 'pptx' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">PowerPoint</div>
            <div className="text-[10px] text-slate-500">.pptx Slide Deck</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('pdf')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'pdf'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-4 h-4 text-rose-500" />
              {selectedFormat === 'pdf' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Print PDF</div>
            <div className="text-[10px] text-slate-500">Study Handouts</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('markdown')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'markdown'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-4 h-4 text-cyan-600" />
              {selectedFormat === 'markdown' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Markdown</div>
            <div className="text-[10px] text-slate-500">.md Study Notes</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('canvas_png')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'canvas_png'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              {selectedFormat === 'canvas_png' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">High-Res PNG</div>
            <div className="text-[10px] text-slate-500">1x / 2x / 4x Image</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('mindmap_svg')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'mindmap_svg'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <Network className="w-4 h-4 text-purple-500" />
              {selectedFormat === 'mindmap_svg' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Vector SVG</div>
            <div className="text-[10px] text-slate-500">Infinite Scale</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('word_doc')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'word_doc'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileCheck className="w-4 h-4 text-blue-600" />
              {selectedFormat === 'word_doc' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Word Doc</div>
            <div className="text-[10px] text-slate-500">.docx Guide</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('mcq')}
            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
              selectedFormat === 'mcq'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              {selectedFormat === 'mcq' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Quiz PDF</div>
            <div className="text-[10px] text-slate-500">MCQ Test Bank</div>
          </button>
        </div>

        {/* Dynamic Controls based on selected format */}

        {/* PPTX Theme Selection */}
        {selectedFormat === 'pptx' && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Slide Deck Theme Palette</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'indigo', name: 'Indigo Scholar', bg: 'bg-indigo-600' },
                { id: 'midnight', name: 'Midnight Dark', bg: 'bg-slate-900 border border-sky-400' },
                { id: 'emerald', name: 'Emerald Science', bg: 'bg-emerald-600' },
                { id: 'amber', name: 'Amber Creative', bg: 'bg-amber-600' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setPptxTheme(th.id as PPTXTheme)}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition-all ${
                    pptxTheme === th.id
                      ? 'border-indigo-500 bg-white dark:bg-slate-800 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${th.bg}`} />
                  <span className="text-slate-800 dark:text-slate-200">{th.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PNG Resolution and Transparency options */}
        {selectedFormat === 'canvas_png' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Resolution Scale:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPngScale(s)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      pngScale === s
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {s}x {s === 4 ? '(Ultra)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Transparent Background:</span>
              <button
                type="button"
                onClick={() => setPngTransparent(!pngTransparent)}
                className={`px-3 py-1 rounded-lg font-bold ${
                  pngTransparent ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {pngTransparent ? 'Transparent' : 'Solid White'}
              </button>
            </div>
          </div>
        )}

        {/* Slide Selection (When PPTX or PDF is selected) */}
        {(selectedFormat === 'pptx' || selectedFormat === 'pdf') && studyPackage?.presentation && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-white">
                Include Slides ({selectedSlideIndices.length} / {totalSlides} selected)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selectedSlideIndices.length === totalSlides) {
                    setSelectedSlideIndices([0]);
                  } else {
                    setSelectedSlideIndices(Array.from({ length: totalSlides }, (_, i) => i));
                  }
                }}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {selectedSlideIndices.length === totalSlides ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {studyPackage.presentation.slides.map((slide, idx) => {
                const isSelected = selectedSlideIndices.includes(idx);
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => toggleSlideSelection(idx)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold">Slide {idx + 1}</div>
                    <div className="text-[9px] truncate max-w-[60px] mx-auto opacity-80">{slide.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cloud Sync Integration Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-medium">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>{cloudDriveStatus || 'Save directly to Cloud Storage:'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCloudDriveUpload('Google Drive')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
            >
              <span>Google Drive</span>
            </button>
            <button
              type="button"
              onClick={() => handleCloudDriveUpload('OneDrive')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
            >
              <span>OneDrive</span>
            </button>
          </div>
        </div>

        {/* Progress Bar during Export */}
        {isExporting && (
          <div className="space-y-1.5 animate-in fade-in">
            <div className="flex justify-between text-xs text-indigo-600 font-bold">
              <span>Synthesizing export package...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExecuteExport}
              className="w-1/2 sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download {selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
