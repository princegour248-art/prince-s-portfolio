import React, { useEffect, useRef, useState, useMemo } from 'react';
import './TrueFocus.css';

export interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'Prince Gour',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#FF6A00',
  glowColor = 'rgba(255, 106, 0, 0.4)',
  animationDuration = 0.35,
  pauseBetweenAnimations = 1.6,
  className = '',
  style
}) => {
  const words = useMemo(() => sentence.trim().split(/\s+/), [sentence]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Auto-cycle through words when not in manual mode
  useEffect(() => {
    if (manualMode || words.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, (pauseBetweenAnimations + animationDuration) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, words.length, pauseBetweenAnimations, animationDuration]);

  // Update focus rect position when currentIndex or window resizes
  useEffect(() => {
    const updateRect = () => {
      const container = containerRef.current;
      const targetWord = wordRefs.current[currentIndex];
      if (!container || !targetWord) return;

      const containerRect = container.getBoundingClientRect();
      const wordRect = targetWord.getBoundingClientRect();

      setFocusRect({
        x: wordRect.left - containerRect.left - 4,
        y: wordRect.top - containerRect.top - 2,
        width: wordRect.width + 8,
        height: wordRect.height + 4
      });
    };

    updateRect();
    const frameId = requestAnimationFrame(updateRect);
    window.addEventListener('resize', updateRect, { passive: true });
    if (document.fonts) {
      document.fonts.ready.then(updateRect);
    }
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateRect);
    };
  }, [currentIndex, words]);

  return (
    <div
      ref={containerRef}
      className={`true-focus-container ${className}`.trim()}
      style={style}
      aria-label={sentence}
    >
      {words.map((word, idx) => {
        const isFocused = idx === currentIndex;
        return (
          <span
            key={`${word}-${idx}`}
            ref={el => {
              wordRefs.current[idx] = el;
            }}
            className="true-focus-word"
            style={{
              filter: isFocused ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isFocused ? 1 : 0.45,
              color: isFocused ? '#F5F5F5' : '#A1A1AA'
            }}
            onPointerEnter={() => {
              setCurrentIndex(idx);
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Focus Indicator Frame */}
      {focusRect && (
        <div
          className={`true-focus-box ${words.length === 1 ? 'single-word' : ''}`.trim()}
          style={{
            transform: `translate3d(${focusRect.x}px, ${focusRect.y}px, 0)`,
            width: `${focusRect.width}px`,
            height: `${focusRect.height}px`,
            color: borderColor,
            boxShadow: `0 0 14px ${glowColor}, inset 0 0 8px ${glowColor}`,
            transitionDuration: `${animationDuration}s`
          }}
        >
          <span className="true-focus-corner top-left" />
          <span className="true-focus-corner top-right" />
          <span className="true-focus-corner bottom-left" />
          <span className="true-focus-corner bottom-right" />
        </div>
      )}
    </div>
  );
};

export default TrueFocus;
