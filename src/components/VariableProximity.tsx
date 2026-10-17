import React, { useEffect, useRef, useMemo } from 'react';
import './VariableProximity.css';

export interface VariableProximityProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  style?: React.CSSProperties;
  baseColor?: string;
  activeColor?: string;
}

const parseWeight = (settingsStr?: string, defaultVal = 400): number => {
  if (!settingsStr) return defaultVal;
  const match = settingsStr.match(/'wght'\s*(\d+)/i) || settingsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : defaultVal;
};

export const VariableProximity: React.FC<VariableProximityProps> = ({
  label,
  fromFontVariationSettings = "'wght' 350",
  toFontVariationSettings = "'wght' 850",
  containerRef,
  radius = 75,
  falloff = 'gaussian',
  className = '',
  style = {},
  baseColor,
  activeColor = '#FF8C42'
}) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const fromWeight = useMemo(
    () => parseWeight(fromFontVariationSettings, 350),
    [fromFontVariationSettings]
  );
  const toWeight = useMemo(
    () => parseWeight(toFontVariationSettings, 850),
    [toFontVariationSettings]
  );

  // Split label into words, preserving spaces
  const words = useMemo(() => label.split(' '), [label]);

  useEffect(() => {
    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseActive = true;

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateChars);
      }
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateChars);
      }
    };

    const updateChars = () => {
      animationFrameRef.current = null;
      const root = rootRef.current;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();

      // Quick bounding box check: if pointer is far from entire block, reset all
      const isNearRoot =
        isMouseActive &&
        mouseX >= rootRect.left - radius &&
        mouseX <= rootRect.right + radius &&
        mouseY >= rootRect.top - radius &&
        mouseY <= rootRect.bottom + radius;

      charRefs.current.forEach(span => {
        if (!span) return;

        if (!isNearRoot) {
          span.style.fontWeight = `${fromWeight}`;
          span.style.fontVariationSettings = `'wght' ${fromWeight}`;
          if (baseColor) {
            span.style.color = baseColor;
          } else {
            span.style.color = '';
          }
          return;
        }

        const rect = span.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(mouseX - charCenterX, mouseY - charCenterY);

        if (distance < radius) {
          const ratio = 1 - distance / radius;
          let progress = ratio;

          if (falloff === 'exponential') {
            progress = Math.pow(ratio, 2);
          } else if (falloff === 'gaussian') {
            progress = Math.exp(-Math.pow(distance / (radius * 0.45), 2));
          }

          const currentWeight = Math.round(fromWeight + (toWeight - fromWeight) * progress);
          span.style.fontWeight = `${currentWeight}`;
          span.style.fontVariationSettings = `'wght' ${currentWeight}`;

          if (progress > 0.5) {
            span.style.color = activeColor;
          } else if (progress > 0.2) {
            span.style.color = '#FFFFFF';
          } else if (baseColor) {
            span.style.color = baseColor;
          } else {
            span.style.color = '';
          }
        } else {
          span.style.fontWeight = `${fromWeight}`;
          span.style.fontVariationSettings = `'wght' ${fromWeight}`;
          if (baseColor) {
            span.style.color = baseColor;
          } else {
            span.style.color = '';
          }
        }
      });
    };

    const targetEl = containerRef?.current || window;
    targetEl.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    targetEl.addEventListener('mouseleave', handleMouseLeave as EventListener, { passive: true });

    return () => {
      targetEl.removeEventListener('mousemove', handleMouseMove as EventListener);
      targetEl.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [containerRef, fromWeight, toWeight, radius, falloff, baseColor, activeColor]);

  // Index accumulator for flat charRefs
  let charIndexCounter = 0;

  return (
    <span
      ref={rootRef}
      className={`variable-proximity-root ${className}`}
      style={style}
      aria-label={label}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="variable-proximity-word">
          {word.split('').map((char, cIdx) => {
            const currentIndex = charIndexCounter++;
            return (
              <span
                key={cIdx}
                ref={el => {
                  charRefs.current[currentIndex] = el;
                }}
                className="variable-proximity-char"
                style={{
                  fontWeight: fromWeight,
                  fontVariationSettings: `'wght' ${fromWeight}`,
                  color: baseColor
                }}
                aria-hidden="true"
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default VariableProximity;
