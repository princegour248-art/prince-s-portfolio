import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Hash,
  FileText,
  Download,
  ExternalLink,
  Eye,
  X,
  ShieldCheck,
  Clock,
  Folder,
  FolderOpen,
  Palette,
  Code2
} from 'lucide-react';
import { PORTFOLIO_CONFIG, type ExperienceItem } from '../data/portfolioData';
import './Experience.css';

interface FolderConfig {
  id: string;
  tabLabel: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  accentColor: string;
}

const FOLDER_CONFIGS: Record<string, FolderConfig> = {
  'codealpha-uiux': {
    id: 'codealpha-uiux',
    tabLabel: '01 / UI/UX DESIGN',
    icon: Palette,
    accentColor: '#FF6A00'
  },
  'cognifyz-webdev': {
    id: 'cognifyz-webdev',
    tabLabel: '02 / WEB DEVELOPMENT',
    icon: Code2,
    accentColor: '#FF8C42'
  }
};

export const Experience: React.FC = () => {
  const { experience } = PORTFOLIO_CONFIG;

  // Track open state for both folders (Folder 01 open by default for immediate discoverability)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'codealpha-uiux': true,
    'cognifyz-webdev': false
  });

  const [viewerDoc, setViewerDoc] = useState<ExperienceItem | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);

  // IntersectionObserver for smooth fade-and-rise header reveal
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

  // Toggle folder open / closed
  const toggleFolder = useCallback((folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  }, []);

  // Open modal viewer
  const handleOpenViewer = useCallback((item: ExperienceItem) => {
    setViewerDoc(item);
  }, []);

  // Close modal viewer
  const handleCloseViewer = useCallback(() => {
    setViewerDoc(null);
  }, []);

  // Manage body scroll and Escape key for modal
  useEffect(() => {
    if (!viewerDoc) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseViewer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewerDoc, handleCloseViewer]);

  // Order items matching Folder 01: UI/UX, Folder 02: Web Development
  const orderedExperience = [...experience].sort((a, b) => {
    if (a.id === 'codealpha-uiux') return -1;
    if (b.id === 'codealpha-uiux') return 1;
    return 0;
  });

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        {/* Section Introduction */}
        <div
          ref={headerRef}
          className={`experience-header-reveal ${headerVisible ? 'is-visible' : ''}`}
          style={{ marginBottom: '40px' }}
        >
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">INTERNSHIP / CAREER ARCHIVE</span>
          </div>
          <h2 className="section-title">Explore My Experience.</h2>
          <p className="section-subtitle">
            A collection of my internship records and professional credentials.
          </p>
        </div>

        {/* React Bits Interactive Career Folders Grid */}
        <div className="career-folders-grid">
          {orderedExperience.map((item: ExperienceItem) => {
            const folderId = item.id || '';
            const isOpen = !!openFolders[folderId];
            const config = FOLDER_CONFIGS[folderId] || {
              id: folderId,
              tabLabel: 'ARCHIVE FOLDER',
              icon: FileText,
              accentColor: '#FF6A00'
            };
            const Icon = config.icon;

            return (
              <div
                key={folderId}
                className={`career-folder-wrapper ${isOpen ? 'is-open' : 'is-closed'}`}
              >
                {/* 3D Physical Folder Container */}
                <div
                  className="career-folder-body"
                  onClick={() => toggleFolder(folderId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFolder(folderId);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-label={`${config.tabLabel} folder for ${item.company}`}
                >
                  {/* Top Folder Tab */}
                  <div className="career-folder-tab">
                    <span className="career-folder-tab-stripe" />
                    <span className="career-folder-tab-title">{config.tabLabel}</span>
                  </div>

                  {/* Folder Back Plate */}
                  <div className="career-folder-backplate">
                    {/* Interior Pocket Slot */}
                    <div className="career-folder-pocket-interior">
                      <span className="career-folder-pocket-glow" />
                    </div>
                  </div>

                  {/* Animated Document Sheet (Slides up from inside pocket when open) */}
                  <div className="career-folder-paper-sheet">
                    <div className="career-folder-paper-header">
                      <span className="career-folder-paper-ref">
                        <FileText size={11} color="#FF6A00" />
                        {item.refId || 'OFFICIAL SELECTION RECORD'}
                      </span>
                      <span className="career-folder-paper-badge">
                        {item.documentStatus || 'Offer Letter (Verified)'}
                      </span>
                    </div>

                    <p className="career-folder-paper-preview-text">
                      {item.description}
                    </p>

                    <div className="career-folder-paper-footer">
                      <span>{item.date || 'Verified Record'}</span>
                      <span style={{ color: '#FF8C42' }}>&bull; {item.location}</span>
                    </div>
                  </div>

                  {/* 3D Front Flap (Rotates forward on click) */}
                  <div className="career-folder-frontflap">
                    <div className="career-folder-frontflap-header">
                      <div className="career-folder-icon-box">
                        <Icon size={20} />
                      </div>
                      <div className="career-folder-frontflap-title-block">
                        <span className="career-folder-company-name">{item.company}</span>
                        <span className="career-folder-role-title">{item.role}</span>
                      </div>
                    </div>

                    <div className="career-folder-frontflap-bottom">
                      <span className="career-folder-cue-text">
                        {isOpen ? (
                          <>
                            <FolderOpen size={14} color="#FF6A00" />
                            <span>Folder Opened &mdash; Click to Close</span>
                          </>
                        ) : (
                          <>
                            <Folder size={14} color="#A1A1AA" />
                            <span>Click to Open Archive</span>
                          </>
                        )}
                      </span>
                      <span className="career-folder-status-indicator">
                        {item.type || 'Offer Letter'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revealed Archive Dossier Panel (Unfolds smoothly beneath folder when open) */}
                {isOpen && (
                  <div className="career-archive-drawer">
                    {/* Verified Metadata Grid */}
                    <div className="archive-meta-grid">
                      {item.date && (
                        <div className="archive-meta-item">
                          <Calendar size={13} color="#FF8C42" />
                          <span>Date: <strong>{item.date}</strong></span>
                        </div>
                      )}
                      {item.duration && (
                        <div className="archive-meta-item">
                          <Clock size={13} color="#FF6A00" />
                          <span>Duration: <strong>{item.duration}</strong></span>
                        </div>
                      )}
                      {item.refId && (
                        <div className="archive-meta-item">
                          <Hash size={13} color="#FF6A00" />
                          <span>Ref: <strong>{item.refId}</strong></span>
                        </div>
                      )}
                      {item.location && (
                        <div className="archive-meta-item">
                          <MapPin size={13} color="#71717A" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="archive-description">{item.description}</p>

                    {/* Scope & Deliverables */}
                    {item.responsibilities && item.responsibilities.length > 0 && (
                      <div className="archive-scope-block">
                        <span className="archive-scope-heading">Scope &amp; Deliverables</span>
                        <ul className="archive-scope-list">
                          {item.responsibilities.map((resp: string, rIdx: number) => (
                            <li key={rIdx} className="archive-scope-item">
                              <CheckCircle2 size={14} color="#FF6A00" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technical Domains */}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="archive-scope-block">
                        <span className="archive-scope-heading">Focus Areas &amp; Tools</span>
                        <div className="archive-tech-row">
                          {item.technologies.map((tech: string, tIdx: number) => (
                            <span key={tIdx} className="archive-tech-pill">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Official Document Card & Action Buttons */}
                    <div className="archive-document-card">
                      {item.offerLetterImage ? (
                        <div
                          className="archive-document-preview-trigger"
                          onClick={() => handleOpenViewer(item)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleOpenViewer(item);
                            }
                          }}
                          aria-label={`Inspect ${item.company} official document`}
                        >
                          <img
                            src={item.offerLetterImage}
                            alt={`${item.company} Offer Letter Document`}
                            className="archive-doc-thumb"
                            loading="lazy"
                          />
                          <div className="archive-doc-overlay">
                            <span className="archive-doc-overlay-tag">
                              <Eye size={14} color="#FF6A00" />
                              Click to Inspect Full Document
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '24px',
                            textAlign: 'center',
                            backgroundColor: '#070707',
                            borderRadius: '8px',
                            border: '1px dashed #2A2A2A',
                            color: '#71717A',
                            fontSize: '12.5px'
                          }}
                        >
                          Document not available
                        </div>
                      )}

                      <div className="archive-action-buttons">
                        <button
                          type="button"
                          className="archive-btn archive-btn-primary"
                          onClick={() => handleOpenViewer(item)}
                          disabled={!item.offerLetterImage}
                        >
                          <Eye size={14} />
                          <span>View Document</span>
                        </button>

                        {item.offerLetterPdf ? (
                          <a
                            href={item.offerLetterPdf}
                            download
                            className="archive-btn archive-btn-outline"
                            title="Download official PDF document"
                          >
                            <Download size={14} color="#FF6A00" />
                            <span>Download PDF</span>
                          </a>
                        ) : item.offerLetterImage ? (
                          <a
                            href={item.offerLetterImage}
                            download
                            className="archive-btn archive-btn-outline"
                            title="Download document image"
                          >
                            <Download size={14} color="#FF6A00" />
                            <span>Download Document</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Full High-Res Document Viewer Modal */}
      {viewerDoc && (
        <div
          className="document-modal-backdrop"
          onClick={handleCloseViewer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-modal-title"
        >
          <div
            className="document-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="document-modal-header">
              <div className="document-modal-title-box">
                <h3 id="document-modal-title" className="document-modal-title">
                  {viewerDoc.company} &mdash; {viewerDoc.role}
                </h3>
                <div className="document-modal-subtitle">
                  <ShieldCheck size={12} color="#FF6A00" />
                  <span>{viewerDoc.type || 'Official Offer Letter'}</span>
                  {viewerDoc.refId && <span>&bull; {viewerDoc.refId}</span>}
                </div>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                className="document-modal-close-btn"
                onClick={handleCloseViewer}
                aria-label="Close document viewer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Document Preview */}
            <div className="document-modal-body">
              {viewerDoc.offerLetterImage && (
                <img
                  src={viewerDoc.offerLetterImage}
                  alt={`${viewerDoc.company} Official Document`}
                  className="document-modal-image"
                />
              )}
            </div>

            {/* Modal Footer / Action Toolbar */}
            <div className="document-modal-footer">
              <div className="document-modal-footer-left">
                <FileText size={13} color="#FF6A00" />
                <span>Verified Official Document</span>
              </div>

              <div className="document-modal-footer-actions">
                {viewerDoc.offerLetterPdf && (
                  <a
                    href={viewerDoc.offerLetterPdf}
                    download
                    className="archive-btn archive-btn-outline"
                    style={{ fontSize: '12px', padding: '7px 14px' }}
                  >
                    <Download size={13} color="#FF6A00" />
                    <span>Download PDF</span>
                  </a>
                )}

                {viewerDoc.offerLetterPdf && (
                  <a
                    href={viewerDoc.offerLetterPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archive-btn archive-btn-outline"
                    style={{ fontSize: '12px', padding: '7px 14px' }}
                  >
                    <ExternalLink size={13} color="#FF8C42" />
                    <span>Open in New Tab</span>
                  </a>
                )}

                <button
                  type="button"
                  className="archive-btn archive-btn-primary"
                  onClick={handleCloseViewer}
                  style={{ fontSize: '12px', padding: '7px 16px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;
