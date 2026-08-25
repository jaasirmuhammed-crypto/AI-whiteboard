import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { CanvasLayer } from '../../types/whiteboard';

interface LayersPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: CanvasLayer[];
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  onUpdateLayers: (layers: CanvasLayer[]) => void;
}

export const LayersPanelModal: React.FC<LayersPanelModalProps> = ({
  isOpen,
  onClose,
  layers,
  activeLayerId,
  onSelectLayer,
  onUpdateLayers,
}) => {
  const [newLayerName, setNewLayerName] = useState('');

  const toggleVisibility = (layerId: string) => {
    onUpdateLayers(
      layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  const toggleLock = (layerId: string) => {
    onUpdateLayers(
      layers.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l))
    );
  };

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLayerName.trim()) {
      const newLayer: CanvasLayer = {
        id: 'layer_' + Date.now(),
        name: newLayerName.trim(),
        visible: true,
        locked: false,
        opacity: 1,
      };
      onUpdateLayers([...layers, newLayer]);
      onSelectLayer(newLayer.id);
      setNewLayerName('');
    }
  };

  const handleDeleteLayer = (layerId: string) => {
    if (layers.length > 1) {
      const filtered = layers.filter((l) => l.id !== layerId);
      onUpdateLayers(filtered);
      if (activeLayerId === layerId) {
        onSelectLayer(filtered[0].id);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-brand text-slate-900 dark:text-white">
              Whiteboard Layers
            </h3>
          </div>
          <span className="text-xs text-slate-400">{layers.length} Layers</span>
        </div>

        {/* Layers Stack List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {layers.map((layer) => {
            const isActive = layer.id === activeLayerId;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span className={`text-xs font-semibold ${isActive ? 'text-indigo-900 dark:text-indigo-200 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {layer.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(layer.id)}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      layer.visible ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'
                    }`}
                    title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                  >
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-rose-500" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLock(layer.id)}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      layer.locked ? 'text-amber-500' : 'text-slate-400'
                    }`}
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                  >
                    {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  {layers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLayer(layer.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500"
                      title="Delete Layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Layer Form */}
        <form onSubmit={handleAddLayer} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="New layer name (e.g. Formulas, Diagrams)..."
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  );
};
