import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Cpu, Globe, Code2, Terminal, Sparkles, GraduationCap, RotateCcw, ArrowDown } from 'lucide-react';
import { TrueFocus } from './TrueFocus';
import { FallingText, type FallingDetailItem } from './FallingText';
import { VariableProximity } from './VariableProximity';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isFallen, setIsFallen] = useState(false);
  const [fallOffsets, setFallOffsets] = useState<Record<string, number>>({});
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setItemRef = (key: string) => (el: HTMLElement | null) => {
    if (el) {
      itemRefs.current.set(key, el);
    } else {
      itemRefs.current.delete(key);
    }
  };

  // Details to be rendered in Falling Text effect as specified in prompt
  const personalDetails: FallingDetailItem[] = [
    {
      label: 'Education',
      value: 'Bachelor of Computer Applications (BCA) student'
    },
    {
      label: 'College',
      value: 'ITM, GIDA, Gorakhpur'
    },
    {
      label: 'Interests',
      value: 'Artificial Intelligence, software & web development'
    },
    {
      label: 'Career Goal',
      value: 'Continuously improve technical skills & build useful, innovative solutions'
    }
  ];

  // Compact skills & interests highlighted areas
  const focusAreas = [
    {
      icon: Cpu,
      title: 'Artificial Intelligence',
      description: 'Fascinated by AI-powered tools, LLM endpoints, and practical generative applications.'
    },
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Crafting responsive, high-performance web applications with clean design and usability.'
    },
    {
      icon: Code2,
      title: 'Software Development',
      description: 'Strengthening programming fundamentals, problem-solving abilities, and robust code.'
    }
  ];

  // Calculate exact drop distances so elements land right above the bottom border
  const calculateFallOffsets = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    // 36px padding above the bottom border
    const floorY = sectionRect.height - 36;

    const newOffsets: Record<string, number> = {};
    itemRefs.current.forEach((el, key) => {
      const elRect = el.getBoundingClientRect();
      const currentBottom = elRect.bottom - sectionRect.top;
      const dropDistance = floorY - currentBottom;
      newOffsets[key] = Math.max(0, dropDistance);
    });

    setFallOffsets(newOffsets);
  }, []);

  useEffect(() => {
    calculateFallOffsets();
    window.addEventListener('resize', calculateFallOffsets, { passive: true });
    return () => window.removeEventListener('resize', calculateFallOffsets);
  }, [calculateFallOffsets]);

  // Auto-refresh / restore when user returns/re-enters About section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let hasLeftSection = false;

    // 1. Intersection Observer: detect leaving and returning
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // User scrolled away from About section
          hasLeftSection = true;
        } else if (hasLeftSection && entry.isIntersecting) {
          // User returned/scrolled back into About section: automatically refresh and restore!
          hasLeftSection = false;
          setIsFallen(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    // 2. Navigation click: when clicking on any link pointing to #about
    const onAboutNavClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href="#about"]');
      if (target) {
        setIsFallen(false);
      }
    };
    document.addEventListener('click', onAboutNavClick);

    // 3. Hash change listener
    const onHashChange = () => {
      if (window.location.hash === '#about') {
        setIsFallen(false);
      }
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', onAboutNavClick);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // Tap handler on "About Me" to toggle falling & resting on bottom border
  const toggleFall = () => {
    calculateFallOffsets();
    setIsFallen(prev => !prev);
  };

  // Helper to compute physical falling transform to bottom border
  const getFallTransform = (key: string, rotDeg = 0, scatterX = 0, delaySec = 0): React.CSSProperties => {
    const dropY = fallOffsets[key] || 380;
    return {
      transform: isFallen
        ? `translate3d(${scatterX}px, ${dropY}px, 0) rotate(${rotDeg}deg)`
        : 'translate3d(0, 0, 0) rotate(0deg)',
      transitionDelay: isFallen ? `${delaySec}s` : '0s',
      position: 'relative',
      zIndex: isFallen ? 10 : 1,
      boxShadow: isFallen ? '0 12px 28px rgba(0, 0, 0, 0.75)' : undefined
    };
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
      style={{
        backgroundColor: '#0B0B0B',
        borderBottom: '1px solid #222222',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          {/* Orange Highlighted Phrase Badge & Tap Trigger */}
          <div
            onClick={toggleFall}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #303030',
              marginBottom: '16px',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'border-color 0.2s ease, transform 0.2s ease'
            }}
            title="Tap to trigger falling effect to the bottom border"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#FF6A00',
                display: 'inline-block',
                boxShadow: '0 0 8px rgba(255, 106, 0, 0.6)'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FF6A00', letterSpacing: '0.04em' }}>
              Developer in Progress
            </span>
            <span style={{ width: '1px', height: '12px', backgroundColor: '#333333' }} />
            <span style={{ fontSize: '11px', color: '#A1A1AA', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {isFallen ? <RotateCcw size={11} color="#FF6A00" /> : <ArrowDown size={11} color="#FF6A00" />}
              <span>{isFallen ? 'Tap to Restore' : 'Tap About Me to Fall'}</span>
            </span>
          </div>

          {/* Interactive Tap-to-Fall "About Me" Heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <h2
              onClick={toggleFall}
              className="section-title"
              style={{
                color: '#F5F5F5',
                margin: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                userSelect: 'none'
              }}
              title="Click or tap to drop elements to the bottom border"
            >
              <span>About Me</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: isFallen ? '#27C93F' : '#FF6A00',
                  border: isFallen ? '1px solid #27C93F' : '1px solid #FF6A00',
                  backgroundColor: isFallen ? 'rgba(39, 201, 63, 0.1)' : 'rgba(255, 106, 0, 0.1)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isFallen ? <RotateCcw size={10} /> : <ArrowDown size={10} />}
                <span>{isFallen ? 'RESTORE' : 'TAP TO FALL'}</span>
              </span>
            </h2>
          </div>

          {/* Interactive TrueFocus Name & Identity Header (Falls to bottom border on tap) */}
          <div
            ref={setItemRef('focusName')}
            className="about-fall-item"
            style={{
              ...getFallTransform('focusName', -5, -12, 0.04),
              fontSize: 'clamp(22px, 3.2vw, 32px)',
              fontWeight: 800,
              color: '#F5F5F5',
              marginTop: '12px'
            }}
          >
            <span style={{ color: '#A1A1AA', fontWeight: 600, marginRight: '8px' }}>Hi, I&apos;m</span>
            <TrueFocus
              sentence="Prince Gour"
              borderColor="#FF6A00"
              glowColor="rgba(255, 106, 0, 0.45)"
              blurAmount={4}
              animationDuration={0.35}
              pauseBetweenAnimations={1.6}
            />
          </div>
        </div>

        {/* 2-Column Content Layout: Elements drop & rest on bottom border without disappearing */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '40px',
            alignItems: 'start'
          }}
          className="about-grid"
        >
          {/* Left Column: Polished Narrative Content & Compact Interest Areas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Polished About Me Content Paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p
                ref={setItemRef('p1')}
                className="about-fall-item"
                style={{
                  ...getFallTransform('p1', 4, 15, 0.08),
                  fontSize: '16px',
                  lineHeight: 1.75,
                  color: '#F5F5F5',
                  margin: 0
                }}
              >
                <VariableProximity
                  label="Hi, I'm Prince Gour, a BCA student at ITM, GIDA, Gorakhpur, with a strong interest in Artificial Intelligence, software development, and web development."
                  fromFontVariationSettings="'wght' 400"
                  toFontVariationSettings="'wght' 850"
                  radius={75}
                  falloff="gaussian"
                  baseColor="#F5F5F5"
                  activeColor="#FF8C42"
                />
              </p>

              <p
                ref={setItemRef('p2')}
                className="about-fall-item"
                style={{
                  ...getFallTransform('p2', -3, -10, 0.12),
                  fontSize: '15px',
                  lineHeight: 1.75,
                  color: '#A1A1AA',
                  margin: 0
                }}
              >
                <VariableProximity
                  label="I enjoy exploring new technologies, learning how software works, and turning ideas into practical digital experiences. I'm particularly interested in AI-powered applications and building modern websites that combine functionality, usability, and clean design."
                  fromFontVariationSettings="'wght' 350"
                  toFontVariationSettings="'wght' 800"
                  radius={70}
                  falloff="gaussian"
                  baseColor="#A1A1AA"
                  activeColor="#FF8C42"
                />
              </p>

              <p
                ref={setItemRef('p3')}
                className="about-fall-item"
                style={{
                  ...getFallTransform('p3', 5, 12, 0.16),
                  fontSize: '15px',
                  lineHeight: 1.75,
                  color: '#A1A1AA',
                  margin: 0
                }}
              >
                <VariableProximity
                  label="As I continue my learning journey, I'm focused on strengthening my programming skills, improving my problem-solving abilities, and developing projects that help me gain practical experience. My goal is to grow as a developer and contribute to creating meaningful technology-driven solutions."
                  fromFontVariationSettings="'wght' 350"
                  toFontVariationSettings="'wght' 800"
                  radius={70}
                  falloff="gaussian"
                  baseColor="#A1A1AA"
                  activeColor="#FF8C42"
                />
              </p>
            </div>

            {/* Compact Skills & Interests Highlight Area */}
            <div style={{ paddingTop: '8px' }}>
              <h3
                ref={setItemRef('interestsTitle')}
                className="about-fall-item"
                style={{
                  ...getFallTransform('interestsTitle', -2, -6, 0.18),
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#FF6A00',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <Sparkles size={14} />
                <span>Core Interests & Focus</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {focusAreas.map((area, idx) => {
                  const Icon = area.icon;
                  const key = `card-${idx}`;
                  const rot = idx === 0 ? -4 : idx === 1 ? 5 : -3;
                  const scX = idx === 0 ? -14 : idx === 1 ? 16 : -8;
                  const delay = 0.2 + idx * 0.04;

                  return (
                    <div
                      key={idx}
                      ref={setItemRef(key)}
                      className="about-fall-item"
                      style={{
                        ...getFallTransform(key, rot, scX, delay),
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 16px',
                        backgroundColor: '#161616',
                        border: '1px solid #262626',
                        borderRadius: '10px'
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 106, 0, 0.12)',
                          border: '1px solid rgba(255, 106, 0, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        <Icon size={18} color="#FF6A00" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#F5F5F5', marginBottom: '3px' }}>
                          {area.title}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.5, margin: 0 }}>
                          {area.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Element & Falling Text Personal Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Minimal Visual Element: Coding / Developer Terminal Card */}
            <div
              ref={setItemRef('terminal')}
              className="about-fall-item"
              style={{
                ...getFallTransform('terminal', 4, 18, 0.1),
                backgroundColor: '#141414',
                border: '1px solid #262626',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#A1A1AA' }}>
                  <Terminal size={12} color="#FF6A00" />
                  <span>prince@itm-gida:~</span>
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12.5px', lineHeight: 1.6, color: '#A1A1AA' }}>
                <div>
                  <span style={{ color: '#FF6A00' }}>const</span> student = &#123;
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  name: <span style={{ color: '#F5F5F5' }}>&quot;Prince Gour&quot;</span>,
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  degree: <span style={{ color: '#F5F5F5' }}>&quot;BCA (Computer Applications)&quot;</span>,
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  institute: <span style={{ color: '#F5F5F5' }}>&quot;ITM, GIDA, Gorakhpur&quot;</span>,
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  status: <span style={{ color: '#27C93F' }}>&quot;Actively Learning &amp; Building&quot;</span>
                </div>
                <div>&#125;;</div>
              </div>
            </div>

            {/* Falling Text Component with interactive physics + synced with tap falling */}
            <div
              ref={setItemRef('highlights')}
              className="about-fall-item"
              style={getFallTransform('highlights', -3, -12, 0.22)}
            >
              <FallingText
                items={personalDetails}
                gravity={0.55}
                bounciness={0.5}
                isSectionFallen={isFallen}
              />
            </div>

            {/* Quick College Callout */}
            <div
              ref={setItemRef('callout')}
              className="about-fall-item"
              style={{
                ...getFallTransform('callout', 3, 14, 0.28),
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 106, 0, 0.05)',
                border: '1px solid rgba(255, 106, 0, 0.2)',
                borderRadius: '8px'
              }}
            >
              <GraduationCap size={20} color="#FF6A00" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: '#A1A1AA', lineHeight: 1.4 }}>
                Undergraduate candidate enrolled at <strong style={{ color: '#F5F5F5' }}>ITM, GIDA, Gorakhpur</strong>, specializing in application development &amp; AI technologies.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Smooth physics falling transition */
        .about-fall-item {
          transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.4s ease;
          will-change: transform;
          opacity: 1 !important;
          filter: none !important;
        }

        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
