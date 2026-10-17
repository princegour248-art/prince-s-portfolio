import React from 'react';
import { ArrowRight, FileDown, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { Lanyard } from './Lanyard';
import { TechText } from './TechText';

export const Hero: React.FC = () => {
  const { personal } = PORTFOLIO_CONFIG;

  return (
    <section
      id="hero"
      style={{
        paddingTop: 'clamp(95px, 12vw, 150px)',
        paddingBottom: 'clamp(50px, 8vw, 90px)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderBottom: '1px solid #222222'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(360px, 440px)', gap: '48px', alignItems: 'center' }} className="hero-grid">
          {/* Left Column: Headlines & Bio */}
          <div>
            {/* Status Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#1A1A1A', border: '1px solid #303030', marginBottom: '24px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E87524', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#A6A6A6' }}>
                BCA Student &bull; Open for Internships &bull; 2026/2027
              </span>
            </div>

            {/* Name with TechText interactive React Bits component */}
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                height: 'clamp(62px, 8.5vw, 92px)',
                position: 'relative',
                marginBottom: '16px'
              }}
            >
              <h1
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0
                }}
              >
                {personal.name}
              </h1>
              <TechText
                text={personal.name}
                fontWeight={800}
                fontSize={84}
                letterSpacing={-0.035}
                color="#F5F2ED"
                accentColor="#E87524"
                align="left"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="type"
                introDuration={1.8}
                clickKick
                guides={false}
              />
            </div>

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
            <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
          </div>

          {/* Right Column: Interactive 3D Developer Lanyard Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Lanyard />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .hero-actions {
            gap: 10px !important;
          }
          .hero-actions .btn-lg {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
