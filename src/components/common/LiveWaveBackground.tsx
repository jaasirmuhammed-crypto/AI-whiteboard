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

interface CursorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
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

    // Mouse Tracking for Increased Cursor-Reactive Wave Bending & Glow
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      prevX: width / 2,
      prevY: height / 2,
      speed: 0,
      active: false,
    };

    const sparks: CursorSpark[] = [];
    const shockwaves: Shockwave[] = [];

    const sparkPalette = [
      'rgba(129, 140, 248, ', // Indigo
      'rgba(192, 132, 252, ', // Purple
      'rgba(56, 189, 248, ',  // Sky
      'rgba(244, 114, 182, ', // Pink
      'rgba(251, 191, 36, ',  // Amber gold
    ];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.speed = Math.min(30, Math.sqrt(dx * dx + dy * dy));
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      // Spawn glowing cursor trail stardust on movement
      if (mouse.speed > 1.5 && sparks.length < 80) {
        const count = Math.min(3, Math.ceil(mouse.speed / 6));
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.8 + 0.4;
          const maxLife = Math.random() * 25 + 20;
          sparks.push({
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
            vx: Math.cos(angle) * speed + dx * 0.05,
            vy: Math.sin(angle) * speed + dy * 0.05,
            size: Math.random() * 2.8 + 1.2,
            alpha: 0.9,
            life: maxLife,
            maxLife,
            color: sparkPalette[Math.floor(Math.random() * sparkPalette.length)],
          });
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.targetX = touch.clientX;
        mouse.targetY = touch.clientY;
        mouse.active = true;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Interactive Shockwave ripple on click
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.45,
        strength: 28,
        alpha: 0.7,
      });

      // Burst of sparkles on click
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.2;
        const speed = Math.random() * 3.5 + 1.5;
        const maxLife = Math.random() * 30 + 25;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.2 + 1.5,
          alpha: 1,
          life: maxLife,
          maxLife,
          color: sparkPalette[Math.floor(Math.random() * sparkPalette.length)],
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
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
    const particleCount = prefersReducedMotion ? 12 : window.innerWidth < 768 ? 20 : 36;
    const particles: Particle[] = [];

    const isDark = theme === 'dark';
    const particleColors = isDark
      ? ['rgba(99, 102, 241, 0.75)', 'rgba(168, 85, 247, 0.7)', 'rgba(6, 182, 212, 0.7)', 'rgba(236, 72, 153, 0.65)']
      : ['rgba(99, 102, 241, 0.55)', 'rgba(14, 165, 233, 0.5)', 'rgba(168, 85, 247, 0.45)', 'rgba(244, 114, 182, 0.4)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.35,
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

      // Fast, responsive lerp for mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * (0.12 * timeFactor);
      mouse.y += (mouse.targetY - mouse.y) * (0.12 * timeFactor);

      step += (prefersReducedMotion ? 0.002 : 0.005) * timeFactor;
      const currentDark = theme === 'dark';

      // 1. Soft Ambient Atmospheric Gradient Beacons (Fixed in viewport)
      const ambientSpots = currentDark
        ? [
            { x: width * 0.22 + Math.sin(step * 0.7) * 45, y: height * 0.28 + Math.cos(step * 0.7) * 30, r: width * 0.38, c: 'rgba(99, 102, 241, 0.14)' },
            { x: width * 0.78 + Math.cos(step * 0.6) * 50, y: height * 0.68 + Math.sin(step * 0.6) * 35, r: width * 0.42, c: 'rgba(168, 85, 247, 0.12)' },
          ]
        : [
            { x: width * 0.22 + Math.sin(step * 0.7) * 45, y: height * 0.28 + Math.cos(step * 0.7) * 30, r: width * 0.38, c: 'rgba(99, 102, 241, 0.09)' },
            { x: width * 0.78 + Math.cos(step * 0.6) * 50, y: height * 0.68 + Math.sin(step * 0.6) * 35, r: width * 0.42, c: 'rgba(14, 165, 233, 0.08)' },
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
              amplitude: height * 0.034,
              frequency: 0.0024,
              speed: 0.85,
              yOffset: height * 0.32,
              strokeColor: 'rgba(99, 102, 241, 0.65)',
              gradient: ['rgba(99, 102, 241, 0.18)', 'rgba(99, 102, 241, 0.01)'],
            },
            // Middle Compact Wave
            {
              amplitude: height * 0.040,
              frequency: 0.0028,
              speed: -0.70,
              yOffset: height * 0.58,
              strokeColor: 'rgba(168, 85, 247, 0.58)',
              gradient: ['rgba(168, 85, 247, 0.16)', 'rgba(168, 85, 247, 0.01)'],
            },
            // Lower Streamlined Wave
            {
              amplitude: height * 0.044,
              frequency: 0.0022,
              speed: 1.05,
              yOffset: height * 0.82,
              strokeColor: 'rgba(6, 182, 212, 0.58)',
              gradient: ['rgba(6, 182, 212, 0.16)', 'rgba(6, 182, 212, 0.01)'],
            },
          ]
        : [
            // Light Mode Upper Sleek Ribbon
            {
              amplitude: height * 0.034,
              frequency: 0.0024,
              speed: 0.85,
              yOffset: height * 0.35,
              strokeColor: 'rgba(99, 102, 241, 0.45)',
              gradient: ['rgba(99, 102, 241, 0.13)', 'rgba(99, 102, 241, 0.01)'],
            },
            // Light Mode Middle Compact Wave
            {
              amplitude: height * 0.040,
              frequency: 0.0028,
              speed: -0.70,
              yOffset: height * 0.60,
              strokeColor: 'rgba(14, 165, 233, 0.42)',
              gradient: ['rgba(14, 165, 233, 0.12)', 'rgba(14, 165, 233, 0.01)'],
            },
            // Light Mode Lower Streamlined Wave
            {
              amplitude: height * 0.044,
              frequency: 0.0022,
              speed: 1.05,
              yOffset: height * 0.84,
              strokeColor: 'rgba(168, 85, 247, 0.38)',
              gradient: ['rgba(168, 85, 247, 0.11)', 'rgba(168, 85, 247, 0.01)'],
            },
          ];

      // 3. ENHANCED MULTI-TIER CURSOR GLOW AURA (Increased presence & beauty)
      if (mouse.active && !prefersReducedMotion) {
        // Outer ambient glow (radius: 360px)
        const outerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 360);
        if (currentDark) {
          outerGlow.addColorStop(0, 'rgba(129, 140, 248, 0.22)');
          outerGlow.addColorStop(0.35, 'rgba(168, 85, 247, 0.12)');
          outerGlow.addColorStop(0.7, 'rgba(6, 182, 212, 0.05)');
          outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          outerGlow.addColorStop(0, 'rgba(99, 102, 241, 0.16)');
          outerGlow.addColorStop(0.4, 'rgba(14, 165, 233, 0.08)');
          outerGlow.addColorStop(0.75, 'rgba(168, 85, 247, 0.03)');
          outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 360, 0, Math.PI * 2);
        ctx.fill();

        // Inner luminous core (radius: 110px)
        const innerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 110);
        if (currentDark) {
          innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
          innerGlow.addColorStop(0.3, 'rgba(129, 140, 248, 0.30)');
          innerGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        } else {
          innerGlow.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
          innerGlow.addColorStop(0.4, 'rgba(147, 51, 234, 0.18)');
          innerGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
        }
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Update and Render Interactive Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 6 * timeFactor;
        sw.alpha = (1 - sw.radius / sw.maxRadius) * 0.7;

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = currentDark
          ? `rgba(168, 85, 247, ${sw.alpha * 0.6})`
          : `rgba(99, 102, 241, ${sw.alpha * 0.5})`;
        ctx.lineWidth = Math.max(1, 4 * (1 - sw.radius / sw.maxRadius));
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Draw Fixed Wave Ribbons (With INCREASED Cursor Bending & Displacement)
      const sampleStep = width < 768 ? 12 : 6;
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += sampleStep) {
          let y =
            Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.7 + step * 0.7) * (wave.amplitude * 0.35) +
            wave.yOffset;

          // INCREASED Cursor Bending Effect (Radius increased to 300px, pullFactor increased)
          if (mouse.active && !prefersReducedMotion) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
              const pullFactor = (1 - dist / 300) * 26;
              const angle = Math.atan2(dy, dx);
              y += Math.sin(angle) * pullFactor;
            }
          }

          // Shockwave Wave Ripple Impact
          shockwaves.forEach((sw) => {
            const dx = x - sw.x;
            const dy = y - sw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const waveDiff = Math.abs(dist - sw.radius);
            if (waveDiff < 45) {
              const rippleStrength = (1 - waveDiff / 45) * (sw.alpha * 16);
              y += Math.sin(waveDiff * 0.15) * rippleStrength;
            }
          });

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude, 0, height);
        grad.addColorStop(0, wave.gradient[0]);
        grad.addColorStop(1, wave.gradient[1]);

        ctx.fillStyle = grad;
        ctx.fill();

        // Sleek Glowing Crest Outline (Only the top wave curve line, avoiding closed box side borders)
        ctx.beginPath();
        for (let x = 0; x <= width; x += sampleStep) {
          let y =
            Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude +
            Math.cos(x * wave.frequency * 0.7 + step * 0.7) * (wave.amplitude * 0.35) +
            wave.yOffset;

          if (mouse.active && !prefersReducedMotion) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
              const pullFactor = (1 - dist / 300) * 26;
              const angle = Math.atan2(dy, dx);
              y += Math.sin(angle) * pullFactor;
            }
          }

          shockwaves.forEach((sw) => {
            const dx = x - sw.x;
            const dy = y - sw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const waveDiff = Math.abs(dist - sw.radius);
            if (waveDiff < 45) {
              const rippleStrength = (1 - waveDiff / 45) * (sw.alpha * 16);
              y += Math.sin(waveDiff * 0.15) * rippleStrength;
            }
          });

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // 6. Update & Draw Floating Energy Particles (With Magnetic Pull)
      particles.forEach((p) => {
        p.x += p.vx * timeFactor;
        p.y += p.vy * timeFactor;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Increased Magnetic Interaction Range (240px)
        if (mouse.active && !prefersReducedMotion) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 240 && dist > 5) {
            const pull = ((240 - dist) / 240) * 0.8 * timeFactor;
            p.x += (dx / dist) * pull;
            p.y += (dy / dist) * pull;

            // Render subtle luminous filament connections to cursor when close
            if (dist < 100) {
              const lineAlpha = (1 - dist / 100) * 0.35;
              ctx.strokeStyle = currentDark
                ? `rgba(168, 85, 247, ${lineAlpha})`
                : `rgba(99, 102, 241, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }

        // Particle Shockwave Repulsion
        shockwaves.forEach((sw) => {
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - sw.radius) < 30) {
            p.x += (dx / (dist || 1)) * (sw.alpha * 4);
            p.y += (dy / (dist || 1)) * (sw.alpha * 4);
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // 7. Render & Update Cursor Stardust Trail Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * timeFactor;
        s.y += s.vy * timeFactor;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life -= 1 * timeFactor;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = (s.life / s.maxLife) * s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (s.life / s.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      style={{
        opacity: 0.98,
      }}
      aria-hidden="true"
    />
  );
};
