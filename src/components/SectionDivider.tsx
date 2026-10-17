import React from 'react';
import './SectionDivider.css';

interface SectionDividerProps {
  className?: string;
  hasBadge?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  className = '',
  hasBadge = true
}) => {
  return (
    <div
      className={`section-divider-container ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="section-divider-line" />
      <div className="section-divider-beam" />
      {hasBadge && <div className="section-divider-badge" />}
    </div>
  );
};

export default SectionDivider;
