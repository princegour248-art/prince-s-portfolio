import React from 'react';
import { EducationTerminal } from './EducationTerminal';
import { AsciiText } from './AsciiText';

export const Education: React.FC = () => {
  return (
    <section
      id="education"
      className="section"
      style={{
        borderBottom: '1px solid #222222',
        backgroundColor: '#0B0B0B',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header with React Bits ASCII Text Effect */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">EDUCATION / INTERACTIVE TERMINAL</span>
          </div>
          <div style={{ margin: '8px 0 12px 0' }}>
            <AsciiText text="EDUCATION" />
          </div>
          <p className="section-subtitle">
            Explore my academic background through a simulated developer terminal.
          </p>
        </div>

        {/* Interactive Simulated Education Terminal Component */}
        <EducationTerminal />
      </div>
    </section>
  );
};

export default Education;
