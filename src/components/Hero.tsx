import React from 'react';
import { ArrowRight, FileDown, Mail, Code, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const Hero: React.FC = () => {
  const { personal } = PORTFOLIO_CONFIG;

  return (
    <section
      id="hero"
      style={{
        paddingTop: '150px',
        paddingBottom: '90px',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderBottom: '1px solid #222222'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '48px', alignItems: 'center' }} className="hero-grid">
          {/* Left Column: Headlines & Bio */}
          <div>
            {/* Status Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#1A1A1A', border: '1px solid #303030', marginBottom: '24px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E87524', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#A6A6A6' }}>
                BCA Student &bull; Open for Internships &bull; 2026/2027
              </span>
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: 'clamp(38px, 5.5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#F5F2ED',
                marginBottom: '16px'
              }}
            >
              {personal.name}
            </h1>

            {/* Professional Headline */}
            <h2
              style={{
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                fontWeight: 600,
                color: '#E87524',
                letterSpacing: '-0.015em',
                marginBottom: '20px'
              }}
            >
              {personal.headline}
            </h2>

            {/* Introduction paragraph */}
            <p
              style={{
                fontSize: 'clamp(15px, 1.3vw, 17px)',
                color: '#A6A6A6',
                lineHeight: 1.68,
                maxWidth: '640px',
                marginBottom: '36px'
              }}
            >
              {personal.tagline} Focused on crafting high-performance full-stack applications with Python and JavaScript, integrating resilient generative AI endpoints, and engineering privacy-conscious software.
            </p>

            {/* Action Buttons: 5 Required Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              {/* 1. Explore My Projects */}
              <a href="#projects" className="btn btn-primary btn-lg">
                <span>Explore My Projects</span>
                <ArrowRight size={16} />
              </a>

              {/* 2. Download Resume */}
              <a
                href="/prince-gour-resume.pdf"
                download="prince-gour-resume.pdf"
                className="btn btn-secondary btn-lg"
              >
                <FileDown size={16} />
                <span>Download Resume</span>
              </a>

              {/* 3. View GitHub */}
              <a
                href={personal.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                title="View GitHub Profile"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>

              {/* 4. Connect on LinkedIn */}
              <a
                href={personal.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                title="Connect on LinkedIn"
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>

              {/* 5. Contact Me */}
              <a href="#contact" className="btn btn-outline">
                <Mail size={16} />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #242424'
              }}
            >
              <div>
                <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#737373', letterSpacing: '0.06em' }}>Primary Stack</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5F2ED' }}>Python &bull; FastAPI &bull; JS</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#303030' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#737373', letterSpacing: '0.06em' }}>Flagship Project</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5F2ED' }}>Master Sahab (AI Study)</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#303030' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#737373', letterSpacing: '0.06em' }}>Certifications</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5F2ED' }}>Google Cloud, Samsung, Tata</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tasteful Profile Monogram Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '280px',
                height: '320px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #303030',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#A6A6A6' }}>
                  DEV PROFILE
                </span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E87524' }} />
              </div>

              {/* Geometric Monogram Portrait */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: 'auto 0' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    border: '2px solid #E87524',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    fontWeight: 800,
                    color: '#E87524',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  PG
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: '16px', color: '#F5F2ED' }}>
                    Prince Gour
                  </span>
                  <span style={{ fontSize: '12px', color: '#A6A6A6' }}>
                    Developer & AI Enthusiast
                  </span>
                </div>
              </div>

              {/* Status tags */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #282828', paddingTop: '14px' }}>
                <span style={{ fontSize: '11.5px', color: '#737373', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Terminal size={12} color="#E87524" /> Local & Cloud
                </span>
                <span style={{ fontSize: '11.5px', color: '#737373', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Code size={12} color="#E87524" /> Python/JS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
