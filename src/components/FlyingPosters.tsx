import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './FlyingPosters.css';

export interface PosterItem {
  id: string;
  image: string;
  title: string;
  company: string;
  role: string;
  type: string;
  date: string;
  refId?: string;
  badge?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  docUrl?: string;
}

interface FlyingPostersProps {
  items: PosterItem[];
  distortion?: number;
  planeWidth?: number;
  planeHeight?: number;
}

export const FlyingPosters: React.FC<FlyingPostersProps> = ({
  items,
  distortion = 2.5,
  planeWidth = 280,
  planeHeight = 395
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalPoster, setModalPoster] = useState<PosterItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // References for Three.js animation state
  const stateRef = useRef({
    progress: 0,
    targetProgress: 0,
    velocity: 0,
    isPointerDown: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    mouse: new THREE.Vector2(-9999, -9999),
    hoveredIndex: -1,
    meshes: [] as THREE.Mesh[],
    textures: [] as THREE.Texture[],
    aspect: 1,
    reqId: 0,
    isVisible: true
  });

  const count = items.length;

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check WebGL availability
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'))
      );
      setHasWebGL(supported);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    if (!hasWebGL || prefersReducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || count === 0) return;

    const state = stateRef.current;

    // When only 2 offer letters are present, alternate them across 4 3D planes for seamless rotation
    const displayItems: PosterItem[] = count === 2 ? [items[0], items[1], items[0], items[1]] : items;
    const totalPlanes = displayItems.length;
    const radius = 490; // 3D cylinder arc radius

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0b, 0.0013);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    state.aspect = width / height;

    const camera = new THREE.PerspectiveCamera(45, state.aspect, 10, 2000);
    camera.position.set(0, 0, 720);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting - Black and Orange theme highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff8c42, 1.7);
    dirLight.position.set(220, 320, 500);
    scene.add(dirLight);

    const orangeBackLight = new THREE.DirectionalLight(0xff6a00, 0.9);
    orangeBackLight.position.set(-220, -200, 350);
    scene.add(orangeBackLight);

    // 3. Texture Loader & Posters Meshes
    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const textures: THREE.Texture[] = [];

    // Plane geometry with segments for aerodynamic curvature
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

    displayItems.forEach((item, i) => {
      const texture = textureLoader.load(item.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
      });
      textures.push(texture);

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.42,
        metalness: 0.08
      });

      const mesh = new THREE.Mesh(geometry, material);
      (mesh as any).originalIndex = i % count;
      (mesh as any).planeIndex = i;
      scene.add(mesh);
      meshes.push(mesh);
    });

    state.meshes = meshes;
    state.textures = textures;

    // 4. Raycaster for hover & click
    const raycaster = new THREE.Raycaster();

    // 5. Visibility Observer: Pause rendering when off-screen to save GPU
    state.isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // 6. Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!state.isVisible) {
        state.reqId = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth lerp progress towards target
      const prevProgress = state.progress;
      state.progress += (state.targetProgress - state.progress) * 0.08;
      state.velocity = (state.progress - prevProgress) / dt;

      // Subtle continuous idle drift when not dragging
      if (!state.isPointerDown && Math.abs(state.velocity) < 0.05) {
        state.targetProgress += 0.0016;
      }

      // Update meshes along circular ribbon arc
      const angleStep = (Math.PI * 2) / totalPlanes;

      meshes.forEach((mesh, i) => {
        const angle = i * angleStep + state.progress;

        // Cylinder coordinates
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius * 0.88;
        const y = Math.sin(angle * 1.5 + time * 0.001) * 20;

        mesh.position.set(x, y, z);

        // Dynamic 3D rotation: face camera with wind tilt reacting to velocity
        const tiltY = -angle - Math.PI / 2;
        const tiltX = Math.sin(angle * 2 + time * 0.0015) * 0.09 + state.velocity * 0.018 * distortion;
        const tiltZ = Math.cos(angle) * 0.06;

        mesh.rotation.set(tiltX, tiltY + Math.PI / 2, tiltZ);

        // Hover scale & elevation
        const isHovered = state.hoveredIndex === i;
        const targetScale = isHovered ? 1.09 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

        if (isHovered) {
          mesh.position.z += 28;
        }

        // Opacity / Depth fade for posters farther away
        const distFromFront = Math.abs(Math.sin(angle));
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = THREE.MathUtils.lerp(1.0, 0.32, distFromFront);
        mat.transparent = true;
      });

      // Raycast to find hovered poster
      raycaster.setFromCamera(state.mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.planeIndex !== undefined) {
          state.hoveredIndex = hit.planeIndex;
        }
      } else {
        state.hoveredIndex = -1;
      }

      // Track active frontmost poster
      let closestPlaneIdx = 0;
      let maxZ = -99999;
      meshes.forEach((mesh, idx) => {
        if (mesh.position.z > maxZ) {
          maxZ = mesh.position.z;
          closestPlaneIdx = idx;
        }
      });
      setActiveIndex(closestPlaneIdx % count);

      renderer.render(scene, camera);
      state.reqId = requestAnimationFrame(animate);
    };

    state.reqId = requestAnimationFrame(animate);

    // 7. Event Handlers
    const handlePointerDown = (e: PointerEvent) => {
      state.isPointerDown = true;
      setIsDragging(true);
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (state.isPointerDown) {
        const deltaX = e.clientX - state.lastX;
        state.targetProgress += deltaX * 0.005;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!state.isPointerDown) return;
      state.isPointerDown = false;
      setIsDragging(false);

      // Check click threshold
      const dist = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);
      if (dist < 8) {
        raycaster.setFromCamera(state.mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const hit = intersects[0].object as any;
          if (hit.originalIndex !== undefined) {
            setModalPoster(items[hit.originalIndex]);
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      state.targetProgress += delta * 0.0022;
      e.preventDefault();
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      state.aspect = w / h;
      camera.aspect = state.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(state.reqId);
      visibilityObserver.disconnect();
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      meshes.forEach((m) => {
        scene.remove(m);
        m.geometry.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else {
          m.material.dispose();
        }
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [items, distortion, planeWidth, planeHeight, count, hasWebGL, prefersReducedMotion]);

  // Navigate between offer letters
  const rotateTo = useCallback(
    (index: number) => {
      const totalPlanes = count === 2 ? 4 : count;
      const angleStep = (Math.PI * 2) / totalPlanes;
      const targetAngle = -index * angleStep;
      stateRef.current.targetProgress = targetAngle;
      setActiveIndex(index % count);
    },
    [count]
  );

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + count) % count;
    rotateTo(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % count;
    rotateTo(nextIdx);
  };

  const activePoster = items[activeIndex] || items[0];

  // Accessible Fallback for Reduced Motion or Unsupported WebGL
  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div className="flying-posters-accessible-fallback" style={{ padding: '24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#141414',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #262626',
                cursor: 'pointer'
              }}
              onClick={() => setModalPoster(item)}
            >
              <img
                src={item.image}
                alt={`${item.company} ${item.role}`}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '14px', objectFit: 'contain', maxHeight: '340px' }}
              />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#F5F5F5', margin: '0 0 4px 0' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: '#FF8C42', margin: 0 }}>{item.company} &bull; {item.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flying-posters-wrapper">
      <div className="flying-posters-container" ref={containerRef}>
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="flying-posters-canvas" />

        {/* Ambient Stage Glow */}
        <div className="flying-posters-ambient" aria-hidden="true" />

        {/* Top Header Pill & Navigation */}
        <div className="flying-posters-header-overlay">
          <div className="flying-posters-pill">
            <span className="flying-posters-pill-dot" />
            <span>React Bits 3D &bull; Flying Posters Gallery</span>
          </div>

          <div className="flying-posters-nav-btns">
            <button
              type="button"
              className="flying-posters-nav-btn"
              onClick={handlePrev}
              title="Previous Offer Letter"
              aria-label="Previous Offer Letter"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="flying-posters-nav-btn"
              onClick={handleNext}
              title="Next Offer Letter"
              aria-label="Next Offer Letter"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Hover Hint */}
        <div className="flying-posters-hover-hint">
          {isDragging ? 'Gliding through 3D stream...' : 'Drag or scroll &bull; Click poster to inspect official offer letter'}
        </div>

        {/* Bottom Bar: Active Title & Dots */}
        <div className="flying-posters-bottom-bar">
          <div
            className="flying-posters-active-label"
            onClick={() => setModalPoster(activePoster)}
            style={{ cursor: 'pointer' }}
          >
            <span className="flying-posters-active-company">{activePoster.company}</span>
            <span className="flying-posters-active-title">
              {activePoster.title} {activePoster.refId ? `(${activePoster.refId})` : ''}
            </span>
          </div>

          <div className="flying-posters-dots-indicator">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`flying-posters-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => rotateTo(idx)}
                aria-label={`Jump to offer letter ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Verified Offer Letter Inspection */}
      {modalPoster && (
        <div
          className="flying-posters-modal-backdrop"
          onClick={() => setModalPoster(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flying-posters-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: High-Res Document Preview */}
            <div className="flying-posters-modal-image-col">
              <img
                src={modalPoster.image}
                alt={`${modalPoster.company} - ${modalPoster.title}`}
                className="flying-posters-modal-img"
              />
            </div>

            {/* Right: Verified Metadata & Content */}
            <div className="flying-posters-modal-info-col">
              <div>
                {/* Header Close */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: '#FF6A00',
                      fontFamily: 'var(--font-mono, monospace)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <ShieldCheck size={14} /> Official Internship Offer Letter
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalPoster(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#A1A1AA',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#F5F5F5', marginBottom: '4px' }}>
                  {modalPoster.title}
                </h3>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#FF8C42', marginBottom: '14px' }}>
                  {modalPoster.company} &bull; {modalPoster.role}
                </p>

                {modalPoster.refId && (
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 106, 0, 0.08)',
                      border: '1px solid rgba(255, 106, 0, 0.25)',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      color: '#FF8C42',
                      fontFamily: 'var(--font-mono, monospace)',
                      marginBottom: '16px'
                    }}
                  >
                    {modalPoster.refId}
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#71717A', marginBottom: '14px' }}>
                  Offer Date: <strong style={{ color: '#D4D4D8' }}>{modalPoster.date}</strong>
                </div>

                <p style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.6, marginBottom: '20px' }}>
                  {modalPoster.description}
                </p>

                {/* Key Contributions */}
                <div style={{ marginBottom: '20px' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#71717A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '8px'
                    }}
                  >
                    Internship Scope &amp; Deliverables
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {modalPoster.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#E4E4E7' }}>
                        <CheckCircle2 size={14} color="#FF6A00" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ borderTop: '1px solid #242424', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {modalPoster.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #2E2E2E',
                        color: '#A1A1AA'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={modalPoster.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ExternalLink size={15} />
                  <span>Open Full Resolution Offer Letter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyingPosters;
