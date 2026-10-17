import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SplitFlapText.css';

interface SplitFlapTextProps {
  text: string;
  speed?: number; // interval between flap cycles in ms
  stagger?: number; // delay between each tile beginning to settle in ms
  className?: string;
  accentIndices?: number[]; // indices of characters to highlight in orange
}

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*#';

export const SplitFlapText: React.FC<SplitFlapTextProps> = ({
  text,
  speed = 45,
  stagger = 80,
  className = '',
  accentIndices = []
}) => {
  const chars = text.toUpperCase().split('');
  const [displayedChars, setDisplayedChars] = useState<string[]>(chars);
  const [flippingIndices, setFlippingIndices] = useState<boolean[]>(
    new Array(chars.length).fill(false)
  );
  const isAnimatingRef = useRef(false);

  const triggerAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    chars.forEach((targetChar, index) => {
      if (targetChar === ' ') {
        return;
      }

      const totalFlips = 6 + index * 2;
      let flipCount = 0;

      setTimeout(() => {
        const interval = setInterval(() => {
          flipCount++;

          // Visual 3D flap state
          setFlippingIndices(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
          });

          if (flipCount >= totalFlips) {
            clearInterval(interval);
            setDisplayedChars(prev => {
              const next = [...prev];
              next[index] = targetChar;
              return next;
            });
            setTimeout(() => {
              setFlippingIndices(prev => {
                const next = [...prev];
                next[index] = false;
                return next;
              });
              if (index === chars.length - 1) {
                isAnimatingRef.current = false;
              }
            }, 120);
          } else {
            // Cycle through random characters
            const randomChar = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
            setDisplayedChars(prev => {
              const next = [...prev];
              next[index] = randomChar;
              return next;
            });
          }
        }, speed);
      }, index * stagger);
    });
  }, [chars, speed, stagger]);

  // Initial animate-in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAnimation();
    }, 150);
    return () => clearTimeout(timer);
  }, [triggerAnimation]);

  return (
    <div
      className={`split-flap-board ${className}`}
      onClick={triggerAnimation}
      onMouseEnter={triggerAnimation}
      role="heading"
      aria-level={2}
      aria-label={text}
      title="Click or hover to re-flip"
    >
      {displayedChars.map((char, idx) => {
        const isAccent = accentIndices.includes(idx);
        const isFlipping = flippingIndices[idx];

        if (char === ' ') {
          return (
            <div
              key={idx}
              style={{ width: '16px' }}
              aria-hidden="true"
            />
          );
        }

        return (
          <div
            key={idx}
            className={`split-flap-tile ${isAccent ? 'accent' : ''}`}
            aria-hidden="true"
          >
            <div className={`split-flap-inner ${isFlipping ? 'flipping' : ''}`}>
              <span className="split-flap-char">{char}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
