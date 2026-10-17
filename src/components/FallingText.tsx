import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import './FallingText.css';

export interface FallingDetailItem {
  label: string;
  value: string;
}

export interface FallingTextProps {
  items: FallingDetailItem[];
  gravity?: number;
  bounciness?: number;
  isSectionFallen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface PhysicsCard {
  label: string;
  value: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  homeX: number;
  homeY: number;
  width: number;
  height: number;
  isDragging: boolean;
}

export const FallingText: React.FC<FallingTextProps> = ({
  items,
  gravity = 0.6,
  bounciness = 0.5,
  isSectionFallen = false,
  className = '',
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardDomRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [manualFalling, setManualFalling] = useState<boolean | null>(null);
  const isFalling = manualFalling !== null ? manualFalling : isSectionFallen;
  const physicsCards = useRef<PhysicsCard[]>([]);
  const dragInfo = useRef<{ activeIdx: number; grabOffsetX: number; grabOffsetY: number; lastX: number; lastY: number }>({
    activeIdx: -1,
    grabOffsetX: 0,
    grabOffsetY: 0,
    lastX: 0,
    lastY: 0
  });

  const prefersReduced = useRef(false);

  // Initialize and record home grid positions
  const initPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards: PhysicsCard[] = [];
    cardDomRefs.current.forEach((el, idx) => {
      if (!el || !items[idx]) return;
      const rect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      const homeX = rect.left - contRect.left;
      const homeY = rect.top - contRect.top;

      cards.push({
        label: items[idx].label,
        value: items[idx].value,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        rot: 0,
        vrot: 0,
        homeX,
        homeY,
        width: rect.width,
        height: rect.height,
        isDragging: false
      });
    });

    physicsCards.current = cards;
  }, [items]);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initPositions();
    window.addEventListener('resize', initPositions, { passive: true });
    return () => window.removeEventListener('resize', initPositions);
  }, [initPositions]);

  // Physics animation tick
  useEffect(() => {
    if (!isFalling || prefersReduced.current) return;

    let rafId = 0;
    const container = containerRef.current;
    if (!container) return;

    const tick = () => {
      const contW = container.clientWidth;
      const contH = container.clientHeight;

      physicsCards.current.forEach((card, idx) => {
        const el = cardDomRefs.current[idx];
        if (!el) return;

        if (card.isDragging) {
          // Handled in pointermove
        } else {
          // Apply gravity
          card.vy += gravity;
          card.x += card.vx;
          card.y += card.vy;

          card.rot += card.vrot;
          card.vx *= 0.985;
          card.vrot *= 0.98;

          // Floor collision
          const floor = contH - card.height - 12;
          if (card.y > floor) {
            card.y = floor;
            card.vy = -card.vy * bounciness;
            card.vx *= 0.92; // floor friction
            card.vrot *= 0.85;
          }

          // Left wall collision
          if (card.x < 12) {
            card.x = 12;
            card.vx = -card.vx * bounciness;
          }

          // Right wall collision
          const rightWall = contW - card.width - 12;
          if (card.x > rightWall) {
            card.x = rightWall;
            card.vx = -card.vx * bounciness;
          }
        }

        // Apply visual transform
        el.style.transform = `translate3d(${card.x - card.homeX}px, ${card.y - card.homeY}px, 0) rotate(${card.rot}deg)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isFalling, gravity, bounciness]);

  // Track previous falling state to trigger physics kick or smooth restore
  const prevFallingRef = useRef(isFalling);

  useEffect(() => {
    if (prefersReduced.current) return;

    if (isFalling && !prevFallingRef.current) {
      initPositions();
      physicsCards.current.forEach(c => {
        c.vy = (Math.random() - 0.2) * 2.8;
        c.vx = (Math.random() - 0.5) * 4.5;
        c.vrot = (Math.random() - 0.5) * 5.0;
      });
    } else if (!isFalling && prevFallingRef.current) {
      physicsCards.current.forEach((c, idx) => {
        c.x = c.homeX;
        c.y = c.homeY;
        c.vx = 0;
        c.vy = 0;
        c.rot = 0;
        c.vrot = 0;
        const el = cardDomRefs.current[idx];
        if (el) {
          el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
          setTimeout(() => {
            if (el) el.style.transition = '';
          }, 460);
        }
      });
    }
    prevFallingRef.current = isFalling;
  }, [isFalling, initPositions]);

  // Toggle falling effect manually
  const triggerDrop = () => {
    if (prefersReduced.current) return;
    setManualFalling(prev => (prev === null ? !isSectionFallen : !prev));
  };

  // Drag interaction
  const onCardPointerDown = (idx: number, e: React.PointerEvent) => {
    if (!isFalling) {
      triggerDrop();
      return;
    }

    const card = physicsCards.current[idx];
    if (!card || !containerRef.current) return;

    card.isDragging = true;
    const contRect = containerRef.current.getBoundingClientRect();
    dragInfo.current = {
      activeIdx: idx,
      grabOffsetX: e.clientX - contRect.left - card.x,
      grabOffsetY: e.clientY - contRect.top - card.y,
      lastX: e.clientX,
      lastY: e.clientY
    };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const { activeIdx, grabOffsetX, grabOffsetY } = dragInfo.current;
    if (activeIdx < 0 || !containerRef.current) return;

    const card = physicsCards.current[activeIdx];
    if (!card) return;

    const contRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - contRect.left - grabOffsetX;
    const newY = e.clientY - contRect.top - grabOffsetY;

    card.vx = (e.clientX - dragInfo.current.lastX) * 0.8;
    card.vy = (e.clientY - dragInfo.current.lastY) * 0.8;
    dragInfo.current.lastX = e.clientX;
    dragInfo.current.lastY = e.clientY;

    card.x = newX;
    card.y = newY;
    card.rot += card.vx * 0.15;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const { activeIdx } = dragInfo.current;
    if (activeIdx >= 0) {
      const card = physicsCards.current[activeIdx];
      if (card) {
        card.isDragging = false;
        card.vx = Math.max(-12, Math.min(12, card.vx));
        card.vy = Math.max(-12, Math.min(12, card.vy));
      }
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    dragInfo.current.activeIdx = -1;
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-wrapper ${className}`.trim()}
      style={style}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="falling-text-header">
        <span className="falling-text-title">Interactive Profile Highlights</span>
        <button
          type="button"
          onClick={triggerDrop}
          className="falling-text-toggle-btn"
          title={isFalling ? 'Reset to grid layout' : 'Trigger physics gravity drop'}
          aria-label={isFalling ? 'Reset layout' : 'Drop elements with gravity'}
        >
          {isFalling ? (
            <>
              <RotateCcw size={12} />
              <span>Restore Grid</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>Falling Effect</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of detail chips that can fall */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        {items.map((item, idx) => (
          <div
            key={item.label}
            ref={el => {
              cardDomRefs.current[idx] = el;
            }}
            className="falling-card-item"
            onPointerDown={e => onCardPointerDown(idx, e)}
          >
            <span className="falling-card-label">{item.label}</span>
            <span className="falling-card-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FallingText;
