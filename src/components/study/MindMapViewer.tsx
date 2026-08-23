import React, { useState, useRef } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Search, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { MindMapData, MindMapNode } from '../../types/studyMaterial';
import { ExportService } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface MindMapViewerProps {
  mindMap: MindMapData;
}

export const MindMapViewer: React.FC<MindMapViewerProps> = ({ mindMap }) => {
  const { showToast } = useToast();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleExportJSON = () => {
    ExportService.exportToJSON(mindMap, `${mindMap.title.replace(/\s+/g, '_')}_mindmap`);
    showToast('Mind Map structure exported as JSON', 'success');
  };

  const root = mindMap.root;

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-brand text-slate-900 dark:text-white">
              {mindMap.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive Hierarchical Concept Graph • Zoom & Drag Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Concept Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden w-40 sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-500">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Graph Viewport */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-[550px] sm:h-[620px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl"
      >
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Movable & Zoomable Canvas Content */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="flex flex-col items-center gap-12 p-8 min-w-[800px]">
            
            {/* Central Root Concept Node */}
            <div 
              onClick={(e) => { e.stopPropagation(); setSelectedNode(root); }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-2 bg-indigo-500/30 rounded-3xl blur-md group-hover:bg-indigo-500/50 transition-all" />
              <div className="relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold font-brand text-base sm:text-lg shadow-xl border border-indigo-400/40 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{root.label}</span>
              </div>
            </div>

            {/* Subtopic Branches Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {root.children?.map((branch) => {
                const isMatchingBranch = searchQuery && branch.label.toLowerCase().includes(searchQuery.toLowerCase());

                return (
                  <div
                    key={branch.id}
                    className="flex flex-col items-center space-y-4 relative"
                  >
                    {/* Branch Node */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setSelectedNode(branch); }}
                      className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer shadow-lg text-center ${
                        isMatchingBranch
                          ? 'ring-2 ring-amber-400 scale-105'
                          : ''
                      }`}
                      style={{
                        backgroundColor: branch.color ? `${branch.color}22` : 'rgba(99,102,241,0.15)',
                        borderColor: branch.color || '#6366f1',
                      }}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        {branch.category || 'Category'}
                      </span>
                      <h4 className="text-xs font-bold text-white font-brand">
                        {branch.label}
                      </h4>
                    </div>

                    {/* Leaf Children Nodes */}
                    <div className="w-full space-y-2">
                      {branch.children?.map((leaf) => {
                        const isMatchingLeaf = searchQuery && leaf.label.toLowerCase().includes(searchQuery.toLowerCase());

                        return (
                          <div
                            key={leaf.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedNode(leaf); }}
                            className={`p-2.5 rounded-xl bg-slate-900/80 border text-left cursor-pointer transition-all hover:scale-102 hover:bg-slate-800 ${
                              isMatchingLeaf
                                ? 'border-amber-400 bg-amber-950/40'
                                : 'border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color || '#6366f1' }} />
                              <span className="text-xs font-semibold text-slate-200">
                                {leaf.label}
                              </span>
                            </div>
                            {leaf.description && (
                              <p className="text-[10px] text-slate-400 mt-1 pl-3 line-clamp-2">
                                {leaf.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Selected Node Details Floating Tooltip/Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-2 z-20">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  Concept Detail
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand">
                  {selectedNode.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            {selectedNode.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedNode.description}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
