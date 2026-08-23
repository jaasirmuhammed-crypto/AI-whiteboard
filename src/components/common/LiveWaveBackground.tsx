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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Tracking for Cursor-Reactive Bending & Glowing Radial Particle Trail
    let mouse = {
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

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Interactive Floating Energy Particles
    const particleCount = prefersReducedMotion ? 8 : window.innerWidth < 768 ? 16 : 30;
    const particles: Particle[] = [];

    const particleColors = theme === 'dark'
      ? ['rgba(99, 102, 241, 0.4)', 'rgba(168, 85, 247, 0.35)', 'rgba(6, 182, 212, 0.35)']
      : ['rgba(99, 102, 241, 0.25)', 'rgba(14, 165, 233, 0.25)', 'rgba(168, 85, 247, 0.2)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      step += prefersReducedMotion ? 0.002 : 0.007;
      const isDark = theme === 'dark';

      // 4 Layers of Flowing Energy Waves with Cursor Bending Displacement
      const waves = isDark
        ? [
            {
              amplitude: height * 0.07,
              frequency: 0.0018,
              speed: 1.0,
              yOffset: height * 0.78,
              color: 'rgba(99, 102, 241, 0.14)',
            },
            {
              amplitude: height * 0.09,
              frequency: 0.0014,
              speed: -0.7,
              yOffset: height * 0.83,
              color: 'rgba(168, 85, 247, 0.11)',
            },
            {
              amplitude: height * 0.06,
              frequency: 0.0022,
              speed: 1.2,
              yOffset: height * 0.88,
              color: 'rgba(6, 182, 212, 0.09)',
            },
            {
              amplitude: height * 0.04,
              frequency: 0.003,
              speed: -1.4,
              yOffset: height * 0.93,
              color: 'rgba(236, 72, 153, 0.06)',
            },
          ]
        : [
            {
              amplitude: height * 0.07,
              frequency: 0.0018,
              speed: 1.0,
              yOffset: height * 0.82,
              color: 'rgba(99, 102, 241, 0.08)',
            },
            {
              amplitude: height * 0.08,
              frequency: 0.0014,
              speed: -0.8,
              yOffset: height * 0.86,
              color: 'rgba(14, 165, 233, 0.07)',
            },
            {
              amplitude: height * 0.05,
              frequency: 0.0026,
              speed: 1.1,
              yOffset: height * 0.90,
              color: 'rgba(168, 85, 247, 0.06)',
            },
            {
              amplitude: height * 0.04,
              frequency: 0.0032,
              speed: -1.2,
              yOffset: height * 0.94,
              color: 'rgba(244, 114, 182, 0.05)',
            },
          ];

      // Draw Cursor Radial Glow Aura when active
      if (mouse.active && !prefersReducedMotion) {
        const glowGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          250
        );
        if (isDark) {
          glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
          glowGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
          glowGradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.02)');
          glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        const sampleStep = width < 768 ? 16 : 8;

        for (let x = 0; x <= width; x += sampleStep) {
          // Calculate standard wave height
          let y =
            Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.5 + step * 0.5) * (wave.amplitude * 0.45) +
            wave.yOffset;

          // Cursor Bending Effect: Wave subtley bends toward cursor if mouse is within 220px
          if (mouse.active && !prefersReducedMotion) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const pullFactor = (1 - dist / 220) * 18;
              y += (mouse.y > y ? pullFactor : -pullFactor);
            }
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Update & Draw Interactive Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle attraction to mouse cursor
        if (mouse.active && !prefersReducedMotion) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 5) {
            p.x += (dx / dist) * 0.4;
            p.y += (dy / dist) * 0.4;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
