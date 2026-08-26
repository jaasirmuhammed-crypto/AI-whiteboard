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
  const [provider, setProvider] = useState<'gemini' | 'claude' | 'openai'>('gemini');
  const [apiKey, setApiKey] = useState(AIService.getApiKey());
  const [claudeKey, setClaudeKey] = useState(localStorage.getItem('ai_claude_api_key') || '');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [systemPromptProfile, setSystemPromptProfile] = useState<'academic' | 'concise' | 'socratic'>('academic');
  const isEnvLinked = AIService.isEnvApiKeyPresent();

  const handleSave = () => {
    AIService.setApiKey(apiKey.trim());
    if (claudeKey.trim()) {
      localStorage.setItem('ai_claude_api_key', claudeKey.trim());
    } else {
      localStorage.removeItem('ai_claude_api_key');
    }
    localStorage.setItem('ai_selected_provider', provider);
    localStorage.setItem('ai_system_prompt_profile', systemPromptProfile);
    showToast(`AI Engine configured: ${provider.toUpperCase()} active with ${systemPromptProfile} prompt profile! ✨`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Engine & API Configuration" maxWidth="max-w-lg">
      <div className="space-y-5">
        
        {/* Info Callout */}
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            AI Whiteboard supports <strong>Google Gemini</strong>, <strong>Anthropic Claude 3.5 Sonnet</strong>, and <strong>OpenAI GPT-4o</strong> with pedagogical system prompts for optimal slide decks, MCQ rationale, and mind map trees.
          </div>
        </div>

        {/* Provider Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Active AI Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gemini', label: 'Google Gemini', desc: 'Fast & Multimodal' },
              { id: 'claude', label: 'Anthropic Claude', desc: 'Smarter Reasoning' },
              { id: 'openai', label: 'OpenAI GPT-4o', desc: 'Advanced Vision' },
            ].map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => setProvider(prov.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === prov.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">{prov.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{prov.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gemini API Key */}
        {provider === 'gemini' && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Gemini API Key
              </label>
              {isEnvLinked && (
                <span className="text-[10px] text-emerald-600 font-bold">Linked via .env.local</span>
              )}
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (or leave empty for built-in AI)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Claude API Key */}
        {provider === 'claude' && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Anthropic Claude API Key (sk-ant-...)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Model Architecture
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {provider === 'gemini' && (
              <>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended — Real-Time 120 FPS)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </>
            )}
            {provider === 'claude' && (
              <>
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (State-of-the-Art Academic Intelligence)</option>
                <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Ultra-Fast Synthesis)</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus (Complex Research Synthesis)</option>
              </>
            )}
            {provider === 'openai' && (
              <>
                <option value="gpt-4o">GPT-4o (Omni Multimodal Vision)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Fast Cost-Effective)</option>
              </>
            )}
          </select>
        </div>

        {/* System Prompt Profile */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Pedagogical System Prompt Directives
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'academic', label: 'Academic Rigor', desc: 'Equations, derivations & proofs' },
              { id: 'concise', label: 'Executive Summary', desc: 'High-yield bullet points' },
              { id: 'socratic', label: 'Socratic Tutor', desc: 'Guiding conceptual questions' },
            ].map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSystemPromptProfile(prof.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  systemPromptProfile === prof.id
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">{prof.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{prof.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </Modal>
  );
};
