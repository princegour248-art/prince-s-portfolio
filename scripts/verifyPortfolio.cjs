const fs = require('fs');
const path = require('path');

console.log('=== STARTING PRINCE GOUR PORTFOLIO VERIFICATION ===\n');

const rootDir = path.resolve(__dirname, '..');
let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✔ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Verify Assets
const resumePath = path.join(rootDir, 'public', 'prince-gour-resume.pdf');
assert(fs.existsSync(resumePath), 'Physical PDF resume exists in public/prince-gour-resume.pdf');
if (fs.existsSync(resumePath)) {
  const buf = fs.readFileSync(resumePath);
  assert(buf.length > 5000, `PDF resume is substantial in size (${buf.length} bytes)`);
  assert(buf.toString('utf8', 0, 5) === '%PDF-', 'PDF file begins with valid %PDF- magic number (real PDF, not fake rename)');
}

const qrPngPath = path.join(rootDir, 'public', 'portfolio-qr.png');
assert(fs.existsSync(qrPngPath), 'Physical QR PNG exists in public/portfolio-qr.png');
if (fs.existsSync(qrPngPath)) {
  const buf = fs.readFileSync(qrPngPath);
  assert(buf.length > 1000, `QR PNG is high resolution (${buf.length} bytes)`);
  // PNG signature 89 50 4E 47
  assert(buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47, 'Valid PNG header verified');
}

const qrSvgPath = path.join(rootDir, 'public', 'portfolio-qr.svg');
assert(fs.existsSync(qrSvgPath), 'Physical QR SVG exists in public/portfolio-qr.svg');
if (fs.existsSync(qrSvgPath)) {
  const svgContent = fs.readFileSync(qrSvgPath, 'utf8');
  assert(svgContent.includes('<svg') && svgContent.includes('</svg>'), 'Valid SVG vector content verified');
}

// 2. Verify Central Data Configuration
const dataPath = path.join(rootDir, 'src', 'data', 'portfolioData.ts');
assert(fs.existsSync(dataPath), 'Central portfolioData.ts exists');
if (fs.existsSync(dataPath)) {
  const dataContent = fs.readFileSync(dataPath, 'utf8');
  assert(dataContent.includes('Prince Gour'), 'Contains user name Prince Gour');
  assert(dataContent.includes('Master Sahab — AI Student Assistant'), 'Contains Master Sahab featured project');
  assert(dataContent.includes('College Complaint Management Portal'), 'Contains College Complaint Portal project');
  assert(dataContent.includes('https://github.com/princegour248-art'), 'Contains Prince Gour GitHub link');
  assert(dataContent.includes('Bachelor of Computer Applications (BCA)'), 'Contains BCA education data');
  assert(dataContent.includes('Samsung'), 'Contains Samsung certification');
  assert(dataContent.includes('Google Cloud'), 'Contains Google Cloud certification');
  assert(dataContent.includes('Cognifyz'), 'Contains Cognifyz internship experience');
  assert(dataContent.includes('CodeAlpha'), 'Contains CodeAlpha UI/UX internship experience');
  assert(dataContent.includes('https://princegour248-art.github.io/prince-s-portfolio/'), 'Contains canonical HTTPS URL for QR code');
}

// 3. Verify Design System Colors
const cssPath = path.join(rootDir, 'src', 'index.css');
assert(fs.existsSync(cssPath), 'Design system index.css exists');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  assert(css.includes('#111111'), 'Main background #111111 defined');
  assert(css.includes('#1A1A1A'), 'Secondary background #1A1A1A defined');
  assert(css.includes('#E87524'), 'Primary orange #E87524 defined');
  assert(css.includes('#F28C38'), 'Hover orange #F28C38 defined');
  assert(css.includes('#F5F2ED'), 'Primary text #F5F2ED defined');
  assert(css.includes('#A6A6A6'), 'Secondary text #A6A6A6 defined');
  assert(css.includes('#303030'), 'Borders #303030 defined');
}

// 4. Verify Built Dist Directory
const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
assert(fs.existsSync(distHtmlPath), 'Production dist/index.html compiled successfully');
if (fs.existsSync(distHtmlPath)) {
  const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
  assert(distHtml.includes('Prince Gour'), 'dist/index.html includes page title and meta');
  assert(distHtml.includes('favicon.svg'), 'dist/index.html includes favicon link');
}

const distResumePath = path.join(rootDir, 'dist', 'prince-gour-resume.pdf');
assert(fs.existsSync(distResumePath), 'Production dist/prince-gour-resume.pdf deployed');

const distQrPng = path.join(rootDir, 'dist', 'portfolio-qr.png');
assert(fs.existsSync(distQrPng), 'Production dist/portfolio-qr.png deployed');

console.log('\n=======================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${totalTests - passedTests}`);
console.log('=======================================================');

if (passedTests === totalTests) {
  console.log('🎉 PORTFOLIO VERIFICATION SUCCEEDED WITH 100% PASS!');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!');
  process.exit(1);
}
