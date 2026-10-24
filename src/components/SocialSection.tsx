import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { StrokeText } from './StrokeText';
import './SocialSection.css';

export const SocialSection: React.FC = () => {
  const { personal } = PORTFOLIO_CONFIG;
  const { contact } = personal;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeRungs, setActiveRungs] = useState<boolean[]>([false, false, false, false]);
  const [railProgress, setRailProgress] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rungRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Entrance animation for header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ladder Scroll Intersection Observer: Activates rungs as user scrolls
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    rungRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveRungs((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Track ladder spine progress on scroll
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when container enters top half of viewport
      const start = windowHeight * 0.8;
      const end = -rect.height * 0.2;
      const total = start - end;
      const current = start - rect.top;

      let progress = (current / total) * 100;
      progress = Math.max(0, Math.min(100, progress));
      setRailProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observers.forEach((obs) => obs.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'in/prince-gour-468b17315',
      url: contact.linkedin,
      badge: 'Career Network',
      icon: LinkedinIcon,
      description:
        'Professional updates, engineering discussions, and career journey. Connect to explore internships, full-stack projects, and tech collaborations.',
      primaryActionText: 'Connect on LinkedIn',
      copyValue: contact.linkedin,
      copyLabel: 'Copy Link'
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: `@${contact.githubUsername}`,
      url: contact.github,
      badge: 'Open Source',
      icon: GithubIcon,
      description:
        'Public repositories, software experiments, and active codebase contributions including Master Sahab AI Student Assistant and full-stack systems.',
      primaryActionText: 'Explore GitHub Repos',
      copyValue: contact.github,
      copyLabel: 'Copy Link'
    },
    {
      id: 'email',
      name: 'Direct Email',
      handle: contact.email,
      url: `mailto:${contact.email}`,
      badge: 'Direct Inquiry',
      icon: Mail,
      description:
        'Direct communication channel for internship opportunities, project collaborations, software architecture feedback, and technical queries.',
      primaryActionText: 'Send an Email',
      copyValue: contact.email,
      copyLabel: 'Copy Email'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: `@${(contact as { instagramUsername?: string }).instagramUsername || '_prince2005__'}`,
      url: (contact as { instagram?: string }).instagram || 'https://www.instagram.com/_prince2005__/',
      badge: 'Visual Updates',
      icon: InstagramIcon,
      description:
        'Personal updates, developer lifestyle, tech snapshots, behind-the-scenes engineering, and creative visual projects.',
      primaryActionText: 'Open Instagram',
      copyValue: (contact as { instagram?: string }).instagram || 'https://www.instagram.com/_prince2005__/',
      copyLabel: 'Copy Link'
    }
  ];

  const renderCard = (platform: typeof platforms[0], index: number) => {
    const Icon = platform.icon;
    const isCopied = copiedKey === platform.id;

    return (
      <div className="social-platform-card">
        {/* Top Identity Block */}
        <div>
          <div className="social-ladder-step-indicator">
            Step 0{index + 1} &bull; Ladder Rung
          </div>

          <div className="social-card-header">
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card-identity"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="social-platform-icon-box">
                <Icon size={22} />
              </div>
              <div className="social-card-titles">
                <h3 className="social-platform-name">{platform.name}</h3>
                <span className="social-platform-handle">{platform.handle}</span>
              </div>
            </a>

            <span className="social-badge-pill">{platform.badge}</span>
          </div>

          {/* Description */}
          <p className="social-card-description" style={{ marginTop: '16px' }}>
            {platform.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="social-card-actions">
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn social-btn-primary"
          >
            <span>{platform.primaryActionText}</span>
            <ArrowUpRight size={15} />
          </a>

          <button
            type="button"
            className="social-btn social-btn-secondary"
            onClick={() => handleCopy(platform.copyValue, platform.id)}
            title={isCopied ? 'Copied to clipboard' : `Copy ${platform.name}`}
            aria-label={`Copy ${platform.name} link`}
          >
            {isCopied ? (
              <>
                <Check size={14} color="#22C55E" />
                <span style={{ color: '#22C55E' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} color="#FF6A00" />
                <span>{platform.copyLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="social" className="section social-section">
      <div className="container">
        {/* Section Header with Stroke Text Effect */}
        <div
          ref={headerRef}
          className={`social-header-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">08 &bull; Digital Presence &amp; Network</span>
          </div>
          <h1 className="section-title stroke-heading">
            <StrokeText text="Connect Across Platforms." />
          </h1>
          <p className="section-subtitle">
            Follow my technical journey, explore source repositories, or connect for professional collaborations.
          </p>
        </div>

        {/* Futuristic Ladder Scroll Animation Track */}
        <div ref={containerRef} className="social-ladder-container">
          {/* Vertical Ladder Spine & Progress Indicator */}
          <div className="social-ladder-spine">
            <div
              className="social-ladder-progress-rail"
              style={{ height: `${railProgress}%` }}
            />
          </div>
          <div className="social-ladder-cap social-ladder-cap-top" />
          <div className="social-ladder-cap social-ladder-cap-bottom" />

          {/* Ladder Rungs Sequence */}
          {platforms.map((platform, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = activeRungs[idx];

            return (
              <div
                key={platform.id}
                ref={(el) => {
                  rungRefs.current[idx] = el;
                }}
                className={`social-ladder-rung ${isLeft ? 'social-ladder-rung-left' : 'social-ladder-rung-right'} ${
                  isActive ? 'is-active' : ''
                }`}
              >
                {/* Left Column */}
                {isLeft ? (
                  <div className="social-ladder-card-wrapper">
                    {renderCard(platform, idx)}
                  </div>
                ) : (
                  <div className="social-ladder-empty" aria-hidden="true" />
                )}

                {/* Center Column: Ladder Node & Branching Beam */}
                <div className="social-ladder-center">
                  <div
                    className={`social-ladder-beam ${
                      isLeft ? 'social-ladder-beam-left' : 'social-ladder-beam-right'
                    }`}
                  />
                  <div className="social-ladder-node">
                    <span className="social-ladder-node-number">0{idx + 1}</span>
                    <span className="social-ladder-node-dot" />
                  </div>
                </div>

                {/* Right Column */}
                {!isLeft ? (
                  <div className="social-ladder-card-wrapper">
                    {renderCard(platform, idx)}
                  </div>
                ) : (
                  <div className="social-ladder-empty" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* Live Availability & Response Time Banner */}
        <div className="social-status-banner">
          <div className="social-status-item">
            <span className="social-status-pulse-dot" />
            <span>
              Status: <strong>Open to Internships &amp; Collaborations</strong>
            </span>
          </div>

          <div className="social-status-item">
            <Clock size={14} color="#FF8C42" />
            <span>
              Response Time: <strong>Within 24 Hours</strong>
            </span>
          </div>

          <div className="social-status-item">
            <MapPin size={14} color="#71717A" />
            <span>
              Location: <strong>India (IST / UTC+5:30)</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
