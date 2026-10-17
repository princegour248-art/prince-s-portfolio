import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SkillCategoryItem } from '../data/skillsSectionData';

interface SkillWheelProps {
  categories: SkillCategoryItem[];
  selectedCategory: SkillCategoryItem;
  onSelectCategory: (category: SkillCategoryItem) => void;
}

export const SkillWheel: React.FC<SkillWheelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const total = categories.length;
  const stepAngle = 36; // 36 degrees per option on the curved 3D cylinder
  const cylinderRadius = 150; // cylinder depth radius in pixels

  const selectedIndex = categories.findIndex(c => c.id === selectedCategory.id);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  // Visual rotation angle of the cylinder
  const [rotationAngle, setRotationAngle] = useState(activeIndex * stepAngle);
  const [isDragging, setIsDragging] = useState(false);

  // Drag physics tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartAngle = useRef<number>(0);
  const lastDeltaY = useRef<number>(0);
  const isInteracting = useRef<boolean>(false);

  // Synchronize when active category changes externally
  useEffect(() => {
    if (!isInteracting.current) {
      setRotationAngle(activeIndex * stepAngle);
    }
  }, [activeIndex, stepAngle]);

  const snapToIndex = useCallback((targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(total - 1, targetIndex));
    setRotationAngle(clampedIndex * stepAngle);
    onSelectCategory(categories[clampedIndex]);
  }, [categories, onSelectCategory, stepAngle, total]);

  // Pointer drag start
  const handlePointerDown = (e: React.PointerEvent) => {
    isInteracting.current = true;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartAngle.current = rotationAngle;
    lastDeltaY.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer drag move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    lastDeltaY.current = deltaY;
    const newAngle = dragStartAngle.current - deltaY * 0.45;
    const minAngle = -15;
    const maxAngle = (total - 1) * stepAngle + 15;
    const clamped = Math.max(minAngle, Math.min(maxAngle, newAngle));
    setRotationAngle(clamped);
  };

  // Pointer drag release
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    isInteracting.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const nearestIndex = Math.round(rotationAngle / stepAngle);
    snapToIndex(nearestIndex);
  };

  // Trackpad / Mouse Wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 6) return;
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(total - 1, activeIndex + direction));
    if (nextIndex !== activeIndex) {
      snapToIndex(nextIndex);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      snapToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      snapToIndex(activeIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      snapToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      snapToIndex(total - 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (activeIndex - 1 + total) % total;
    snapToIndex(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (activeIndex + 1) % total;
    snapToIndex(nextIndex);
  };

  return (
    <div
      ref={containerRef}
      className="reactbits-option-wheel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="Skill category option wheel"
      aria-activedescendant={`wheel-option-${selectedCategory.id}`}
    >
      {/* Up Navigation Button */}
      <button
        type="button"
        className="reactbits-wheel-nav-btn up"
        onClick={handlePrev}
        aria-label="Previous skill category"
        title="Previous category"
      >
        <ChevronUp size={16} />
      </button>

      {/* 3D Cylindrical Drum */}
      <div
        className="reactbits-wheel-drum"
        style={{
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `rotateX(${rotationAngle}deg)`
        }}
      >
        {categories.map((cat, idx) => {
          const itemBaseAngle = idx * stepAngle;
          const offsetAngle = itemBaseAngle - rotationAngle;
          const isCurrentActive = idx === activeIndex;

          const rad = (offsetAngle * Math.PI) / 180;
          const cosine = Math.cos(rad);
          const absOffset = Math.abs(offsetAngle);

          // React Bits blur, opacity, and scale curve from screenshot
          const opacity = absOffset > 85 ? 0 : Math.max(0.12, Math.min(1, Math.pow(cosine, 2.5)));
          const blurAmount = absOffset < 10 ? 0 : Math.min(4.5, absOffset * 0.08);
          const scale = Math.max(0.8, Math.min(1.08, 0.82 + cosine * 0.26));
          const isVisible = absOffset < 90;

          return (
            <div
              key={cat.id}
              id={`wheel-option-${cat.id}`}
              role="option"
              aria-selected={isCurrentActive}
              className={`reactbits-wheel-item ${isCurrentActive ? 'active' : ''}`}
              style={{
                display: isVisible ? 'flex' : 'none',
                transform: `rotateX(${-itemBaseAngle}deg) translateZ(${cylinderRadius}px) scale(${scale})`,
                opacity: opacity,
                filter: `blur(${blurAmount}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer'
              }}
              onClick={(e) => {
                if (Math.abs(lastDeltaY.current) < 5) {
                  e.stopPropagation();
                  snapToIndex(idx);
                }
              }}
            >
              <span className="reactbits-wheel-hyphen">
                {isCurrentActive ? '—' : '-'}
              </span>
              <span className="reactbits-wheel-text">
                {cat.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top & Bottom Vignette Gradient Masks */}
      <div className="reactbits-wheel-mask-top" />
      <div className="reactbits-wheel-mask-bottom" />

      {/* Down Navigation Button */}
      <button
        type="button"
        className="reactbits-wheel-nav-btn down"
        onClick={handleNext}
        aria-label="Next skill category"
        title="Next category"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};
