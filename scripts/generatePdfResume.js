const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateResume() {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const darkColor = [24, 24, 27];       // Charcoal #18181B
  const grayColor = [82, 82, 91];       // Zinc #52525B
  const lightGray = [113, 113, 122];    // Muted #71717A
  const orangeColor = [232, 117, 36];   // Primary orange #E87524
  const lineColor = [228, 228, 231];    // Divider line #E4E4E7

  // Helper functions
  function drawSectionHeader(title) {
    y += 14;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...orangeColor);
    doc.text(title.toUpperCase(), margin, y);
    
    // Line under title
    y += 4;
    doc.setDrawColor(...lineColor);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  }

  // --- HEADER ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.text('PRINCE GOUR', margin, y);
  y += 16;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...orangeColor);
  doc.text('AI Enthusiast  |  Aspiring Software Developer  |  Web Developer', margin, y);
  y += 14;

  // Contact links line
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const contactText = 'Email: princegour248@gmail.com  |  GitHub: github.com/princegour248-art  |  LinkedIn: linkedin.com/in/princegour  |  India';
  doc.text(contactText, margin, y);
  y += 6;

  // --- PROFESSIONAL SUMMARY ---
  drawSectionHeader('Professional Summary');
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  const summary = 'Motivated Bachelor of Computer Applications (BCA) student with a solid foundation in software engineering, full-stack web development, and artificial intelligence integration. Experienced in developing practical web applications, designing resilient RESTful APIs with Python & FastAPI, and implementing clean user interfaces with an architectural, privacy-conscious mindset.';
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12;

  // --- TECHNICAL SKILLS ---
  drawSectionHeader('Technical Skills');
  const skillCategories = [
    { label: 'Programming Languages', val: 'Python, Java, JavaScript (ES6+)' },
    { label: 'Frontend Technologies', val: 'HTML5, CSS3, Modern JavaScript, React, Responsive Design' },
    { label: 'Backend & APIs', val: 'Python, FastAPI, RESTful APIs, Node.js Basics' },
    { label: 'AI & Machine Learning', val: 'Generative AI, AI API Integration, Ollama Local Models, Prompt Engineering' },
    { label: 'Databases & Storage', val: 'SQL, Relational Database Design, Supabase, LocalStorage' },
    { label: 'Developer Tools', val: 'Git, GitHub, VS Code, Vite, Command Line / PowerShell' }
  ];

  skillCategories.forEach(sc => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkColor);
    doc.text(`${sc.label}: `, margin, y);
    const labelWidth = doc.getTextWidth(`${sc.label}: `);
    
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(sc.val, margin + labelWidth, y);
    y += 12;
  });

  // --- FEATURED PROJECTS ---
  drawSectionHeader('Featured Projects');

  // Project 1: Master Sahab
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text('Master Sahab — AI Student Assistant', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  const p1Meta = 'Python, FastAPI, JavaScript, Generative AI (Ollama/LLMs), CSS Modules';
  doc.text(p1Meta, pageWidth - margin - doc.getTextWidth(p1Meta), y);
  y += 11;

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  const p1Bullets = [
    'Architected a production-ready AI academic study platform providing multi-turn conceptual explanation and doubt resolution.',
    'Engineered automated daily routine timetable planner, active recall flashcards with 3D flip physics, and interactive practice quizzes.',
    'Implemented local-first client persistence with 0ms offline latency fallback for continuous accessibility without cloud lock-in.'
  ];
  p1Bullets.forEach(b => {
    doc.text('•', margin + 6, y);
    const lines = doc.splitTextToSize(b, contentWidth - 16);
    doc.text(lines, margin + 16, y);
    y += lines.length * 10.5;
  });
  y += 3;

  // Project 2: College Complaint Portal
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text('College Complaint Management Portal', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  const p2Meta = 'Python, FastAPI, SQL, JavaScript, Role-Based Access Control (RBAC)';
  doc.text(p2Meta, pageWidth - margin - doc.getTextWidth(p2Meta), y);
  y += 11;

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  const p2Bullets = [
    'Engineered an institution-wide grievance redressal platform with student, department, and administrative role tiers.',
    'Integrated anonymous filing options with cryptographic privacy safeguards to protect student identity while preserving audit logs.',
    'Implemented real-time ticket state tracking across submission, review, investigation, and resolution stages.'
  ];
  p2Bullets.forEach(b => {
    doc.text('•', margin + 6, y);
    const lines = doc.splitTextToSize(b, contentWidth - 16);
    doc.text(lines, margin + 16, y);
    y += lines.length * 10.5;
  });

  // --- EDUCATION ---
  drawSectionHeader('Education');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text('Bachelor of Computer Applications (BCA)', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  const eduPeriod = 'Undergraduate Student (Current)';
  doc.text(eduPeriod, pageWidth - margin - doc.getTextWidth(eduPeriod), y);
  y += 11;

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  doc.text('Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Web Technologies, Software Engineering', margin, y);
  y += 12;

  // --- INTERNSHIPS & PROFESSIONAL EXPERIENCE ---
  drawSectionHeader('Internship Experience');

  // Cognifyz
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text('Web Development Intern — Cognifyz Technologies', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  const exp1Type = 'Internship / Documentation';
  doc.text(exp1Type, pageWidth - margin - doc.getTextWidth(exp1Type), y);
  y += 10;
  doc.setTextColor(...grayColor);
  doc.text('• Implemented responsive web layouts and interactive interface components following modern web standards.', margin + 6, y);
  y += 12;

  // CodeAlpha
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text('UI/UX Design Intern — CodeAlpha', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  const exp2Type = 'Internship / Documentation';
  doc.text(exp2Type, pageWidth - margin - doc.getTextWidth(exp2Type), y);
  y += 10;
  doc.setTextColor(...grayColor);
  doc.text('• Formulated user journeys, interactive wireframes, and design system tokens for consistent digital user experiences.', margin + 6, y);
  y += 12;

  // --- CERTIFICATIONS ---
  drawSectionHeader('Certifications & Professional Development');
  const certs = [
    'Samsung: Big Data Professional Course',
    'Mastercard: Cybersecurity Fundamentals Course',
    'Google Cloud: Generative AI Fundamentals Certification',
    'Simplilearn: Machine Learning Foundations Course',
    'Tata: GenAI-Powered Data Analytics Specialization',
    'Web Development Professional Certification'
  ];

  for (let i = 0; i < certs.length; i += 2) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...grayColor);
    doc.text(`• ${certs[i]}`, margin + 6, y);
    if (certs[i + 1]) {
      doc.text(`• ${certs[i + 1]}`, margin + contentWidth / 2, y);
    }
    y += 11;
  }

  // Ensure output directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'prince-gour-resume.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

  console.log(`[Success] Real ATS-friendly PDF resume generated at: ${outputPath} (${pdfBytes.byteLength} bytes)`);
}

generateResume();
