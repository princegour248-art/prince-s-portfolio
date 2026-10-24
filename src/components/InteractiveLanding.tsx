import React, { useEffect, useRef, useCallback } from 'react';
import { getDeviceProfile } from '../utils/performance';
import './InteractiveLanding.css';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseColor: string;
  activeColor: string;
}

interface BlastWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

export const InteractiveLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blastWavesRef = useRef<BlastWave[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Mouse & Touch tracking
  const mouseRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    tiltX: number;
    tiltY: number;
  }>({
    x: -9999,
    y: -9999,
    active: false,
    tiltX: 0,
    tiltY: 0
  });

  // Trigger explosive particle shockwave
  const triggerBlast = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    blastWavesRef.current.push({
      x: localX,
      y: localY,
      radius: 0,
      maxRadius: Math.min(window.innerWidth * 0.45, 320),
      speed: 14,
      opacity: 1
    });

    // Propel nearby particles cleanly
    particlesRef.current.forEach(p => {
      const dx = p.x - localX;
      const dy = p.y - localY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 240) {
        const force = (1 - dist / 240) * 30;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }, []);

  // Initialize Canvas particles with clean, professional typography
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const profile = getDeviceProfile();
    const dpr = profile.dpr;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // Canvas dimensions sized for large, commanding typography
    const canvasWidth = Math.min(winWidth - 28, 1560);
    const isMobile = winWidth < 860;
    const canvasHeight = isMobile
      ? Math.min(winHeight * 0.65, 380)
      : Math.min(winHeight * 0.60, 360);

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);

    // Off-screen canvas for rasterizing text
    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvasWidth;
    offCanvas.height = canvasHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    // Professional, crisp palette: Pure white, clean off-white, and warm orange accent
    const pureWhite = '#FFFFFF';
    const cleanOffWhite = '#F5F2ED';
    const signatureOrange = '#E87524';

    let fontSize = 90;

    if (isMobile) {
      // 2-line layout on smartphone / small screens: "PRINCE'S" / "PORTFOLIO"
      offCtx.font = `900 60px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      const testWidth = offCtx.measureText('PORTFOLIO').width;
      const targetWidth = canvasWidth * 0.88;
      fontSize = Math.max(48, Math.min(84, Math.floor((60 * targetWidth) / testWidth)));
      offCtx.font = `900 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;

      const centerY = canvasHeight / 2;
      const lineGap = fontSize * 1.16;

      offCtx.fillText("PRINCE'S", canvasWidth / 2, centerY - lineGap * 0.48);
      offCtx.fillText('PORTFOLIO', canvasWidth / 2, centerY + lineGap * 0.52);
    } else {
      // Single line layout for desktop with grand scale (up to 140px!)
      offCtx.font = `900 100px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      const testWidth = offCtx.measureText("PRINCE'S PORTFOLIO").width;
      const targetWidth = canvasWidth * 0.92;
      fontSize = Math.max(72, Math.min(140, Math.floor((100 * targetWidth) / testWidth)));
      offCtx.font = `900 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      offCtx.fillText("PRINCE'S PORTFOLIO", canvasWidth / 2, canvasHeight / 2);
    }

    const imgData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imgData.data;

    // Density gap optimized for low-memory (2GB RAM) vs high-end devices
    const gap = profile.isLowEnd
      ? (isMobile ? 5 : 4)
      : (isMobile ? 3 : Math.max(2, Math.round(fontSize / 45)));
    const newParticles: Particle[] = [];

    for (let y = 0; y < canvasHeight; y += gap) {
      for (let x = 0; x < canvasWidth; x += gap) {
        const index = (y * canvasWidth + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 120) {
          // Subtle scatter angle on initial load
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 80 + 30;
          const startX = x + Math.cos(angle) * dist;
          const startY = y + Math.sin(angle) * dist;

          // Crisp professional color mix: mostly clean white with subtle orange highlights
          const isOrange = Math.random() < 0.22;
          const baseColor = isOrange ? signatureOrange : (Math.random() < 0.5 ? pureWhite : cleanOffWhite);
          const activeColor = isOrange ? '#FFA048' : '#FFFFFF';

          newParticles.push({
            x: startX,
            y: startY,
            originX: x,
            originY: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: isMobile ? 1.8 : 2.1 + (Math.random() - 0.5) * 0.4,
            baseColor,
            activeColor
          });
        }
      }
    }

    particlesRef.current = newParticles;
  }, []);

  // Animation render loop
  useEffect(() => {
    initCanvas();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        initCanvas();
      });
    }

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let active = true;

    const render = () => {
      if (!active) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const pCount = particles.length;

      // 1. Process expanding blast shockwaves (clean, crisp rings)
      const activeWaves: BlastWave[] = [];
      for (let i = 0; i < blastWavesRef.current.length; i++) {
        const wave = blastWavesRef.current[i];
        wave.radius += wave.speed;
        wave.opacity = Math.max(0, 1 - wave.radius / wave.maxRadius);

        if (wave.opacity > 0 && wave.radius < wave.maxRadius) {
          activeWaves.push(wave);

          ctx.strokeStyle = `rgba(232, 117, 36, ${wave.opacity * 0.7})`;
          ctx.lineWidth = 1.8 * wave.opacity;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      blastWavesRef.current = activeWaves;

      // 2. Process & draw text particles
      const repelRadius = 100;
      const repelForce = 9;
      const spring = 0.082;
      const friction = 0.86;

      for (let i = 0; i < pCount; i++) {
        const p = particles[i];

        // Cursor repulsion
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * repelForce;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force;
            p.vy -= Math.sin(angle) * force;
          }
        }

        // Spring force pulling back cleanly to origin
        p.vx += (p.originX - p.x) * spring;
        p.vy += (p.originY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Clean, crisp solid particle rendering with zero shadows/webbing
        const speed = Math.hypot(p.vx, p.vy);
        const isAgitated = speed > 0.9;

        ctx.fillStyle = isAgitated ? p.activeColor : p.baseColor;
        ctx.beginPath();
        const renderSize = isAgitated ? p.size * 1.25 : p.size;
        ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        animationFrameRef.current = null;
      }
    };

    // Pause when scrolled out of view to save battery & RAM on 2GB devices
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initCanvas]);

  // Handle pointer tracking & subtle 3D tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    mouseRef.current.x = localX;
    mouseRef.current.y = localY;
    mouseRef.current.active = true;

    // Subtle 3D Tilt calculation
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const tiltX = (e.clientX - centerX) / centerX;
    const tiltY = (e.clientY - centerY) / centerY;

    mouseRef.current.tiltX = tiltX;
    mouseRef.current.tiltY = tiltY;

    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);

      const stage = containerRef.current.querySelector('.landing-stage') as HTMLElement | null;
      if (stage) {
        stage.style.transform = `perspective(1200px) rotateX(${-tiltY * 6}deg) rotateY(${tiltX * 6}deg)`;
      }
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;

    if (containerRef.current) {
      const stage = containerRef.current.querySelector('.landing-stage') as HTMLElement | null;
      if (stage) {
        stage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      }
    }
  };

  return (
    <section
      id="landing"
      ref={containerRef}
      className="landing-section"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => triggerBlast(e.clientX, e.clientY)}
      aria-label="Prince's Portfolio Landing Screen"
    >
      {/* Soft, clean ambient spotlight */}
      <div className="landing-spotlight" />

      {/* Accessible semantic heading for Screen Readers & SEO */}
      <h1 className="landing-sr-only">Prince's Portfolio</h1>

      {/* 3D Interactive Stage: Strictly ONLY the animated title is rendered */}
      <div className="landing-stage">
        <div className="landing-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="landing-canvas"
            title="Prince's Portfolio"
          />
        </div>
      </div>
    </section>
  );
};

export default InteractiveLanding;
