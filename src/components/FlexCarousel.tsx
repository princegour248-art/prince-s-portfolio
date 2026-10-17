import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Award,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  KeyRound
} from 'lucide-react';
import type { CertificationItem } from '../data/portfolioData';
import './FlexCarousel.css';

interface FlexCarouselProps {
  items: CertificationItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const FlexCarousel: React.FC<FlexCarouselProps> = ({
  items,
  autoplay = false,
  autoplayInterval = 5000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalItem, setModalItem] = useState<CertificationItem | null>(null);
  const isHoveredRef = useRef(false);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  // Autoplay support (pauses on hover)
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !modalItem) {
        setActiveIndex(prev => (prev + 1) % items.length);
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, items.length, modalItem]);

  // Keyboard navigation for carousel & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalItem) {
        if (e.key === 'Escape') {
          setModalItem(null);
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalItem, items.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalItem) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        modalCloseBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalItem]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % items.length);
  };

  return (
    <div
      className="flex-carousel-wrapper"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Desktop & Tablet Flex Card Row */}
      <div className="flex-carousel-container" role="region" aria-label="Certifications Flex Carousel">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id || index}
              className={`flex-carousel-card ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
              onMouseEnter={() => {
                setActiveIndex(index);
              }}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveIndex(index);
                }
              }}
              title={isActive ? undefined : `Click to view ${item.title}`}
            >
              {/* Background Ambient Layer */}
              <div
                className="flex-card-bg-layer"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : undefined,
                  backgroundColor: !item.image ? '#181818' : undefined
                }}
              />

              {/* Inactive Vertical Spine Column */}
              <div className="flex-card-collapsed-spine" aria-hidden={isActive}>
                <span className="flex-spine-index">0{index + 1}</span>
                <span className="flex-spine-title">{item.title}</span>
                <span className="flex-spine-issuer">{item.issuer}</span>
              </div>

              {/* Active Expanded Card Content */}
              <div className="flex-card-expanded-content" aria-hidden={!isActive}>
                {/* Top Metadata Row */}
                <div className="flex-card-topbar">
                  <div className="flex-card-badges">
                    <span className="flex-card-issuer-badge">{item.issuer}</span>
                    <span className="flex-card-status-badge">
                      <CheckCircle size={12} />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  {item.date && (
                    <div className="flex-card-date-tag">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>

                {/* Center: Certificate Image Preview Frame */}
                {item.image ? (
                  <div
                    className="flex-card-preview-frame"
                    onClick={e => {
                      e.stopPropagation();
                      setModalItem(item);
                    }}
                    title="Click to inspect full certificate"
                  >
                    <img
                      src={item.image}
                      alt={`${item.title} Certificate Issued by ${item.issuer}`}
                      className="flex-card-preview-img"
                      loading="lazy"
                    />
                    <div className="flex-card-preview-overlay">
                      <Maximize2 size={16} />
                      <span>Click to Enlarge</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex-card-preview-frame"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #181818 0%, #101010 100%)'
                    }}
                  >
                    <Award size={36} color="#FF6A00" />
                    <span style={{ fontSize: '13px', color: '#A1A1AA' }}>Verified Credential</span>
                  </div>
                )}

                {/* Bottom Details & Action */}
                <div className="flex-card-info-bottom">
                  <h3 className="flex-card-title">{item.title}</h3>

                  {/* Topic Badges */}
                  <div className="flex-card-topics">
                    {item.topics.slice(0, 4).map((topic, tIdx) => (
                      <span key={tIdx} className="flex-card-topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Actions & Credential ID */}
                  <div className="flex-card-actions">
                    <div className="flex-card-id-code">
                      {item.credentialId ? (
                        <span>
                          <KeyRound size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          ID: {item.credentialId}
                        </span>
                      ) : (
                        <span>
                          <ShieldCheck size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {item.type}
                        </span>
                      )}
                    </div>

                    {item.image && (
                      <button
                        type="button"
                        className="flex-card-zoom-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setModalItem(item);
                        }}
                      >
                        <Maximize2 size={13} />
                        <span>View Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation & Indicator Controls */}
      <div className="flex-carousel-controls">
        <button
          type="button"
          className="flex-carousel-nav-btn"
          onClick={handlePrev}
          aria-label="Previous Certificate"
          title="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-carousel-dots" role="tablist" aria-label="Certificate navigation dots">
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`flex-carousel-dot ${dotIdx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Go to certificate ${dotIdx + 1}`}
              aria-selected={dotIdx === activeIndex}
              role="tab"
            />
          ))}
        </div>

        <button
          type="button"
          className="flex-carousel-nav-btn"
          onClick={handleNext}
          aria-label="Next Certificate"
          title="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Lightbox Modal for Full Certificate Inspection */}
      {modalItem && modalItem.image && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-heading"
        >
          <div
            className="cert-modal-dialog"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="cert-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="#FF6A00" />
                <h3 id="cert-modal-heading" className="cert-modal-title">
                  {modalItem.title}
                </h3>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                className="cert-modal-close-btn"
                onClick={() => setModalItem(null)}
                aria-label="Close certificate modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="cert-modal-body">
              <img
                src={modalItem.image}
                alt={`${modalItem.title} issued by ${modalItem.issuer}`}
                className="cert-modal-full-img"
              />
            </div>

            {/* Modal Footer */}
            <div className="cert-modal-footer">
              <div style={{ fontSize: '13px', color: '#A1A1AA' }}>
                <span>Issuer: <strong style={{ color: '#F5F5F5' }}>{modalItem.issuer}</strong></span>
                {modalItem.credentialId && (
                  <span style={{ marginLeft: '14px' }}>
                    Code: <strong style={{ color: '#FF8C42' }}>{modalItem.credentialId}</strong>
                  </span>
                )}
                {modalItem.date && (
                  <span style={{ marginLeft: '14px' }}>
                    Date: <strong style={{ color: '#F5F5F5' }}>{modalItem.date}</strong>
                  </span>
                )}
              </div>

              <a
                href={modalItem.image}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <ExternalLink size={13} />
                <span>Open High-Res Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexCarousel;
