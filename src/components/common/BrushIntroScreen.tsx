import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BrushIntroScreenProps {
  onComplete: () => void;
}

export const BrushIntroScreen: React.FC<BrushIntroScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0, visible: false, angle: -25 });
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
    const scale = Math.min(1.1, Math.max(0.6, width / 700));

    // Define cursive stroke coordinates for writing "Whiteboard"
    // Each segment represents one continuous stroke of the brush
    const strokes: Array<Array<{ x: number; y: number }>> = [
      // 1. "W"
      [
        { x: cx - 210 * scale, y: cy - 45 * scale },
        { x: cx - 190 * scale, y: cy + 30 * scale },
        { x: cx - 170 * scale, y: cy - 20 * scale },
        { x: cx - 150 * scale, y: cy + 30 * scale },
        { x: cx - 130 * scale, y: cy - 35 * scale },
      ],
      // 2. "h"
      [
        { x: cx - 120 * scale, y: cy - 65 * scale },
        { x: cx - 120 * scale, y: cy + 30 * scale },
        { x: cx - 115 * scale, y: cy - 5 * scale },
        { x: cx - 95 * scale, y: cy - 5 * scale },
        { x: cx - 95 * scale, y: cy + 30 * scale },
      ],
      // 3. "i"
      [
        { x: cx - 80 * scale, y: cy - 10 * scale },
        { x: cx - 80 * scale, y: cy + 30 * scale },
      ],
      // "i" dot
      [
        { x: cx - 80 * scale, y: cy - 25 * scale },
        { x: cx - 80 * scale, y: cy - 23 * scale },
      ],
      // 4. "t"
      [
        { x: cx - 60 * scale, y: cy - 50 * scale },
        { x: cx - 60 * scale, y: cy + 30 * scale },
      ],
      // "t" crossbar
      [
        { x: cx - 72 * scale, y: cy - 20 * scale },
        { x: cx - 48 * scale, y: cy - 20 * scale },
      ],
      // 5. "e"
      [
        { x: cx - 40 * scale, y: cy + 8 * scale },
        { x: cx - 18 * scale, y: cy + 8 * scale },
        { x: cx - 18 * scale, y: cy - 10 * scale },
        { x: cx - 40 * scale, y: cy - 10 * scale },
        { x: cx - 40 * scale, y: cy + 30 * scale },
        { x: cx - 20 * scale, y: cy + 30 * scale },
      ],
      // 6. "b"
      [
        { x: cx - 5 * scale, y: cy - 65 * scale },
        { x: cx - 5 * scale, y: cy + 30 * scale },
        { x: cx + 18 * scale, y: cy + 5 * scale },
        { x: cx + 18 * scale, y: cy + 30 * scale },
        { x: cx - 5 * scale, y: cy + 30 * scale },
      ],
      // 7. "o"
      [
        { x: cx + 35 * scale, y: cy + 10 * scale },
        { x: cx + 55 * scale, y: cy - 10 * scale },
        { x: cx + 70 * scale, y: cy + 10 * scale },
        { x: cx + 55 * scale, y: cy + 30 * scale },
        { x: cx + 35 * scale, y: cy + 10 * scale },
      ],
      // 8. "a"
      [
        { x: cx + 85 * scale, y: cy + 10 * scale },
        { x: cx + 105 * scale, y: cy - 10 * scale },
        { x: cx + 115 * scale, y: cy + 30 * scale },
        { x: cx + 85 * scale, y: cy + 30 * scale },
        { x: cx + 85 * scale, y: cy + 10 * scale },
        { x: cx + 115 * scale, y: cy + 30 * scale },
      ],
      // 9. "r"
      [
        { x: cx + 130 * scale, y: cy + 30 * scale },
        { x: cx + 130 * scale, y: cy - 10 * scale },
        { x: cx + 140 * scale, y: cy - 10 * scale },
        { x: cx + 150 * scale, y: cy + 5 * scale },
      ],
      // 10. "d"
      [
        { x: cx + 190 * scale, y: cy - 65 * scale },
        { x: cx + 190 * scale, y: cy + 30 * scale },
        { x: cx + 165 * scale, y: cy + 30 * scale },
        { x: cx + 165 * scale, y: cy - 10 * scale },
        { x: cx + 190 * scale, y: cy - 10 * scale },
      ],
      // 11. Dynamic underline swoosh
      [
        { x: cx - 225 * scale, y: cy + 58 * scale },
        { x: cx - 60 * scale, y: cy + 65 * scale },
        { x: cx + 120 * scale, y: cy + 60 * scale },
        { x: cx + 215 * scale, y: cy + 48 * scale },
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

    // Ink particle emitter
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

    let currentIndex = 0;
    const totalPoints = strokePoints.length;
    const drawnPoints: Array<{ x: number; y: number; isNewSegment: boolean }> = [];

    const DURATION = 1600; // 1.6s swift writing
    let startTime: number | null = null;

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      const targetIndex = Math.floor(progress * totalPoints);

      while (currentIndex < targetIndex && currentIndex < totalPoints) {
        const pt = strokePoints[currentIndex];
        drawnPoints.push(pt);

        // Emit ink dust particles
        if (Math.random() < 0.5) {
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

      // Clear Canvas
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

      // Draw Glowing Brush Strokes
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
        const strokeGrad = ctx.createLinearGradient(cx - 220 * scale, cy, cx + 220 * scale, cy);
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

      // Draw & Update Particles
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

      // Brush Position Tracking
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
      } else if (progress >= 1) {
        setBrushPos((prev) => ({ ...prev, visible: false }));
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Short pause once word is written, then smooth transition
        setTimeout(() => {
          finishIntro();
        }, 400);
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

      {/* Writing Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Realistic Painting Brush */}
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

            {/* Brush Icon */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_15px_25px_rgba(99,102,241,0.6)]"
            >
              {/* Nib Tip */}
              <path d="M6 58L14 50L18 54L10 62L6 58Z" fill="#F8FAFC" />
              <path d="M6 58L2 62L6 62L10 62L6 58Z" fill="#6366F1" />
              {/* Metallic Grip */}
              <path d="M14 50L30 34L34 38L18 54L14 50Z" fill="url(#metal_grad)" />
              {/* Stylus Body */}
              <path d="M30 34L54 10L58 14L34 38L30 34Z" fill="url(#body_grad)" />
              {/* Top Cap */}
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

      {/* Floating Tagline */}
      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold text-indigo-300 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Writing Whiteboard...</span>
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
