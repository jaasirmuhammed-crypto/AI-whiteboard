import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Eraser } from 'lucide-react';

interface BrushIntroScreenProps {
  onComplete: () => void;
}

export const BrushIntroScreen: React.FC<BrushIntroScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0, visible: false, angle: -25 });
  const [dusterPos, setDusterPos] = useState({ x: 0, y: 0, visible: false, angle: 5 });
  const [phaseText, setPhaseText] = useState('Writing AI Whiteboard...');
  const animFrameRef = useRef<number | null>(null);

  const finishIntro = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(1.0, Math.max(0.55, width / 780));

    // Define cursive stroke coordinates for writing "AI Whiteboard"
    const strokes: Array<Array<{ x: number; y: number }>> = [
      // 1. "A"
      [
        { x: cx - 290 * scale, y: cy + 30 * scale },
        { x: cx - 270 * scale, y: cy - 65 * scale },
        { x: cx - 250 * scale, y: cy + 30 * scale },
      ],
      // "A" crossbar
      [
        { x: cx - 280 * scale, y: cy - 10 * scale },
        { x: cx - 260 * scale, y: cy - 10 * scale },
      ],
      // 2. "I"
      [
        { x: cx - 235 * scale, y: cy - 65 * scale },
        { x: cx - 235 * scale, y: cy + 30 * scale },
      ],
      // "I" top serif
      [
        { x: cx - 248 * scale, y: cy - 65 * scale },
        { x: cx - 222 * scale, y: cy - 65 * scale },
      ],
      // "I" bottom serif
      [
        { x: cx - 248 * scale, y: cy + 30 * scale },
        { x: cx - 222 * scale, y: cy + 30 * scale },
      ],

      // 3. "W"
      [
        { x: cx - 195 * scale, y: cy - 45 * scale },
        { x: cx - 175 * scale, y: cy + 30 * scale },
        { x: cx - 155 * scale, y: cy - 20 * scale },
        { x: cx - 135 * scale, y: cy + 30 * scale },
        { x: cx - 115 * scale, y: cy - 35 * scale },
      ],
      // 4. "h"
      [
        { x: cx - 100 * scale, y: cy - 65 * scale },
        { x: cx - 100 * scale, y: cy + 30 * scale },
        { x: cx - 95 * scale, y: cy - 5 * scale },
        { x: cx - 75 * scale, y: cy - 5 * scale },
        { x: cx - 75 * scale, y: cy + 30 * scale },
      ],
      // 5. "i"
      [
        { x: cx - 60 * scale, y: cy - 10 * scale },
        { x: cx - 60 * scale, y: cy + 30 * scale },
      ],
      // "i" dot
      [
        { x: cx - 60 * scale, y: cy - 25 * scale },
        { x: cx - 60 * scale, y: cy - 23 * scale },
      ],
      // 6. "t"
      [
        { x: cx - 40 * scale, y: cy - 50 * scale },
        { x: cx - 40 * scale, y: cy + 30 * scale },
      ],
      // "t" crossbar
      [
        { x: cx - 52 * scale, y: cy - 20 * scale },
        { x: cx - 28 * scale, y: cy - 20 * scale },
      ],
      // 7. "e"
      [
        { x: cx - 20 * scale, y: cy + 8 * scale },
        { x: cx + 2 * scale, y: cy + 8 * scale },
        { x: cx + 2 * scale, y: cy - 10 * scale },
        { x: cx - 20 * scale, y: cy - 10 * scale },
        { x: cx - 20 * scale, y: cy + 30 * scale },
        { x: cx + 0 * scale, y: cy + 30 * scale },
      ],
      // 8. "b"
      [
        { x: cx + 15 * scale, y: cy - 65 * scale },
        { x: cx + 15 * scale, y: cy + 30 * scale },
        { x: cx + 38 * scale, y: cy + 5 * scale },
        { x: cx + 38 * scale, y: cy + 30 * scale },
        { x: cx + 15 * scale, y: cy + 30 * scale },
      ],
      // 9. "o"
      [
        { x: cx + 55 * scale, y: cy + 10 * scale },
        { x: cx + 75 * scale, y: cy - 10 * scale },
        { x: cx + 90 * scale, y: cy + 10 * scale },
        { x: cx + 75 * scale, y: cy + 30 * scale },
        { x: cx + 55 * scale, y: cy + 10 * scale },
      ],
      // 10. "a"
      [
        { x: cx + 105 * scale, y: cy + 10 * scale },
        { x: cx + 125 * scale, y: cy - 10 * scale },
        { x: cx + 135 * scale, y: cy + 30 * scale },
        { x: cx + 105 * scale, y: cy + 30 * scale },
        { x: cx + 105 * scale, y: cy + 10 * scale },
        { x: cx + 135 * scale, y: cy + 30 * scale },
      ],
      // 11. "r"
      [
        { x: cx + 150 * scale, y: cy + 30 * scale },
        { x: cx + 150 * scale, y: cy - 10 * scale },
        { x: cx + 160 * scale, y: cy - 10 * scale },
        { x: cx + 170 * scale, y: cy + 5 * scale },
      ],
      // 12. "d"
      [
        { x: cx + 210 * scale, y: cy - 65 * scale },
        { x: cx + 210 * scale, y: cy + 30 * scale },
        { x: cx + 185 * scale, y: cy + 30 * scale },
        { x: cx + 185 * scale, y: cy - 10 * scale },
        { x: cx + 210 * scale, y: cy - 10 * scale },
      ],
      // 13. Dynamic underline swoosh
      [
        { x: cx - 305 * scale, y: cy + 58 * scale },
        { x: cx - 60 * scale, y: cy + 65 * scale },
        { x: cx + 140 * scale, y: cy + 60 * scale },
        { x: cx + 235 * scale, y: cy + 48 * scale },
      ],
    ];

    // Smooth dense interpolation for 60fps drawing
    const strokePoints: Array<{ x: number; y: number; isNewSegment: boolean }> = [];
    strokes.forEach((stroke) => {
      for (let i = 0; i < stroke.length - 1; i++) {
        const p0 = stroke[i];
        const p1 = stroke[i + 1];
        const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        const steps = Math.max(5, Math.floor(dist / 2));

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          strokePoints.push({
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t,
            isNewSegment: i === 0 && s === 0,
          });
        }
      }
    });

    // Particle emitter
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
    }
    const particles: Particle[] = [];
    const colors = ['#6366F1', '#818CF8', '#A855F7', '#38BDF8', '#FFFFFF'];
    const dustColors = ['#E2E8F0', '#CBD5E1', '#94A3B8', '#F8FAFC', '#818CF8'];

    let currentIndex = 0;
    const totalPoints = strokePoints.length;
    let drawnPoints: Array<{ x: number; y: number; isNewSegment: boolean }> = [];

    // Timeline Configuration
    const WRITE_DURATION = 1500; // 1.5s pen writing
    const PAUSE_DURATION = 300;  // 0.3s pause
    const ERASE_DURATION = 1400; // 1.4s duster erasing
    const TOTAL_DURATION = WRITE_DURATION + PAUSE_DURATION + ERASE_DURATION;

    let startTime: number | null = null;
    let hasSwitchedToErasing = false;

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      // Clear Canvas Frame
      ctx.clearRect(0, 0, width, height);

      // Subtle Whiteboard Dot Grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      const dotSpacing = 32;
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =======================================================================
      // STAGE 1: PEN WRITING "AI WHITEBOARD"
      // =======================================================================
      if (elapsed <= WRITE_DURATION) {
        const progress = Math.min(1, elapsed / WRITE_DURATION);
        const targetIndex = Math.floor(progress * totalPoints);

        while (currentIndex < targetIndex && currentIndex < totalPoints) {
          const pt = strokePoints[currentIndex];
          drawnPoints.push(pt);

          // Ink spark particles
          if (Math.random() < 0.45) {
            particles.push({
              x: pt.x,
              y: pt.y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2 - 0.5,
              size: Math.random() * 2.5 + 1.2,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: 1,
              life: Math.random() * 20 + 10,
            });
          }

          currentIndex++;
        }

        // Track Pen Stylus
        if (currentIndex > 0 && currentIndex < totalPoints) {
          const currentPt = strokePoints[currentIndex - 1];
          const nextPt = strokePoints[Math.min(currentIndex + 3, totalPoints - 1)];
          const angle = (Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x) * 180) / Math.PI;

          setBrushPos({
            x: currentPt.x,
            y: currentPt.y,
            visible: true,
            angle: angle - 40,
          });

          // Glowing Ink Flare at brush tip
          ctx.save();
          const flare = ctx.createRadialGradient(currentPt.x, currentPt.y, 0, currentPt.x, currentPt.y, 22 * scale);
          flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          flare.addColorStop(0.3, 'rgba(129, 140, 248, 0.7)');
          flare.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flare;
          ctx.beginPath();
          ctx.arc(currentPt.x, currentPt.y, 22 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } 
      // =======================================================================
      // STAGE 2: PAUSE BEFORE DUSTER
      // =======================================================================
      else if (elapsed <= WRITE_DURATION + PAUSE_DURATION) {
        setBrushPos((prev) => ({ ...prev, visible: false }));
        if (!hasSwitchedToErasing) {
          hasSwitchedToErasing = true;
          setPhaseText('Erasing AI Whiteboard with Duster...');
        }
      } 
      // =======================================================================
      // STAGE 3: DUSTER ERASING "AI WHITEBOARD"
      // =======================================================================
      else {
        setBrushPos((prev) => ({ ...prev, visible: false }));
        const eraseElapsed = elapsed - (WRITE_DURATION + PAUSE_DURATION);
        const eraseProgress = Math.min(1, eraseElapsed / ERASE_DURATION);

        // Sweeping motion: from left of "AI Whiteboard" to far right
        const dusterStartX = cx - 350 * scale;
        const dusterEndX = cx + 360 * scale;
        const dusterX = dusterStartX + (dusterEndX - dusterStartX) * eraseProgress;
        
        // Natural gentle wave up and down
        const dusterY = cy + Math.sin(eraseProgress * Math.PI * 4) * 22 * scale;
        const dusterAngle = Math.sin(eraseProgress * Math.PI * 4) * 12;

        setDusterPos({
          x: dusterX,
          y: dusterY,
          visible: eraseProgress < 1,
          angle: dusterAngle,
        });

        // Filter out erased points that the duster has passed over
        drawnPoints = drawnPoints.filter((pt) => pt.x > dusterX + 25 * scale);

        // Emit Chalk Dust Puffs in the wake of the duster
        if (eraseProgress < 0.95 && Math.random() < 0.8) {
          for (let p = 0; p < 3; p++) {
            particles.push({
              x: dusterX + (Math.random() - 0.5) * 40 * scale,
              y: dusterY + (Math.random() - 0.5) * 60 * scale,
              vx: (Math.random() - 0.5) * 3 - 1.5,
              vy: (Math.random() - 0.5) * 2.5 - 0.8,
              size: Math.random() * 3 + 1.5,
              color: dustColors[Math.floor(Math.random() * dustColors.length)],
              alpha: 0.9,
              life: Math.random() * 25 + 15,
            });
          }
        }
      }

      // =======================================================================
      // DRAW REMAINING GLOWING STROKES
      // =======================================================================
      if (drawnPoints.length > 1) {
        // Outer Neon Halo
        ctx.save();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 14 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#818CF8';
        ctx.shadowBlur = 24;
        ctx.globalAlpha = 0.28;

        ctx.beginPath();
        for (let i = 0; i < drawnPoints.length; i++) {
          const pt = drawnPoints[i];
          if (pt.isNewSegment || i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.restore();

        // Main Gradient Stroke
        ctx.save();
        const strokeGrad = ctx.createLinearGradient(cx - 300 * scale, cy, cx + 240 * scale, cy);
        strokeGrad.addColorStop(0, '#38BDF8'); // Cyan
        strokeGrad.addColorStop(0.3, '#818CF8'); // Indigo
        strokeGrad.addColorStop(0.7, '#A855F7'); // Purple
        strokeGrad.addColorStop(1, '#EC4899'); // Pink

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 6 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#6366F1';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let i = 0; i < drawnPoints.length; i++) {
          const pt = drawnPoints[i];
          if (pt.isNewSegment || i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.restore();

        // Core White Light Thread
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.9;

        ctx.beginPath();
        for (let i = 0; i < drawnPoints.length; i++) {
          const pt = drawnPoints[i];
          if (pt.isNewSegment || i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      // =======================================================================
      // DRAW PARTICLES (INK SPARKLES & CHALK DUST)
      // =======================================================================
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Continue animation loop
      if (elapsed < TOTAL_DURATION) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        setDusterPos((prev) => ({ ...prev, visible: false }));
        setTimeout(() => {
          finishIntro();
        }, 150);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] overflow-hidden transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Writing & Erasing Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 1. Realistic Painting Brush Stylus */}
      {brushPos.visible && (
        <div
          className="pointer-events-none absolute z-30 transition-transform duration-75"
          style={{
            left: `${brushPos.x}px`,
            top: `${brushPos.y}px`,
            transform: `translate(-12%, -88%) rotate(${brushPos.angle}deg)`,
          }}
        >
          <div className="relative">
            {/* Glowing ink drop */}
            <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-indigo-400 blur-[3px] animate-ping opacity-80" />

            {/* Brush Stylus */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_15px_25px_rgba(99,102,241,0.6)]"
            >
              <path d="M6 58L14 50L18 54L10 62L6 58Z" fill="#F8FAFC" />
              <path d="M6 58L2 62L6 62L10 62L6 58Z" fill="#6366F1" />
              <path d="M14 50L30 34L34 38L18 54L14 50Z" fill="url(#metal_grad)" />
              <path d="M30 34L54 10L58 14L34 38L30 34Z" fill="url(#body_grad)" />
              <circle cx="56" cy="12" r="3" fill="#818CF8" />

              <defs>
                <linearGradient id="metal_grad" x1="14" y1="50" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#CBD5E1" />
                  <stop offset="0.5" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="body_grad" x1="30" y1="34" x2="58" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#312E81" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 2. Realistic Chalkboard Duster / Eraser */}
      {dusterPos.visible && (
        <div
          className="pointer-events-none absolute z-30 transition-transform duration-75"
          style={{
            left: `${dusterPos.x}px`,
            top: `${dusterPos.y}px`,
            transform: `translate(-50%, -50%) rotate(${dusterPos.angle}deg)`,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Dust cloud behind eraser */}
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse" />

            {/* Duster Body (Wooden Block with Felt Base) */}
            <div className="relative w-28 h-16 rounded-2xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-2 border-amber-600 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-1.5">
              {/* Wooden grain highlights */}
              <div className="w-full h-2 rounded-full bg-amber-600/40" />
              
              {/* Ergonomic handle ridge */}
              <div className="self-center px-4 py-1 rounded-lg bg-amber-900/90 border border-amber-700/60 shadow-inner flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[9px] font-bold text-amber-200 uppercase tracking-widest font-mono">
                  DUSTER
                </span>
              </div>

              {/* Bottom Felt Eraser Pad with Chalk Dust Marks */}
              <div className="w-full h-4 rounded-xl bg-slate-900 border-t border-slate-700 flex items-center justify-around px-2">
                <div className="w-2 h-1 rounded-full bg-slate-400/30" />
                <div className="w-3 h-1 rounded-full bg-slate-400/40" />
                <div className="w-2 h-1 rounded-full bg-slate-400/30" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dynamic Tagline */}
      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-semibold text-indigo-300 shadow-2xl">
          {dusterPos.visible ? (
            <Eraser className="w-4 h-4 text-amber-400 animate-bounce" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          )}
          <span>{phaseText}</span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={finishIntro}
        className="absolute top-6 right-6 z-40 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800/80 backdrop-blur-md transition-all cursor-pointer hover:border-indigo-500/50 shadow-lg active:scale-95"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
