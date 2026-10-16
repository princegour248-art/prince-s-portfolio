const fs = require('fs');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

// Target canonical live portfolio URL (changeable via CLI argument: node scripts/generateQrCode.cjs [url])
const targetUrl = process.argv[2] || 'https://princegour248-art.github.io/portfolio';
const localWifiUrl = 'http://192.168.1.30:5173';

const projectDir = path.join(__dirname, '..');
const publicDir = path.join(projectDir, 'public');
const desktopDir = path.join(os.homedir(), 'Desktop');

async function generate() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const qrOptions = {
    width: 1024,
    margin: 3,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  };

  console.log(`\n==============================================`);
  console.log(`Generating Scannable QR Codes for Prince Gour`);
  console.log(`Target URL: ${targetUrl}`);
  console.log(`==============================================\n`);

  // 1. Generate live portfolio QR in public/
  const publicPngPath = path.join(publicDir, 'portfolio-qr.png');
  await QRCode.toFile(publicPngPath, targetUrl, qrOptions);
  console.log(`[OK] Saved public PNG: ${publicPngPath}`);

  // 2. Generate live portfolio QR SVG in public/
  const publicSvgPath = path.join(publicDir, 'portfolio-qr.svg');
  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 3,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'H'
  });
  fs.writeFileSync(publicSvgPath, svgString, 'utf8');
  console.log(`[OK] Saved public SVG: ${publicSvgPath}`);

  // 3. Save copy in project root
  const rootPngPath = path.join(projectDir, 'Prince_Gour_Portfolio_QR.png');
  await QRCode.toFile(rootPngPath, targetUrl, qrOptions);
  console.log(`[OK] Saved project root QR: ${rootPngPath}`);

  // 4. Save copy on Desktop for instant user access
  if (fs.existsSync(desktopDir)) {
    const desktopPngPath = path.join(desktopDir, 'Prince_Gour_Portfolio_QR.png');
    await QRCode.toFile(desktopPngPath, targetUrl, qrOptions);
    console.log(`[OK] Saved to Desktop: ${desktopPngPath}`);

    // Also generate local Wi-Fi QR on Desktop for immediate testing
    const desktopLocalPngPath = path.join(desktopDir, 'Prince_Gour_Portfolio_QR_WiFi_Test.png');
    await QRCode.toFile(desktopLocalPngPath, localWifiUrl, qrOptions);
    console.log(`[OK] Saved local Wi-Fi test QR to Desktop: ${desktopLocalPngPath}`);
  }

  console.log(`\n[SUCCESS] QR Codes successfully generated!`);
}

generate().catch(err => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});
