import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  PenTool, 
  Sparkles, 
  Download, 
  Keyboard, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Presentation, 
  HelpCircle,
  ArrowRight,
  ChevronRight,
  FileCode,
  Zap,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  content: {
    heading: string;
    summary: string;
    sections: {
      title: string;
      body: string;
      tips?: string[];
      code?: string;
    }[];
  };
}

export const DocumentationHubView: React.FC = () => {
  const { setCurrentView, createProject } = useProject();
  const { setAccessibilityModalOpen } = useAccessibility();
  const [activeArticleId, setActiveArticleId] = useState<string>('quickstart');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const articles: DocArticle[] = [
    {
      id: 'quickstart',
      category: '🚀 Getting Started',
      title: 'Quickstart Guide: From Canvas Sketch to Presentation in 60s',
      description: 'Learn the primary workflow for sketching, OCR recognition, and output generation.',
      readTime: '3 min read',
      content: {
        heading: 'Mastering the AI Whiteboard Workflow',
        summary: 'AI Whiteboard is designed for zero-friction academic ideation. You can draw freely without worrying about clean formatting, and let the AI multimodal engine handle structure, design, and syllabus depth.',
        sections: [
          {
            title: '1. Select Your Canvas Tool or Subject Template',
            body: 'Open the canvas and choose between Pen, Pencil, Highlighter, or open the Templates Library (📐 Math Cartesian grid, ⚡ Physics free-body diagrams, 🏛️ History timelines).',
            tips: [
              'Use keyboard shortcuts P for Pen, E for Eraser, T for Text, and S for Shapes.',
              'Apple Pencil and iPad styluses are supported with zero-latency 120 FPS bezier smoothing.',
            ],
          },
          {
            title: '2. Generate Multi-Artifact Study Materials',
            body: 'Click the glowing "Generate Study Materials" button at top right. The OCR system analyzes your formulas, diagram arrows, and handwriting to determine subject depth and target exam standards.',
            tips: [
              'You can click "Live Preview Deck" to inspect theme styling before confirming generation.',
              'Select a target competitive exam (UPSC, NEET, JEE, USMLE, SAT, GRE) to auto-adjust difficulty.',
            ],
          },
          {
            title: '3. Export to Google Slides, Notion, or PDF',
            body: 'Once generated, open the Export Hub to download native PowerPoint .PPTX files, import into Google Slides with 1 click, copy Notion toggle questions, or export 4K Retina PNG drawings.',
          },
        ],
      },
    },
    {
      id: 'shortcuts',
      category: '⌨️ Keyboard Navigation & Shortcuts',
      title: 'Complete Keyboard Shortcut Index & Accessibility Guide',
      description: 'Work at lightning speed without ever touching the mouse or trackpad.',
      readTime: '4 min read',
      content: {
        heading: 'Keyboard Productivity & WCAG 2.1 Navigation',
        summary: 'Every tool and modal in AI Whiteboard is fully accessible via keyboard shortcuts and standard tab focus rings.',
        sections: [
          {
            title: 'Whiteboard Drawing & Canvas Shortcuts',
            body: 'Essential single-key commands for instant tool switching:',
            tips: [
              'P: Select Pen / Brush Tool',
              'E: Select Precision Eraser Tool',
              'T: Insert Text / Typography Box',
              'S: Open Shapes Palette (Rectangle, Circle, Arrow, Line)',
              'Ctrl + Z: Undo last stroke',
              'Ctrl + Y / Ctrl + Shift + Z: Redo stroke',
              'Space + Drag: Pan Canvas Viewport',
              'Ctrl + + / Ctrl + -: Zoom in / Zoom out',
            ],
          },
          {
            title: 'WCAG 2.1 AA Screen Reader Navigation',
            body: 'Screen readers (NVDA, JAWS, VoiceOver) announce live status updates via aria-live status regions when switching tools, saving, or generating presentations.',
          },
        ],
      },
    },
    {
      id: 'math_stem',
      category: '📐 Subject Guides',
      title: 'Mathematics & STEM Notation Best Practices',
      description: 'How to write calculus integrals, matrices, chemical formulas, and circuits for 99.9% OCR accuracy.',
      readTime: '5 min read',
      content: {
        heading: 'Writing STEM Notation for Optimal AI Parsing',
        summary: 'Our neural handwriting model is tuned on thousands of academic notebooks and exam papers.',
        sections: [
          {
            title: 'Calculus & Mathematical Symbols',
            body: 'Write integrals ∫, summations ∑, limits lim_(x→0), and derivatives dy/dx standardly. The system automatically converts them into formatted LaTeX and formal proof matrices.',
            tips: [
              'Keep indices and exponents clearly elevated or subscripted.',
              'Use the Cartesian Grid template for coordinate geometry curve analysis.',
            ],
          },
          {
            title: 'Chemical Reactions & Molecular Mechanisms',
            body: 'Draw arrow sequences Reactant -> Intermediate -> Product. Include reagents (e.g. H2SO4 / Heat) above the arrow for automated reaction classification.',
          },
        ],
      },
    },
    {
      id: 'exports',
      category: '📑 Exporting & Sharing',
      title: 'Google Slides, Notion, and LMS Classroom Integration',
      description: 'Learn how to export into your favorite note-taking apps and virtual classrooms.',
      readTime: '3 min read',
      content: {
        heading: 'Seamless Multi-Format Integration',
        summary: 'Share your study materials anywhere without lock-in.',
        sections: [
          {
            title: 'Importing into Google Slides in 2 Clicks',
            body: '1. Export as PowerPoint (.pptx) or select Google Slides from the Export Hub.\n2. Open Google Drive (drive.google.com) or Google Slides (slides.google.com).\n3. Drag and drop the file or click File ➔ Import Slides.',
          },
          {
            title: 'Pasting into Notion with Spaced Repetition Toggles',
            body: 'Click "Copy to Clipboard" in the Notion Export tab. Paste (Ctrl+V) into any Notion page to instantly receive styled Callout summary blocks and collapsible question dropdowns for active recall study.',
          },
        ],
      },
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentArticle = articles.find((a) => a.id === activeArticleId) || articles[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>AI Whiteboard Knowledge Base & Documentation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-brand tracking-tight">
              Guides, Tutorials & Best Practices
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Everything you need to master multimodal note-taking, STEM formulas, exports, and accessibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAccessibilityModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Accessibility Mode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                createProject('Calculus Integrals');
                setCurrentView('whiteboard');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Whiteboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation, formulas, keyboard shortcuts, or topics..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Main 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Table of Contents & Article Index */}
          <div className="lg:col-span-4 space-y-2 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              Documentation Index
            </span>
            <div className="space-y-1.5">
              {filteredArticles.map((article) => {
                const isActive = activeArticleId === article.id;
                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => setActiveArticleId(article.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex flex-col space-y-1 ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-500/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {article.category}
                    </span>
                    <span className="text-xs sm:text-sm font-bold line-clamp-1">
                      {article.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {article.readTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Article Reader */}
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                {currentArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-brand text-slate-900 dark:text-white">
                {currentArticle.content.heading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentArticle.content.summary}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {currentArticle.content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    <span>{section.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>

                  {section.tips && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5 text-xs text-indigo-950 dark:text-indigo-200">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Pro Tips & Best Practices:</span>
                      </div>
                      <ul className="space-y-1 list-disc pl-4 text-[11px] sm:text-xs">
                        {section.tips.map((tip, tIdx) => (
                          <li key={tIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Was this article helpful?</span>
              <button
                type="button"
                onClick={() => {
                  createProject();
                  setCurrentView('whiteboard');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <span>Try on Whiteboard Canvas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
