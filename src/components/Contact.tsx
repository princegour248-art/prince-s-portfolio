import React, { useState } from 'react';
import { Mail, Send, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

export const Contact: React.FC = () => {
  const { contact } = PORTFOLIO_CONFIG.personal;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill out all required fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    // Construct mailto link cleanly
    const subject = encodeURIComponent(formData.subject || `Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    const mailtoUrl = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    setStatus({
      type: 'success',
      message: 'Opening your default email client with your pre-filled inquiry. You can also contact directly at ' + contact.email
    });
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">10 &bull; Get In Touch</span>
          <h2 className="section-title">Contact & Connect</h2>
          <p className="section-subtitle">
            Open to internship opportunities, technical collaborations, and software engineering inquiries.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px', alignItems: 'start' }} className="contact-grid">
          {/* Left Column: Direct Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Card */}
            <a
              href={`mailto:${contact.email}`}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616',
                transition: 'border-color 150ms ease'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Email</span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>{contact.email}</span>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GithubIcon size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GitHub Profile</span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>github.com/{contact.githubUsername}</span>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <LinkedinIcon size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional Network</span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>LinkedIn Profile</span>
              </div>
            </a>

            {/* Location Pill Card */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: '#1F1F1F',
                  border: '1px solid #303030',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={20} color="#A6A6A6" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Location</span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>{contact.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Message Form */}
          <div className="card" style={{ padding: '32px', backgroundColor: '#161616' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F2ED', marginBottom: '8px' }}>
              Send a Direct Message
            </h3>
            <p style={{ fontSize: '13px', color: '#A6A6A6', marginBottom: '24px' }}>
              Draft an inquiry directly. Submitting opens your verified email client with all details formatted.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D4D4D8', marginBottom: '6px' }}>
                  Your Name <span style={{ color: '#E87524' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    color: '#F5F2ED',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D4D4D8', marginBottom: '6px' }}>
                  Your Email Address <span style={{ color: '#E87524' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    color: '#F5F2ED',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D4D4D8', marginBottom: '6px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Internship Inquiry / Project Discussion"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    color: '#F5F2ED',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#D4D4D8', marginBottom: '6px' }}>
                  Message <span style={{ color: '#E87524' }}>*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    color: '#F5F2ED',
                    fontSize: '13.5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {status.message && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    backgroundColor: status.type === 'success' ? '#112211' : '#221111',
                    border: status.type === 'success' ? '1px solid #16A34A' : '1px solid #E11D48',
                    color: status.type === 'success' ? '#4ADE80' : '#FB7185',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{status.message}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                <Send size={15} />
                <span>Send Message via Email</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
