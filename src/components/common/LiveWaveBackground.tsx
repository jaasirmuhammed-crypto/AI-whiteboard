import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const LiveWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use low-latency 2D context for ultra-smooth 120 FPS wave rendering
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let lastTime = performance.now();

    // Mouse Tracking for Cursor-Reactive Wave Bending
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Floating Energy Particles anchored to viewport
    const particleCount = prefersReducedMotion ? 10 : window.innerWidth < 768 ? 16 : 28;
    const particles: Particle[] = [];

    const isDark = theme === 'dark';
    const particleColors = isDark
      ? ['rgba(99, 102, 241, 0.65)', 'rgba(168, 85, 247, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(236, 72, 153, 0.5)']
      : ['rgba(99, 102, 241, 0.4)', 'rgba(14, 165, 233, 0.4)', 'rgba(168, 85, 247, 0.35)', 'rgba(244, 114, 182, 0.3)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.25,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    let step = 0;

    const render = (currentTime: number) => {
      const delta = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;
      const timeFactor = delta / 16.667; // Normalize to 60fps base

      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * (0.08 * timeFactor);
      mouse.y += (mouse.targetY - mouse.y) * (0.08 * timeFactor);

      step += (prefersReducedMotion ? 0.002 : 0.005) * timeFactor;
      const currentDark = theme === 'dark';

      // 1. Soft Ambient Atmospheric Gradient Beacons (Fixed in viewport)
      const ambientSpots = currentDark
        ? [
            { x: width * 0.25 + Math.sin(step * 0.7) * 45, y: height * 0.3 + Math.cos(step * 0.7) * 30, r: width * 0.35, c: 'rgba(99, 102, 241, 0.12)' },
            { x: width * 0.75 + Math.cos(step * 0.6) * 50, y: height * 0.65 + Math.sin(step * 0.6) * 35, r: width * 0.4, c: 'rgba(168, 85, 247, 0.10)' },
          ]
        : [
            { x: width * 0.25 + Math.sin(step * 0.7) * 45, y: height * 0.3 + Math.cos(step * 0.7) * 30, r: width * 0.35, c: 'rgba(99, 102, 241, 0.08)' },
            { x: width * 0.75 + Math.cos(step * 0.6) * 50, y: height * 0.65 + Math.sin(step * 0.6) * 35, r: width * 0.4, c: 'rgba(14, 165, 233, 0.07)' },
          ];

      ambientSpots.forEach((spot) => {
        const spotGrad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
        spotGrad.addColorStop(0, spot.c);
        spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Fixed Wave Layers Anchored to the Viewport (No scroll movement)
      const waves = currentDark
        ? [
            // Upper Sleek Ribbon
            {
              amplitude: height * 0.032,
              frequency: 0.0024,
              speed: 0.85,
              yOffset: height * 0.32,
              strokeColor: 'rgba(99, 102, 241, 0.55)',
              gradient: ['rgba(99, 102, 241, 0.16)', 'rgba(99, 102, 241, 0.01)'],
            },
            // Middle Compact Wave
            {
              amplitude: height * 0.038,
              frequency: 0.0028,
              speed: -0.70,
              yOffset: height * 0.58,
              strokeColor: 'rgba(168, 85, 247, 0.50)',
              gradient: ['rgba(168, 85, 247, 0.14)', 'rgba(168, 85, 247, 0.01)'],
            },
            // Lower Streamlined Wave
            {
              amplitude: height * 0.042,
              frequency: 0.0022,
              speed: 1.05,
              yOffset: height * 0.82,
              strokeColor: 'rgba(6, 182, 212, 0.50)',
              gradient: ['rgba(6, 182, 212, 0.15)', 'rgba(6, 182, 212, 0.01)'],
            },
          ]
        : [
            // Light Mode Upper Sleek Ribbon
            {
              amplitude: height * 0.032,
              frequency: 0.0024,
              speed: 0.85,
              yOffset: height * 0.35,
              strokeColor: 'rgba(99, 102, 241, 0.38)',
              gradient: ['rgba(99, 102, 241, 0.11)', 'rgba(99, 102, 241, 0.01)'],
            },
            // Light Mode Middle Compact Wave
            {
              amplitude: height * 0.038,
              frequency: 0.0028,
              speed: -0.70,
              yOffset: height * 0.60,
              strokeColor: 'rgba(14, 165, 233, 0.35)',
              gradient: ['rgba(14, 165, 233, 0.10)', 'rgba(14, 165, 233, 0.01)'],
            },
            // Light Mode Lower Streamlined Wave
            {
              amplitude: height * 0.042,
              frequency: 0.0022,
              speed: 1.05,
              yOffset: height * 0.84,
              strokeColor: 'rgba(168, 85, 247, 0.32)',
              gradient: ['rgba(168, 85, 247, 0.10)', 'rgba(168, 85, 247, 0.01)'],
            },
          ];

      // Draw Cursor Radial Glow Aura when active
      if (mouse.active && !prefersReducedMotion) {
        const glowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
        if (currentDark) {
          glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
          glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
          glowGradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.04)');
          glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Fixed Wave Ribbons (Anchored to the screen viewport)
      const sampleStep = width < 768 ? 14 : 7;
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += sampleStep) {
          let y =
            Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.7 + step * 0.7) * (wave.amplitude * 0.35) +
            wave.yOffset;

          // Cursor Bending Effect
          if (mouse.active && !prefersReducedMotion) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const pullFactor = (1 - dist / 180) * 12;
              y += (mouse.y > y ? pullFactor : -pullFactor);
            }
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude, 0, height);
        grad.addColorStop(0, wave.gradient[0]);
        grad.addColorStop(1, wave.gradient[1]);

        ctx.fillStyle = grad;
        ctx.fill();

        // Sleek Glowing Crest Outline
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update & Draw Floating Particles anchored to viewport
      particles.forEach((p) => {
        p.x += p.vx * timeFactor;
        p.y += p.vy * timeFactor;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mouse.active && !prefersReducedMotion) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 5) {
            p.x += (dx / dist) * (0.3 * timeFactor);
            p.y += (dy / dist) * (0.3 * timeFactor);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      style={{
        opacity: 0.95,
      }}
      aria-hidden="true"
    />
  );
};
