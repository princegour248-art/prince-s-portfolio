# Prince Gour — Developer Portfolio + Resume + QR Code

A production-ready, minimal, professional personal developer portfolio for **Prince Gour** (AI Enthusiast | Aspiring Software Developer | Web Developer).

Built strictly according to the **Orange-and-Black** minimal editorial design system, completely free of AI-slop, glowing neon cards, or fake statistics.

---

## 🎨 1. Design Direction & Color Palette

- **Main Background**: `#111111`
- **Secondary Background**: `#1A1A1A`
- **Primary Orange**: `#E87524` (buttons, active states, key icons, badges)
- **Hover Orange**: `#F28C38`
- **Primary Text**: `#F5F2ED` (high contrast, readable)
- **Secondary Text**: `#A6A6A6` (zinc body text)
- **Borders**: `#303030` (subtle structural separation)
- **Typography**: Inter (UI & Headings) + JetBrains Mono (Code & Tags)

---

## 🚀 2. Features Included

1. **Hero Section**:
   - Name, headline, professional summary, quick metrics
   - 5 Working CTAs: Explore Projects, Download Resume, View GitHub, Connect on LinkedIn, Contact Me
   - Geometric monogram avatar badge (`PG`)
2. **About Me**: Authentic BCA journey, problem-solving mindset, and 4 core technical pillars
3. **Technical Skills**: Categorized skills (Programming, Frontend, Backend, AI/ML, Databases, Tools, Design) without arbitrary percentage bars
4. **Featured Projects**:
   - **Master Sahab — AI Student Assistant**: Study timetable, 3D active recall flashcards, practice quizzes, FastAPI backend, local-first offline fallback
   - **College Complaint Management Portal**: Anonymous grievance submission, RBAC roles, real-time ticket state tracking
   - **Future Projects**: Modular configurable template
5. **Education**: BCA degree path, relevant coursework, and learning trajectory
6. **Certifications**: Samsung (Big Data), Mastercard (Cybersecurity), Google Cloud (GenAI), Simplilearn (ML), Tata (Data Analytics), Web Dev
7. **Internship Experience**: Cognifyz Technologies (Web Development), CodeAlpha (UI/UX)
8. **Professional Resume (Real PDF)**:
   - Real, selectable ATS-friendly PDF (`public/prince-gour-resume.pdf`)
   - Pre-generated at build time via `jspdf`
   - Client-side dynamic generator fallback for on-the-fly downloads
9. **Live GitHub Integration**:
   - Directly fetches Prince's public repositories from `api.github.com/users/princegour248-art/repos`
   - Real star counts, fork counts, and primary language indicators
   - Fallback metadata if offline or rate-limited
10. **Automatic Portfolio QR Code**:
    - Dedicated "Scan to View My Portfolio" section
    - Real scannable high-contrast black-and-white QR code on white background
    - Download high-res PNG (512x512 / 1024x1024) button
    - Download vector SVG button
    - Copy portfolio link button with feedback toast
    - Print-ready previews (Business Card & Resume Badge formats)
11. **Contact Section**:
    - Direct verified email (`mailto:`)
    - Validated form preparing pre-formatted email inquiries
    - Direct GitHub and LinkedIn links

---

## 🛠️ 3. Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailored Modern CSS Design System with CSS variables
- **Icons**: Lucide React + custom GitHub/LinkedIn SVGs
- **QR Engine**: `qrcode` (PNG + SVG generation)
- **PDF Engine**: `jspdf` (ATS single-page PDF generator)

---

## 📁 4. Project Structure

```
prince-gour-portfolio/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.svg             # Monogram favicon
│   ├── prince-gour-resume.pdf  # Real ATS-friendly PDF resume
│   ├── portfolio-qr.png        # High-res scannable QR PNG
│   └── portfolio-qr.svg        # Scalable QR vector SVG
├── scripts/
│   ├── generatePdfResume.cjs   # Build-time PDF resume generator
│   ├── generateQrCode.cjs      # Build-time QR code generator
│   └── verifyPortfolio.cjs     # 32-point automated verification test suite
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Responsive navbar + mobile drawer
│   │   ├── Hero.tsx            # Hero with 5 action buttons
│   │   ├── About.tsx           # Authentic BCA & engineering focus
│   │   ├── Skills.tsx          # Categorized technical skills
│   │   ├── Projects.tsx        # Responsive project cards & schematics
│   │   ├── Education.tsx       # BCA education details
│   │   ├── Certifications.tsx  # Verified course completions
│   │   ├── Experience.tsx      # Cognifyz & CodeAlpha internships
│   │   ├── ResumeSection.tsx   # ATS resume preview & download
│   │   ├── GithubSection.tsx   # Live GitHub API repos
│   │   ├── QRCodeSection.tsx   # Scannable QR & print-ready layouts
│   │   ├── Contact.tsx         # Validated message form & direct email
│   │   ├── Footer.tsx          # Back to top & copyright
│   │   └── icons.tsx           # GitHub & LinkedIn SVG icons
│   ├── data/
│   │   └── portfolioData.ts    # Central editable configuration
│   ├── utils/
│   │   ├── generateResumePdf.ts# Client-side dynamic PDF generation
│   │   └── qrCodeHelper.ts     # QR code download helpers
│   ├── App.tsx                 # Root layout & section intersection observer
│   ├── index.css               # Orange-and-black design tokens
│   └── main.tsx
├── index.html                  # SEO & OpenGraph meta tags
├── package.json
└── vite.config.ts
```

---

## ⚙️ 5. How to Edit Portfolio Data

All information is centrally managed in a single file:
[`src/data/portfolioData.ts`](file:///C:/Users/DELL/prince-gour-portfolio/src/data/portfolioData.ts)

To customize:
1. Open `src/data/portfolioData.ts`.
2. Edit personal bio, LinkedIn URL, email, college name, or project links.
3. Run `npm run build:resume` to update the physical PDF resume automatically!

---

## 💻 6. Local Development

```bash
# 1. Navigate to the project directory
cd prince-gour-portfolio

# 2. Start Vite local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🏗️ 7. Production Build & Verification

```bash
# Generate physical resume PDF, static QR assets, check TypeScript, and bundle:
npm run build

# Run the 32-point automated audit test suite:
node scripts/verifyPortfolio.cjs
```

---

## 🌐 8. Free Deployment Instructions

### Option A: Free Vercel Deployment (Recommended — 2 Minutes)
1. Push your repository to GitHub (`https://github.com/princegour248-art/portfolio`).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `portfolio` repository.
4. Keep the default settings (Framework: Vite, Root: `./`, Build command: `npm run build`, Output: `dist`).
5. Click **Deploy**. Vercel will grant you a free public HTTPS domain: `https://your-portfolio.vercel.app`.
6. Once deployed, update `canonicalUrl` in `src/data/portfolioData.ts` to your Vercel URL and run `npm run build:qr`.

### Option B: Free GitHub Pages Deployment
1. Create a GitHub repo named `portfolio` under your account `princegour248-art`.
2. Push your project code to GitHub.
3. On GitHub, navigate to **Settings > Pages > Build and deployment**.
4. Set **Source** to **GitHub Actions**.
5. The pre-configured `.github/workflows/deploy.yml` workflow will automatically trigger, build the website, generate the resume PDF, and deploy your portfolio to:
   ```
   https://princegour248-art.github.io/portfolio/
   ```
6. The QR code on your website already points directly to this canonical GitHub Pages URL!

---

## 📱 9. Automatic QR Code Usage

- **Destination**: Encodes canonical public HTTPS URL (`https://princegour248-art.github.io/portfolio`).
- **Scanning**: Open any standard smartphone camera app (iOS Camera or Android Google Lens) and point it at the QR code on screen or printed material. It opens the portfolio directly.
- **Downloading**: Click **"Download QR Code (PNG)"** for high-resolution graphics, or **"Download Vector (SVG)"** for sharp print scaling on business cards and resumes.
