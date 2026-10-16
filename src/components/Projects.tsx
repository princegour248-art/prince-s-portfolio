import React, { useState } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './icons';
import { PORTFOLIO_CONFIG, type Project } from '../data/portfolioData';

export const Projects: React.FC = () => {
  const { projects } = PORTFOLIO_CONFIG;
  const [activeFilter, setActiveFilter] = useState<'All' | 'AI & Web' | 'Full-Stack' | 'System'>('All');

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span className="section-tag">03 &bull; Engineering Portfolio</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Selected software applications engineered with real architectural requirements, structured APIs, and user-centered design.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['All', 'AI & Web', 'Full-Stack', 'System'] as const).map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: activeFilter === filter ? '1px solid #E87524' : '1px solid #303030',
                  backgroundColor: activeFilter === filter ? 'rgba(232, 117, 36, 0.1)' : '#1A1A1A',
                  color: activeFilter === filter ? '#E87524' : '#A6A6A6',
                  transition: 'all 150ms ease'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredProjects.map((project: Project) => {
            return (
              <div
                key={project.id}
                className="card project-card-grid"
                style={{
                  padding: '32px',
                  backgroundColor: '#161616',
                  display: 'grid',
                  gridTemplateColumns: project.isPlaceholder ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)',
                  gap: '32px',
                  alignItems: 'start',
                  position: 'relative'
                }}
              >
                {/* Left/Main Column: Project Details */}
                <div>
                  {/* Category & Tagline */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: '#E87524',
                        backgroundColor: 'rgba(232, 117, 36, 0.08)',
                        border: '1px solid rgba(232, 117, 36, 0.25)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {project.category}
                    </span>
                    {project.isPlaceholder && (
                      <span style={{ fontSize: '11px', color: '#737373', fontFamily: 'var(--font-mono)' }}>
                        Configurable Project Slot
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F5F2ED', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    {project.title}
                  </h3>

                  <p style={{ fontSize: '14.5px', color: '#E87524', fontWeight: 500, marginBottom: '14px' }}>
                    {project.tagline}
                  </p>

                  <p style={{ fontSize: '14px', color: '#A6A6A6', lineHeight: 1.65, marginBottom: '24px' }}>
                    {project.description}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#737373', marginBottom: '10px' }}>
                      Implemented Features
                    </span>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {project.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#D4D4D8' }}>
                          <CheckCircle2 size={16} color="#E87524" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '11.5px',
                          padding: '3px 9px',
                          borderRadius: '4px',
                          backgroundColor: '#1E1E1E',
                          border: '1px solid #303030',
                          color: '#A6A6A6'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        <GithubIcon size={15} />
                        <span>Source Code</span>
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#737373',
                          border: '1px dashed #303030',
                          padding: '6px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        Repository link available upon release
                      </span>
                    )}

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <ExternalLink size={15} />
                        <span>Project Documentation</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Architectural Schematic Mockup (Tasteful UI preview without AI-slop) */}
                {!project.isPlaceholder && (
                  <div
                    style={{
                      backgroundColor: '#111111',
                      border: '1px solid #282828',
                      borderRadius: '10px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      position: 'sticky',
                      top: '90px'
                    }}
                  >
                    {/* Simulated terminal bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #202020', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#383838' }} />
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#383838' }} />
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#383838' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#737373' }}>
                        {project.id === 'master-sahab' ? 'ai-core-service:8000' : 'complaint-portal:8080'}
                      </span>
                    </div>

                    {/* Architecture diagram card preview */}
                    {project.id === 'master-sahab' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>AI INFERENCE RUNTIME</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Ollama Local LLM + FastAPI Streaming Endpoint</span>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>STUDENT STUDY SUITE</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Adaptive Timetable &bull; 3D Flashcards &bull; Quizzes</span>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>LOCAL PERSISTENCE</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Zero Latency Offline Fallback Cache</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>ANONYMOUS INGESTION</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Cryptographically Detached Identity Pipeline</span>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>RBAC ACCESS CONTROL</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Student &bull; Department Coordinator &bull; Admin</span>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: '#1A1A1A', borderRadius: '6px', border: '1px solid #2D2D2D' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#E87524', fontWeight: 600 }}>AUDITABLE STATUS ENGINE</span>
                          <span style={{ fontSize: '12.5px', color: '#F5F2ED' }}>Ticket Life Cycle: Submitted &rarr; Review &rarr; Resolved</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .project-card-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
