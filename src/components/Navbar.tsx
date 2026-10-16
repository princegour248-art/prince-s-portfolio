import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Experience', href: '#experience' },
    { label: 'Resume', href: '#resume' },
    { label: 'GitHub', href: '#github' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(17, 17, 17, 0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid #303030' : '1px solid transparent',
        transition: 'all 200ms ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="Prince Gour Portfolio Home">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #303030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              color: '#E87524'
            }}
          >
            PG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', color: '#F5F2ED' }}>
              {PORTFOLIO_CONFIG.personal.name}
            </span>
            <span style={{ fontSize: '11px', color: '#A6A6A6', lineHeight: 1.1 }}>
              Developer Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '13.5px',
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  color: isActive ? '#E87524' : '#A6A6A6',
                  backgroundColor: isActive ? 'rgba(232, 117, 36, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(232, 117, 36, 0.25)' : '1px solid transparent',
                  transition: 'all 150ms ease'
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/prince-gour-resume.pdf"
            download="prince-gour-resume.pdf"
            className="btn btn-primary btn-sm"
          >
            <FileDown size={15} />
            <span>Resume</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #303030',
              backgroundColor: '#1A1A1A',
              color: '#F5F2ED'
            }}
            className="mobile-hamburger"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#141414',
            borderBottom: '1px solid #303030',
            padding: '16px 24px 24px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: activeSection === link.href.replace('#', '') ? '#E87524' : '#F5F2ED',
                  backgroundColor: activeSection === link.href.replace('#', '') ? 'rgba(232, 117, 36, 0.08)' : 'transparent',
                  border: '1px solid #282828'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
