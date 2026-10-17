import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ScrambledText.css';

interface ScrambledTextProps {
  text: string;
  speed?: number; // duration per cycle in ms
  scrambleDuration?: number; // iterations per char
  className?: string;
  scrambleChars?: string;
  revealDirection?: 'start' | 'end' | 'center';
}

const DEFAULT_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const ScrambledText: React.FC<ScrambledTextProps> = ({
  text,
  speed = 40,
  className = '',
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  revealDirection = 'start'
}) => {
  const characters = text.split('');
  const [displayChars, setDisplayChars] = useState<string[]>(characters);
  const [scramblingIndices, setScramblingIndices] = useState<boolean[]>(
    new Array(characters.length).fill(false)
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);

  // Cleanup all timers
  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  // Trigger full wave scramble (intro, hover, or click)
  const triggerScramble = useCallback(() => {
    clearAllTimers();
    isAnimatingRef.current = true;

    // Determine sequential order
    const indices = characters.map((_, i) => i);
    if (revealDirection === 'end') {
      indices.reverse();
    } else if (revealDirection === 'center') {
      const mid = Math.floor(characters.length / 2);
      indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    }

    // Set all non-space characters to scrambling
    setScramblingIndices(characters.map(c => c !== ' '));

    indices.forEach((index, orderIdx) => {
      if (characters[index] === ' ') return;

      const totalCycles = 6 + orderIdx * 2;
      let cycle = 0;

      const interval = window.setInterval(() => {
        cycle++;
        if (cycle >= totalCycles) {
          clearInterval(interval);
          setDisplayChars(prev => {
            const next = [...prev];
            next[index] = characters[index];
            return next;
          });
          setScramblingIndices(prev => {
            const next = [...prev];
            next[index] = false;
            return next;
          });

          // Check if last character resolved
          if (orderIdx === indices.length - 1) {
            isAnimatingRef.current = false;
          }
        } else {
          // Cycle random character
          const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          setDisplayChars(prev => {
            const next = [...prev];
            next[index] = randomChar;
            return next;
          });
        }
      }, speed);

      intervalsRef.current.push(interval);
    });
  }, [characters, revealDirection, scrambleChars, speed, clearAllTimers]);

  // Per-character interactive jitter on individual mouse hover
  const handleCharHover = (index: number) => {
    if (characters[index] === ' ' || isAnimatingRef.current) return;

    setScramblingIndices(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    let count = 0;
    const interval = window.setInterval(() => {
      count++;
      if (count > 5) {
        clearInterval(interval);
        setDisplayChars(prev => {
          const next = [...prev];
          next[index] = characters[index];
          return next;
        });
        setScramblingIndices(prev => {
          const next = [...prev];
          next[index] = false;
          return next;
        });
      } else {
        const rand = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        setDisplayChars(prev => {
          const next = [...prev];
          next[index] = rand;
          return next;
        });
      }
    }, 45);

    intervalsRef.current.push(interval);
  };

  // Trigger on initial view when scrolled into viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          triggerScramble();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearAllTimers();
    };
  }, [triggerScramble, clearAllTimers]);

  return (
    <div className="scrambled-wrapper" style={{ display: 'inline-block' }}>
      <div
        ref={containerRef}
        className={`scrambled-text-container ${className}`}
        onClick={triggerScramble}
        role="heading"
        aria-level={2}
        aria-label={text}
        title="Click or hover to scramble"
      >
        {displayChars.map((char, idx) => {
          if (char === ' ') {
            return (
              <span key={idx} style={{ width: '0.45em', display: 'inline-block' }}>
                &nbsp;
              </span>
            );
          }

          const isScrambling = scramblingIndices[idx];

          return (
            <span
              key={idx}
              className={`scrambled-char ${isScrambling ? 'scrambling' : 'resolved'}`}
              onMouseEnter={() => handleCharHover(idx)}
              aria-hidden="true"
            >
              {char}
            </span>
          );
        })}
      </div>
      <span className="scrambled-text-bar" aria-hidden="true" />
    </div>
  );
};

export default ScrambledText;
