const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const CANONICAL_URL = 'https://princegour248-art.github.io/portfolio';
const publicDir = path.join(__dirname, '..', 'public');

async function generate() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate PNG (high resolution 512x512 with proper quiet zone margin)
  const pngPath = path.join(publicDir, 'portfolio-qr.png');
  await QRCode.toFile(pngPath, CANONICAL_URL, {
    width: 512,
    margin: 3,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
  console.log(`[Success] Scannable QR PNG saved at: ${pngPath}`);

  // Generate SVG
  const svgPath = path.join(publicDir, 'portfolio-qr.svg');
  const svgString = await QRCode.toString(CANONICAL_URL, {
    type: 'svg',
    margin: 3,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
  fs.writeFileSync(svgPath, svgString, 'utf8');
  console.log(`[Success] Scannable QR SVG saved at: ${svgPath}`);
}

generate().catch(err => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});
