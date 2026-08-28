import React, { useState } from 'react';
import { 
  Download, 
  Presentation, 
  FileText, 
  Layers, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Image as ImageIcon, 
  Palette, 
  FileCheck2, 
  X,
  FileCode
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ExportService, PPTXTheme } from '../../services/exportService';
import { AnalyticsTrackingService } from '../../services/analyticsTrackingService';
import { useToast } from '../common/Toast';
import { WhiteboardElement } from '../../types/whiteboard';
import { PresentationData, StudyMaterialsPackage } from '../../types/studyMaterial';

interface ExportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements?: WhiteboardElement[];
  rawCanvasElements?: WhiteboardElement[];
  studyMaterials?: StudyMaterialsPackage | Partial<StudyMaterialsPackage> | null;
  studyPackage?: StudyMaterialsPackage | Partial<StudyMaterialsPackage> | null;
  projectTitle?: string;
  canvasSnapshot?: string;
  canvasSvgString?: string;
}

export const ExportHubModal: React.FC<ExportHubModalProps> = ({
  isOpen,
  onClose,
  elements = [],
  rawCanvasElements = [],
  studyMaterials,
  studyPackage,
  projectTitle = 'Study Materials',
}) => {
  const activeElements = elements.length > 0 ? elements : rawCanvasElements;
  const activeStudyMaterials = studyMaterials || studyPackage;
  const { showToast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'pptx' | 'gslides' | 'pdf' | 'notion' | 'word' | 'png' | 'svg'>('pptx');
  const [pptxTheme, setPptxTheme] = useState<PPTXTheme>('indigo');
  const [pngScale, setPngScale] = useState<1 | 2 | 4>(2);
  const [pngTransparent, setPngTransparent] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedNotion, setCopiedNotion] = useState<boolean>(false);

  // Derive presentation from study materials or fallback mock
  const presentation: PresentationData = (activeStudyMaterials?.presentation as PresentationData) || {
    id: 'pres_export',
    topic: projectTitle,
    title: projectTitle,
    author: 'AI Whiteboard',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide_mock_1',
        slideNumber: 1,
        title: projectTitle,
        subtitle: 'Synthesized Study Materials & Whiteboard Deck',
        layout: 'title',
        notes: 'Introductory slide.',
      },
      {
        id: 'slide_mock_2',
        slideNumber: 2,
        title: 'Key Concepts & Lecture Notes',
        layout: 'bullets',
        bulletPoints: [
          'Primary principles and definitions derived from visual notes',
          'Fundamental governing laws and mathematical formulations',
          'High-yield exam review points and formulas',
        ],
        notes: 'Core concepts slide.',
      },
      {
        id: 'slide_mock_3',
        slideNumber: 3,
        title: 'Analytical Applications & Next Steps',
        layout: 'split',
        leftPoints: ['Core Derivations', 'Formula Transformations', 'Boundary Conditions'],
        rightPoints: ['Practical Applications', 'Competitive Exam Tips', 'Summary Review'],
        notes: 'Summary slide.',
      },
    ],
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (selectedFormat === 'pptx') {
        showToast('Generating PowerPoint (.pptx)... 📊', 'info');
        await ExportService.exportToPPTX(presentation, projectTitle, pptxTheme);
        showToast('PowerPoint downloaded successfully! 🎉', 'success');
      } else if (selectedFormat === 'gslides') {
        showToast('Preparing Google Slides compatible deck... 🚀', 'info');
        await ExportService.exportToGoogleSlides(presentation, `${projectTitle}_Google_Slides`);
        showToast('Ready for Google Slides! Open drive.google.com to import. 🌟', 'success');
      } else if (selectedFormat === 'pdf') {
        showToast('Generating Printable PDF... 📄', 'info');
        ExportService.exportPresentationToPDF(presentation, projectTitle);
        showToast('PDF downloaded successfully! 📄', 'success');
      } else if (selectedFormat === 'notion') {
        showToast('Downloading Notion-Ready Page... 📝', 'info');
        ExportService.exportToNotion({
          topic: projectTitle,
          summary: activeStudyMaterials?.summary || `Lecture notes and slide breakdown for ${projectTitle}.`,
          presentation,
          quiz: activeStudyMaterials?.quiz,
        }, projectTitle);
        showToast('Notion page (.notion.md) downloaded! 📝', 'success');
      } else if (selectedFormat === 'word') {
        showToast('Generating Word Document (.doc)... 📘', 'info');
        ExportService.exportToWordDoc({
          topic: projectTitle,
          summary: activeStudyMaterials?.summary || `Lecture notes for ${projectTitle}.`,
          presentation,
          quiz: activeStudyMaterials?.quiz,
        }, projectTitle);
        showToast('Word document downloaded! 📘', 'success');
      } else if (selectedFormat === 'png') {
        if (activeElements.length === 0) {
          showToast('No drawing elements found on canvas to export.', 'info');
        } else {
          showToast(`Exporting ${pngScale}x Retina PNG... 🖼️`, 'info');
          await ExportService.exportHighResPNG(activeElements, projectTitle, pngScale, pngTransparent);
          showToast('High-Res PNG image exported! 🖼️', 'success');
        }
      } else if (selectedFormat === 'svg') {
        if (activeElements.length === 0) {
          showToast('No drawing elements found on canvas to export.', 'info');
        } else {
          showToast('Exporting Vector SVG... 📐', 'info');
          ExportService.exportToSVGFile(activeElements, projectTitle);
          showToast('Vector SVG exported! 📐', 'success');
        }
      }
      AnalyticsTrackingService.trackExportFormat(selectedFormat, projectTitle);
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast('Export failed. Please try another format.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyNotionClipboard = async () => {
    try {
      await ExportService.copyNotionMarkdownToClipboard({
        topic: projectTitle,
        summary: activeStudyMaterials?.summary || `Lecture notes for ${projectTitle}.`,
        presentation,
        quiz: activeStudyMaterials?.quiz,
      });
      AnalyticsTrackingService.trackExportFormat('notion_clipboard', projectTitle);
      setCopiedNotion(true);
      showToast('Copied Notion blocks to clipboard! Paste directly into Notion (Ctrl+V) 📋', 'success');
      setTimeout(() => setCopiedNotion(false), 3000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const exportCards = [
    {
      id: 'pptx',
      title: 'PowerPoint Presentation',
      ext: '.pptx',
      desc: 'Native Microsoft PowerPoint presentation with custom color themes, typography, and presenter notes.',
      icon: <Presentation className="w-5 h-5 text-indigo-500" />,
      badge: 'Popular',
      badgeColor: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      id: 'gslides',
      title: 'Google Slides',
      ext: '.pptx / Drive',
      desc: 'Optimized 16:9 layout ready to upload & open directly in Google Slides without formatting loss.',
      icon: <ExternalLink className="w-5 h-5 text-amber-500" />,
      badge: 'Google Drive',
      badgeColor: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 'pdf',
      title: 'Printable PDF Document',
      ext: '.pdf',
      desc: 'High-yield landscape PDF study packet formatted for revision, printing, and tablet annotating.',
      icon: <FileText className="w-5 h-5 text-rose-500" />,
      badge: 'Vector PDF',
      badgeColor: 'bg-rose-500/10 text-rose-600',
    },
    {
      id: 'notion',
      title: 'Notion Workspace Page',
      ext: '.notion.md',
      desc: 'Formatted with Notion callouts, toggle Q&A dropdowns, and database property headers.',
      icon: <FileCode className="w-5 h-5 text-emerald-500" />,
      badge: 'Notion Ready',
      badgeColor: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      id: 'word',
      title: 'Microsoft Word Document',
      ext: '.doc',
      desc: 'Full structured academic study guide with executive summary, slide breakdowns, and quiz answers.',
      icon: <FileCheck2 className="w-5 h-5 text-blue-500" />,
      badge: 'MS Word',
      badgeColor: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 'png',
      title: 'Retina Canvas Image',
      ext: '.png',
      desc: 'High-resolution raster image snapshot of your whiteboard drawing with 1x, 2x, or 4x scaling.',
      icon: <ImageIcon className="w-5 h-5 text-purple-500" />,
      badge: 'Up to 4K',
      badgeColor: 'bg-purple-500/10 text-purple-600',
    },
    {
      id: 'svg',
      title: 'Scalable Vector Graphic',
      ext: '.svg',
      desc: 'Lossless mathematical vector strokes and shapes suitable for infinite zoom and Illustrator.',
      icon: <Layers className="w-5 h-5 text-cyan-500" />,
      badge: 'Vector',
      badgeColor: 'bg-cyan-500/10 text-cyan-600',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                  Multi-Format Export & Sharing Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  7 Formats Available
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export presentations, study notes, and canvas drawings into industry-standard formats.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto pr-1">
          {exportCards.map((card) => {
            const isSelected = selectedFormat === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedFormat(card.id as any)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{card.title}</span>
                      </h4>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{card.ext}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Context Options */}
        {selectedFormat === 'pptx' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" /> PowerPoint Color Theme
              </span>
              <span className="text-[10px] text-slate-400 font-mono">16:9 Widescreen</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'indigo', name: 'Indigo Modern', color: '#4f46e5' },
                { id: 'midnight', name: 'Midnight Dark', color: '#0284c7' },
                { id: 'emerald', name: 'Emerald Green', color: '#059669' },
                { id: 'amber', name: 'Amber Gold', color: '#d97706' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setPptxTheme(th.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    pptxTheme === th.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: th.color }} />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedFormat === 'gslides' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2 text-amber-900 dark:text-amber-200">
            <div className="font-bold flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-500" />
              <span>How Google Slides Import Works:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              Clicking <b>Export</b> generates an optimized PowerPoint file. Once downloaded, simply drag and drop the file into <b>Google Drive</b> or open <b>slides.google.com ➔ File ➔ Import slides</b> to instantly edit in Google Slides.
            </p>
          </div>
        )}

        {selectedFormat === 'notion' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" /> Notion Workspace Format
              </span>
              <button
                type="button"
                onClick={handleCopyNotionClipboard}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                {copiedNotion ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotion ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Includes pre-built Notion callout blocks, collapsible toggle questions for spaced repetition, and key concept takeaways ready for instant pasting.
            </p>
          </div>
        )}

        {selectedFormat === 'png' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Resolution Scale:</span>
              {[
                { scale: 1, label: '1x (1080p)' },
                { scale: 2, label: '2x (2K Retina)' },
                { scale: 4, label: '4x (4K Ultra)' },
              ].map((s) => (
                <button
                  key={s.scale}
                  onClick={() => setPngScale(s.scale as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    pngScale === s.scale
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={pngTransparent}
                onChange={(e) => setPngTransparent(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Transparent Background</span>
            </label>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting File...' : `Download ${selectedFormat.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
