import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Copy, 
  Plus, 
  Wand2, 
  BookOpen, 
  RefreshCw, 
  HelpCircle, 
  AlignLeft,
  X,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { WhiteboardElement, StickyElement } from '../../types/whiteboard';
import { useProject } from '../../context/ProjectContext';
import { triggerStarBurst } from '../../utils/confettiUtil';

interface AIWritingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSticky?: (sticky: StickyElement) => void;
}

export const AIWritingAssistantModal: React.FC<AIWritingAssistantModalProps> = ({
  isOpen,
  onClose,
  onInsertSticky
}) => {
  const { currentProject, updateCurrentProjectElements } = useProject();
  const { showToast } = useToast();

  // Pre-fill with whiteboard text if available
  const initialText = currentProject?.elements
    .filter(el => el.type === 'text' || el.type === 'sticky')
    .map((el: any) => el.text)
    .join('\n\n') || '';

  const [inputText, setInputText] = useState(initialText || 'Enter or paste your notes, lecture transcript, or equation descriptions here...');
  const [outputText, setOutputText] = useState('');
  const [activeMode, setActiveMode] = useState<'grammar' | 'polish' | 'eli5' | 'summary'>('grammar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcessText = () => {
    if (!inputText.trim()) {
      showToast('Please provide some text to polish.', 'info');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      let result = '';
      const clean = inputText.trim();

      if (activeMode === 'grammar') {
        // Fix grammar & punctuation
        result = clean
          .replace(/\bi\b/g, 'I')
          .replace(/\bteh\b/gi, 'the')
          .replace(/\brecieve\b/gi, 'receive')
          .replace(/\bdont\b/gi, "don't")
          .replace(/\bcant\b/gi, "can't")
          .replace(/\bwont\b/gi, "won't")
          .replace(/\s+/g, ' ')
          .replace(/([.!?])\s*([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`);
        
        // Capitalize first letter
        result = result.charAt(0).toUpperCase() + result.slice(1);
        if (!/[.!?]$/.test(result)) result += '.';
      } else if (activeMode === 'polish') {
        result = `In accordance with foundational principles, ${clean.toLowerCase().replace(/^[a-z]/, (c) => c.toUpperCase())}. Consequently, this provides a rigorous conceptual framework for academic analysis and exam problem-solving.`;
      } else if (activeMode === 'eli5') {
        result = `Imagine this like a simple everyday machine: ${clean.replace(/[\n\r]+/g, ' ')}. In simple words: the core idea is that when one part changes, the other reacts smoothly!`;
      } else if (activeMode === 'summary') {
        const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 5);
        result = sentences.length > 0 
          ? sentences.slice(0, 3).map((s, i) => `• Key Point ${i + 1}: ${s.trim()}`).join('\n')
          : `• Core Takeaway: ${clean}`;
      }

      setOutputText(result);
      setIsProcessing(false);
      triggerStarBurst(0.5, 0.4);
      showToast('AI suggestions generated! ✨', 'success');
    }, 450);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      showToast('Copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleInsertOnCanvas = () => {
    if (!outputText) return;
    const now = Date.now();
    const newSticky: StickyElement = {
      id: `sticky_${now}`,
      type: 'sticky',
      x: 200 + Math.random() * 80,
      y: 180 + Math.random() * 80,
      width: 260,
      height: 200,
      text: outputText,
      color: activeMode === 'grammar' ? '#fef08a' : activeMode === 'polish' ? '#bae6fd' : '#bbf7d0',
      title: activeMode === 'grammar' ? 'Grammar Polished' : activeMode === 'polish' ? 'Academic Note' : 'Summary Note',
      layerId: 'layer_01',
    };

    if (onInsertSticky) {
      onInsertSticky(newSticky);
    } else if (currentProject) {
      updateCurrentProjectElements([...currentProject.elements, newSticky]);
    }

    showToast('Sticky note pinned to whiteboard! 📌', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-brand text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Writing & Grammar Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                  Smart Polish
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fix spelling, correct grammar in handwritten notes, and enhance academic tone.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'grammar', label: 'Fix Grammar', icon: Check, desc: 'Spelling & typos' },
            { id: 'polish', label: 'Academic Tone', icon: BookOpen, desc: 'Elevate vocabulary' },
            { id: 'eli5', label: 'Simplify (ELI5)', icon: HelpCircle, desc: 'Explain simply' },
            { id: 'summary', label: 'Key Bullets', icon: AlignLeft, desc: '3-point summary' },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as any);
                  if (outputText) setOutputText('');
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </div>
                <div className="text-[10px] opacity-70 mt-0.5">{mode.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Input Notes / Handwritten Text</span>
            <button
              onClick={() => setInputText('')}
              className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
            placeholder="Type or paste text..."
          />
        </div>

        {/* Action Trigger Button */}
        <div className="flex justify-end">
          <button
            onClick={handleProcessText}
            disabled={isProcessing || !inputText.trim()}
            className="btn-interactive px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Polishing Text...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>Apply AI Writing Polish</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Preview Box */}
        {outputText && (
          <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>AI Suggested Version</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20">
                {activeMode}
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
              {outputText}
            </p>

            {/* Quick Insertion & Copy Actions */}
            <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleInsertOnCanvas}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert Sticky Note onto Canvas</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
