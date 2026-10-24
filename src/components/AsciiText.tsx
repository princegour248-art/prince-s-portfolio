import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getDeviceProfile } from '../utils/performance';
import './AsciiText.css';

interface AsciiTextProps {
  text?: string;
  enableWaves?: boolean;
  asciiFontSize?: number;
  waveSpeed?: number;
  className?: string;
}

const ASCII_CHARSET = '@#S%?*+;:,. ';

interface AsciiCell {
  char: string;
  baseChar: string;
  brightness: number;
  x: number;
  y: number;
  color: string;
}

export const AsciiText: React.FC<AsciiTextProps> = ({
  text = 'EDUCATION',
  enableWaves = true,
  asciiFontSize = 7,
  waveSpeed = 0.04,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const [canvasDimensions, setCanvasDimensions] = useState({ width: 340, height: 75 });

  // Mouse interaction state
  const mouseRef = useRef<{ x: number; y: number; active: boolean; tiltX: number; tiltY: number }>({
    x: -9999,
    y: -9999,
    active: false,
    tiltX: 0,
    tiltY: 0
  });

  // Ripple state
  const ripplesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; opacity: number }[]>([]);

  // Sample characters from text rasterization
  const gridRef = useRef<AsciiCell[]>([]);

  const initGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Estimate bounds based on text length and character size
    const estimatedWidth = Math.min(window.innerWidth - 48, Math.max(300, text.length * 36));
    const estimatedHeight = 72;

    setCanvasDimensions({ width: estimatedWidth, height: estimatedHeight });

    const profile = getDeviceProfile();
    const dpr = profile.dpr;
    canvas.width = estimatedWidth * dpr;
    canvas.height = estimatedHeight * dpr;
    canvas.style.width = `${estimatedWidth}px`;
    canvas.style.height = `${estimatedHeight}px`;

    // Offscreen render to sample luminance
    const offCanvas = document.createElement('canvas');
    offCanvas.width = estimatedWidth;
    offCanvas.height = estimatedHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.font = '900 48px "JetBrains Mono", "SF Mono", monospace';
    offCtx.textBaseline = 'middle';
    offCtx.textAlign = 'left';
    offCtx.fillText(text, 6, estimatedHeight / 2);

    const imgData = offCtx.getImageData(0, 0, estimatedWidth, estimatedHeight);
    const data = imgData.data;

    const cellStep = asciiFontSize;
    const newCells: AsciiCell[] = [];

    for (let y = 0; y < estimatedHeight; y += cellStep) {
      for (let x = 0; x < estimatedWidth; x += cellStep) {
        const index = (y * estimatedWidth + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 40) {
          const brightness = alpha / 255;
          const charIndex = Math.min(
            ASCII_CHARSET.length - 1,
            Math.floor((1 - brightness) * (ASCII_CHARSET.length - 1))
          );
          const char = ASCII_CHARSET[charIndex];

          newCells.push({
            char,
            baseChar: char,
            brightness,
            x,
            y,
            color: brightness > 0.85 ? '#FF8C42' : '#F5F5F5'
          });
        }
      }
    }

    gridRef.current = newCells;
  }, [text, asciiFontSize]);

  useEffect(() => {
    initGrid();

    const handleResize = () => {
      initGrid();
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
      ctx.save();
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      timeRef.current += waveSpeed;
      const t = timeRef.current;
      const mouse = mouseRef.current;

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter(r => {
        r.radius += 3.5;
        r.opacity *= 0.94;
        return r.opacity > 0.04 && r.radius < r.maxRadius;
      });

      const cells = gridRef.current;
      const count = cells.length;

      ctx.font = `bold ${asciiFontSize + 1}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < count; i++) {
        const cell = cells[i];

        // Wave displacement
        let waveY = 0;
        let waveColor = cell.color;

        if (enableWaves) {
          const wavePhase = Math.sin(t * 1.5 + cell.x * 0.05);
          waveY = wavePhase * 3.5;

          if (wavePhase > 0.6) {
            waveColor = '#FF6A00';
          }
        }

        // Mouse proximity ripple / scramble
        let drawX = cell.x;
        let drawY = cell.y + waveY;
        let charToDraw = cell.baseChar;

        if (mouse.active) {
          const dx = mouse.x - cell.x;
          const dy = mouse.y - cell.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 65) {
            const force = (1 - dist / 65) * 5;
            drawY += Math.sin(t * 3 + dist * 0.1) * force;
            waveColor = '#FF6A00';

            // Jitter / scramble ASCII char on close proximity
            if (Math.random() > 0.6) {
              charToDraw = ASCII_CHARSET[Math.floor(Math.random() * (ASCII_CHARSET.length - 2))];
            }
          }
        }

        // Click shockwave displacement
        ripplesRef.current.forEach(r => {
          const dx = cell.x - r.x;
          const dy = cell.y - r.y;
          const dist = Math.hypot(dx, dy);
          const diff = Math.abs(dist - r.radius);

          if (diff < 20) {
            drawY += Math.sin(diff * 0.3) * (6 * r.opacity);
            waveColor = '#FF8C42';
            charToDraw = '@';
          }
        });

        ctx.fillStyle = waveColor;
        ctx.fillText(charToDraw, drawX, drawY);
      }

      ctx.restore();

      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        animationFrameRef.current = null;
      }
    };

    // Pause offscreen to conserve memory on 2GB devices
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
  }, [initGrid, enableWaves, waveSpeed, asciiFontSize]);

  // Pointer interactions
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = {
      x,
      y,
      active: true,
      tiltX: ((x / rect.width) - 0.5) * 12,
      tiltY: ((y / rect.height) - 0.5) * -12
    };

    if (canvasRef.current) {
      canvasRef.current.style.transform = `perspective(500px) rotateX(${mouseRef.current.tiltY}deg) rotateY(${mouseRef.current.tiltX}deg)`;
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    if (canvasRef.current) {
      canvasRef.current.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
    }
  };

  // Click shockwave ripple
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 180,
      opacity: 1
    });
  };

  return (
    <div
      ref={containerRef}
      className={`ascii-text-wrapper ${className}`.trim()}
      role="heading"
      aria-level={2}
      aria-label={text}
      title="Hover to wave &amp; tilt &bull; Click to ripple"
    >
      <canvas
        ref={canvasRef}
        className="ascii-text-canvas"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ width: canvasDimensions.width, height: canvasDimensions.height }}
      />
      <div className="ascii-text-hint">
        ASCII Waves &bull; Interactive Tilt &bull; Click to Ripple
      </div>
    </div>
  );
};

export default AsciiText;
