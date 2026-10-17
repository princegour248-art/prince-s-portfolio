import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { type SkillCategoryItem, getSkillIcon } from '../data/skillsSectionData';

interface SkillFolderProps {
  category: SkillCategoryItem;
}

export const SkillFolder: React.FC<SkillFolderProps> = ({ category }) => {
  // Folder starts closed by default: skills are tucked inside, NO dialog box
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(prev => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFolder();
    }
  };

  // Organic floating cloud positions when popped up
  const pillFloatConfigs = [
    { x: -48, y: -90, rotate: -6, anim: 'reactbits-float-a' },
    { x: 44, y: -98, rotate: 5, anim: 'reactbits-float-b' },
    { x: -40, y: -45, rotate: 3, anim: 'reactbits-float-c' },
    { x: 42, y: -50, rotate: -4, anim: 'reactbits-float-d' },
    { x: 0, y: -130, rotate: 1, anim: 'reactbits-float-a' }
  ];

  const Icon = category.icon;

  return (
    <div
      className={`reactbits-folder-float-wrapper ${isOpen ? 'folder-open' : 'folder-closed'}`}
      onClick={toggleFolder}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`${category.folderTitle} folder`}
    >
      {/* Zero-Gravity Floating Pills Cloud (Hidden inside by default, pops up on click!) */}
      <div className={`reactbits-folder-cloud-container ${isOpen ? 'cloud-popped' : 'cloud-tucked'}`}>
        {category.skills.map((skill, idx) => {
          const SkillIcon = getSkillIcon(skill);
          const config = pillFloatConfigs[idx % pillFloatConfigs.length];

          return (
            <div
              key={`${category.id}-${skill}`}
              className={`reactbits-folder-floating-pill ${isOpen ? config.anim : ''}`}
              style={{
                '--target-x': `${config.x}px`,
                '--target-y': `${config.y}px`,
                '--target-rotate': `${config.rotate}deg`,
                transitionDelay: `${idx * 0.05}s`
              } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SkillIcon size={14} className="reactbits-pill-icon" />
              <span className="reactbits-pill-text">{skill}</span>
            </div>
          );
        })}
      </div>

      {/* 3D Physical Folder Container */}
      <div className="reactbits-folder-body">
        {/* Top Folder Tab */}
        <div className="reactbits-folder-tab">
          <span className="reactbits-folder-tab-stripe" />
          <span className="reactbits-folder-tab-title">{category.folderTitle}</span>
        </div>

        {/* Folder Back Plate */}
        <div className="reactbits-folder-backplate">
          {/* Interior Pocket Slot */}
          <div className="reactbits-folder-pocket-interior">
            <span className="reactbits-folder-pocket-glow" />
          </div>
        </div>

        {/* 3D Front Flap (Tilts forward when open) */}
        <div className="reactbits-folder-frontflap">
          <div className="reactbits-folder-frontflap-cutout" />
          <div className="reactbits-folder-frontflap-content">
            <div className="reactbits-folder-header-row">
              <div className="reactbits-folder-icon-circle">
                <Icon size={18} />
              </div>
              <div>
                <div className="reactbits-folder-main-label">{category.folderTitle}</div>
                <div className="reactbits-folder-sub-label">{category.title}</div>
              </div>
            </div>

            <div style={{ height: '8px' }} />
          </div>
        </div>
      </div>

      {/* Status under folder */}
      <div className="reactbits-folder-counter-tag">
        <Sparkles size={11} color="#FF6A00" />
        <span>{category.skills.length} Technologies Collection</span>
      </div>
    </div>
  );
};
