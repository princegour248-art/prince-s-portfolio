import { jsPDF } from 'jspdf';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

/**
 * Generates and triggers download of an authentic, ATS-friendly PDF resume
 * with selectable text, clickable links, and precise typography.
 */
export function generateClientResumePdf(): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const darkColor = [24, 24, 27] as const;       // Charcoal #18181B
  const grayColor = [82, 82, 91] as const;       // Zinc #52525B
  const lightGray = [113, 113, 122] as const;    // Muted #71717A
  const orangeColor = [232, 117, 36] as const;   // Primary orange #E87524
  const lineColor = [228, 228, 231] as const;    // Divider line #E4E4E7

  function drawSectionHeader(title: string) {
    y += 14;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...orangeColor);
    doc.text(title.toUpperCase(), margin, y);
    
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
  doc.text(PORTFOLIO_CONFIG.personal.name.toUpperCase(), margin, y);
  y += 16;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...orangeColor);
  doc.text(PORTFOLIO_CONFIG.personal.headline, margin, y);
  y += 14;

  // Contact line
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const contactText = `Email: ${PORTFOLIO_CONFIG.personal.contact.email}  |  GitHub: github.com/${PORTFOLIO_CONFIG.personal.contact.githubUsername}  |  LinkedIn: linkedin.com/in/prince-gour-468b17315  |  Location: ${PORTFOLIO_CONFIG.personal.contact.location}`;
  doc.text(contactText, margin, y);
  y += 6;

  // --- SUMMARY ---
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
  PORTFOLIO_CONFIG.skills.forEach(sc => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkColor);
    doc.text(`${sc.title}: `, margin, y);
    const labelWidth = doc.getTextWidth(`${sc.title}: `);
    
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(sc.skills.join(', '), margin + labelWidth, y);
    y += 12;
  });

  // --- FEATURED PROJECTS ---
  drawSectionHeader('Featured Projects');
  const featured = PORTFOLIO_CONFIG.projects.filter(p => !p.isPlaceholder);

  featured.forEach(p => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkColor);
    doc.text(p.title, margin, y);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...lightGray);
    const meta = p.tags.slice(0, 5).join(', ');
    doc.text(meta, pageWidth - margin - doc.getTextWidth(meta), y);
    y += 11;

    doc.setFontSize(8.5);
    doc.setTextColor(...grayColor);
    p.features.slice(0, 3).forEach(b => {
      doc.text('•', margin + 6, y);
      const lines = doc.splitTextToSize(b, contentWidth - 16);
      doc.text(lines, margin + 16, y);
      y += lines.length * 10.5;
    });
    y += 3;
  });

  // --- EDUCATION ---
  drawSectionHeader('Education');
  const edu = PORTFOLIO_CONFIG.education[0];
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text(edu.degree, margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...lightGray);
  doc.text(edu.period, pageWidth - margin - doc.getTextWidth(edu.period), y);
  y += 11;

  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  doc.text(`Relevant Coursework: ${edu.coursework.slice(0, 5).join(', ')}`, margin, y);
  y += 12;

  // --- INTERNSHIPS ---
  drawSectionHeader('Internship Experience');
  PORTFOLIO_CONFIG.experience.forEach(exp => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkColor);
    doc.text(`${exp.role} — ${exp.company}`, margin, y);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...lightGray);
    doc.text(exp.type, pageWidth - margin - doc.getTextWidth(exp.type), y);
    y += 10;
    doc.setTextColor(...grayColor);
    doc.text(`• ${exp.description}`, margin + 6, y);
    y += 12;
  });

  // --- CERTIFICATIONS ---
  drawSectionHeader('Certifications & Professional Courses');
  const certList = PORTFOLIO_CONFIG.certifications.map(c => `${c.issuer}: ${c.title}`);
  for (let i = 0; i < certList.length; i += 2) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...grayColor);
    doc.text(`• ${certList[i]}`, margin + 6, y);
    if (certList[i + 1]) {
      doc.text(`• ${certList[i + 1]}`, margin + contentWidth / 2, y);
    }
    y += 11;
  }

  doc.save('prince-gour-resume.pdf');
}
