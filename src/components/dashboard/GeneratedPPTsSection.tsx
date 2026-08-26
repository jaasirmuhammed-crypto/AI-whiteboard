import React, { useState } from 'react';
import { 
  Presentation, 
  Search, 
  Download, 
  Play, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Clock,
  Eye,
  FileDown
} from 'lucide-react';
import { WhiteboardProject } from '../../types/user';
import { PresentationData } from '../../types/studyMaterial';
import { useProject } from '../../context/ProjectContext';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface GeneratedPPTsSectionProps {
  onPreviewPPT: (presentation: PresentationData) => void;
  onOpenCreateModal: () => void;
}

export const GeneratedPPTsSection: React.FC<GeneratedPPTsSectionProps> = ({ 
  onPreviewPPT,
  onOpenCreateModal
}) => {
  const { projects, setCurrentView, setActiveStudyMaterials, loadProject } = useProject();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const pptProjects = projects.filter((p) => {
    if (!p.studyMaterials?.presentation) return false;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studyMaterials.presentation.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studyMaterials.presentation.theme || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDownloadPPTX = async (project: WhiteboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const pres = project.studyMaterials?.presentation;
    if (!pres) return;

    setDownloadingId(project.id);
    try {
      await ExportService.exportToPPTX(pres, pres.title || project.title);
      showToast(`PowerPoint deck "${pres.title}.pptx" exported successfully! 📊`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PPTX file.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadPDF = (project: WhiteboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const pres = project.studyMaterials?.presentation;
    if (!pres) return;
    ExportService.exportPresentationToPDF(pres, pres.title || project.title);
    showToast('Presentation exported as PDF! 📑', 'success');
  };

  const handleOpenStudyHub = (project: WhiteboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.studyMaterials) {
      setActiveStudyMaterials(project.studyMaterials);
      setCurrentView('study_hub');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Counts Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generated presentations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden backdrop-blur-md shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Presentation className="w-4 h-4 text-indigo-500" />
          <span>Total Presentations: <strong className="text-slate-900 dark:text-white">{pptProjects.length} Decks</strong></span>
        </div>
      </div>

      {/* PPT Decks Grid */}
      {pptProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pptProjects.map((project) => {
            const pres = project.studyMaterials?.presentation!;
            const totalSlides = pres.slides?.length || 0;
            const firstSlide = pres.slides?.[0];

            return (
              <div
                key={project.id}
                onClick={() => onPreviewPPT(pres)}
                className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  {/* PPT Cover Preview */}
                  <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-4 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                    
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 text-[10px] font-mono backdrop-blur-xs uppercase">
                        {pres.theme || 'Modern'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600/80 text-white text-[10px] font-bold">
                        {totalSlides} Slides
                      </span>
                    </div>

                    <div className="space-y-1 my-auto">
                      <h4 className="text-sm sm:text-base font-extrabold font-brand text-white line-clamp-2 leading-tight">
                        {pres.title || project.title}
                      </h4>
                      {firstSlide?.subtitle && (
                        <p className="text-[11px] text-indigo-300 line-clamp-1">
                          {firstSlide.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                      <span>Slide Deck</span>
                      <span>AI Whiteboard Studio</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <span>{totalSlides} High-Yield Slides</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => onPreviewPPT(pres)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadPDF(project, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Download PDF Presentation"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDownloadPPTX(project, e)}
                      disabled={downloadingId === project.id}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      title="Download real .pptx PowerPoint file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingId === project.id ? 'Saving...' : '.PPTX'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4 bg-white/40 dark:bg-slate-900/40">
          <Presentation className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-brand">
              No Generated Presentations Found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a whiteboard, sketch your concepts, and click "AI Suite" to generate slide decks.
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Create Whiteboard</span>
          </button>
        </div>
      )}

    </div>
  );
};
