import React from 'react';
import { ArrowUp, Mail, QrCode } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const { personal } = PORTFOLIO_CONFIG;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid #222222',
        backgroundColor: '#0D0D0D',
        paddingTop: '48px',
        paddingBottom: '48px',
        color: '#A6A6A6',
        fontSize: '13px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            paddingBottom: '32px',
            borderBottom: '1px solid #1C1C1C'
          }}
        >
          {/* Brand info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #303030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                color: '#E87524'
              }}
            >
              PG
            </div>
            <div>
              <span style={{ fontWeight: 700, color: '#F5F2ED', display: 'block' }}>
                {personal.name}
              </span>
              <span style={{ fontSize: '11.5px', color: '#737373' }}>
                {personal.headline}
              </span>
            </div>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href={personal.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A6A6A6', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="GitHub"
            >
              <GithubIcon size={16} /> <span>GitHub</span>
            </a>
            <a
              href={personal.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#A6A6A6', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="LinkedIn"
            >
              <LinkedinIcon size={16} /> <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${personal.contact.email}`}
              style={{ color: '#A6A6A6', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Email"
            >
              <Mail size={16} /> <span>Email</span>
            </a>
            <a
              href="#qrcode"
              style={{ color: '#E87524', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
              title="Portfolio QR Code"
            >
              <QrCode size={16} /> <span>QR Code</span>
            </a>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '999px' }}
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>

        {/* Bottom copyright notice */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '24px',
            fontSize: '12px',
            color: '#666666'
          }}
        >
          <span>&copy; {new Date().getFullYear()} Prince Gour. Handcrafted developer portfolio & resume.</span>
          <span>Designed with Orange & Black Minimal Architecture &bull; No AI-Slop</span>
        </div>
      </div>
    </footer>
  );
};
