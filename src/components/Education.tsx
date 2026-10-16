import React from 'react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const Education: React.FC = () => {
  const { education } = PORTFOLIO_CONFIG;

  return (
    <section id="education" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">04 &bull; Academic Foundation</span>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            Formal coursework and foundational computer science studies supporting my practical software development.
          </p>
        </div>

        {/* Education Timeline Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {education.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#161616',
                padding: '32px',
                borderLeft: '4px solid #E87524'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <GraduationCap size={22} color="#E87524" />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F2ED' }}>
                      {item.degree}
                    </h3>
                  </div>
                  <p style={{ fontSize: '15px', color: '#A6A6A6' }}>
                    {item.field} &bull; <span style={{ color: '#D4D4D8' }}>{item.institution}</span>
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    backgroundColor: '#1E1E1E',
                    border: '1px solid #303030',
                    fontSize: '12px',
                    color: '#E87524',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <Calendar size={13} />
                  <span>{item.period}</span>
                </div>
              </div>

              {/* Coursework list */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #242424' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  <BookOpen size={14} color="#E87524" /> Relevant Coursework & Subjects
                </span>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      style={{
                        fontSize: '12.5px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #2E2E2E',
                        color: '#D4D4D8'
                      }}
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.highlights.map((h, hIdx) => (
                    <p key={hIdx} style={{ fontSize: '13px', color: '#888888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#E87524' }}>&rsaquo;</span> {h}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
