import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_CONFIG, type ExperienceItem } from '../data/portfolioData';

export const Experience: React.FC = () => {
  const { experience } = PORTFOLIO_CONFIG;

  return (
    <section id="experience" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">06 &bull; Industry & Training</span>
          <h2 className="section-title">Internship Experience</h2>
          <p className="section-subtitle">
            Practical internship exposure and hands-on technical project engagements.
          </p>
        </div>

        {/* Experience Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {experience.map((item: ExperienceItem, idx: number) => (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#161616',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '3px solid #E87524'
              }}
            >
              <div>
                {/* Header with Role and Company */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F2ED', marginBottom: '4px' }}>
                      {item.role}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#E87524', fontWeight: 600 }}>
                      {item.company}
                    </p>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#1E1E1E',
                      border: '1px solid #303030',
                      color: '#A6A6A6',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                <p style={{ fontSize: '13.5px', color: '#A6A6A6', lineHeight: 1.6, marginBottom: '20px' }}>
                  {item.description}
                </p>

                {/* Key Responsibilities */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#737373', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Key Contributions
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#D4D4D8' }}>
                        <CheckCircle2 size={14} color="#E87524" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies */}
              <div style={{ borderTop: '1px solid #242424', paddingTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #2E2E2E',
                      color: '#888888'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
