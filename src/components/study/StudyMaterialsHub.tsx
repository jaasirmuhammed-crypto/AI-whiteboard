import React, { useState } from 'react';
import { 
  Presentation, 
  HelpCircle, 
  Network, 
  ArrowLeft, 
  Lightbulb
} from 'lucide-react';
import { StudyMaterialsPackage } from '../../types/studyMaterial';
import { PPTViewer } from './PPTViewer';
import { MCQQuizViewer } from './MCQQuizViewer';
import { MindMapViewer } from './MindMapViewer';
import { useProject } from '../../context/ProjectContext';
import { useI18n } from '../../i18n';
import { TopicSearchGuideCard } from '../common/TopicSearchGuideCard';

interface StudyMaterialsHubProps {
  packageData: StudyMaterialsPackage;
}

export const StudyMaterialsHub: React.FC<StudyMaterialsHubProps> = ({ packageData }) => {
  const { setCurrentView } = useProject();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'ppt' | 'mcq' | 'mindmap'>('ppt');
  const [showSearchGuide, setShowSearchGuide] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 shadow-2xl border border-indigo-700/50 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('whiteboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Whiteboard</span>
              </button>

              <button
                onClick={() => setShowSearchGuide(!showSearchGuide)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-400/30 backdrop-blur-md transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showSearchGuide ? 'Hide Search Guide' : '💡 How to Search Any Topic'}</span>
              </button>
            </div>

            {packageData.examContext && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <span>🎯 Target Exam: {packageData.examContext.name}</span>
                <span>•</span>
                <span>{packageData.examContext.country}</span>
                {packageData.examContext.difficultyLevel && (
                  <span className="px-2 py-0.2 rounded bg-amber-500/30 text-[10px]">
                    {packageData.examContext.difficultyLevel}
                  </span>
                )}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold font-brand tracking-tight">
              {t.outputs.readyTitle}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              {packageData.summary}
            </p>
          </div>

          {/* Quick Keywords Badges & Official Link */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap justify-end gap-1.5 max-w-xs">
              {packageData.extractedKeywords.slice(0, 6).map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-mono backdrop-blur-md">
                  #{kw}
                </span>
              ))}
            </div>
            {packageData.examContext?.officialPortal && (
              <a
                href={packageData.examContext.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold mt-1"
              >
                Official Exam Source ({new URL(packageData.examContext.officialPortal).hostname}) ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Optional Interactive How to Search Guide Card */}
      {showSearchGuide && (
        <TopicSearchGuideCard onClose={() => setShowSearchGuide(false)} />
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('ppt')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ppt'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>PowerPoint Presentation</span>
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mcq'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>MCQ Practice Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('mindmap')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mindmap'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Interactive Mind Map</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'ppt' && <PPTViewer presentation={packageData.presentation} />}
        {activeTab === 'mcq' && <MCQQuizViewer quiz={packageData.quiz} />}
        {activeTab === 'mindmap' && <MindMapViewer mindMap={packageData.mindMap} />}
      </div>

      {/* Always-visible Guide Card at the bottom of the page */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <TopicSearchGuideCard />
      </div>
    </div>
  );
};
