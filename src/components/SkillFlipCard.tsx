import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { SkillCategoryItem } from '../data/skillsSectionData';

interface SkillFlipCardProps {
  category: SkillCategoryItem;
}

export const SkillFlipCard: React.FC<SkillFlipCardProps> = ({ category }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  const Icon = category.icon;

  return (
    <div
      className="skill-flip-container"
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Skill card for ${category.title}`}
      aria-pressed={isFlipped}
    >
      <div className={`skill-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* FRONT FACE */}
        <div className="skill-flip-face skill-flip-front">
          {/* Header Badge */}
          <div className="skill-card-badge">
            <span className="skill-card-badge-dot" />
            <span>{category.badge}</span>
          </div>

          {/* Center Category Showcase */}
          <div className="skill-card-center-content">
            <div className="skill-card-icon-halo">
              <Icon size={42} strokeWidth={2} />
            </div>

            <h3 className="skill-card-title">{category.title}</h3>
            <p className="skill-card-subtitle">{category.folderTitle}</p>
          </div>

          <div style={{ height: '12px' }} />
        </div>

        {/* BACK FACE */}
        <div className="skill-flip-face skill-flip-back">
          {/* Header Badge */}
          <div className="skill-card-badge" style={{ borderColor: 'rgba(255, 106, 0, 0.4)' }}>
            <Sparkles size={12} color="#FF6A00" />
            <span>Category Overview</span>
          </div>

          {/* Overview Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Icon size={22} color="#FF6A00" />
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                {category.title}
              </h4>
            </div>

            <p className="skill-card-back-desc">
              {category.description}
            </p>
          </div>

          <div style={{ height: '12px' }} />
        </div>
      </div>
    </div>
  );
};
