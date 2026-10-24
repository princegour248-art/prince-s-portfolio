import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getDeviceProfile } from '../utils/performance';
import './ParticleText.css';

interface ParticleTextProps {
  text?: string;
  fontSize?: number;
  gap?: number;
  particleSize?: number;
  repelRadius?: number;
  repelForce?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  activeColor: string;
}

export const ParticleText: React.FC<ParticleTextProps> = ({
  text = 'SKILLS',
  fontSize = 46,
  gap = 3,
  particleSize = 1.8,
  repelRadius = 70,
  repelForce = 6,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false
  });
  const [dimensions, setDimensions] = useState({ width: 280, height: 70 });

  // Initialize and sample particles from rendered text
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const profile = getDeviceProfile();
    const effectiveGap = profile.isLowEnd ? Math.max(gap + 2, 5) : gap;

    // Use container width or compute bounds based on font size
    const estimatedWidth = Math.min(window.innerWidth - 48, Math.max(260, text.length * (fontSize * 0.72)));
    const estimatedHeight = Math.round(fontSize * 1.4);

    setDimensions({ width: estimatedWidth, height: estimatedHeight });

    const dpr = profile.dpr;
    canvas.width = estimatedWidth * dpr;
    canvas.height = estimatedHeight * dpr;
    canvas.style.width = `${estimatedWidth}px`;
    canvas.style.height = `${estimatedHeight}px`;

    ctx.scale(dpr, dpr);

    // Render offscreen text
    const offCanvas = document.createElement('canvas');
    offCanvas.width = estimatedWidth;
    offCanvas.height = estimatedHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.font = `800 ${fontSize}px "JetBrains Mono", "SF Mono", monospace`;
    offCtx.textBaseline = 'middle';
    offCtx.textAlign = 'left';
    offCtx.fillText(text, 6, estimatedHeight / 2);

    const imgData = offCtx.getImageData(0, 0, estimatedWidth, estimatedHeight);
    const data = imgData.data;

    const newParticles: Particle[] = [];

    for (let y = 0; y < estimatedHeight; y += effectiveGap) {
      for (let x = 0; x < estimatedWidth; x += effectiveGap) {
        const index = (y * estimatedWidth + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          // Intro scattering: start scattered and gather to origin
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 80;
          const startX = x + Math.cos(angle) * dist;
          const startY = y + Math.sin(angle) * dist;

          // Color accents: mix of bright white and primary orange
          const isOrange = Math.random() > 0.65;
          const baseColor = isOrange ? '#FF8C42' : '#F5F5F5';
          const activeColor = '#FF6A00';

          newParticles.push({
            x: startX,
            y: startY,
            originX: x,
            originY: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: particleSize + (Math.random() - 0.5) * 0.4,
            color: baseColor,
            activeColor
          });
        }
      }
    }

    particlesRef.current = newParticles;
  }, [text, fontSize, gap, particleSize]);

  // Main animation frame loop
  useEffect(() => {
    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let running = true;

    const render = () => {
      if (!running) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
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

        // Spring damping back to origin
        const spring = 0.08;
        const friction = 0.88;

        p.vx += (p.originX - p.x) * spring;
        p.vy += (p.originY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Velocity-based color highlight
        const speed = Math.hypot(p.vx, p.vy);
        const isMoving = speed > 0.8;

        ctx.fillStyle = isMoving ? p.activeColor : p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        animationFrameRef.current = null;
      }
    };

    // Pause offscreen to free memory & GPU on 2GB RAM phones
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    render();

    return () => {
      running = false;
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, repelRadius, repelForce]);

  // Pointer interactions
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  // Explosive click burst
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const particles = particlesRef.current;
    particles.forEach(p => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const force = (120 / dist) * 8;
      const angle = Math.atan2(dy, dx);

      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`particle-text-wrapper ${className}`.trim()}
      role="heading"
      aria-level={2}
      aria-label={text}
      title="Hover or click to disperse particles"
    >
      <canvas
        ref={canvasRef}
        className="particle-text-canvas"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ width: dimensions.width, height: dimensions.height }}
      />
      <div className="particle-text-hint">
        Hover to repel &bull; Click to burst
      </div>
    </div>
  );
};

export default ParticleText;
