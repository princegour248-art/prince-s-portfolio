import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sparkles } from 'lucide-react';
import frontCardImg from '../assets/id-card-front.jpeg';
import backCardImg from '../assets/id-card-back.jpeg';
import './Lanyard.css';

interface LanyardProps {
  className?: string;
}

// Generates royal blue woven lanyard strap with white "ITM" branding
function createLanyardStrapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Royal Blue base strap
  ctx.fillStyle = '#0F3460';
  ctx.fillRect(0, 0, 1024, 128);

  // Woven side border bands
  ctx.fillStyle = '#082142';
  ctx.fillRect(0, 0, 1024, 12);
  ctx.fillRect(0, 116, 1024, 12);

  // Inner subtle edge highlight
  ctx.fillStyle = '#1D5BB0';
  ctx.fillRect(0, 12, 1024, 3);
  ctx.fillRect(0, 113, 1024, 3);

  // Woven technical cloth pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let i = 0; i < 1024; i += 10) {
    ctx.fillRect(i, 15, 5, 98);
  }

  // White "ITM" repeated along the strap
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 68px "Inter", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const segments = 4;
  for (let i = 0; i < segments; i++) {
    const cx = (1024 / segments) * (i + 0.5);
    ctx.fillText('ITM', cx, 66);

    // Subtle divider dot between segments
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc((1024 / segments) * (i + 1), 66, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Lanyard: React.FC<LanyardProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleFlipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 540;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, -0.05, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'lanyard-canvas';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(4, 7, 8);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Soft warm accent rim light
    const rimLight = new THREE.PointLight(0xE87524, 2.8, 14);
    rimLight.position.set(-4, -1, 5);
    scene.add(rimLight);

    const topFill = new THREE.PointLight(0x4A90E2, 1.8, 10);
    topFill.position.set(0, 4, 4);
    scene.add(topFill);

    // 3. Textures
    const textureLoader = new THREE.TextureLoader();

    // Front ID card texture
    const frontTex = textureLoader.load(frontCardImg);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.minFilter = THREE.LinearMipmapLinearFilter;
    frontTex.magFilter = THREE.LinearFilter;
    frontTex.generateMipmaps = true;

    // Back ID card texture (flipped horizontally so when card flips 180 deg it reads normally)
    const backTex = textureLoader.load(backCardImg);
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.minFilter = THREE.LinearMipmapLinearFilter;
    backTex.magFilter = THREE.LinearFilter;
    backTex.generateMipmaps = true;
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.repeat.x = -1;
    backTex.offset.x = 1;

    // Blue ITM lanyard strap texture
    const strapTex = createLanyardStrapTexture();

    // 4. Badge Mesh Assembly
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    const cardWidth = 2.65;
    const cardHeight = 4.15;
    const cardDepth = 0.055;

    // Multi-material for box geometry: [right, left, top, bottom, front, back]
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.35,
      metalness: 0.7
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.28,
      metalness: 0.1
    });

    // Halftone Reveal Shader Uniforms for the back image (React Bits Halftone Reveal)
    const halftoneUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.32 },
      uEdgeSoftness: { value: 0.09 },
      uDotSize: { value: 72.0 },
      uHover: { value: 0.8 },
      uResolution: { value: new THREE.Vector2(1.0, cardHeight / cardWidth) },
      uAccentColor: { value: new THREE.Color('#FF6A00') }
    };

    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.28,
      metalness: 0.1
    });

    // Inject React Bits Halftone Reveal GLSL Shader into backMat
    backMat.customProgramCacheKey = () => 'reactbits-halftone-reveal-v1';
    backMat.onBeforeCompile = (shader: any) => {
      shader.uniforms.uTime = halftoneUniforms.uTime;
      shader.uniforms.uMouse = halftoneUniforms.uMouse;
      shader.uniforms.uRadius = halftoneUniforms.uRadius;
      shader.uniforms.uEdgeSoftness = halftoneUniforms.uEdgeSoftness;
      shader.uniforms.uDotSize = halftoneUniforms.uDotSize;
      shader.uniforms.uHover = halftoneUniforms.uHover;
      shader.uniforms.uResolution = halftoneUniforms.uResolution;
      shader.uniforms.uAccentColor = halftoneUniforms.uAccentColor;

      shader.fragmentShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uRadius;
        uniform float uEdgeSoftness;
        uniform float uDotSize;
        uniform float uHover;
        uniform vec2 uResolution;
        uniform vec3 uAccentColor;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #ifdef USE_MAP
          vec4 baseTex = texture2D( map, vMapUv );

          // 1. Calculate luminance of underlying photo
          float lum = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));

          // 2. Halftone 45-degree angled screen grid
          vec2 aspectUV = vec2(vMapUv.x * uResolution.x, vMapUv.y * uResolution.y);
          float angle = 0.785398; // 45 deg
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          vec2 rotUV = rot * (aspectUV * uDotSize);

          vec2 cell = fract(rotUV) - 0.5;
          float distFromCell = length(cell);

          // Subtle ambient wave undulation through halftone dots
          float wave = sin(rotUV.x * 0.18 + rotUV.y * 0.18 + uTime * 2.4) * 0.05;
          float dotRadius = clamp(sqrt(clamp(lum, 0.0, 1.0)) * 0.52 + wave * (1.0 - uHover * 0.5), 0.03, 0.65);

          // Smooth antialiased circular dot mask
          float dotSmooth = 0.07;
          float dotMask = 1.0 - smoothstep(dotRadius - dotSmooth, dotRadius + dotSmooth, distFromCell);

          // Halftone Color Palette: Obsidian dark card with luminous silver & warm orange dots
          vec3 dotColor = mix(vec3(0.92, 0.92, 0.96), uAccentColor, 0.35 * (1.0 - lum));
          vec3 halftoneBg = vec3(0.05, 0.05, 0.07);
          vec3 halftoneColor = mix(halftoneBg, dotColor, dotMask);

          // 3. Interactive Reveal Spotlight from Cursor / Touch
          vec2 diff = vMapUv - uMouse;
          diff.y *= uResolution.y / uResolution.x;
          float distToMouse = length(diff);

          float activeRadius = uRadius * mix(0.75, 1.0, uHover);
          float reveal = 1.0 - smoothstep(activeRadius - uEdgeSoftness, activeRadius + uEdgeSoftness, distToMouse);
          reveal *= clamp(uHover * 1.2, 0.0, 1.0);

          // 4. Luminous orange rim glow at reveal edge
          float rimDist = abs(distToMouse - activeRadius);
          float rimGlow = (1.0 - smoothstep(0.0, uEdgeSoftness * 1.1, rimDist)) * uHover;
          vec3 glowColor = uAccentColor * 1.8;

          // 5. Final Composite: Halftone Pattern -> Crisp Original Photo + Glowing Edge
          vec3 finalColor = mix(halftoneColor, baseTex.rgb, reveal);
          finalColor += glowColor * rimGlow * 0.8;

          vec4 sampledDiffuseColor = vec4(finalColor, baseTex.a);
          diffuseColor *= sampledDiffuseColor;
        #endif
        `
      );
    };

    const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
    const cardMesh = new THREE.Mesh(cardGeo, [
      edgeMat,
      edgeMat,
      edgeMat,
      edgeMat,
      frontMat,
      backMat
    ]);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    badgeGroup.add(cardMesh);

    // Clear acrylic protective casing around the card
    const frameGeo = new THREE.BoxGeometry(cardWidth + 0.1, cardHeight + 0.1, cardDepth + 0.02);
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.45
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    badgeGroup.add(frameMesh);

    // Metallic Swivel Clip at the top of the badge
    const clipGroup = new THREE.Group();
    clipGroup.position.set(0, cardHeight / 2 + 0.16, 0);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xE0E0E0,
      metalness: 0.95,
      roughness: 0.18
    });

    // Swivel ring
    const ringGeo = new THREE.TorusGeometry(0.14, 0.035, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.rotation.x = Math.PI / 2;
    clipGroup.add(ringMesh);

    // Metallic bracket body
    const bracketGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.26, 16);
    const bracketMesh = new THREE.Mesh(bracketGeo, metalMat);
    bracketMesh.position.set(0, 0.14, 0);
    clipGroup.add(bracketMesh);

    badgeGroup.add(clipGroup);

    // 5. Hanging Blue Lanyard Strap (Procedural Curve)
    const anchorY = 4.3;
    const ropeSegments = 8;
    const ropeNodes: THREE.Vector3[] = [];
    for (let i = 0; i <= ropeSegments; i++) {
      const t = i / ropeSegments;
      ropeNodes.push(new THREE.Vector3(0, anchorY - t * 3.8, 0));
    }

    const strapCurve = new THREE.CatmullRomCurve3(ropeNodes);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
    const strapMat = new THREE.MeshStandardMaterial({
      map: strapTex,
      roughness: 0.55,
      metalness: 0.1
    });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    scene.add(strapMesh);

    // 6. Physics Simulation State
    const cardPos = new THREE.Vector3(0, 0.1, 0);
    const cardVel = new THREE.Vector3(0, 0, 0);
    let cardRotZ = 0;
    let cardRotX = 0;
    let cardRotY = 0;
    let targetRotY = 0; // Flip angle (0 = Front, Math.PI = Back)
    let rotVelZ = 0;
    let rotVelX = 0;

    // Mouse / Drag interaction state
    let isDragging = false;
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planeIntersect = new THREE.Vector3();
    const prevMouseWorld = new THREE.Vector3();
    const mouseWorldVel = new THREE.Vector3();
    let lastTime = performance.now();

    // Halftone Reveal pointer coordinates
    const targetMouseUv = new THREE.Vector2(0.5, 0.5);
    let isPointerOverCard = false;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: update rope geometry on every frame
    const updateStrap = () => {
      const topAnchor = new THREE.Vector3(0, anchorY, 0);
      const clipWorldPos = new THREE.Vector3();
      clipGroup.getWorldPosition(clipWorldPos);
      clipWorldPos.y += 0.14;

      for (let i = 0; i <= ropeSegments; i++) {
        const t = i / ropeSegments;
        const base = new THREE.Vector3().lerpVectors(topAnchor, clipWorldPos, t);
        const sag = Math.sin(t * Math.PI) * 0.22 * (1 - Math.abs(cardPos.x) * 0.2);
        base.z += sag;
        ropeNodes[i].copy(base);
      }

      strapCurve.points = ropeNodes;
      strapMesh.geometry.dispose();
      strapMesh.geometry = new THREE.TubeGeometry(strapCurve, 32, 0.07, 8, false);
    };

    // Pointer Event Handlers (Drag, Swing, Halftone UV Tracking)
    const onPointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([cardMesh, frameMesh]);

      if (intersects.length > 0) {
        isDragging = true;
        setHintVisible(false);
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {
          // ignore capture fallback
        }

        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), cardPos);
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);
        prevMouseWorld.copy(planeIntersect);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Track UV coordinates for Halftone Reveal on card face
      const intersects = raycaster.intersectObjects([cardMesh, frameMesh]);
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.uv) {
          targetMouseUv.set(1.0 - hit.uv.x, hit.uv.y);
        } else {
          const localPoint = cardMesh.worldToLocal(hit.point.clone());
          const nx = Math.max(0, Math.min(1, (localPoint.x + cardWidth / 2) / cardWidth));
          const ny = Math.max(0, Math.min(1, (localPoint.y + cardHeight / 2) / cardHeight));
          targetMouseUv.set(nx, ny);
        }
        isPointerOverCard = true;
      } else {
        isPointerOverCard = false;
      }

      if (isDragging) {
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
          planeIntersect.x = Math.max(-2.8, Math.min(2.8, planeIntersect.x));
          planeIntersect.y = Math.max(-2.4, Math.min(1.8, planeIntersect.y));

          mouseWorldVel.subVectors(planeIntersect, prevMouseWorld);
          prevMouseWorld.copy(planeIntersect);

          cardPos.x += (planeIntersect.x - cardPos.x) * 0.45;
          cardPos.y += (planeIntersect.y - cardPos.y) * 0.45;
        }
      } else {
        const swayForceX = mouse.x * 0.08;
        cardVel.x += swayForceX * 0.12;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        try {
          renderer.domElement.releasePointerCapture(e.pointerId);
        } catch {
          // capture release fallback
        }

        cardVel.x += Math.max(-4.5, Math.min(4.5, mouseWorldVel.x * 18));
        cardVel.y += Math.max(-4.5, Math.min(4.5, mouseWorldVel.y * 18));
      }
    };

    // Toggle card flip (Front to Back with Halftone Reveal)
    const doFlip = () => {
      targetRotY = targetRotY === 0 ? Math.PI : 0;
      setIsFlipped(targetRotY !== 0);
      setHintVisible(false);
    };
    toggleFlipRef.current = doFlip;

    let clickTimeout: number | null = null;
    const onClick = () => {
      if (!clickTimeout) {
        clickTimeout = window.setTimeout(() => {
          clickTimeout = null;
          doFlip();
        }, 180);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('click', onClick);

    // Resize handling
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 540;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Pause when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 7. Animation Loop with Verlet/Spring Physics
    let animId: number;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      if (!isVisible) return;

      const dt = Math.min(0.04, (now - lastTime) / 1000 || 0.016);
      lastTime = now;

      if (!isDragging && !prefersReduced) {
        const springK = 18;
        const damping = 0.94;

        const forceX = -springK * cardPos.x;
        const forceY = -springK * (cardPos.y - 0.1);

        cardVel.x = (cardVel.x + forceX * dt) * damping;
        cardVel.y = (cardVel.y + forceY * dt) * damping;

        cardPos.x += cardVel.x * dt;
        cardPos.y += cardVel.y * dt;
      }

      // Angular rotation physics
      const targetAngleZ = -cardPos.x * 0.45 - cardVel.x * 0.06;
      const targetAngleX = (cardPos.y - 0.1) * 0.35 + cardVel.y * 0.04;

      rotVelZ = (rotVelZ + (targetAngleZ - cardRotZ) * 22 * dt) * 0.88;
      rotVelX = (rotVelX + (targetAngleX - cardRotX) * 22 * dt) * 0.88;

      cardRotZ += rotVelZ * dt;
      cardRotX += rotVelX * dt;

      // Smooth card flip Y rotation
      cardRotY += (targetRotY - cardRotY) * 0.14;

      // Update Halftone Reveal shader state
      halftoneUniforms.uMouse.value.lerp(targetMouseUv, 0.14);

      // Gentle ambient drift when not hovering so effect is visually evident
      if (!isPointerOverCard) {
        const driftX = 0.5 + Math.cos(now * 0.0016) * 0.22;
        const driftY = 0.5 + Math.sin(now * 0.0024) * 0.28;
        targetMouseUv.set(driftX, driftY);
      }

      // Hover intensity
      const isCardFacingBack = Math.abs(cardRotY - Math.PI) < Math.PI * 0.45;
      const targetHover = (isPointerOverCard || isCardFacingBack) ? 1.0 : 0.65;
      halftoneUniforms.uHover.value += (targetHover - halftoneUniforms.uHover.value) * 0.1;
      halftoneUniforms.uTime.value = now * 0.001;

      // Apply transformations to 3D badge group
      badgeGroup.position.copy(cardPos);
      badgeGroup.rotation.set(cardRotX, cardRotY, cardRotZ);

      // Update hanging strap spline
      updateStrap();

      // Render 3D Scene
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(tick);

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('click', onClick);

      cardGeo.dispose();
      frameGeo.dispose();
      ringGeo.dispose();
      bracketGeo.dispose();
      strapGeo.dispose();
      frontTex.dispose();
      backTex.dispose();
      strapTex.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`lanyard-container ${className}`}
      aria-label="Interactive 3D Developer Lanyard ID Badge"
      role="region"
    >
      {hintVisible && (
        <div className="lanyard-hint">
          <span className="lanyard-hint-dot" />
          <span>Drag or tap badge to flip</span>
        </div>
      )}

      {/* Floating Flip Button & Halftone Reveal Status */}
      <div className="lanyard-controls">
        <button
          type="button"
          onClick={() => toggleFlipRef.current()}
          className="lanyard-flip-btn"
          aria-label={isFlipped ? "Flip to front of ID card" : "Flip to back of ID card (Halftone Reveal)"}
        >
          <RotateCcw size={13} className={`lanyard-flip-icon ${isFlipped ? 'is-flipped' : ''}`} />
          <span>{isFlipped ? 'Flip to Front' : 'Flip to Back (Halftone Reveal ✨)'}</span>
        </button>

        {isFlipped && (
          <div className="lanyard-halftone-badge" role="status">
            <Sparkles size={11} />
            <span>Halftone Reveal &bull; Hover / Touch to Reveal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lanyard;
