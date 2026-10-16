import React from 'react';
import { FileDown, Eye, Check, FileText, Download } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { generateClientResumePdf } from '../utils/generateResumePdf';

export const ResumeSection: React.FC = () => {
  const { personal, education, skills, projects } = PORTFOLIO_CONFIG;

  const handleDownloadDynamic = () => {
    generateClientResumePdf();
  };

  return (
    <section id="resume" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">07 &bull; Curriculum Vitae</span>
          <h2 className="section-title">Professional Resume</h2>
          <p className="section-subtitle">
            An ATS-optimized, single-page professional resume structured for recruiter readability, technical screening, and engineering audits.
          </p>
        </div>

        {/* Resume Container Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '32px',
            alignItems: 'start'
          }}
          className="resume-grid"
        >
          {/* Left Column: Visual ATS Resume Document Stage */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#18181B',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              fontFamily: 'Helvetica, Arial, sans-serif'
            }}
            className="resume-sheet"
          >
            {/* Header */}
            <div style={{ borderBottom: '1.5px solid #E87524', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#18181B', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {personal.name.toUpperCase()}
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#E87524', marginBottom: '8px' }}>
                {personal.headline}
              </p>
              <div style={{ fontSize: '10px', color: '#52525B', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span>Email: {personal.contact.email}</span>
                <span>&bull;</span>
                <span>GitHub: github.com/{personal.contact.githubUsername}</span>
                <span>&bull;</span>
                <span>Location: {personal.contact.location}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', borderBottom: '1px solid #E4E4E7', paddingBottom: '2px' }}>
                Professional Summary
              </h4>
              <p style={{ fontSize: '10.5px', color: '#27272A', lineHeight: 1.5 }}>
                {personal.about.paragraphs[0]}
              </p>
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #E4E4E7', paddingBottom: '2px' }}>
                Technical Skills
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
                {skills.slice(0, 5).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px' }}>
                    <strong style={{ color: '#18181B', minWidth: '130px' }}>{s.title}:</strong>
                    <span style={{ color: '#52525B' }}>{s.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Projects */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #E4E4E7', paddingBottom: '2px' }}>
                Selected Projects
              </h4>
              {projects.filter(p => !p.isPlaceholder).map((proj, pIdx) => (
                <div key={pIdx} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '11px', color: '#18181B' }}>{proj.title}</strong>
                    <span style={{ fontSize: '9px', color: '#71717A' }}>{proj.tags.slice(0, 4).join(', ')}</span>
                  </div>
                  <ul style={{ paddingLeft: '14px', marginTop: '2px', fontSize: '9.5px', color: '#3F3F46', lineHeight: 1.45 }}>
                    {proj.features.slice(0, 2).map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', borderBottom: '1px solid #E4E4E7', paddingBottom: '2px' }}>
                Education
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <strong style={{ color: '#18181B' }}>{education[0].degree}</strong>
                <span style={{ color: '#71717A' }}>{education[0].period}</span>
              </div>
              <p style={{ fontSize: '9.5px', color: '#52525B' }}>
                Relevant Coursework: {education[0].coursework.slice(0, 4).join(', ')}
              </p>
            </div>

            {/* Internships & Certs Summary */}
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', borderBottom: '1px solid #E4E4E7', paddingBottom: '2px' }}>
                Certifications & Internships
              </h4>
              <p style={{ fontSize: '9.5px', color: '#3F3F46', lineHeight: 1.5 }}>
                &bull; Samsung (Big Data) &bull; Mastercard (Cybersecurity) &bull; Google Cloud (GenAI) &bull; Cognifyz Technologies (Web Dev) &bull; CodeAlpha (UI/UX)
              </p>
            </div>
          </div>

          {/* Right Column: Download Actions & Verification details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px', backgroundColor: '#161616' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#E87524', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                <FileText size={15} /> Verified PDF File
              </span>

              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F2ED', marginBottom: '8px' }}>
                Download Real PDF
              </h4>

              <p style={{ fontSize: '13px', color: '#A6A6A6', lineHeight: 1.55, marginBottom: '20px' }}>
                This is a real ATS-friendly vector PDF with selectable text, clickable hyperlinks, and standard font metrics (no image snapshots or fake renames).
              </p>

              {/* Working Download Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="/prince-gour-resume.pdf"
                  download="prince-gour-resume.pdf"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <FileDown size={16} />
                  <span>Download PDF (Direct)</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadDynamic}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  title="Generate live from current portfolio configuration"
                >
                  <Download size={15} />
                  <span>Generate Live Copy</span>
                </button>

                <a
                  href="/prince-gour-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  <Eye size={15} />
                  <span>View in New Tab</span>
                </a>
              </div>
            </div>

            {/* Quality Checklist Card */}
            <div className="card" style={{ padding: '20px', backgroundColor: '#141414' }}>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                ATS Compliance Checklist
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#D4D4D8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#16A34A" /> <span>Standard A4 single-page layout</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#16A34A" /> <span>Fully selectable & searchable text</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#16A34A" /> <span>Recruiter-tested typography & contrast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#16A34A" /> <span>Responsive mobile & desktop support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .resume-grid {
            grid-template-columns: 1fr !important;
          }
          .resume-sheet {
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
