import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, ExternalLink, Smartphone, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';
import { downloadQrPng, downloadQrSvg } from '../utils/qrCodeHelper';

export const QRCodeSection: React.FC = () => {
  const defaultUrl = PORTFOLIO_CONFIG.personal.meta.canonicalUrl;
  const [portfolioUrl, setPortfolioUrl] = useState(defaultUrl);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'standard' | 'business-card' | 'resume-header'>('standard');

  // Generate QR code whenever URL changes
  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(portfolioUrl, {
      width: 512,
      margin: 3,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR data URL:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [portfolioUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadPng = () => {
    downloadQrPng(portfolioUrl, `prince-gour-portfolio-qr.png`);
  };

  const handleDownloadSvg = () => {
    downloadQrSvg(portfolioUrl, `prince-gour-portfolio-qr.svg`);
  };

  return (
    <section id="qrcode" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-tag">09 &bull; Instant Access</span>
          <h2 className="section-title">Scan to View My Portfolio</h2>
          <p className="section-subtitle">
            A verified, high-contrast QR code pointing directly to the canonical public HTTPS portfolio URL. Tested for immediate smartphone camera recognition.
          </p>
        </div>

        {/* QR Section Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 380px) 1fr',
            gap: '40px',
            alignItems: 'start'
          }}
          className="qr-grid"
        >
          {/* Left Column: The Scannable QR Code Stage */}
          <div
            style={{
              backgroundColor: '#161616',
              border: '1px solid #303030',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* The Black & White QR Code on White Background with Quiet Space */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #E4E4E7',
                display: 'inline-block',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                marginBottom: '20px'
              }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code pointing to ${portfolioUrl}`}
                  style={{
                    width: '240px',
                    height: '240px',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  Generating QR code...
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E87524', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <Smartphone size={16} />
              <span>Camera & Lens Scannable</span>
            </div>

            <p style={{ fontSize: '12px', color: '#A6A6A6', maxWidth: '280px', marginBottom: '24px' }}>
              Encodes canonical public HTTPS URL directly. Free of trackers or personal data.
            </p>

            {/* Direct Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Download size={16} />
                <span>Download QR Code (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <Download size={16} />
                <span>Download Vector (SVG)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                {copied ? <Check size={16} color="#16A34A" /> : <Copy size={16} />}
                <span>{copied ? 'Portfolio Link Copied!' : 'Copy Portfolio Link'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Print-Ready Layouts & Canonical URL Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Canonical URL Config Card */}
            <div className="card" style={{ backgroundColor: '#161616', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#E87524', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Encoded Target URL
                </span>
                <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} /> HTTPS Production Canonical
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    color: '#F5F2ED',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)'
                  }}
                  placeholder="https://your-public-url.com"
                  aria-label="Target portfolio URL for QR code"
                />

                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  title="Open live link in new tab"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <p style={{ fontSize: '12px', color: '#737373', lineHeight: 1.5 }}>
                Tip: After deploying your portfolio to Vercel or GitHub Pages, update the canonical URL in <code>portfolioData.ts</code> or the input above to produce the permanent public QR code.
              </p>
            </div>

            {/* Print-Ready Layout Card (Business Card & Resume Badge) */}
            <div className="card" style={{ backgroundColor: '#161616', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#F5F2ED' }}>
                    Print-Ready Previews
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#A6A6A6' }}>
                    Format previews designed for business cards, resumes, and stickers.
                  </p>
                </div>

                {/* Tab switcher */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('business-card')}
                    style={{
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'business-card' ? '#E87524' : '#1F1F1F',
                      color: activeTab === 'business-card' ? '#111111' : '#A6A6A6',
                      fontWeight: 600
                    }}
                  >
                    Business Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('resume-header')}
                    style={{
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'resume-header' ? '#E87524' : '#1F1F1F',
                      color: activeTab === 'resume-header' ? '#111111' : '#A6A6A6',
                      fontWeight: 600
                    }}
                  >
                    Resume Badge
                  </button>
                </div>
              </div>

              {/* Dynamic Preview Box */}
              {activeTab === 'business-card' ? (
                <div
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#F5F2ED', display: 'block' }}>
                      {PORTFOLIO_CONFIG.personal.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#E87524', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                      AI & Web Developer
                    </span>
                    <span style={{ fontSize: '11px', color: '#737373', display: 'block' }}>
                      {PORTFOLIO_CONFIG.personal.contact.email}
                    </span>
                    <span style={{ fontSize: '11px', color: '#737373', display: 'block' }}>
                      github.com/{PORTFOLIO_CONFIG.personal.contact.githubUsername}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                    <img src={qrDataUrl} alt="QR Code thumbnail" style={{ width: '80px', height: '80px', display: 'block' }} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #303030',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '6px' }}>
                      <img src={qrDataUrl} alt="QR Code thumbnail" style={{ width: '56px', height: '56px', display: 'block' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#F5F2ED', display: 'block' }}>
                        Scan to verify interactive projects
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#A6A6A6' }}>
                        Opens live portfolio with source code & test suites
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .qr-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
