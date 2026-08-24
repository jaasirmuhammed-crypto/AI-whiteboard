import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BrushIntroScreenProps {
  onComplete: () => void;
}

export const BrushIntroScreen: React.FC<BrushIntroScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stageText, setStageText] = useState('Writing whiteboard...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0, visible: false, angle: -30 });
  const animFrameRef = useRef<number | null>(null);

  const finishIntro = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 650);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Dynamic stroke coordinates for "AI Whiteboard" and aesthetic curves
    const cx = width / 2;
    const cy = height / 2 - 20;

    // Normalized strokes scaled to screen width
    const scale = Math.min(1, width / 750);

    // Lettering & drawing path points:
    // 1. "AI" Badge / Sparkle
    // 2. "W - h - i - t - e - b - o - a - r - d" cursive wave
    // 3. Underline flourish & dots
    const pathSegments: Array<Array<{ x: number; y: number }>> = [
      // "AI" Symbol / Sparkle burst
      [
        { x: cx - 240 * scale, y: cy - 40 * scale },
        { x: cx - 210 * scale, y: cy - 90 * scale },
        { x: cx - 180 * scale, y: cy - 40 * scale },
      ],
      [
        { x: cx - 225 * scale, y: cy - 65 * scale },
        { x: cx - 195 * scale, y: cy - 65 * scale },
      ],
      [
        { x: cx - 165 * scale, y: cy - 90 * scale },
        { x: cx - 165 * scale, y: cy - 40 * scale },
      ],
      // Main "W"
      [
        { x: cx - 130 * scale, y: cy - 50 * scale },
        { x: cx - 115 * scale, y: cy + 10 * scale },
        { x: cx - 100 * scale, y: cy - 25 * scale },
        { x: cx - 85 * scale, y: cy + 10 * scale },
        { x: cx - 70 * scale, y: cy - 35 * scale },
      ],
      // "h"
      [
        { x: cx - 65 * scale, y: cy - 65 * scale },
        { x: cx - 65 * scale, y: cy + 10 * scale },
        { x: cx - 60 * scale, y: cy - 15 * scale },
        { x: cx - 45 * scale, y: cy - 15 * scale },
        { x: cx - 45 * scale, y: cy + 10 * scale },
      ],
      // "i"
      [
        { x: cx - 35 * scale, y: cy - 20 * scale },
        { x: cx - 35 * scale, y: cy + 10 * scale },
      ],
      // "t"
      [
        { x: cx - 20 * scale, y: cy - 50 * scale },
        { x: cx - 20 * scale, y: cy + 10 * scale },
      ],
      [
        { x: cx - 28 * scale, y: cy - 25 * scale },
        { x: cx - 12 * scale, y: cy - 25 * scale },
      ],
      // "e"
      [
        { x: cx - 5 * scale, y: cy - 5 * scale },
        { x: cx + 12 * scale, y: cy - 5 * scale },
        { x: cx + 12 * scale, y: cy - 20 * scale },
        { x: cx - 5 * scale, y: cy - 20 * scale },
        { x: cx - 5 * scale, y: cy + 10 * scale },
        { x: cx + 15 * scale, y: cy + 10 * scale },
      ],
      // "b"
      [
        { x: cx + 30 * scale, y: cy - 65 * scale },
        { x: cx + 30 * scale, y: cy + 10 * scale },
        { x: cx + 45 * scale, y: cy - 10 * scale },
        { x: cx + 45 * scale, y: cy + 10 * scale },
        { x: cx + 30 * scale, y: cy + 10 * scale },
      ],
      // "o"
      [
        { x: cx + 60 * scale, y: cy - 5 * scale },
        { x: cx + 78 * scale, y: cy - 20 * scale },
        { x: cx + 90 * scale, y: cy - 5 * scale },
        { x: cx + 78 * scale, y: cy + 10 * scale },
        { x: cx + 60 * scale, y: cy - 5 * scale },
      ],
      // "a"
      [
        { x: cx + 105 * scale, y: cy - 5 * scale },
        { x: cx + 120 * scale, y: cy - 20 * scale },
        { x: cx + 125 * scale, y: cy + 10 * scale },
        { x: cx + 105 * scale, y: cy + 10 * scale },
        { x: cx + 105 * scale, y: cy - 5 * scale },
        { x: cx + 125 * scale, y: cy + 10 * scale },
      ],
      // "r"
      [
        { x: cx + 140 * scale, y: cy + 10 * scale },
        { x: cx + 140 * scale, y: cy - 20 * scale },
        { x: cx + 148 * scale, y: cy - 20 * scale },
        { x: cx + 158 * scale, y: cy - 10 * scale },
      ],
      // "d"
      [
        { x: cx + 190 * scale, y: cy - 65 * scale },
        { x: cx + 190 * scale, y: cy + 10 * scale },
        { x: cx + 172 * scale, y: cy + 10 * scale },
        { x: cx + 172 * scale, y: cy - 20 * scale },
        { x: cx + 190 * scale, y: cy - 20 * scale },
      ],
      // Underline glow swoosh
      [
        { x: cx - 250 * scale, y: cy + 38 * scale },
        { x: cx - 100 * scale, y: cy + 48 * scale },
        { x: cx + 80 * scale, y: cy + 42 * scale },
        { x: cx + 220 * scale, y: cy + 34 * scale },
        { x: cx + 245 * scale, y: cy + 24 * scale },
      ],
    ];

    // Build dense points for smooth stroke drawing
    const allPoints: Array<{ x: number; y: number; isNewSegment: boolean }> = [];
    pathSegments.forEach((segment) => {
      for (let i = 0; i < segment.length - 1; i++) {
        const p0 = segment[i];
        const p1 = segment[i + 1];
        const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        const steps = Math.max(8, Math.floor(dist / 3));

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          allPoints.push({
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t,
            isNewSegment: i === 0 && s === 0,
          });
        }
      }
    });

    // Particle System
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
    const colors = ['#6366F1', '#818CF8', '#A855F7', '#38BDF8', '#EC4899', '#FFFFFF'];

    let currentIndex = 0;
    const totalPoints = allPoints.length;
    const drawnPoints: Array<{ x: number; y: number; isNewSegment: boolean }> = [];

    // Stage texts
    const textStages = [
      { progress: 0.15, text: '🎨 Dipping ink and tracing strokes...' },
      { progress: 0.50, text: '✨ Drawing interactive whiteboard...' },
      { progress: 0.85, text: '⚡ Initializing AI Neural Canvas...' },
      { progress: 1.0, text: '🚀 Welcome to AI Whiteboard!' }
    ];

    let startTime: number | null = null;
    const DURATION = 2200; // 2.2 seconds total drawing time

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      // Update target point index
      const targetIndex = Math.floor(progress * totalPoints);

      while (currentIndex < targetIndex && currentIndex < totalPoints) {
        const pt = allPoints[currentIndex];
        drawnPoints.push(pt);

        // Spawn particles at brush tip
        if (Math.random() < 0.6) {
          particles.push({
            x: pt.x,
            y: pt.y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 0.5,
            size: Math.random() * 3.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            life: Math.random() * 25 + 15,
          });
        }

        currentIndex++;
      }

      // Update stage text based on progress
      const currentStage = textStages.find((s) => progress <= s.progress) || textStages[textStages.length - 1];
      setStageText(currentStage.text);

      // Clear with sleek dark gradient
      ctx.clearRect(0, 0, width, height);

      // Background Subtle Dot Grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const dotSpacing = 28;
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Glowing Ink Trace
      if (drawnPoints.length > 1) {
        // Outer Glow Layer
        ctx.save();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 14 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#818CF8';
        ctx.shadowBlur = 24;
        ctx.globalAlpha = 0.25;

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

        // Main Stroke Layer (Gradient Indigo -> Violet)
        ctx.save();
        const strokeGrad = ctx.createLinearGradient(cx - 250, cy, cx + 250, cy);
        strokeGrad.addColorStop(0, '#60A5FA'); // Sky Blue
        strokeGrad.addColorStop(0.3, '#818CF8'); // Indigo
        strokeGrad.addColorStop(0.7, '#C084FC'); // Purple
        strokeGrad.addColorStop(1, '#F472B6'); // Pink

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 6.5 * scale;
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

        // Core White Light Ribbon
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.85;

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
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update Live Brush Tip Position
      if (currentIndex > 0 && currentIndex < totalPoints) {
        const currentPt = allPoints[currentIndex - 1];
        const nextPt = allPoints[Math.min(currentIndex + 3, totalPoints - 1)];
        const angle = (Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x) * 180) / Math.PI;

        setBrushPos({
          x: currentPt.x,
          y: currentPt.y,
          visible: true,
          angle: angle - 45,
        });

        // Brush tip laser glow
        ctx.save();
        const tipGlow = ctx.createRadialGradient(currentPt.x, currentPt.y, 0, currentPt.x, currentPt.y, 25 * scale);
        tipGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        tipGlow.addColorStop(0.3, 'rgba(129, 140, 248, 0.7)');
        tipGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(currentPt.x, currentPt.y, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (progress >= 1) {
        setBrushPos((prev) => ({ ...prev, visible: false }));
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Finished writing, brief pause to showcase artwork then transition
        setTimeout(() => {
          finishIntro();
        }, 500);
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
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Interactive Writing Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Realistic Floating Stylus / Brush */}
      {brushPos.visible && (
        <div
          className="pointer-events-none absolute z-30 transition-transform duration-75"
          style={{
            left: `${brushPos.x}px`,
            top: `${brushPos.y}px`,
            transform: `translate(-15%, -85%) rotate(${brushPos.angle}deg)`,
          }}
        >
          <div className="relative">
            {/* Ink drop glow */}
            <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-indigo-400 blur-[3px] animate-ping opacity-75" />

            {/* Stylus / Brush Body */}
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
              {/* Premium Stylus Body */}
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

      {/* Floating Status & Tagline */}
      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold text-indigo-300 shadow-xl animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{stageText}</span>
        </div>

        <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase">
          Draw • Think • Learn with AI
        </p>
      </div>

      {/* Top Right Quick Skip Button */}
      <button
        onClick={finishIntro}
        className="absolute top-6 right-6 z-40 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800/80 backdrop-blur-md transition-all cursor-pointer hover:border-indigo-500/50 shadow-lg active:scale-95"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
