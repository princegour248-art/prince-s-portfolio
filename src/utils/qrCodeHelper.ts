import QRCode from 'qrcode';

/**
 * Generate a high-resolution PNG data URL for a given URL
 * Ensures proper quiet zone and pure black/white contrast for optimal camera scanning.
 */
export async function generateQrDataUrl(url: string, size = 512): Promise<string> {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 3,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
}

/**
 * Generate clean SVG string for high-fidelity vector rendering and printing.
 */
export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 3,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
}

/**
 * Download PNG image directly to user device
 */
export async function downloadQrPng(url: string, filename = 'prince-gour-portfolio-qr.png'): Promise<void> {
  const dataUrl = await generateQrDataUrl(url, 1024);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Download SVG vector directly to user device
 */
export async function downloadQrSvg(url: string, filename = 'prince-gour-portfolio-qr.svg'): Promise<void> {
  const svgString = await generateQrSvg(url);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}
