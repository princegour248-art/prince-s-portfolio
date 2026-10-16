import React from 'react';
import { Code2, Layout, Server, BrainCircuit, Database, Wrench, Palette } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const { skills } = PORTFOLIO_CONFIG;

  const categoryIcons: Record<string, React.ElementType> = {
    "Programming Languages": Code2,
    "Frontend Engineering": Layout,
    "Backend & APIs": Server,
    "AI & Machine Learning": BrainCircuit,
    "Databases & Cloud": Database,
    "Tools & Workflow": Wrench,
    "Design & Prototyping": Palette
  };

  return (
    <section id="skills" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '48px' }}>
          <span className="section-tag">02 &bull; Capabilities</span>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">
            Core technologies, programming languages, and engineering tools I utilize to construct software systems. Structured transparently without arbitrary percentage bars.
          </p>
        </div>

        {/* Skills Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}
          className="skills-grid"
        >
          {skills.map((cat, idx) => {
            const Icon = categoryIcons[cat.title] || Code2;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#161616',
                  padding: '24px'
                }}
              >
                <div>
                  {/* Category Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#1F1F1F',
                        border: '1px solid #303030',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#E87524'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F5F2ED' }}>
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#A6A6A6', marginBottom: '18px', lineHeight: 1.5 }}>
                    {cat.description}
                  </p>

                  {/* Skills Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 500,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#1E1E1E',
                          border: '1px solid #303030',
                          color: '#F5F2ED',
                          transition: 'border-color 150ms ease'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
