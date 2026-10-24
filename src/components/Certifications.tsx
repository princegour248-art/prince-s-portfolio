import React from 'react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { FlexCarousel } from './FlexCarousel';
import { StrokeText } from './StrokeText';

export const Certifications: React.FC = () => {
  const { certifications } = PORTFOLIO_CONFIG;

  return (
    <section
      id="certifications"
      className="section"
      style={{
        borderBottom: '1px solid #222222',
        backgroundColor: '#0B0B0B',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header with Stroke Text Effect */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">05 &bull; Continuous Learning</span>
          </div>
          <h1 className="section-title stroke-heading">
            <StrokeText text="Certifications & Credentials" accentText="&" />
          </h1>
          <p className="section-subtitle">
            Interactive Flex Carousel featuring verified credentials in Artificial Intelligence, Machine Learning, and UI/UX Design.
          </p>
        </div>

        {/* React Bits Flex Carousel */}
        <FlexCarousel items={certifications} autoplay={false} />
      </div>
    </section>
  );
};

export default Certifications;
