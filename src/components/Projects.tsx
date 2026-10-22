import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  X,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu
} from 'lucide-react';
import { GithubIcon } from './icons';
import { PORTFOLIO_CONFIG, type Project } from '../data/portfolioData';
import { SplitFlapText } from './SplitFlapText';
import './Projects.css';

interface FeaturedProjectMeta {
  number: string;
  categoryLabel: string;
  statusLabel: string;
  isDev?: boolean;
  implementationDetails: string[];
}

const PROJECT_EXTENDED_META: Record<string, FeaturedProjectMeta> = {
  'master-sahab': {
    number: '01 / 03',
    categoryLabel: 'AI & Web Engineering',
    statusLabel: 'Live Repository',
    isDev: false,
    implementationDetails: [
      'Engineered high-performance backend endpoints using Python & FastAPI for multi-turn conversational reasoning.',
      'Designed zero-latency local-first client persistence with automatic LocalStorage synchronization.',
      'Integrated resilient fallback pipelines compatible with both local Ollama LLMs and cloud endpoints.',
      'Built interactive 3D flashcard flip physics and custom study routine algorithms.'
    ]
  },
  'college-complaint-portal': {
    number: '02 / 03',
    categoryLabel: 'Full-Stack Web System',
    statusLabel: 'Verified Project',
    isDev: false,
    implementationDetails: [
      'Implemented Role-Based Access Control (RBAC) tiers for students, department heads, and campus administrators.',
      'Constructed privacy-conscious submission pathways with cryptographic salt hashing to protect student identity.',
      'Architected state-machine ticket lifecycle handling submission, department routing, investigation, and resolution.'
    ]
  },
  'future-projects': {
    number: '03 / 03',
    categoryLabel: 'Autonomous Systems',
    statusLabel: 'In Development / Exploratory',
    isDev: true,
    implementationDetails: [
      'Researching lightweight multi-agent orchestration schemas and deterministic session state memory on disk.',
      'Prototyping modular plug-and-play tool invocation protocols for autonomous developer workflows.',
      'Focusing on zero-hallucination verification loops and automated test-driven progress commits.'
    ]
  }
};

export const Projects: React.FC = () => {
  const { projects } = PORTFOLIO_CONFIG;
  // Display exactly three verified/featured projects
  const featuredProjects = projects.slice(0, 3);

  // Selected project for the detailed popup modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and focus close button when modal opens
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Handle Escape key to close modal & restore focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        const lastId = selectedProject.id;
        setSelectedProject(null);
        setTimeout(() => {
          triggerButtonRefs.current[lastId]?.focus();
        }, 30);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    if (selectedProject) {
      const lastId = selectedProject.id;
      setSelectedProject(null);
      setTimeout(() => {
        triggerButtonRefs.current[lastId]?.focus();
      }, 30);
    }
  };

  // Dynamic Scroll Stack Depth & Scaling Effect
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const updateStack = () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < 2) {
        ticking = false;
        return;
      }

      const isMobile = window.innerWidth <= 640;
      const stickyTop = isMobile ? 75 : 88;
      const stepOffset = isMobile ? 16 : 28;

      cards.forEach((card, i) => {
        let accumulatedScale = 1;
        let accumulatedBrightness = 1;

        for (let j = i + 1; j < cards.length; j++) {
          const nextCard = cards[j];
          if (!nextCard) continue;

          const nextRect = nextCard.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();

          const targetSticky = stickyTop + j * stepOffset;
          const distance = nextRect.top - targetSticky;
          const transitionRange = Math.max(1, cardRect.height * 0.85);
          const progress = Math.max(0, Math.min(1, 1 - distance / transitionRange));

          accumulatedScale -= progress * 0.045;
          accumulatedBrightness -= progress * 0.14;
        }

        const finalScale = Math.max(0.86, accumulatedScale);
        const finalBrightness = Math.max(0.65, accumulatedBrightness);

        card.style.transform = `scale(${finalScale.toFixed(3)})`;
        card.style.transformOrigin = 'top center';
        card.style.filter = `brightness(${finalBrightness.toFixed(2)})`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateStack);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateStack();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [featuredProjects.length]);

  return (
    <section id="projects" className="section">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '14px' }}>
            <span className="section-tag">SELECTED WORK / 01—03</span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <SplitFlapText text="PROJECTS" />
          </div>
        </div>

        {/* React Bits Scroll Stack Sequence */}
        <div className="scroll-stack-container">
          {featuredProjects.map((project, idx) => {
            const meta = PROJECT_EXTENDED_META[project.id] || {
              number: `0${idx + 1} / 03`,
              categoryLabel: project.category,
              statusLabel: project.isPlaceholder ? 'In Development' : 'Verified Project',
              isDev: project.isPlaceholder,
              implementationDetails: []
            };

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="scroll-stack-card"
                style={{
                  '--stack-offset': `${idx * 28}px`,
                  '--stack-offset-mobile': `${idx * 16}px`,
                  '--stack-index': idx + 1
                } as React.CSSProperties}
              >
                {/* Top Metadata Bar */}
                <div className="scroll-stack-topbar">
                  <div className="scroll-stack-num-tag">
                    <span className="scroll-stack-number">{meta.number}</span>
                    <span className="scroll-stack-category">{meta.categoryLabel}</span>
                  </div>

                  <div className="scroll-stack-status">
                    <span className={`scroll-stack-status-dot ${meta.isDev ? 'dev' : ''}`} />
                    <span>{meta.statusLabel}</span>
                  </div>
                </div>

                {/* Card Main Body Grid */}
                <div className="scroll-stack-grid">
                  {/* Left Column: Project Information & Actions */}
                  <div className="scroll-stack-details">
                    <h3 className="scroll-stack-title">{project.title}</h3>
                    <p className="scroll-stack-tagline">{project.tagline}</p>
                    <p className="scroll-stack-desc">{project.description}</p>

                    {/* Tech Tags */}
                    <div className="scroll-stack-tags">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="scroll-stack-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="scroll-stack-actions">
                      <button
                        ref={(el) => {
                          triggerButtonRefs.current[project.id] = el;
                        }}
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(project)}
                        aria-label={`Explore details for ${project.title}`}
                      >
                        <Sparkles size={14} />
                        <span>Explore Project</span>
                      </button>

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          aria-label={`GitHub repository for ${project.title}`}
                        >
                          <GithubIcon size={15} />
                          <span>Repository</span>
                        </a>
                      ) : (
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#71717A',
                            fontFamily: 'var(--font-mono, monospace)',
                            padding: '6px 10px'
                          }}
                        >
                          Repository in development
                        </span>
                      )}

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          aria-label={`Live demo for ${project.title}`}
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Editorial Architecture Preview */}
                  <div className="scroll-stack-preview-panel">
                    <div className="scroll-preview-chrome">
                      <span className="scroll-preview-dot red" />
                      <span className="scroll-preview-dot yellow" />
                      <span className="scroll-preview-dot green" />
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#71717A',
                          fontFamily: 'var(--font-mono, monospace)',
                          marginLeft: '8px'
                        }}
                      >
                        {project.id}.arch.ts
                      </span>
                    </div>

                    <div className="scroll-preview-body">
                      <div className="scroll-preview-code-line accent">
                        // {project.title}
                      </div>
                      <div className="scroll-preview-code-line">
                        const coreArchitecture = &#123;
                      </div>
                      <div className="scroll-preview-code-line" style={{ paddingLeft: '16px' }}>
                        domain: &apos;{project.category}&apos;,
                      </div>
                      <div className="scroll-preview-code-line" style={{ paddingLeft: '16px' }}>
                        stack: [{project.tags.slice(0, 3).map(t => `'${t}'`).join(', ')}],
                      </div>
                      <div className="scroll-preview-code-line" style={{ paddingLeft: '16px' }}>
                        resilience: &apos;local-first / privacy&apos;
                      </div>
                      <div className="scroll-preview-code-line">
                        &#125;;
                      </div>
                    </div>

                    <div className="scroll-preview-badge-status">
                      <span>{meta.statusLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED PROJECT MODAL POPUP */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="project-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="project-modal-header">
              <div className="project-modal-title-box">
                <span className="project-modal-category">
                  {PROJECT_EXTENDED_META[selectedProject.id]?.categoryLabel || selectedProject.category}
                </span>
                <h3 id="project-modal-title" className="project-modal-title">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="project-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close project details modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="project-modal-body">
              {/* 1. Overview */}
              <div>
                <div className="project-modal-section-title">
                  <Terminal size={14} color="#FF6A00" />
                  <span>Project Overview</span>
                </div>
                <p className="project-modal-overview-text">
                  {selectedProject.description}
                </p>
              </div>

              {/* 2. Key Features */}
              <div>
                <div className="project-modal-section-title">
                  <ShieldCheck size={14} color="#FF6A00" />
                  <span>Key Verified Features</span>
                </div>
                <ul className="project-modal-features-list">
                  {selectedProject.features.map((feat, fIdx) => (
                    <li key={fIdx} className="project-modal-feature-item">
                      <CheckCircle2 size={16} className="project-modal-feature-bullet" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Tech Stack */}
              <div>
                <div className="project-modal-section-title">
                  <Code2 size={14} color="#FF6A00" />
                  <span>Verified Technology Stack</span>
                </div>
                <div className="project-modal-tags-grid">
                  {selectedProject.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="scroll-stack-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Implementation Details */}
              {PROJECT_EXTENDED_META[selectedProject.id]?.implementationDetails?.length > 0 && (
                <div>
                  <div className="project-modal-section-title">
                    <Layers size={14} color="#FF6A00" />
                    <span>Engineering & Architecture Details</span>
                  </div>
                  <ul className="project-modal-features-list">
                    {PROJECT_EXTENDED_META[selectedProject.id].implementationDetails.map((detail, dIdx) => (
                      <li key={dIdx} className="project-modal-feature-item">
                        <Cpu size={15} color="#FF8C42" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer Links */}
            <div className="project-modal-footer">
              <span className="project-modal-footer-hint">
                Press <kbd style={{ padding: '2px 6px', background: '#222', borderRadius: '4px', border: '1px solid #333' }}>Esc</kbd> or click outside to close
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <GithubIcon size={14} />
                    <span>View GitHub</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
