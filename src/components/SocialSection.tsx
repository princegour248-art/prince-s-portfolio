import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Globe,
  Copy,
  Check,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import './SocialSection.css';

export const SocialSection: React.FC = () => {
  const { personal } = PORTFOLIO_CONFIG;
  const { contact } = personal;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fade-and-rise entrance animation
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
      handle: 'in/princegour',
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
      id: 'portfolio',
      name: 'Digital Portfolio',
      handle: 'princegour248-art.github.io/portfolio',
      url: personal.meta.canonicalUrl,
      badge: 'Live Showcase',
      icon: Globe,
      description:
        'Official interactive developer portfolio featuring simulated terminals, 3D career archives, verified certifications, ATS resume, and scannable QR credentials.',
      primaryActionText: 'View Live Site',
      copyValue: personal.meta.canonicalUrl,
      copyLabel: 'Share Link'
    }
  ];

  return (
    <section id="social" className="section social-section">
      <div className="container">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`social-header-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">08 &bull; Digital Presence &amp; Network</span>
          </div>
          <h2 className="section-title">Connect Across Platforms.</h2>
          <p className="section-subtitle">
            Follow my technical journey, explore source repositories, or connect for professional collaborations.
          </p>
        </div>

        {/* 2x2 Platform Cards Grid */}
        <div className="social-platforms-grid">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isCopied = copiedKey === platform.id;

            return (
              <div key={platform.id} className="social-platform-card">
                {/* Top Identity Block */}
                <div>
                  <div className="social-card-header">
                    <div className="social-card-identity">
                      <div className="social-platform-icon-box">
                        <Icon size={22} />
                      </div>
                      <div className="social-card-titles">
                        <h3 className="social-platform-name">{platform.name}</h3>
                        <span className="social-platform-handle">{platform.handle}</span>
                      </div>
                    </div>

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
