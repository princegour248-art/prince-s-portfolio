import React, { useEffect, useRef } from 'react';
import './GlowCursor.css';

export interface GlowCursorProps {
  color?: string;
  coolColor?: string;
  intensity?: number;
  trailWidth?: number;
  linger?: number;
  glow?: number;
  hotspot?: number;
  followSpeed?: number;
  grain?: number;
  clickBurst?: boolean;
  quality?: 'low' | 'medium' | 'high';
  theme?: 'dark' | 'light';
  blendMode?: GlobalCompositeOperation;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: { r: number; g: number; b: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  if (Number.isNaN(num) || c.length !== 6) {
    return { r: 255, g: 106, b: 0 }; // default warm orange
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function lerpRgb(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number },
  t: number
): { r: number; g: number; b: number } {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * clamped),
    g: Math.round(c1.g + (c2.g - c1.g) * clamped),
    b: Math.round(c1.b + (c2.b - c1.b) * clamped)
  };
}

export const GlowCursor: React.FC<GlowCursorProps> = ({
  color = '#FF6A00',
  coolColor = '#FF8C42',
  intensity = 1.3,
  trailWidth = 3,
  linger = 1.4,
  glow = 1.2,
  hotspot = 0.8,
  followSpeed = 0.6,
  grain = 2,
  clickBurst = true,
  quality = 'high',
  theme = 'dark',
  blendMode,
  enabled = true,
  className = '',
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Check touch and reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Quality scale factor
    const qualityScale = quality === 'low' ? 0.6 : quality === 'medium' ? 0.8 : 1.0;
    const baseRgb = hexToRgb(color);
    const coolRgb = hexToRgb(coolColor);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2) * qualityScale;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2) * qualityScale;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Pointer state
    const pointer = { x: -999, y: -999, inside: false };
    const head = { x: -999, y: -999 };
    const trail: TrailPoint[] = [];
    const bursts: BurstParticle[] = [];

    let rafId = 0;
    let active = false;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;

      // Initialize head immediately to prevent flying from corner
      if (head.x < -100) {
        head.x = e.clientX;
        head.y = e.clientY;
      }

      if (!active) {
        active = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!clickBurst) return;

      const particleCount = 14;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
        const speed = 2.4 + Math.random() * 3.8;
        bursts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: (1.5 + Math.random() * 2.5) * (trailWidth / 3),
          life: 0,
          maxLife: 0.45 + Math.random() * 0.2,
          color: Math.random() > 0.4 ? baseRgb : coolRgb
        });
      }

      if (!active) {
        active = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    // Main animation loop
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Follow cursor physics
      if (pointer.inside) {
        const speed = Math.max(0.1, Math.min(1, followSpeed * 1.4));
        head.x += (pointer.x - head.x) * speed;
        head.y += (pointer.y - head.y) * speed;

        const dist = Math.hypot(pointer.x - head.x, pointer.y - head.y);
        if (dist > 1 || trail.length === 0) {
          trail.push({ x: head.x, y: head.y, time: now });
        }
      }

      // Purge old trail points exceeding linger
      const maxAgeMs = linger * 1000;
      while (trail.length > 0 && now - trail[0].time > maxAgeMs) {
        trail.shift();
      }

      // Update bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.life += dt;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        if (p.life >= p.maxLife) {
          bursts.splice(i, 1);
        }
      }

      // Render Canvas
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const effectiveBlendMode: GlobalCompositeOperation =
        blendMode || (theme === 'dark' ? 'screen' : 'source-over');
      ctx.globalCompositeOperation = effectiveBlendMode;

      // 1. Draw glowing trail
      if (trail.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Multi-pass rendering: outer aura glow, middle soft glow, core sharp beam
        const passes = [
          { blur: glow * 22, widthMult: 2.8, alphaMult: 0.16 * intensity },
          { blur: glow * 9, widthMult: 1.4, alphaMult: 0.36 * intensity },
          { blur: glow * 3, widthMult: 1.0, alphaMult: 0.85 * intensity }
        ];

        for (const pass of passes) {
          ctx.shadowBlur = pass.blur;

          for (let i = 1; i < trail.length; i++) {
            const p0 = trail[i - 1];
            const p1 = trail[i];
            const ageRatio = (now - p1.time) / maxAgeMs; // 0 (new) to 1 (old)
            const alpha = Math.max(0, 1 - ageRatio) * pass.alphaMult;
            if (alpha <= 0.005) continue;

            const currentColor = lerpRgb(baseRgb, coolRgb, ageRatio);
            const colorStr = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${alpha.toFixed(3)})`;

            ctx.shadowColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${(alpha * 0.8).toFixed(3)})`;
            ctx.strokeStyle = colorStr;
            ctx.lineWidth = Math.max(0.5, trailWidth * pass.widthMult * (1 - ageRatio * 0.45));

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw cursor head hotspot
      if (pointer.inside && head.x > -100) {
        const spotRadius = (16 + trailWidth * 2) * glow;
        const spotGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, spotRadius);

        // Bright white-hot center core fading into rich orange glow
        const hotAlpha = Math.min(1, hotspot * intensity);
        spotGrad.addColorStop(0, `rgba(255, 255, 255, ${hotAlpha.toFixed(2)})`);
        spotGrad.addColorStop(0.25, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${(hotAlpha * 0.75).toFixed(2)})`);
        spotGrad.addColorStop(0.65, `rgba(${coolRgb.r}, ${coolRgb.g}, ${coolRgb.b}, ${(hotAlpha * 0.28).toFixed(2)})`);
        spotGrad.addColorStop(1, `rgba(${coolRgb.r}, ${coolRgb.g}, ${coolRgb.b}, 0)`);

        ctx.shadowBlur = glow * 14;
        ctx.shadowColor = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.6)`;
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(head.x, head.y, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Film grain specks around hotspot
        if (grain > 0) {
          const speckCount = Math.round(grain * 4);
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.4 * intensity).toFixed(2)})`;
          for (let s = 0; s < speckCount; s++) {
            const rad = Math.random() * spotRadius * 0.7;
            const th = Math.random() * Math.PI * 2;
            const sx = head.x + Math.cos(th) * rad;
            const sy = head.y + Math.sin(th) * rad;
            const sz = Math.random() > 0.6 ? 1.5 : 1;
            ctx.fillRect(Math.round(sx), Math.round(sy), sz, sz);
          }
        }
      }

      // 4. Draw click burst sparks
      if (bursts.length > 0) {
        for (const p of bursts) {
          const progress = p.life / p.maxLife;
          const alpha = (1 - progress) * 0.9 * intensity;
          const rad = p.size * (1 - progress * 0.5);

          ctx.shadowBlur = glow * 8;
          ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(2)})`;
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Check if animation should continue
      const hasContent = trail.length > 0 || bursts.length > 0 || pointer.inside;
      if (hasContent) {
        rafId = requestAnimationFrame(tick);
      } else {
        active = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [
    color,
    coolColor,
    intensity,
    trailWidth,
    linger,
    glow,
    hotspot,
    followSpeed,
    grain,
    clickBurst,
    quality,
    theme,
    blendMode,
    enabled
  ]);

  return (
    <div className={`glow-cursor-container ${className}`.trim()} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="glow-cursor-canvas" />
    </div>
  );
};

export default GlowCursor;
