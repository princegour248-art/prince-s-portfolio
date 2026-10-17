import React, { useState } from 'react';
import { SKILL_CATEGORIES, type SkillCategoryItem } from '../data/skillsSectionData';
import { SkillWheel } from './SkillWheel';
import { SkillFlipCard } from './SkillFlipCard';
import { SkillFolder } from './SkillFolder';
import { ParticleText } from './ParticleText';
import './Skills.css';

export const Skills: React.FC = () => {
  // Single source of truth for selected category across Wheel, Flip Card, and Folder
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryItem>(
    SKILL_CATEGORIES[0]
  );

  return (
    <section
      id="skills"
      className="section"
      style={{
        backgroundColor: '#0B0B0B',
        borderBottom: '1px solid #222222',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '36px', textAlign: 'left' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">02 &bull; Capabilities</span>
          </div>
          <div style={{ margin: '8px 0 12px 0' }}>
            <ParticleText text="SKILLS" fontSize={48} />
          </div>
          <p className="section-subtitle">
            Choose a category. Discover what I build.
          </p>
        </div>

        {/* Interactive Three-Part Layout */}
        <div className="skills-interactive-container">
          {/* LEFT: React Bits Option Wheel */}
          <div className="skills-column skills-column-left">
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: '#8E8E93',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Option Wheel
              </span>
            </div>
            <SkillWheel
              categories={SKILL_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* CENTER: 3D Flip Card */}
          <div className="skills-column skills-column-center">
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: '#8E8E93',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Interactive 3D Overview
              </span>
            </div>
            <SkillFlipCard key={selectedCategory.id} category={selectedCategory} />
          </div>

          {/* RIGHT: React Bits Folder Float */}
          <div className="skills-column skills-column-right">
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: '#8E8E93',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Folder Float
              </span>
            </div>
            <SkillFolder category={selectedCategory} />
          </div>
        </div>
      </div>
    </section>
  );
};
