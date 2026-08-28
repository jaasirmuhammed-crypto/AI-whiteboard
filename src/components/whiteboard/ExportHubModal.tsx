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
  FileCode,
  Cloud,
  Share2,
  HardDrive,
  Sliders,
  CheckCircle2,
  Lock
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

export type ExportFormatType = 
  | 'pptx' 
  | 'whiteboard_pdf'
  | 'pdf' 
  | 'gslides' 
  | 'notion' 
  | 'word' 
  | 'png' 
  | 'svg'
  | 'cloud_sync';

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
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>('pptx');
  const [pptxTheme, setPptxTheme] = useState<PPTXTheme>('indigo');
  const [pngScale, setPngScale] = useState<1 | 2 | 4>(2);
  const [pngTransparent, setPngTransparent] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedNotion, setCopiedNotion] = useState<boolean>(false);
  const [cloudProvider, setCloudProvider] = useState<'gdrive' | 'onedrive'>('gdrive');
  const [cloudShareLink, setCloudShareLink] = useState<string | null>(null);

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
        showToast('Generating PowerPoint (.pptx) with embedded whiteboard slides... 📊', 'info');
        await ExportService.exportToPPTX(presentation, projectTitle, pptxTheme);
        showToast('PowerPoint downloaded successfully! 🎉', 'success');
      } else if (selectedFormat === 'whiteboard_pdf') {
        if (activeElements.length === 0) {
          showToast('No drawing strokes found on canvas to export.', 'info');
        } else {
          showToast('Rendering Whiteboard Canvas Drawing into High-DPI PDF... 📄', 'info');
          await ExportService.exportWhiteboardToPDF(activeElements, projectTitle);
          showToast('Whiteboard PDF downloaded! 📄', 'success');
        }
      } else if (selectedFormat === 'gslides') {
        showToast('Preparing Google Slides compatible deck... 🚀', 'info');
        await ExportService.exportToGoogleSlides(presentation, `${projectTitle}_Google_Slides`);
        showToast('Ready for Google Slides! Open drive.google.com to import. 🌟', 'success');
      } else if (selectedFormat === 'pdf') {
        showToast('Generating Presentation Slides PDF... 📄', 'info');
        ExportService.exportPresentationToPDF(presentation, projectTitle);
        showToast('Presentation PDF downloaded! 📄', 'success');
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
      } else if (selectedFormat === 'cloud_sync') {
        showToast(`Syncing with ${cloudProvider === 'gdrive' ? 'Google Drive' : 'Microsoft OneDrive'}... ☁️`, 'info');
        const res = await ExportService.exportToCloudDrive(cloudProvider, projectTitle, 'pdf');
        setCloudShareLink(res.shareUrl);
        showToast(`Uploaded to ${res.providerName}! Shareable link created. 🔗`, 'success');
        return;
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
      showToast('Failed to copy to clipboard.', 'error');
    }
  };

  const exportCards = [
    {
      id: 'pptx',
      title: 'PowerPoint Presentation',
      ext: '.pptx',
      desc: 'Native 16:9 slides with custom academic themes, speaker notes, and embedded sketches.',
      icon: <Presentation className="w-5 h-5 text-indigo-500" />,
      badge: 'Native PPTX',
      badgeColor: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      id: 'whiteboard_pdf',
      title: 'Whiteboard Drawing PDF',
      ext: '.pdf',
      desc: 'Export the actual digital whiteboard handwritten notes & formulas to high-resolution vector PDF.',
      icon: <FileText className="w-5 h-5 text-rose-500" />,
      badge: 'Canvas PDF',
      badgeColor: 'bg-rose-500/10 text-rose-600',
    },
    {
      id: 'gslides',
      title: 'Google Slides Compatible',
      ext: '.pptx ➔ Slides',
      desc: '1-Click import format ready for Google Drive (drive.google.com) and Google Classroom.',
      icon: <Cloud className="w-5 h-5 text-amber-500" />,
      badge: 'Google Slides',
      badgeColor: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 'pdf',
      title: 'Presentation Slides PDF',
      ext: '.pdf',
      desc: 'Print-ready landscape PDF deck with formatted theorem matrices and bullet cards.',
      icon: <FileText className="w-5 h-5 text-rose-500" />,
      badge: 'Slides PDF',
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
      id: 'png',
      title: 'PNG Canvas Snapshot',
      ext: '.png',
      desc: 'High-resolution raster image snapshot with 1x, 2x Retina, or 4x Ultra HD scaling & transparency.',
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
    {
      id: 'cloud_sync',
      title: 'Google Drive & OneDrive Sync',
      ext: 'Cloud Sync',
      desc: 'Directly upload and sync your notebook to Google Drive or Microsoft OneDrive.',
      icon: <HardDrive className="w-5 h-5 text-sky-500" />,
      badge: 'Direct Cloud',
      badgeColor: 'bg-sky-500/10 text-sky-600',
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
                  Multi-Format Export & Cloud Sync Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  8 Formats & Cloud Integrations
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export presentations, handwritten whiteboard PDFs, 4K PNGs, and sync directly to Google Drive.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[44vh] overflow-y-auto pr-1">
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

        {/* Quality Controls for PNG */}
        {selectedFormat === 'png' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-500" /> Resolution & Transparency Controls
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {pngScale === 1 ? '1920x1080 (1x)' : pngScale === 2 ? '3840x2160 Retina (2x)' : '7680x4320 Ultra 4K (4x)'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[
                  { scale: 1, label: '1x Standard' },
                  { scale: 2, label: '2x Retina (Recommended)' },
                  { scale: 4, label: '4x Ultra HD' },
                ].map((item) => (
                  <button
                    key={item.scale}
                    type="button"
                    onClick={() => setPngScale(item.scale as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      pngScale === item.scale
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pngTransparent}
                  onChange={(e) => setPngTransparent(e.target.checked)}
                  className="rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span>Transparent Background</span>
              </label>
            </div>
          </div>
        )}

        {/* Cloud Sync Context Tab */}
        {selectedFormat === 'cloud_sync' && (
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-3 text-sky-950 dark:text-sky-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-sky-500" /> Select Cloud Storage Provider
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setCloudProvider('gdrive'); setCloudShareLink(null); }}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  cloudProvider === 'gdrive'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>Google Drive</span>
              </button>

              <button
                type="button"
                onClick={() => { setCloudProvider('onedrive'); setCloudShareLink(null); }}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  cloudProvider === 'onedrive'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Microsoft OneDrive</span>
              </button>
            </div>

            {cloudShareLink && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-500/40 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>File Synced Successfully!</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={cloudShareLink}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                  <a
                    href={cloudShareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            <span>Destination: </span>
            <strong className="text-slate-700 dark:text-slate-200 capitalize font-mono">{selectedFormat.replace('_', ' ')}</strong>
          </div>

          <div className="flex items-center gap-2">
            {selectedFormat === 'notion' && (
              <button
                type="button"
                onClick={handleCopyNotionClipboard}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedNotion ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotion ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            )}

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExport}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating File...' : selectedFormat === 'cloud_sync' ? 'Sync to Cloud' : 'Export & Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
