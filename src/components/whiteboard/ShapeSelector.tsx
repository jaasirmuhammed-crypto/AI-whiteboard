import React from 'react';
import { ShapeType } from '../../types/whiteboard';
import { 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  ArrowUpRight, 
  StickyNote,
  Check
} from 'lucide-react';

interface ShapeSelectorProps {
  currentShape: ShapeType;
  onSelectShape: (shape: ShapeType) => void;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  currentShape,
  onSelectShape,
}) => {
  const shapes: { id: ShapeType; name: string; icon: any }[] = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle / Ellipse', icon: Circle },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'line', name: 'Straight Line', icon: Minus },
    { id: 'arrow', name: 'Arrow Pointer', icon: ArrowUpRight },
    { id: 'sticky-note', name: 'Sticky Note', icon: StickyNote },
  ];

  return (
    <div className="p-3 w-56 space-y-1">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 border-b border-slate-100 dark:border-slate-800 mb-1">
        Geometric Shapes
      </div>
      {shapes.map((s) => {
        const Icon = s.icon;
        const isSelected = currentShape === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelectShape(s.id)}
            className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
              isSelected
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-indigo-500" />
              <span>{s.name}</span>
            </div>
            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </button>
        );
      })}
    </div>
  );
};
