import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  Palette, 
  Maximize2,
  Check
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProject } from '../../context/ProjectContext';

export const DemoWhiteboard: React.FC = () => {
  const { t, language } = useI18n();
  const { setCurrentView, createProject } = useProject();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [color, setColor] = useState('#4f46e5');
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = ['#4f46e5', '#9333ea', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#1e293b'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial background & starter text
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Ruled lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 30; y < rect.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(rect.width - 10, y);
      ctx.stroke();
    }

    // Starter sample note
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4f46e5';
    ctx.fillText('✍️ Try sketching formulas or notes here!', 24, 55);

    ctx.font = '13px "Caveat", cursive, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('E = mc²   •   ΔG = ΔH - TΔS   •   DNA -> RNA -> Protein', 24, 85);
  }, []);

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // redraw ruled lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 30; y < rect.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(rect.width - 10, y);
      ctx.stroke();
    }
  };

  const isTa = language === 'ta';
  const isHi = language === 'hi';
  const isAr = language === 'ar';
  const isEs = language === 'es';
  const isZh = language === 'zh';

  const miniBadge = isTa ? 'ஊடாடும் பயிற்சி அரங்கம்' : isHi ? 'इंटरैक्टिव मिनी खेल का मैदान' : isAr ? 'منطقة تجربة تفاعلية مصغرة' : isEs ? 'Área de Prueba Interactiva' : isZh ? '交互式快速体验画板' : 'Interactive Mini Playground';
  const miniTitle = isTa ? 'ஒயிட்போர்டின் மென்மையான அனுபவம்' : isHi ? 'व्हाइटबोर्ड की सहजता का अनुभव करें' : isAr ? 'جرب سلاسة السبورة التفاعلية' : isEs ? 'Experimenta la Fluidez de la Pizarra' : isZh ? '即刻体验智能白板的极致丝滑' : 'Experience the Whiteboard Fluidity';
  const miniDesc = isTa ? 'கீழே நேரடியாக வரையவும் அல்லது முழு அளவிலான ஸ்டுடியோவைத் திறக்கவும்.' : isHi ? 'सीधे नीचे ड्रा करें या पूर्ण-स्क्रीन पेशेवर स्टूडियो में जाएं।' : isAr ? 'ارسم مباشرة في الأسفل أو انتقل إلى الاستوديو الاحترافي الكامل.' : isEs ? 'Dibuja directamente abajo o entra al estudio profesional completo.' : isZh ? '在下方直接涂鸦书写，或一键进入全屏专业级创作工坊。' : 'Draw directly below or jump into the full-screen professional studio.';
  const launchStudio = isTa ? 'முழு பலகையைத் திற' : isHi ? 'पूर्ण स्टूडियो खोलें' : isAr ? 'فتح الاستوديو الكامل' : isEs ? 'Abrir Estudio Completo' : isZh ? '开启全屏白板工作台' : 'Launch Full Studio';

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            {miniBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand text-slate-900 dark:text-white">
            {miniTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {miniDesc}
          </p>
        </div>

        {/* Demo Canvas Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 sm:p-6 overflow-hidden">
          
          {/* Mini Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEraser(false)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  !isEraser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>{t.whiteboard.pens || 'Pen'}</span>
              </button>

              <button
                onClick={() => setIsEraser(true)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isEraser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>{t.whiteboard.eraser || 'Eraser'}</span>
              </button>

              {/* Swatches */}
              {!isEraser && (
                <div className="flex items-center gap-1.5 ml-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.whiteboard.clear || 'Clear'}
              </button>

              <button
                onClick={() => {
                  createProject('Sandbox Notes');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {launchStudio}
              </button>
            </div>
          </div>

          {/* Canvas Element */}
          <div className="relative mt-4 h-72 sm:h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full cursor-crosshair block"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
