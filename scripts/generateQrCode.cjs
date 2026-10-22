const fs = require('fs');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

/**
 * Dynamically detects active local IPv4 address (e.g. Wi-Fi / Ethernet)
 * Avoids broken QR codes when DHCP assigns a new local IP.
 */
function getLocalWifiIp() {
  const interfaces = os.networkInterfaces();
  
  // 1. Look for typical private LAN addresses (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        if (
          addr.address.startsWith('192.168.') ||
          addr.address.startsWith('10.') ||
          /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(addr.address)
        ) {
          return addr.address;
        }
      }
    }
  }

  // 2. Fallback to any non-internal IPv4
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }

  return '192.168.1.28';
}

// Canonical live URL (overridable via CLI argument)
const targetUrl = process.argv[2] || 'https://princegour248-art.github.io/prince-gour-portfolio/';
const currentIp = getLocalWifiIp();
const localWifiUrl = `http://${currentIp}:5173`;

const projectDir = path.join(__dirname, '..');
const publicDir = path.join(projectDir, 'public');
const distDir = path.join(projectDir, 'dist');
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

  console.log(`\n======================================================`);
  console.log(` Generating Fresh Scannable QR Codes for Prince Gour`);
  console.log(` Detected Active Local IP : ${currentIp}`);
  console.log(` Local Wi-Fi Mobile URL   : ${localWifiUrl}`);
  console.log(` Canonical Live Target URL: ${targetUrl}`);
  console.log(`======================================================\n`);

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
  console.log(`[OK] Saved project root Live QR: ${rootPngPath}`);

  const rootWifiPngPath = path.join(projectDir, 'Prince_Gour_Portfolio_QR_WiFi_Test.png');
  await QRCode.toFile(rootWifiPngPath, localWifiUrl, qrOptions);
  console.log(`[OK] Saved project root Wi-Fi QR: ${rootWifiPngPath}`);

  // 4. Also copy to dist if dist exists
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(publicPngPath, path.join(distDir, 'portfolio-qr.png'));
    fs.copyFileSync(publicSvgPath, path.join(distDir, 'portfolio-qr.svg'));
    console.log(`[OK] Synchronized QR assets to dist/`);
  }

  // 5. Save copies on Desktop for instant access
  if (fs.existsSync(desktopDir)) {
    const desktopPngPath = path.join(desktopDir, 'Prince_Gour_Portfolio_QR.png');
    await QRCode.toFile(desktopPngPath, targetUrl, qrOptions);
    console.log(`[OK] Saved Live QR to Desktop: ${desktopPngPath}`);

    const desktopLocalPngPath = path.join(desktopDir, 'Prince_Gour_Portfolio_QR_WiFi_Test.png');
    await QRCode.toFile(desktopLocalPngPath, localWifiUrl, qrOptions);
    console.log(`[OK] Saved Local Wi-Fi QR (${localWifiUrl}) to Desktop: ${desktopLocalPngPath}`);

    // Update Desktop HTML Viewer with the latest active IP and URLs
    updateDesktopHtmlViewer(desktopDir, localWifiUrl, targetUrl, currentIp);
  }

  console.log(`\n[SUCCESS] QR Codes successfully generated & synchronized!`);
}

function updateDesktopHtmlViewer(desktopPath, localUrl, liveUrl, activeIp) {
  const viewerHtmlPath = path.join(desktopPath, 'Prince_Portfolio_QR_Viewer.html');
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prince Gour — Portfolio QR Scanner & Viewer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0E0E0E;
      color: #F5F2ED;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      max-width: 720px;
      margin-bottom: 36px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .header h1 span { color: #E87524; }
    .header p {
      font-size: 15px;
      color: #A0A0A0;
      line-height: 1.5;
    }
    .status-banner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(232, 117, 36, 0.12);
      border: 1px solid rgba(232, 117, 36, 0.4);
      color: #E87524;
      font-size: 13px;
      padding: 6px 14px;
      border-radius: 999px;
      margin-top: 14px;
      font-weight: 600;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px #22c55e;
      display: inline-block;
    }
    .cards-container {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
      max-width: 900px;
      width: 100%;
    }
    .card {
      background: #181818;
      border: 1px solid #2B2B2B;
      border-radius: 16px;
      padding: 28px;
      width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    .badge-live {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .badge-local {
      background: rgba(232, 117, 36, 0.15);
      color: #E87524;
      border: 1px solid rgba(232, 117, 36, 0.3);
    }
    .card h2 {
      font-size: 19px;
      margin-bottom: 8px;
      text-align: center;
    }
    .card p.desc {
      font-size: 13px;
      color: #8E8E8E;
      text-align: center;
      margin-bottom: 20px;
      min-height: 40px;
    }
    .qr-frame {
      background: #FFFFFF;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .qr-frame img {
      width: 220px;
      height: 220px;
      display: block;
      image-rendering: pixelated;
    }
    .url-box {
      background: #111111;
      border: 1px solid #333333;
      padding: 10px 14px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 13px;
      color: #E87524;
      width: 100%;
      text-align: center;
      word-break: break-all;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background: #E87524;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .btn:hover { background: #d06318; }
    .instructions-box {
      max-width: 865px;
      width: 100%;
      background: #141414;
      border: 1px solid #282828;
      border-radius: 12px;
      padding: 24px;
      margin-top: 36px;
    }
    .instructions-box h3 {
      font-size: 16px;
      color: #E87524;
      margin-bottom: 12px;
    }
    .instructions-box ol {
      padding-left: 20px;
      font-size: 14px;
      color: #CCCCCC;
      line-height: 1.8;
    }
    .instructions-box code {
      background: #202020;
      padding: 2px 6px;
      border-radius: 4px;
      color: #F5F2ED;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Prince Gour — <span>Portfolio QR Scanner</span></h1>
    <p>Apne phone camera ya Google Lens se screen par dikh rahe QR Code ko scan karein aur portfolio ko seedha apne mobile par open karein.</p>
    <div class="status-banner">
      <span class="status-dot"></span>
      <span>Active Wi-Fi IP: ${activeIp} &bull; Auto-Synced</span>
    </div>
  </div>

  <div class="cards-container">
    <!-- Local Wi-Fi Card -->
    <div class="card">
      <div class="badge badge-local">Abhi Turant Mobile Par Test Karein</div>
      <h2>Local Wi-Fi QR Code</h2>
      <p class="desc">Aapke Wi-Fi / Hotspot par chalta hai. Agar computer par server on hai, to phone camera se scan karte hi site turant open hogi.</p>
      <div class="qr-frame">
        <img src="Prince_Gour_Portfolio_QR_WiFi_Test.png?t=${Date.now()}" alt="Local Wi-Fi QR Code">
      </div>
      <div class="url-box">${localUrl}</div>
      <a href="${localUrl}" target="_blank" class="btn">Computer Browser me open karein</a>
    </div>

    <!-- Live GitHub Pages Card -->
    <div class="card">
      <div class="badge badge-live">Permanent Global URL (Har Kisi Ke Liye)</div>
      <h2>Live Portfolio QR Code</h2>
      <p class="desc">Duniya ka koi bhi vyakti kahin se bhi is QR code ko scan karega to aapka portfolio open hoga (GitHub Pages / Online Link).</p>
      <div class="qr-frame">
        <img src="Prince_Gour_Portfolio_QR.png?t=${Date.now()}" alt="Live Portfolio QR Code">
      </div>
      <div class="url-box">${liveUrl}</div>
      <a href="Prince_Gour_Portfolio_QR.png" download class="btn">Download QR Image (PNG)</a>
    </div>
  </div>

  <div class="instructions-box">
    <h3>📱 QR Code se Mobile me Kaise Kholein (Error Fix Guide):</h3>
    <ol>
      <li><strong>Local Wi-Fi QR scan karne ke liye (Sabse aasan):</strong>
        <br>Desktop par bane <code>Open_Portfolio_On_Mobile.bat</code> par double-click karein!
        <br>Wo automatically aapke Wi-Fi ka IP detect karke server start kar dega aur QR screen par open karega. Phone ko same Wi-Fi ya Mobile Hotspot se connect karke scan karein!
      </li>
      <li><strong>Online / Permanent 24/7 Live karne ke liye:</strong>
        <br>GitHub par repository <code>prince-gour-portfolio</code> create karein aur push kar dein:
        <br><code>git push -u origin main</code>
        <br>GitHub Actions automatically deploy kar dega aur <code>${liveUrl}</code> 24/7 active ho jayega!
      </li>
    </ol>
  </div>
</body>
</html>`;

  fs.writeFileSync(viewerHtmlPath, htmlContent, 'utf8');
  console.log(`[OK] Updated Desktop HTML Viewer: ${viewerHtmlPath}`);
}

generate().catch(err => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});
