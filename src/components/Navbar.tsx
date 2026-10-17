import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { GooeyNav, type GooeyNavItem } from './GooeyNav';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { personal } = PORTFOLIO_CONFIG;

  // Track window scroll for glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Main navigation items for GooeyNav (arranged according to page slides order)
  const navLinks: GooeyNavItem[] = useMemo(() => [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Resume', href: '#resume' },
    { label: 'Contact', href: '#contact' },
  ], []);

  // Calculate matching active index for GooeyNav
  const activeIndex = useMemo(() => {
    const idx = navLinks.findIndex(l => l.href?.replace('#', '') === activeSection);
    return idx >= 0 ? idx : 0;
  }, [navLinks, activeSection]);

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(17, 17, 17, 0.94)' : 'rgba(17, 17, 17, 0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid #303030' : '1px solid rgba(48, 48, 48, 0.35)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '16px'
        }}
      >
        {/* Brand Monogram & Name */}
        <a
          href="#hero"
          className="nav-brand"
          aria-label="Prince Gour Portfolio - Return to Hero"
        >
          <div className="nav-logo-monogram">
            <span>PG</span>
          </div>
          <div className="nav-brand-text">
            <div className="nav-brand-name-row">
              <span className="nav-brand-name">{personal.name}</span>
              <span className="nav-brand-status-dot" title="Available for Opportunities" />
            </div>
            <span className="nav-brand-subtitle">Developer Portfolio</span>
          </div>
        </a>

        {/* Center: GooeyNav Component from React Bits */}
        <div className="desktop-gooey-nav-wrapper">
          <GooeyNav
            items={navLinks}
            activeIndex={activeIndex}
            theme="dark"
            color="#E87524"
            activeTextColor="#111111"
            colors={['#E87524', '#F28C38', '#FF6A00']}
            size="sm"
            frame={true}
            particleCount={14}
            spread={48}
            animationTime={550}
            timeVariance={250}
            gooeyness={0.5}
            wobble={0.45}
            hoverEffect={true}
          />
        </div>

        {/* Right Action Cluster */}
        <div className="nav-actions">
          {/* Quick Social Links (Desktop) */}
          <div className="nav-social-group">
            <a
              href={personal.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-link"
              title="GitHub Profile"
              aria-label="Prince Gour on GitHub"
            >
              <GithubIcon size={16} />
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-hamburger-btn"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="mobile-drawer"
        >
          <div className="container mobile-drawer-content">
            <nav aria-label="Mobile Navigation">
              <ul className="mobile-links-list">
                {navLinks.map((link, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-link-item ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={14} className="mobile-link-icon" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile Actions Drawer Footer */}
            <div className="mobile-drawer-footer">
              <a
                href={personal.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for Navbar */}
      <style>{`
        /* Brand */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
        }

        .nav-logo-monogram {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background-color: #1A1A1A;
          border: 1px solid #303030;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono, monospace);
          font-weight: 800;
          font-size: 14.5px;
          color: #E87524;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .nav-brand:hover .nav-logo-monogram {
          border-color: #E87524;
          transform: translateY(-1px);
        }

        .nav-brand-text {
          display: flex;
          flex-direction: column;
        }

        .nav-brand-name-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .nav-brand-name {
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.02em;
          color: #F5F2ED;
          line-height: 1.2;
        }

        .nav-brand-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #E87524;
          box-shadow: 0 0 6px rgba(232, 117, 36, 0.6);
          display: inline-block;
        }

        .nav-brand-subtitle {
          font-size: 11px;
          color: #A6A6A6;
          line-height: 1.1;
        }

        /* Center Desktop GooeyNav Container */
        .desktop-gooey-nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
        }

        /* Action Cluster */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .nav-social-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          color: #A6A6A6;
          background-color: transparent;
          border: 1px solid transparent;
          transition: all 0.18s ease;
        }

        .nav-icon-link:hover {
          color: #E87524;
          background-color: rgba(232, 117, 36, 0.08);
          border-color: rgba(232, 117, 36, 0.25);
          transform: translateY(-1px);
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background-color: #303030;
        }

        /* Resume Button */
        .nav-resume-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background-color: #E87524;
          color: #111111;
          font-weight: 600;
          font-size: 13.5px;
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #E87524;
          box-shadow: 0 2px 10px rgba(232, 117, 36, 0.2);
          transition: all 0.18s ease;
          text-decoration: none;
          white-space: nowrap;
        }

        .nav-resume-btn:hover {
          background-color: #F28C38;
          border-color: #F28C38;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(232, 117, 36, 0.3);
        }

        /* Mobile Hamburger */
        .nav-hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 6px;
          border: 1px solid #303030;
          background-color: #1A1A1A;
          color: #F5F2ED;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .nav-hamburger-btn:hover {
          border-color: #E87524;
          color: #E87524;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(17, 17, 17, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #303030;
          overflow-y: auto;
          animation: drawerSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes drawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-drawer-content {
          padding-top: 20px;
          padding-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-link-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #F5F2ED;
          background-color: #1A1A1A;
          border: 1px solid #282828;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .mobile-link-item:hover,
        .mobile-link-item.active {
          color: #E87524;
          border-color: rgba(232, 117, 36, 0.35);
          background-color: rgba(232, 117, 36, 0.08);
        }

        .mobile-link-icon {
          color: #A6A6A6;
        }

        .mobile-drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #282828;
        }

        .mobile-social-row {
          display: flex;
          gap: 10px;
        }

        /* Focus outlines */
        .nav-brand:focus-visible,
        .nav-icon-link:focus-visible,
        .nav-resume-btn:focus-visible,
        .nav-hamburger-btn:focus-visible,
        .mobile-link-item:focus-visible {
          outline: 2px solid #E87524;
          outline-offset: 3px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1040px) {
          .desktop-gooey-nav-wrapper {
            display: none !important;
          }
          .nav-social-group {
            display: none !important;
          }
          .nav-divider {
            display: none !important;
          }
          .nav-hamburger-btn {
            display: inline-flex !important;
          }
        }

        @media (max-width: 480px) {
          .nav-resume-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
