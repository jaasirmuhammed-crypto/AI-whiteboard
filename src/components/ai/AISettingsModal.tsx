import React, { useState } from 'react';
import { Key, Sparkles, Shield, Check, Info } from 'lucide-react';
import { Modal } from '../common/Modal';
import { AIService } from '../../services/aiService';
import { useToast } from '../common/Toast';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState(AIService.getApiKey());
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');

  const handleSave = () => {
    AIService.setApiKey(apiKey.trim());
    showToast('AI Settings updated successfully', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Engine & API Configuration" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            AI Whiteboard includes an intelligent built-in pedagogical parser that works offline or without an API key. To enable custom Google Gemini cloud vision OCR, you can optionally insert your Google AI Studio key below.
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Google Gemini API Key (Optional)
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Vision & Multimodal Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast & Recommended)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </Modal>
  );
};
