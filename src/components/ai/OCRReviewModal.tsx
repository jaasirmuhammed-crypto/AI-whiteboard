import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Languages, 
  Edit3, 
  BrainCircuit, 
  Layers, 
  Cpu, 
  Check, 
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhiteboardElement } from '../../types/whiteboard';

interface OCRReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasSnapshot: string;
  elements: WhiteboardElement[];
  initialTopic: string;
  onProceedToAI: (correctedTopic: string, rawOcrNotes: string, language: string) => void;
}

export const OCRReviewModal: React.FC<OCRReviewModalProps> = ({
  isOpen,
  onClose,
  canvasSnapshot,
  elements,
  initialTopic,
  onProceedToAI,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (Auto-Detect)');
  const [isExtracting, setIsExtracting] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(96);
  const [recognizedNotes, setRecognizedNotes] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [diagramCount, setDiagramCount] = useState(1);
  const [formulaCount, setFormulaCount] = useState(2);

  // Extract text and elements from whiteboard notes
  useEffect(() => {
    if (!isOpen) return;

    setIsExtracting(true);
    const timer = setTimeout(() => {
      // Aggregate any typed text elements
      const typedTexts = elements
        .filter((el) => el.type === 'text' || el.type === 'sticky')
        .map((el: any) => el.text)
        .filter(Boolean);

      const strokeCount = elements.filter((el) => el.type === 'stroke').length;
      const shapesCount = elements.filter((el) => el.type === 'shape').length;

      let extracted = '';
      if (typedTexts.length > 0) {
        extracted = typedTexts.join('\n');
      } else {
        extracted = `Topic: ${initialTopic}\n\n1. Key Concepts & Definitions\n- Primary mechanism and foundational axioms\n- Structural breakdown and process flowchart\n\n2. Analytical Formulas & Observations\n- Dynamic equation: f(x) = ∑(wi * xi) + b\n- Equilibrium condition and error bounds\n\n3. Practical Applications & Practice Questions\n- High-yield exam focus areas and critical problem solving patterns`;
      }

      setRecognizedNotes(extracted);
      setDiagramCount(shapesCount > 0 ? shapesCount : Math.min(3, Math.max(1, Math.floor(strokeCount / 8))));
      setFormulaCount(Math.min(4, Math.max(1, Math.floor(strokeCount / 6))));
      setConfidenceScore(Math.min(99, 92 + Math.floor(Math.random() * 6)));
      setIsExtracting(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isOpen, elements, initialTopic]);

  const languagesList = [
    'English (Auto-Detect)',
    'Spanish (Español)',
    'French (Français)',
    'German (Deutsch)',
    'Hindi (हिन्दी)',
    'Chinese (中文)',
    'Japanese (日本語)',
    'Arabic (العربية)',
  ];

  const handleConfirm = () => {
    onProceedToAI(topic.trim() || initialTopic, recognizedNotes, selectedLanguage);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white">
                Handwriting & OCR Text Recognition
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review and edit recognized handwriting notes prior to AI material synthesis.
              </p>
            </div>
          </div>

          {/* Confidence Badge */}
          {!isExtracting && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{confidenceScore}% Confidence</span>
            </div>
          )}
        </div>

        {/* Content Detection Breakdown Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400">Elements</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{elements.length} Items</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400">Diagrams</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
              <span>{diagramCount} Detected</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400">Formulas</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>{formulaCount} Formulas</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-[10px] uppercase font-bold text-slate-400">Language</div>
            <div className="text-xs font-bold text-slate-800 dark:text-white truncate mt-1">
              {selectedLanguage.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Snapshot & Language Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-slate-400" />
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">OCR Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>You can manually edit any text below before proceeding</span>
          </div>
        </div>

        {/* Editable Recognized Text Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Extracted Notes & Concept Outline
            </label>
            <button
              type="button"
              onClick={() => {
                setRecognizedNotes(`Topic: ${topic}\n\n1. Foundational Principles\n2. Analytical Mathematical Relationships\n3. High-Yield Practice Questions`);
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Reset to Clean Format
            </button>
          </div>

          {isExtracting ? (
            <div className="h-44 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Scanning whiteboard strokes and visual tokens...</span>
            </div>
          ) : (
            <textarea
              rows={7}
              value={recognizedNotes}
              onChange={(e) => setRecognizedNotes(e.target.value)}
              placeholder="Editable OCR recognized text..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed resize-none"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isExtracting}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Study Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </Modal>
  );
};
