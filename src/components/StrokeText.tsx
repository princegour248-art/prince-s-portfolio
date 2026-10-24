import React from 'react';
import './StrokeText.css';

export interface StrokeTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  accentText?: string;
  onClick?: () => void;
  title?: string;
}

export const StrokeText: React.FC<StrokeTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  style,
  accentText,
  onClick,
  title
}) => {
  if (accentText && text.includes(accentText)) {
    const parts = text.split(accentText);
    return (
      <Component
        className={`stroke-text ${className}`.trim()}
        data-text={text}
        style={style}
        onClick={onClick}
        title={title}
      >
        <span>{parts[0]}</span>
        <span className="stroke-text-accent" data-text={accentText}>
          {accentText}
        </span>
        <span>{parts.slice(1).join(accentText)}</span>
      </Component>
    );
  }

  return (
    <Component
      className={`stroke-text ${className}`.trim()}
      data-text={text}
      style={style}
      onClick={onClick}
      title={title}
    >
      {text}
    </Component>
  );
};

export default StrokeText;
