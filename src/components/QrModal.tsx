import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Copy, Smartphone, Zap } from 'lucide-react';
import './QrModal.css';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const liveUrl = 'https://princegour248-art.github.io/prince-gour-portfolio/';
  const qrImgSrc = `${import.meta.env.BASE_URL}portfolio-qr.png`;

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="qr-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-heading"
    >
      <div className="qr-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="qr-modal-close"
          onClick={onClose}
          aria-label="Close QR Modal"
        >
          <X size={16} />
        </button>

        {/* Status Badge */}
        <div className="qr-modal-badge">
          <span className="qr-modal-badge-dot" />
          <span>Live Mobile Scanner</span>
        </div>

        <h3 id="qr-modal-heading" className="qr-modal-title">
          Scan to Open on Mobile
        </h3>
        <p className="qr-modal-desc">
          Point your smartphone camera at the QR code below to experience the portfolio live on your device.
        </p>

        {/* High-Contrast Crisp QR Code Card */}
        <div className="qr-modal-card-frame">
          <img
            src={qrImgSrc}
            alt="Scannable Portfolio QR Code"
            className="qr-modal-img"
            loading="eager"
            onError={(e) => {
              // Fallback to relative path if base url differs
              const target = e.currentTarget;
              if (!target.src.endsWith('/portfolio-qr.png')) {
                target.src = '/portfolio-qr.png';
              }
            }}
          />
        </div>

        {/* 2GB RAM & Budget Mobile Guarantee */}
        <div className="qr-modal-ram-spec">
          <Zap size={18} color="#FF6A00" style={{ flexShrink: 0 }} />
          <div>
            <strong>Optimized for 2GB RAM Devices</strong>
            <div style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '2px' }}>
              Adaptive DPR &bull; Paused Offscreen Loops &bull; 83KB Image Payload
            </div>
          </div>
        </div>

        {/* URL Box & One-Click Copy */}
        <div className="qr-modal-url-row">
          <Smartphone size={14} color="#71717A" style={{ flexShrink: 0 }} />
          <span className="qr-modal-url-text" title={liveUrl}>
            {liveUrl}
          </span>
          <button
            type="button"
            className="qr-modal-copy-btn"
            onClick={handleCopy}
            title="Copy URL to clipboard"
          >
            {copied ? (
              <>
                <Check size={12} color="#22C55E" />
                <span style={{ color: '#22C55E' }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrModal;
