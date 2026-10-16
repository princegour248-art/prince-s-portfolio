import React from 'react';
import { BookOpen, Cpu, Layers, Sparkles } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const About: React.FC = () => {
  const { about } = PORTFOLIO_CONFIG.personal;

  const corePillars = [
    {
      icon: Cpu,
      title: "AI Integration & Pragmatism",
      description: "Hands-on experience connecting LLMs and Generative AI pipelines into real web workflows, focusing on privacy, latency, and reliable user outcomes."
    },
    {
      icon: Layers,
      title: "Clean Full-Stack Architecture",
      description: "Writing maintainable backend APIs in Python (FastAPI) and structured frontend interfaces, ensuring separation of concerns and robust data contracts."
    },
    {
      icon: Sparkles,
      title: "Intuitive UI/UX & Accessibility",
      description: "Prioritizing high-contrast typography, distraction-free spatial layouts, and keyboard-first accessibility across desktop and mobile devices."
    },
    {
      icon: BookOpen,
      title: "Continuous Learning & BCA Path",
      description: "Applying foundational computer science theory (data structures, algorithms, databases) directly into functional, production-oriented software projects."
    }
  ];

  return (
    <section id="about" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '48px' }}>
          <span className="section-tag">01 &bull; Background & Vision</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            An authentic perspective on my learning trajectory, problem-solving philosophy, and technical focus as an aspiring software engineer.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }} className="about-grid">
          {/* Left Column: Narrative Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {about.paragraphs.map((p, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: '15.5px',
                  lineHeight: 1.75,
                  color: idx === 0 ? '#F5F2ED' : '#A6A6A6'
                }}
              >
                {p}
              </p>
            ))}

            {/* Quick Facts Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginTop: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #282828'
              }}
              className="quick-facts-grid"
            >
              {about.highlights.map((h, i) => (
                <div key={i} style={{ backgroundColor: '#1A1A1A', padding: '16px', borderRadius: '10px', border: '1px solid #303030' }}>
                  <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#E87524', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>
                    {h.label}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5F2ED' }}>
                    {h.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Core Engineering Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F5F2ED', marginBottom: '4px' }}>
              Core Engineering Focus
            </h3>
            {corePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px',
                    backgroundColor: '#161616',
                    alignItems: 'flex-start'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(232, 117, 36, 0.1)',
                      border: '1px solid rgba(232, 117, 36, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} color="#E87524" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#F5F2ED', marginBottom: '6px' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#A6A6A6', lineHeight: 1.55 }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 540px) {
          .quick-facts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
