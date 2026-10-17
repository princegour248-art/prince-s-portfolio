import React from 'react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { FlexCarousel } from './FlexCarousel';

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
        {/* Section Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">05 &bull; Continuous Learning</span>
          </div>
          <h2 className="section-title">Certifications &amp; Credentials</h2>
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
