import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  BookOpen, 
  Tag, 
  Clock,
  Presentation,
  HelpCircle,
  Network,
  Eye
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';
import { useProject } from '../../context/ProjectContext';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface SavedNotesSectionProps {
  onOpenNoteDetail: (project: WhiteboardProject) => void;
  onOpenCreateModal: () => void;
}

export const SavedNotesSection: React.FC<SavedNotesSectionProps> = ({ 
  onOpenNoteDetail,
  onOpenCreateModal
}) => {
  const { projects, loadProject, setCurrentView, setActiveStudyMaterials } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique keyword tags across projects
  const allKeywords = Array.from(
    new Set(
      projects.flatMap((p) => p.studyMaterials?.extractedKeywords || [])
    )
  );

  const notesList = projects.filter((p) => {
    const hasNotes = !!p.studyMaterials?.summary || p.elements.some(el => el.type === 'text' || el.type === 'sticky');
    if (!hasNotes) return false;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studyMaterials?.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studyMaterials?.extractedKeywords || []).some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag) {
      return (p.studyMaterials?.extractedKeywords || []).includes(selectedTag);
    }
    return true;
  });

  const handleCopyNote = async (project: WhiteboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const pkg = project.studyMaterials;
    const rawText = project.elements
      .filter((el) => el.type === 'text' || el.type === 'sticky')
      .map((el: any) => el.text)
      .join('\n\n');
    const content = `${project.title}\n\n${pkg?.summary || rawText}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(project.id);
      showToast(`Notes for "${project.title}" copied! 📋`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDownloadWord = (project: WhiteboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    ExportService.exportToWordDoc({
      topic: project.title,
      summary: project.studyMaterials?.summary || 'Whiteboard Notes',
      presentation: project.studyMaterials?.presentation,
      quiz: project.studyMaterials?.quiz,
      extractedKeywords: project.studyMaterials?.extractedKeywords,
    }, project.title);
    showToast('Word Document exported! 📄', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, summaries & keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md shadow-xs"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedTag === null
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Topics
          </button>
          {allKeywords.slice(0, 6).map((kw) => (
            <button
              key={kw}
              onClick={() => setSelectedTag(selectedTag === kw ? null : kw)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedTag === kw
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              #{kw}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {notesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notesList.map((project) => {
            const pkg = project.studyMaterials;
            const rawText = project.elements
              .filter((el) => el.type === 'text' || el.type === 'sticky')
              .map((el: any) => el.text)
              .join(' ');
            const previewSnippet = pkg?.summary || rawText || 'No text notes captured.';

            return (
              <div
                key={project.id}
                onClick={() => onOpenNoteDetail(project)}
                className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand truncate max-w-[180px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h4>
                    </div>

                    {pkg && (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold shrink-0">
                        AI Synthesized
                      </span>
                    )}
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {previewSnippet}
                  </p>

                  {/* Keywords Pills */}
                  {pkg?.extractedKeywords && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {pkg.extractedKeywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                          #{kw}
                        </span>
                      ))}
                      {pkg.extractedKeywords.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{pkg.extractedKeywords.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopyNote(project, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy Note Content"
                    >
                      {copiedId === project.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={(e) => handleDownloadWord(project, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                      title="Export to Word (.doc)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenNoteDetail(project)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4 bg-white/40 dark:bg-slate-900/40">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              No Saved Notes Found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Write notes on your whiteboard and run the AI Suite to generate synthesized study guides.
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Whiteboard Notebook</span>
          </button>
        </div>
      )}

    </div>
  );
};
