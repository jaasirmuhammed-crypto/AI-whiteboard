import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  BookOpen, 
  Tag, 
  ExternalLink,
  Presentation,
  HelpCircle,
  Network
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhiteboardProject } from '../../types/user';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';
import { useProject } from '../../context/ProjectContext';

interface NoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WhiteboardProject | null;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ isOpen, onClose, project }) => {
  const { loadProject, setCurrentView, setActiveStudyMaterials } = useProject();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const pkg = project.studyMaterials;
  const rawTextElements = project.elements
    .filter((el) => el.type === 'text' || el.type === 'sticky')
    .map((el: any) => el.text)
    .filter(Boolean)
    .join('\n\n');

  const fullNoteContent = `${project.title}\n\n${pkg?.summary || rawTextElements || 'No written text captured on this board yet.'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullNoteContent);
      setCopied(true);
      showToast('Note content copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownloadWord = () => {
    ExportService.exportToWordDoc({
      topic: project.title,
      summary: pkg?.summary || rawTextElements || 'Executive Whiteboard Notes',
      presentation: pkg?.presentation,
      quiz: pkg?.quiz,
      extractedKeywords: pkg?.extractedKeywords || [],
    }, project.title);
    showToast('Word Document (.doc) exported! 📄', 'success');
  };

  const handleDownloadMarkdown = () => {
    ExportService.exportToMarkdownDoc({
      topic: project.title,
      summary: pkg?.summary || rawTextElements || 'Executive Whiteboard Notes',
      presentation: pkg?.presentation,
      quiz: pkg?.quiz,
    }, project.title);
    showToast('Markdown (.md) exported! 📝', 'success');
  };

  const handleOpenStudyHub = () => {
    if (pkg) {
      setActiveStudyMaterials(pkg);
      setCurrentView('study_hub');
      onClose();
    }
  };

  const handleOpenWhiteboard = () => {
    loadProject(project.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-brand">
                  {project.title}
                </h2>
                {pkg && (
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                    AI Synthesized
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Last updated {new Date(project.updatedAt).toLocaleDateString()} • {project.elements.length} Whiteboard Elements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Keywords */}
        {pkg?.extractedKeywords && pkg.extractedKeywords.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Key Concepts & Topics
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pkg.extractedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Executive Summary */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Executive Topic Summary
          </span>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
            {pkg?.summary || rawTextElements || 'No text elements detected on this whiteboard. Write or type on the whiteboard to generate study notes.'}
          </div>
        </div>

        {/* AI Materials Quick Summary Bar */}
        {pkg && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-2">
              <Presentation className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {pkg.presentation?.slides?.length || 0} Slides
                </p>
                <span className="text-[10px] text-slate-400">PowerPoint Deck</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {pkg.quiz?.questions?.length || 0} Questions
                </p>
                <span className="text-[10px] text-slate-400">Practice Quiz</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {pkg.mindMap?.root ? 'Interactive Graph' : 'Concept Map'}
                </p>
                <span className="text-[10px] text-slate-400">Concept Map</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWord}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export Word (.doc)</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-500" />
              <span>Export Markdown (.md)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {pkg && (
              <button
                onClick={handleOpenStudyHub}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open in Study Hub</span>
              </button>
            )}

            <button
              onClick={handleOpenWhiteboard}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Whiteboard</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
