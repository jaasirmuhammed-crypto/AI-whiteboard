import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  FileSpreadsheet, 
  Network, 
  Atom, 
  ArrowRight,
  Compass,
  Layers,
  Sparkles,
  BookOpen,
  Binary,
  GitBranch,
  Search,
  Sigma,
  Zap,
  Landmark,
  GraduationCap,
  FlaskConical,
  Dna,
  Scale,
  Activity
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhiteboardElement, ShapeElement, TextElement } from '../../types/whiteboard';
import { useToast } from '../common/Toast';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'Math' | 'Science' | 'History' | 'Academic';
  description: string;
  icon: React.ReactNode;
  color: string;
  tags: string[];
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
  const [activeCategory, setActiveCategory] = useState<'All' | 'Math' | 'Science' | 'History' | 'Academic'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const createTextEl = (
    id: string,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    bold: boolean = false,
    italic: boolean = false
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
    italic,
    underline: false,
    align: 'left',
    layerId: 'layer_01',
  });

  const templates: TemplateDefinition[] = [
    // ==========================================
    // 📐 MATHEMATICS TEMPLATES
    // ==========================================
    {
      id: 'math_cartesian',
      name: 'Cartesian 4-Quadrant Graph Grid',
      category: 'Math',
      description: 'Orthogonal X and Y coordinate axes with quadrant indicators (I, II, III, IV), tick marks, origin point, and dedicated function equation box.',
      icon: <Sigma className="w-5 h-5" />,
      color: 'from-blue-600 to-indigo-700',
      tags: ['Algebra', 'Functions', 'Calculus', 'Coordinate Geometry'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        // Title & Equation Box
        const title = createTextEl(`m_c_t_${now}`, '📐 Cartesian Coordinate System & Curve Analysis', 40, 30, 18, '#4f46e5', true);
        
        // Function input box
        const funcBox: ShapeElement = {
          id: `m_c_fb_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 65,
          width: 320,
          height: 48,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.8,
          fillColor: 'rgba(99, 102, 241, 0.08)',
          layerId: 'layer_01',
        };
        const funcText = createTextEl(`m_c_ft_${now}`, 'f(x) = y = mx + c  |  Domain: [a, b]', 55, 95, 12, '#4338ca', true);

        // Center Origin for axes: (540, 420)
        const originX = 540;
        const originY = 420;

        // X-Axis (Horizontal line with arrow)
        const xAxis: ShapeElement = {
          id: `m_c_x_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 140,
          y: originY,
          width: 800,
          height: 0,
          color: '#1e293b',
          strokeWidth: 2,
          opacity: 0.9,
          layerId: 'layer_01',
        };

        // Y-Axis (Vertical line with arrow)
        const yAxis: ShapeElement = {
          id: `m_c_y_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: originX,
          y: 720,
          width: 0,
          height: -600,
          color: '#1e293b',
          strokeWidth: 2,
          opacity: 0.9,
          layerId: 'layer_01',
        };

        // Axis Labels & Origin
        const xLabel = createTextEl(`m_c_xl_${now}`, '+X Axis', 950, originY + 5, 13, '#0f172a', true);
        const yLabel = createTextEl(`m_c_yl_${now}`, '+Y Axis', originX + 10, 115, 13, '#0f172a', true);
        const originLabel = createTextEl(`m_c_ol_${now}`, 'O(0, 0)', originX - 50, originY + 18, 11, '#64748b', true);

        // Quadrant Labels
        const q1 = createTextEl(`m_c_q1_${now}`, 'Quadrant I (+, +)', originX + 160, originY - 140, 13, '#0284c7', true);
        const q2 = createTextEl(`m_c_q2_${now}`, 'Quadrant II (-, +)', originX - 260, originY - 140, 13, '#0284c7', true);
        const q3 = createTextEl(`m_c_q3_${now}`, 'Quadrant III (-, -)', originX - 260, originY + 140, 13, '#0284c7', true);
        const q4 = createTextEl(`m_c_q4_${now}`, 'Quadrant IV (+, -)', originX + 160, originY + 140, 13, '#0284c7', true);

        // Notes sidebar box
        const notesBox: ShapeElement = {
          id: `m_c_nb_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 1000,
          y: 65,
          width: 320,
          height: 480,
          color: '#0284c7',
          strokeWidth: 1.5,
          opacity: 0.8,
          fillColor: 'rgba(2, 132, 199, 0.05)',
          layerId: 'layer_01',
        };
        const notesTitle = createTextEl(`m_c_nt_${now}`, '📝 Key Properties & Intercepts:', 1020, 95, 13, '#0369a1', true);
        const notesBody = createTextEl(`m_c_nbd_${now}`, '• X-intercept (y=0):\n• Y-intercept (x=0):\n• Slope dy/dx:\n• Inflection points:\n• Asymptotes:', 1020, 130, 12, '#334155');

        elements.push(title, funcBox, funcText, xAxis, yAxis, xLabel, yLabel, originLabel, q1, q2, q3, q4, notesBox, notesTitle, notesBody);
        return elements;
      },
    },
    {
      id: 'math_calculus_proof',
      name: 'Calculus Derivation & Step-by-Step Proof',
      category: 'Math',
      description: 'Structured 4-section matrix for formal mathematical derivations: Theorem Statement, Given/Assumptions, Step Proof, and Q.E.D Conclusion.',
      icon: <Binary className="w-5 h-5" />,
      color: 'from-sky-500 to-indigo-600',
      tags: ['Calculus', 'Derivations', 'Integrals', 'Limits'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`m_calc_t_${now}`, '⚡ Mathematical Theorem & Rigorous Proof Schema', 40, 35, 18, '#2563eb', true);

        // 1. Theorem Box
        const thmBox: ShapeElement = {
          id: `m_calc_thm_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 70,
          width: 1200,
          height: 70,
          color: '#2563eb',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(37, 99, 235, 0.08)',
          layerId: 'layer_01',
        };
        const thmLabel = createTextEl(`m_calc_thml_${now}`, '📜 1. THEOREM STATEMENT / PROPOSITION:', 60, 100, 13, '#1d4ed8', true);

        // 2. Given & Hypothesis (Left)
        const givenBox: ShapeElement = {
          id: `m_calc_gb_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 155,
          width: 360,
          height: 480,
          color: '#64748b',
          strokeWidth: 1.5,
          opacity: 0.8,
          fillColor: 'rgba(100, 116, 139, 0.05)',
          layerId: 'layer_01',
        };
        const givenLabel = createTextEl(`m_calc_gl_${now}`, '🔍 2. Given & Boundary Assumptions', 60, 185, 13, '#475569', true);

        // 3. Step-by-Step Proof (Center)
        const proofBox: ShapeElement = {
          id: `m_calc_pb_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 420,
          y: 155,
          width: 820,
          height: 480,
          color: '#4f46e5',
          strokeWidth: 1.5,
          opacity: 0.8,
          fillColor: 'rgba(79, 70, 229, 0.04)',
          layerId: 'layer_01',
        };
        const proofLabel = createTextEl(`m_calc_pl_${now}`, '📐 3. Deductive Derivation Steps & Algebraic Transformations', 440, 185, 13, '#4338ca', true);
        const step1 = createTextEl(`m_calc_s1_${now}`, 'Step 1: Apply limit / substitution definition...', 440, 225, 12, '#64748b', false, true);

        // Q.E.D. Box
        const qedBox: ShapeElement = {
          id: `m_calc_qed_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 440,
          y: 560,
          width: 780,
          height: 55,
          color: '#10b981',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(16, 185, 129, 0.12)',
          layerId: 'layer_01',
        };
        const qedText = createTextEl(`m_calc_qedt_${now}`, '🎯 Hence Proved / Q.E.D. [ Final Invariant Equation ]', 460, 595, 13, '#065f46', true);

        elements.push(title, thmBox, thmLabel, givenBox, givenLabel, proofBox, proofLabel, step1, qedBox, qedText);
        return elements;
      },
    },

    // ==========================================
    // ⚡ SCIENCE TEMPLATES (Physics, Chemistry, Bio)
    // ==========================================
    {
      id: 'sci_physics_fbd',
      name: 'Physics Vector & Free Body Diagram',
      category: 'Science',
      description: 'Equilibrium dynamics board with Cartesian force coordinate system (Normal force N, Weight mg, Friction f, Applied force F), and Newton law sum equations.',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-amber-500 to-red-600',
      tags: ['Mechanics', 'Forces', 'Circuits', 'Newton Laws'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`sci_fbd_t_${now}`, '⚡ Free Body Diagram (FBD) & Equilibrium Equations', 40, 35, 18, '#d97706', true);

        // FBD Drawing Canvas Box (Center)
        const fbdCanvas: ShapeElement = {
          id: `sci_fbd_c_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 70,
          width: 580,
          height: 520,
          color: '#d97706',
          strokeWidth: 2,
          opacity: 0.8,
          fillColor: 'rgba(217, 119, 6, 0.05)',
          layerId: 'layer_01',
        };
        const fbdLabel = createTextEl(`sci_fbd_lbl_${now}`, '🎨 1. Force Vector & Free Body Sketch Zone', 60, 100, 13, '#b45309', true);

        // Sample mass block in center
        const massBlock: ShapeElement = {
          id: `sci_fbd_m_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 270,
          y: 280,
          width: 120,
          height: 90,
          color: '#475569',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(71, 85, 105, 0.15)',
          layerId: 'layer_01',
        };
        const massText = createTextEl(`sci_fbd_mt_${now}`, 'Mass [m]', 305, 330, 13, '#334155', true);

        // Forces Arrows
        // Normal force (Up)
        const fNormal: ShapeElement = {
          id: `sci_fn_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 330,
          y: 280,
          width: 0,
          height: -100,
          color: '#2563eb',
          strokeWidth: 2.5,
          opacity: 0.9,
          layerId: 'layer_01',
        };
        const fnText = createTextEl(`sci_fnt_${now}`, 'N (Normal)', 340, 195, 12, '#2563eb', true);

        // Weight (Down)
        const fWeight: ShapeElement = {
          id: `sci_fw_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 330,
          y: 370,
          width: 0,
          height: 100,
          color: '#dc2626',
          strokeWidth: 2.5,
          opacity: 0.9,
          layerId: 'layer_01',
        };
        const fwText = createTextEl(`sci_fwt_${now}`, 'W = mg', 340, 465, 12, '#dc2626', true);

        // Equations Box (Right)
        const eqBox: ShapeElement = {
          id: `sci_fbd_eq_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 640,
          y: 70,
          width: 580,
          height: 520,
          color: '#2563eb',
          strokeWidth: 2,
          opacity: 0.8,
          fillColor: 'rgba(37, 99, 235, 0.05)',
          layerId: 'layer_01',
        };
        const eqLabel = createTextEl(`sci_fbd_eql_${now}`, '📐 2. Newton\'s 2nd Law Equations of Motion', 660, 100, 13, '#1d4ed8', true);
        const eqBody = createTextEl(`sci_fbd_eqb_${now}`, '• Σ F_x = m · a_x\n• Σ F_y = m · a_y = 0 (Vertical Equilibrium)\n• Net Friction f_k = μ_k · N\n• Torque Σ τ = I · α', 660, 140, 12, '#334155');

        elements.push(title, fbdCanvas, fbdLabel, massBlock, massText, fNormal, fnText, fWeight, fwText, eqBox, eqLabel, eqBody);
        return elements;
      },
    },
    {
      id: 'sci_chem_reaction',
      name: 'Chemistry Reaction Mechanism & Pathway',
      category: 'Science',
      description: 'Sequential 3-stage reaction layout: Reactants + Reagents -> Intermediate / Transition State -> Products, with activation energy callout.',
      icon: <FlaskConical className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-700',
      tags: ['Organic Chemistry', 'Reactions', 'Catalysts', 'Mechanisms'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`sci_chem_t_${now}`, '🧪 Chemical Reaction Mechanism & Energy Pathway', 40, 35, 18, '#059669', true);

        // Box 1: Reactants
        const b1: ShapeElement = {
          id: `chem_b1_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 80,
          width: 320,
          height: 240,
          color: '#059669',
          strokeWidth: 2,
          opacity: 0.85,
          fillColor: 'rgba(5, 150, 105, 0.08)',
          layerId: 'layer_01',
        };
        const t1 = createTextEl(`chem_t1_${now}`, '1. Starting Reactants & Nucleophile', 55, 110, 13, '#047857', true);

        // Arrow 1
        const a1: ShapeElement = {
          id: `chem_a1_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 370,
          y: 200,
          width: 90,
          height: 0,
          color: '#059669',
          strokeWidth: 2.5,
          opacity: 0.9,
          layerId: 'layer_01',
        };
        const reagentLabel = createTextEl(`chem_rg_${now}`, 'Reagents / Catalyst', 365, 180, 10, '#047857', true);

        // Box 2: Intermediate
        const b2: ShapeElement = {
          id: `chem_b2_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 470,
          y: 80,
          width: 320,
          height: 240,
          color: '#d97706',
          strokeWidth: 2,
          opacity: 0.85,
          fillColor: 'rgba(217, 119, 6, 0.08)',
          layerId: 'layer_01',
        };
        const t2 = createTextEl(`chem_t2_${now}`, '2. Carbocation / Transition State [‡]', 485, 110, 13, '#b45309', true);

        // Arrow 2
        const a2: ShapeElement = {
          id: `chem_a2_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 800,
          y: 200,
          width: 90,
          height: 0,
          color: '#059669',
          strokeWidth: 2.5,
          opacity: 0.9,
          layerId: 'layer_01',
        };

        // Box 3: Final Product
        const b3: ShapeElement = {
          id: `chem_b3_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 900,
          y: 80,
          width: 320,
          height: 240,
          color: '#2563eb',
          strokeWidth: 2,
          opacity: 0.85,
          fillColor: 'rgba(37, 99, 235, 0.08)',
          layerId: 'layer_01',
        };
        const t3 = createTextEl(`chem_t3_${now}`, '3. Final Isolated Product & Yield', 915, 110, 13, '#1d4ed8', true);

        // Bottom Thermodynamics / Kinetics Box
        const thermoBox: ShapeElement = {
          id: `chem_tb_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 350,
          width: 1180,
          height: 220,
          color: '#6366f1',
          strokeWidth: 1.5,
          opacity: 0.8,
          fillColor: 'rgba(99, 102, 241, 0.05)',
          layerId: 'layer_01',
        };
        const thermoTitle = createTextEl(`chem_tt_${now}`, '⚡ Thermodynamic & Stereochemistry Notes (ΔH, ΔG, Rate Law)', 60, 380, 13, '#4338ca', true);

        elements.push(title, b1, t1, a1, reagentLabel, b2, t2, a2, b3, t3, thermoBox, thermoTitle);
        return elements;
      },
    },

    // ==========================================
    // 🏛️ HISTORY & SOCIAL STUDIES TEMPLATES
    // ==========================================
    {
      id: 'hist_timeline_ladder',
      name: 'Historical Chronological Ladder & Turning Points',
      category: 'History',
      description: 'Vertical timeline spine connecting key epochs, triggers, major battles/events, and long-term socio-political outcomes.',
      icon: <Landmark className="w-5 h-5" />,
      color: 'from-amber-600 to-orange-700',
      tags: ['World History', 'UPSC', 'Timelines', 'Civilizations'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`hist_t_${now}`, '🏛️ Historical Chronology & Cause-Effect Milestone Ladder', 40, 35, 18, '#c2410c', true);

        // Vertical Central Timeline Spine
        const spine: ShapeElement = {
          id: `hist_sp_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 600,
          y: 80,
          width: 0,
          height: 520,
          color: '#c2410c',
          strokeWidth: 3,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Event 1 (Left - Antecedents)
        const ev1: ShapeElement = {
          id: `hist_ev1_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 100,
          y: 90,
          width: 440,
          height: 100,
          color: '#ea580c',
          strokeWidth: 1.5,
          opacity: 0.9,
          fillColor: 'rgba(234, 88, 12, 0.08)',
          layerId: 'layer_01',
        };
        const ev1Text = createTextEl(`hist_ev1_t_${now}`, '1. Root Causes & Pre-Conditions (Epoch I)', 120, 120, 13, '#9a3412', true);
        const ev1Details = createTextEl(`hist_ev1_d_${now}`, '• Socio-economic grievances\n• Institutional weakness & triggering friction', 120, 145, 11, '#475569');

        // Event 2 (Right - Flashpoint)
        const ev2: ShapeElement = {
          id: `hist_ev2_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 660,
          y: 220,
          width: 440,
          height: 100,
          color: '#dc2626',
          strokeWidth: 1.5,
          opacity: 0.9,
          fillColor: 'rgba(220, 38, 38, 0.08)',
          layerId: 'layer_01',
        };
        const ev2Text = createTextEl(`hist_ev2_t_${now}`, '2. Catalyst & Major Flashpoint (Year / Date)', 680, 250, 13, '#991b1b', true);
        const ev2Details = createTextEl(`hist_ev2_d_${now}`, '• Key leaders and revolutionary declarations\n• Decisive military engagement / treaty', 680, 275, 11, '#475569');

        // Event 3 (Left - Consequences)
        const ev3: ShapeElement = {
          id: `hist_ev3_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 100,
          y: 350,
          width: 440,
          height: 100,
          color: '#059669',
          strokeWidth: 1.5,
          opacity: 0.9,
          fillColor: 'rgba(5, 150, 105, 0.08)',
          layerId: 'layer_01',
        };
        const ev3Text = createTextEl(`hist_ev3_t_${now}`, '3. Post-Crisis Reorganization & Treaties', 120, 380, 13, '#065f46', true);
        const ev3Details = createTextEl(`hist_ev3_d_${now}`, '• Boundary redistributions & constitutional shifts\n• Long-term global historical ramifications', 120, 405, 11, '#475569');

        elements.push(title, spine, ev1, ev1Text, ev1Details, ev2, ev2Text, ev2Details, ev3, ev3Text, ev3Details);
        return elements;
      },
    },
    {
      id: 'hist_upsc_polity',
      name: 'Constitutional Articles & Landmark Case Law',
      category: 'History',
      description: 'High-yield framework for competitive governance and civil services: Constitutional Provisions, Historical Background, Supreme Court Landmark Precedents, and Administrative Impact.',
      icon: <Scale className="w-5 h-5" />,
      color: 'from-purple-600 to-indigo-800',
      tags: ['Polity', 'UPSC', 'Constitution', 'Supreme Court', 'Law'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`pol_t_${now}`, '⚖️ Constitutional Provisions, Landmark Judgments & Administrative Impact', 40, 35, 18, '#6b21a8', true);

        // 4 Grid Blocks
        // 1. Article Text
        const b1: ShapeElement = {
          id: `pol_b1_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 70,
          width: 580,
          height: 250,
          color: '#7e22ce',
          strokeWidth: 1.5,
          opacity: 0.85,
          fillColor: 'rgba(126, 34, 206, 0.06)',
          layerId: 'layer_01',
        };
        const t1 = createTextEl(`pol_t1_${now}`, '📜 1. Constitutional Article & Text of the Provision', 60, 100, 13, '#6b21a8', true);

        // 2. Legislative Context
        const b2: ShapeElement = {
          id: `pol_b2_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 640,
          y: 70,
          width: 580,
          height: 250,
          color: '#2563eb',
          strokeWidth: 1.5,
          opacity: 0.85,
          fillColor: 'rgba(37, 99, 235, 0.06)',
          layerId: 'layer_01',
        };
        const t2 = createTextEl(`pol_t2_${now}`, '🏛️ 2. Constituent Assembly Intent & Historical Background', 660, 100, 13, '#1d4ed8', true);

        // 3. Supreme Court Rulings
        const b3: ShapeElement = {
          id: `pol_b3_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 40,
          y: 340,
          width: 580,
          height: 250,
          color: '#ea580c',
          strokeWidth: 1.5,
          opacity: 0.85,
          fillColor: 'rgba(234, 88, 12, 0.06)',
          layerId: 'layer_01',
        };
        const t3 = createTextEl(`pol_t3_${now}`, '⚖️ 3. Landmark Supreme Court Judgments & Doctrine', 60, 370, 13, '#c2410c', true);

        // 4. Policy Implementation
        const b4: ShapeElement = {
          id: `pol_b4_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 640,
          y: 340,
          width: 580,
          height: 250,
          color: '#059669',
          strokeWidth: 1.5,
          opacity: 0.85,
          fillColor: 'rgba(5, 150, 105, 0.06)',
          layerId: 'layer_01',
        };
        const t4 = createTextEl(`pol_t4_${now}`, '📋 4. Modern Administrative Impact & Governance Reforms', 660, 370, 13, '#047857', true);

        elements.push(title, b1, t1, b2, t2, b3, t3, b4, t4);
        return elements;
      },
    },

    // ==========================================
    // 📝 GENERAL ACADEMIC FRAMEWORKS
    // ==========================================
    {
      id: 'cornell',
      name: 'Cornell Note-Taking System',
      category: 'Academic',
      description: 'Structured layout with a dedicated Cue column, main lecture notes zone, and summary row at the bottom.',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-600',
      tags: ['Study Notes', 'Lectures', 'Summaries', 'Revision'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const cueLine: ShapeElement = {
          id: `cue_line_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 260,
          y: 60,
          width: 0,
          height: 540,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.6,
          layerId: 'layer_01',
        };

        const summaryLine: ShapeElement = {
          id: `summary_line_${now}`,
          type: 'shape',
          shapeType: 'line',
          x: 40,
          y: 500,
          width: 1140,
          height: 0,
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 0.6,
          layerId: 'layer_01',
        };

        const titleText = createTextEl(`title_${now}`, 'Topic: Lecture Title / Date', 40, 30, 18, '#4f46e5', true);
        const cueHeader = createTextEl(`cue_hdr_${now}`, '💡 Cues & Key Questions', 40, 80, 13, '#64748b', true);
        const notesHeader = createTextEl(`notes_hdr_${now}`, '📝 Main Lecture Notes, Explanations & Diagrams', 280, 80, 13, '#64748b', true);
        const summaryHeader = createTextEl(`summary_hdr_${now}`, '🎯 Summary & Core Takeaways:', 40, 525, 13, '#059669', true);

        elements.push(cueLine, summaryLine, titleText, cueHeader, notesHeader, summaryHeader);
        return elements;
      },
    },
    {
      id: 'flowchart',
      name: 'Logic Flowchart & Decision Tree',
      category: 'Academic',
      description: 'Standard flowchart schema with Start terminal, Process boxes, Decision diamond, and flow arrows.',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      tags: ['Logic', 'Algorithms', 'Decisions', 'Computer Science'],
      generateElements: () => {
        const elements: WhiteboardElement[] = [];
        const now = Date.now();

        const title = createTextEl(`fc_title_${now}`, '🔄 Algorithm / Logic Flowchart', 40, 35, 18, '#2563eb', true);

        // Start Oval/Pill
        const startBox: ShapeElement = {
          id: `fc_start_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 400,
          y: 70,
          width: 160,
          height: 50,
          color: '#10b981',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(16, 185, 129, 0.15)',
          layerId: 'layer_01',
        };
        const startText = createTextEl(`fc_st_${now}`, 'START', 455, 100, 13, '#059669', true);

        // Arrow 1
        const a1: ShapeElement = {
          id: `fc_a1_${now}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 480,
          y: 120,
          width: 0,
          height: 60,
          color: '#64748b',
          strokeWidth: 2,
          opacity: 0.8,
          layerId: 'layer_01',
        };

        // Process Box 1
        const p1: ShapeElement = {
          id: `fc_p1_${now}`,
          type: 'shape',
          shapeType: 'rectangle',
          x: 370,
          y: 180,
          width: 220,
          height: 60,
          color: '#3b82f6',
          strokeWidth: 2,
          opacity: 0.9,
          fillColor: 'rgba(59, 130, 246, 0.1)',
          layerId: 'layer_01',
        };
        const p1Text = createTextEl(`fc_p1t_${now}`, 'Initialize Variables', 415, 215, 12, '#1d4ed8', true);

        elements.push(title, startBox, startText, a1, p1, p1Text);
        return elements;
      },
    },
  ];

  // Filter templates based on category and search query
  const filteredTemplates = templates.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      t.name.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      t.tags.some((tag) => tag.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  const handleSelect = (template: TemplateDefinition) => {
    const elements = template.generateElements();
    onApplyTemplate(elements);
    showToast(`Applied template "${template.name}" ✨`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Pre-Built Academic Templates Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Load specialized subject canvas layouts for Math, Science, History, and structured study.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'All', label: 'All Templates' },
            { id: 'Math', label: '📐 Mathematics' },
            { id: 'Science', label: '⚡ Science (Physics/Chem/Bio)' },
            { id: 'History', label: '🏛️ History & Polity' },
            { id: 'Academic', label: '📝 Academic Frameworks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm italic">No templates found matching your search.</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelect(template)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${template.color} text-white flex items-center justify-center shadow-xs`}>
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {template.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-medium text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                  >
                    <span>Insert</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          <span>{filteredTemplates.length} templates ready to insert</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
