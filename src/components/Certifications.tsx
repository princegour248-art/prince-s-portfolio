import React from 'react';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';
import { PORTFOLIO_CONFIG, type CertificationItem } from '../data/portfolioData';

export const Certifications: React.FC = () => {
  const { certifications } = PORTFOLIO_CONFIG;

  return (
    <section id="certifications" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">05 &bull; Continuous Learning</span>
          <h2 className="section-title">Certifications & Courses</h2>
          <p className="section-subtitle">
            Industry and academic courses completed across artificial intelligence, cybersecurity, big data, and software architecture.
          </p>
        </div>

        {/* Certifications Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
          className="certs-grid"
        >
          {certifications.map((cert: CertificationItem, idx: number) => (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#161616',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header with Issuer badge and type */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#E87524',
                      backgroundColor: 'rgba(232, 117, 36, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(232, 117, 36, 0.2)'
                    }}
                  >
                    {cert.issuer}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#16A34A',
                      fontWeight: 500
                    }}
                  >
                    <CheckCircle size={12} /> {cert.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F5F2ED', marginBottom: '12px', lineHeight: 1.35 }}>
                  {cert.title}
                </h3>

                {/* Topics / Skills Covered */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {cert.topics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '11.5px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #2C2C2C',
                        color: '#A6A6A6'
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #242424', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#737373', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Award size={13} color="#E87524" /> {cert.type}
                </span>

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '12px', color: '#E87524', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
                  >
                    Verify <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ fontSize: '11px', color: '#555555' }}>
                    Verified Curriculum
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .certs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
