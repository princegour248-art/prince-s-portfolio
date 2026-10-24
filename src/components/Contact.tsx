import React, { useState, useEffect, useRef } from 'react';
import { Mail, Send, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { StrokeText } from './StrokeText';
import './Contact.css';

export const Contact: React.FC = () => {
  const { contact } = PORTFOLIO_CONFIG.personal;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <section id="contact" ref={sectionRef} className="section contact-section">
      {/* High-Tech Animated Ambient Orbs */}
      <div className="contact-ambient-orb contact-ambient-orb-1" />
      <div className="contact-ambient-orb contact-ambient-orb-2" />

      <div className="container">
        {/* Section Header */}
        <div className={`contact-header ${isVisible ? 'is-visible' : ''}`}>
          <div style={{ marginBottom: '12px' }}>
            <span className="section-tag">09 &bull; Get In Touch</span>
          </div>
          <h1 className="section-title stroke-heading">
            <StrokeText text="Contact & Connect" accentText="&" />
          </h1>
          <p className="section-subtitle">
            Open to internship opportunities, technical collaborations, and software engineering inquiries.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="contact-grid">
          {/* Left Column: Direct Contact Info Cards with Staggered Entrance & Dynamic Hover */}
          <div className="contact-cards-column">
            {/* Email Card */}
            <a
              href={`mailto:${contact.email}`}
              className={`card contact-card-animated ${isVisible ? 'is-visible' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616',
                transitionDelay: '0.08s'
              }}
            >
              <div
                className="contact-card-icon-box"
                style={{
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)'
                }}
              >
                <Mail size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Direct Email
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>
                  {contact.email}
                </span>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`card contact-card-animated ${isVisible ? 'is-visible' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616',
                transitionDelay: '0.18s'
              }}
            >
              <div
                className="contact-card-icon-box"
                style={{
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)'
                }}
              >
                <GithubIcon size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  GitHub Profile
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>
                  github.com/{contact.githubUsername}
                </span>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`card contact-card-animated ${isVisible ? 'is-visible' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616',
                transitionDelay: '0.28s'
              }}
            >
              <div
                className="contact-card-icon-box"
                style={{
                  backgroundColor: 'rgba(232, 117, 36, 0.1)',
                  border: '1px solid rgba(232, 117, 36, 0.25)'
                }}
              >
                <LinkedinIcon size={20} color="#E87524" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Network
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>
                  LinkedIn Profile
                </span>
              </div>
            </a>

            {/* Location Pill Card */}
            <div
              className={`card contact-card-animated ${isVisible ? 'is-visible' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#161616',
                transitionDelay: '0.38s'
              }}
            >
              <div
                className="contact-card-icon-box"
                style={{
                  backgroundColor: '#1F1F1F',
                  border: '1px solid #303030'
                }}
              >
                <MapPin size={20} color="#A6A6A6" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Base Location
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F2ED' }}>
                  {contact.location}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Message Form with Animated Inputs & Action */}
          <div
            className={`contact-form-card ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
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
                  className="contact-input"
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
                  className="contact-input"
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
                  className="contact-input"
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
                  className="contact-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {status.message && (
                <div
                  className="contact-status-alert"
                  style={{
                    backgroundColor: status.type === 'success' ? '#112211' : '#221111',
                    border: status.type === 'success' ? '1px solid #16A34A' : '1px solid #E11D48',
                    color: status.type === 'success' ? '#4ADE80' : '#FB7185'
                  }}
                >
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{status.message}</span>
                </div>
              )}

              <button type="submit" className="contact-submit-btn">
                <span className="contact-submit-icon">
                  <Send size={15} />
                </span>
                <span>Send Message via Email</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
