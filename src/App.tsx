import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { ResumeSection } from './components/ResumeSection';
import { SocialSection } from './components/SocialSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const sections = [
      'hero',
      'about',
      'skills',
      'projects',
      'education',
      'certifications',
      'resume',
      'social',
      'contact'
    ];

    // Section indicator observer
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });

    // React Bits Universal Edge Border Glow
    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        '.card, .project-card-grid, .skill-flip-face, .reactbits-folder-body, .resume-card, .social-platform-card, .terminal-window, .flex-carousel-card'
      );
      if (target && target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      navObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0B0B', color: '#F5F5F5', position: 'relative' }}>
      <Navbar activeSection={activeSection} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <ResumeSection />
        <SocialSection />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;
