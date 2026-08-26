import React from 'react';
import { 
  LayoutTemplate, 
  FileSpreadsheet, 
  Network, 
  Atom, 
  Stethoscope, 
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhiteboardElement, ShapeElement, TextElement } from '../../types/whiteboard';
import { useToast } from '../common/Toast';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  generateElements: () => WhiteboardElement[];
}

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (elements: WhiteboardElement[]) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const { showToast } = useToast();

  const createTextEl = (
    id: string,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    bold: boolean = false
  ): TextElement => ({
    id,
    type: 'text',
    text,
    x,
    y,
    fontSize,
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color,
    bold,
    italic: false,
    underline: false,
    align: 'left',
    layerId: 'layer_01',
  });

  const templates: TemplateDefinition[] = [
    {
      id: 'cornell',
      name: 'Cornell Note-Taking System',
      category: 'Academic Study',
      description: 'Structured layout with a dedicated Cue column, main lecture notes zone, and summary row at the bottom.',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        // 1. Cue Column Line (Vertical)
        const cueLine: ShapeElement = {
          id: `cue_line_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 240,
          y: 60,
          width: 0,
          height: 680,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.6,
          layerId: 'layer_01',
        };

        // 2. Summary Divider Line (Horizontal)
        const summaryLine: ShapeElement = {
          id: `summary_line_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 40,
          y: 580,
          width: 900,
          height: 0,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.6,
          layerId: 'layer_01',
        };

        const titleText = createTextEl(`title_${now}`, 'Topic: Lecture Title / Date', 40, 40, 20, '#4f46e5', true);
        const cueHeader = createTextEl(`cue_hdr_${now}`, '💡 Cues & Key Terms', 40, 90, 14, '#64748b', true);
        const notesHeader = createTextEl(`notes_hdr_${now}`, '📝 Main Lecture Notes & Formulas', 260, 90, 14, '#64748b', true);
        const summaryHeader = createTextEl(`summary_hdr_${now}`, '🎯 Summary & Core Takeaways:', 40, 610, 14, '#059669', true);

        elements.push(cueLine, summaryLine, titleText, cueHeader, notesHeader, summaryHeader);
        return elements;
      },
    },
    {
      id: 'qa_diagram',
      name: 'Question | Answer | Diagram Grid',
      category: 'Exam Revision',
      description: '3-zone layout for high-yield exam practice: write question on left, derivation in center, and diagram sketch on right.',
      icon: <LayoutTemplate className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        // 2 Vertical dividers
        const div1: ShapeElement = {
          id: `div1_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 320,
          y: 80,
          width: 0,
          height: 640,
          color: '#f59e0b',
          strokeWidth: 2,
          opacity: 0.5,
          layerId: 'layer_01',
        };

        const div2: ShapeElement = {
          id: `div2_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 640,
          y: 80,
          width: 0,
          height: 640,
          color: '#f59e0b',
          strokeWidth: 2,
          opacity: 0.5,
          layerId: 'layer_01',
        };

        const t1 = createTextEl(`t1_${now}`, '❓ 1. Question / Problem', 40, 60, 15, '#d97706', true);
        const t2 = createTextEl(`t2_${now}`, '⚡ 2. Step-by-Step Derivation', 340, 60, 15, '#2563eb', true);
        const t3 = createTextEl(`t3_${now}`, '🎨 3. Visual Sketch / Graph', 660, 60, 15, '#7c3aed', true);

        elements.push(div1, div2, t1, t2, t3);
        return elements;
      },
    },
    {
      id: 'mindmap',
      name: 'Concept Mind Map Tree Starter',
      category: 'Visual Synthesis',
      description: 'Radial central root node with branching nodes ready for rapid visual brainstorming and hierarchical connections.',
      icon: <Network className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        // Central Root Node Box
        const rootBox: ShapeElement = {
          id: `root_box_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 380,
          y: 280,
          width: 200,
          height: 70,
          color: '#8b5cf6',
          strokeWidth: 3,
          opacity: 0.9,
          fillColor: 'rgba(139, 92, 246, 0.15)',
          layerId: 'layer_01',
        };

        const rootText = createTextEl(`root_text_${now}`, 'Central Core Topic', 410, 320, 16, '#7c3aed', true);

        // Branch 1 (Top)
        const branchTop: ShapeElement = {
          id: `b_top_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 480,
          y: 280,
          width: 0,
          height: -100,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Branch 2 (Left)
        const branchLeft: ShapeElement = {
          id: `b_left_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 380,
          y: 315,
          width: -120,
          height: 0,
          color: '#06b6d4',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Branch 3 (Right)
        const branchRight: ShapeElement = {
          id: `b_right_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 580,
          y: 315,
          width: 120,
          height: 0,
          color: '#10b981',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        elements.push(rootBox, rootText, branchTop, branchLeft, branchRight);
        return elements;
      },
    },
    {
      id: 'stem_physics',
      name: 'STEM Laws & Formula Matrix',
      category: 'Science & Engineering',
      description: 'Matrix layout for physics equations, boundary conditions, and chemical reaction mechanisms.',
      icon: <Atom className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`stem_title_${now}`, '⚡ Equation & Mechanism Derivation Sheet', 40, 40, 18, '#0284c7', true);

        const formulaBox: ShapeElement = {
          id: `formula_box_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 80,
          width: 420,
          height: 180,
          color: '#0284c7',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        const formulaText = createTextEl(`formula_text_${now}`, 'Key Formulas & Constants:', 55, 110, 13, '#0369a1', true);

        elements.push(title, formulaBox, formulaText);
        return elements;
      },
    },
    {
      id: 'flowchart',
      name: 'Logic Flowchart & Decision Tree',
      category: 'Computer Science & Logic',
      description: 'Standard flowchart schema with Start terminal, Process boxes, Decision diamond, and flow arrows.',
      icon: <Network className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`fc_title_${now}`, '🔄 Algorithm / Logic Flowchart', 40, 40, 18, '#2563eb', true);

        // Start Oval/Pill
        const startBox: ShapeElement = {
          id: `fc_start_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 400,
          y: 80,
          width: 160,
          height: 50,
          color: '#10b981',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(16, 185, 129, 0.15)',
          layerId: 'layer_01',
        };
        const startText = createTextEl(`fc_st_${now}`, 'START', 455, 110, 14, '#059669', true);

        // Arrow 1
        const a1: ShapeElement = {
          id: `fc_a1_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 480,
          y: 130,
          width: 0,
          height: 60,
          color: '#64748b',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Process Box
        const procBox: ShapeElement = {
          id: `fc_proc_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 370,
          y: 190,
          width: 220,
          height: 60,
          color: '#3b82f6',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(59, 130, 246, 0.12)',
          layerId: 'layer_01',
        };
        const procText = createTextEl(`fc_pt_${now}`, 'Execute Process Step 1', 400, 225, 13, '#2563eb', true);

        // Arrow 2
        const a2: ShapeElement = {
          id: `fc_a2_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 480,
          y: 250,
          width: 0,
          height: 60,
          color: '#64748b',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Decision Diamond / Rectangle
        const decBox: ShapeElement = {
          id: `fc_dec_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 370,
          y: 310,
          width: 220,
          height: 70,
          color: '#f59e0b',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(245, 158, 11, 0.15)',
          layerId: 'layer_01',
        };
        const decText = createTextEl(`fc_dt_${now}`, 'Condition Valid? [Y / N]', 400, 350, 13, '#d97706', true);

        elements.push(title, startBox, startText, a1, procBox, procText, a2, decBox, decText);
        return elements;
      },
    },
    {
      id: 'meeting_action',
      name: 'Meeting & Action Item Tracker',
      category: 'Productivity & Planning',
      description: 'Structured 3-column layout for agenda items, key discussion takeaways, and assigned action item checklist.',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`mt_title_${now}`, '📋 Meeting Notes & Action Items Matrix', 40, 40, 18, '#0f766e', true);
        const col1H = createTextEl(`mt_c1_${now}`, '📌 1. Agenda & Objective', 40, 80, 14, '#0d9488', true);
        const col2H = createTextEl(`mt_c2_${now}`, '💬 2. Discussion Notes', 360, 80, 14, '#2563eb', true);
        const col3H = createTextEl(`mt_c3_${now}`, '✅ 3. Action Items & Owner', 680, 80, 14, '#059669', true);

        // Divider 1
        const div1: ShapeElement = {
          id: `mt_d1_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 340,
          y: 75,
          width: 0,
          height: 600,
          color: '#14b8a6',
          strokeWidth: 1.5,
          opacity: 0.4,
          layerId: 'layer_01',
        };

        // Divider 2
        const div2: ShapeElement = {
          id: `mt_d2_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 660,
          y: 75,
          width: 0,
          height: 600,
          color: '#14b8a6',
          strokeWidth: 1.5,
          opacity: 0.4,
          layerId: 'layer_01',
        };

        elements.push(title, col1H, col2H, col3H, div1, div2);
        return elements;
      },
    },
    {
      id: 'medical_case',
      name: 'Clinical Vignette & Patient Case',
      category: 'Medicine & Healthcare',
      description: 'Structured patient history, physical exam, differential diagnosis, and diagnostic workup table.',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'from-rose-500 to-red-600',
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`med_title_${now}`, '🩺 Clinical Case Note / Differential Diagnosis', 40, 40, 18, '#e11d48', true);
        const h1 = createTextEl(`med_h1_${now}`, '👤 Chief Complaint & HPI', 40, 80, 14, '#be123c', true);
        const h2 = createTextEl(`med_h2_${now}`, '🔍 Physical Exam & Labs', 360, 80, 14, '#be123c', true);
        const h3 = createTextEl(`med_h3_${now}`, '💊 Differential & Rx Plan', 680, 80, 14, '#be123c', true);

        elements.push(title, h1, h2, h3);
        return elements;
      },
    },
  ];

  const handleSelect = (tmpl: TemplateDefinition) => {
    const elements = tmpl.generateElements();
    onApplyTemplate(elements);
    showToast(`Loaded "${tmpl.name}" layout template! 📐`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Structured Notebook Templates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a pre-drawn framework to organize your lecture notes, equations, and diagrams.
              </p>
            </div>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelect(tmpl)}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tmpl.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    {tmpl.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {tmpl.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-brand group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tmpl.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Apply Template</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </Modal>
  );
};
