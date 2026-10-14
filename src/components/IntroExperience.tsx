import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/audio';

interface IntroExperienceProps {
  onComplete: () => void;
  isLightMode?: boolean;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSkipped, setIsSkipped] = useState(false);
  const [phase, setPhase] = useState<'reveal' | 'rotate' | 'zoom' | 'portal' | 'done'>('reveal');
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const hasFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    try {
      sessionStorage.setItem('portfolio_intro_seen', 'true');
    } catch {
      // ignore storage errors
    }
    setContainerOpacity(0);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setIsSkipped(true);
    sounds.playTap();
    finish();
  }, [finish]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let headsetGroup: THREE.Group | null = null;

    // Track geometries and materials for disposal
    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Scene setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050608, 0.04);

      // 2. Camera setup
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);

      // 4. Procedural Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      // Key light - subtle cool studio softbox from top-front
      const keyLight = new THREE.DirectionalLight(0xdbeafe, 2.8);
      keyLight.position.set(2, 4, 5);
      scene.add(keyLight);

      // Rim light - sharp warm specular grazing top and sides
      const rimLight = new THREE.DirectionalLight(0x93c5fd, 3.2);
      rimLight.position.set(-3, 3, -2);
      scene.add(rimLight);

      // Bottom bounce fill light - gentle upward glow
      const bounceLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      bounceLight.position.set(0, -3, 2);
      scene.add(bounceLight);

      // Subtle point light right in front of visor for specular glint
      const visorPointLight = new THREE.PointLight(0x60a5fa, 1.8, 8);
      visorPointLight.position.set(0, 0.5, 3);
      scene.add(visorPointLight);

      // 5. Constructing the Cinematic Spatial Headset
      headsetGroup = new THREE.Group();
      scene.add(headsetGroup);

      // Materials
      const aluminumMaterial = new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        metalness: 0.88,
        roughness: 0.22,
      });
      disposableMaterials.push(aluminumMaterial);

      const darkTitaniumMaterial = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.92,
        roughness: 0.28,
      });
      disposableMaterials.push(darkTitaniumMaterial);

      const cushionFabricMaterial = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.9,
        metalness: 0.05,
      });
      disposableMaterials.push(cushionFabricMaterial);

      const frontGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x090d16,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        ior: 1.52,
        reflectivity: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.92,
      });
      disposableMaterials.push(frontGlassMaterial);

      const interiorLensesMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1e3a8a,
        metalness: 0.2,
        roughness: 0.02,
        transmission: 0.95,
        ior: 1.58,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        emissive: 0x0284c7,
        emissiveIntensity: 0.25,
      });
      disposableMaterials.push(interiorLensesMaterial);

      const strapKnitMaterial = new THREE.MeshStandardMaterial({
        color: 0xe4e4e7,
        roughness: 0.85,
        metalness: 0.1,
      });
      disposableMaterials.push(strapKnitMaterial);

      // Visor Front Curved Glass
      // Formed using a 3D curved ellipsoid shape
      const visorGeo = new THREE.SphereGeometry(1.6, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.45);
      visorGeo.scale(1.5, 0.82, 0.75);
      disposableGeometries.push(visorGeo);
      const visorMesh = new THREE.Mesh(visorGeo, frontGlassMaterial);
      visorMesh.rotation.x = Math.PI * 0.52;
      visorMesh.position.set(0, 0, 0.4);
      headsetGroup.add(visorMesh);

      // Aluminum Enclosure Frame around the visor rim
      const frameGeo = new THREE.TorusGeometry(1.85, 0.12, 32, 64);
      frameGeo.scale(1.15, 0.65, 0.45);
      disposableGeometries.push(frameGeo);
      const frameMesh = new THREE.Mesh(frameGeo, aluminumMaterial);
      frameMesh.position.set(0, 0, 0.25);
      headsetGroup.add(frameMesh);

      // Inner Light Seal Cushion
      const sealGeo = new THREE.TorusGeometry(1.82, 0.2, 32, 64);
      sealGeo.scale(1.12, 0.62, 0.65);
      disposableGeometries.push(sealGeo);
      const sealMesh = new THREE.Mesh(sealGeo, cushionFabricMaterial);
      sealMesh.position.set(0, 0, -0.2);
      headsetGroup.add(sealMesh);

      // Interior Optical Display Lenses (Left & Right)
      const lensGeo = new THREE.CylinderGeometry(0.52, 0.56, 0.18, 36);
      lensGeo.rotateX(Math.PI / 2);
      disposableGeometries.push(lensGeo);

      const leftLens = new THREE.Mesh(lensGeo, interiorLensesMaterial);
      leftLens.position.set(-0.75, 0.05, 0.05);
      headsetGroup.add(leftLens);

      const rightLens = new THREE.Mesh(lensGeo, interiorLensesMaterial);
      rightLens.position.set(0.75, 0.05, 0.05);
      headsetGroup.add(rightLens);

      // Lens Bezel Rings (Subtle titanium framing)
      const bezelGeo = new THREE.TorusGeometry(0.58, 0.04, 24, 48);
      disposableGeometries.push(bezelGeo);
      const leftBezel = new THREE.Mesh(bezelGeo, darkTitaniumMaterial);
      leftBezel.position.copy(leftLens.position);
      headsetGroup.add(leftBezel);

      const rightBezel = new THREE.Mesh(bezelGeo, darkTitaniumMaterial);
      rightBezel.position.copy(rightLens.position);
      headsetGroup.add(rightBezel);

      // Top Digital Crown Dial
      const crownGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 24);
      disposableGeometries.push(crownGeo);
      const crown = new THREE.Mesh(crownGeo, aluminumMaterial);
      crown.position.set(1.4, 0.95, -0.05);
      crown.rotation.z = -Math.PI * 0.2;
      headsetGroup.add(crown);

      // Top Shutter Capture Button
      const buttonGeo = new THREE.BoxGeometry(0.35, 0.08, 0.12);
      disposableGeometries.push(buttonGeo);
      const button = new THREE.Mesh(buttonGeo, aluminumMaterial);
      button.position.set(-1.25, 0.95, -0.05);
      button.rotation.z = Math.PI * 0.15;
      headsetGroup.add(button);

      // Audio Straps (Left & Right rigid audio pods)
      const strapGeo = new THREE.BoxGeometry(0.9, 0.22, 0.12);
      disposableGeometries.push(strapGeo);
      const leftStrap = new THREE.Mesh(strapGeo, aluminumMaterial);
      leftStrap.position.set(-2.2, 0, -0.4);
      leftStrap.rotation.y = -Math.PI * 0.15;
      headsetGroup.add(leftStrap);

      const rightStrap = new THREE.Mesh(strapGeo, aluminumMaterial);
      rightStrap.position.set(2.2, 0, -0.4);
      rightStrap.rotation.y = Math.PI * 0.15;
      headsetGroup.add(rightStrap);

      // Rear 3D Braided Headband Loop
      const bandCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2.6, 0, -0.5),
        new THREE.Vector3(0, 0.3, -2.8),
        new THREE.Vector3(2.6, 0, -0.5)
      );
      const bandGeo = new THREE.TubeGeometry(bandCurve, 40, 0.28, 16, false);
      disposableGeometries.push(bandGeo);
      const bandMesh = new THREE.Mesh(bandGeo, strapKnitMaterial);
      headsetGroup.add(bandMesh);

      // Rear Adjustment Dial
      const rearDialGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32);
      rearDialGeo.rotateX(Math.PI / 2);
      disposableGeometries.push(rearDialGeo);
      const rearDial = new THREE.Mesh(rearDialGeo, aluminumMaterial);
      rearDial.position.set(0, 0.3, -2.8);
      headsetGroup.add(rearDial);

      // Initial Headset Pose
      headsetGroup.position.set(0, 0, 0);
      headsetGroup.rotation.set(-0.12, -0.55, 0.08); // Floating angle showing profile and curvature
      headsetGroup.scale.set(0.95, 0.95, 0.95);

      // Play soft ambient initiation sound if sound is on
      try {
        sounds.playGlassChime();
      } catch {
        // ignore audio errors
      }

      // Timing and Animation Loop (Total Duration ~2.8s)
      const startTime = performance.now();
      const TOTAL_DURATION = 2800; // ms

      const animate = (currentTime: number) => {
        if (hasFinishedRef.current) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / TOTAL_DURATION, 1);

        // Smooth cubic-bezier-like easing functions
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easeInOutQuart = (t: number) =>
          t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
        const easeInExpo = (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10));

        // Floating hover sine wave
        const floatY = Math.sin(elapsed * 0.003) * 0.06;

        if (progress < 0.32) {
          // PHASE 1: The Reveal (0.0s - 0.9s)
          // Suspended floating reveal with subtle highlight shifts
          setPhase('reveal');
          const p1 = progress / 0.32;
          const eased = easeOutCubic(p1);

          if (headsetGroup) {
            headsetGroup.position.y = -0.15 + eased * 0.15 + floatY;
            headsetGroup.rotation.y = -0.55 + eased * 0.2;
            headsetGroup.rotation.x = -0.12 + Math.sin(elapsed * 0.002) * 0.02;
          }
          if (camera) {
            camera.position.z = 7.5 - eased * 0.5;
          }
          keyLight.intensity = 1.2 + eased * 1.6;
          visorPointLight.intensity = 0.6 + eased * 1.2;
        } else if (progress < 0.65) {
          // PHASE 2: The Rotation (0.9s - 1.8s)
          // Deliberate rotation facing viewer, highlighting optical lenses and visor specular
          setPhase('rotate');
          const p2 = (progress - 0.32) / 0.33;
          const eased = easeInOutQuart(p2);

          if (headsetGroup) {
            headsetGroup.position.y = floatY;
            headsetGroup.rotation.y = -0.35 + eased * 0.35; // Settles to 0 (head-on facing viewer)
            headsetGroup.rotation.x = -0.1 + eased * 0.1;
            headsetGroup.rotation.z = 0.06 * (1 - eased);
          }
          if (camera) {
            camera.position.z = 7.0 - eased * 1.4; // 7.0 -> 5.6
          }

          // Shimmering visor light glint sweep
          visorPointLight.position.x = -2.5 + eased * 5.0;
        } else if (progress < 0.92) {
          // PHASE 3: The Transition & Glass Zoom (1.8s - 2.55s)
          // Accelerates through the glass lenses, expanding to fill viewport
          setPhase('zoom');
          const p3 = (progress - 0.65) / 0.27;
          const easedZoom = easeInExpo(p3);

          if (camera && headsetGroup) {
            // Camera dives directly into the lenses
            camera.position.z = 5.6 - easedZoom * 5.2; // 5.6 -> 0.4
            camera.position.y = 0.05 * easedZoom;

            // Headset expands outward as lenses fill the screen
            const s = 1.0 + easedZoom * 1.8;
            headsetGroup.scale.set(s, s, s);
          }

          // Visor lens optical dispersion glow
          interiorLensesMaterial.emissiveIntensity = 0.25 + easedZoom * 2.5;

          // Transition to portal overlay as lenses meet camera near plane
          if (p3 > 0.4) {
            const portalP = (p3 - 0.4) / 0.6;
            setPortalOpacity(Math.min(portalP * 1.2, 1));
          }
        } else {
          // PHASE 4 & 5: Entering the Portfolio (2.55s - 2.8s)
          // Full luminous glass expansion seamlessly blending into visionOS panels
          setPhase('portal');
          setPortalOpacity(1);

          if (progress >= 1.0) {
            setPhase('done');
            finish();
            return;
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      // Handle window resize
      const handleResize = () => {
        if (!camera || !renderer) return;
        const newW = window.innerWidth;
        const newH = window.innerHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        // Comprehensive Three.js Resource Cleanup
        disposableGeometries.forEach((g) => g.dispose());
        disposableMaterials.forEach((m) => m.dispose());
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
      };
    } catch {
      // Graceful fallback: If WebGL context is unavailable or errors occur, exit immediately
      finish();
    }
  }, [finish]);

  if (isSkipped) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none transition-opacity duration-700 ease-out"
      style={{
        opacity: containerOpacity,
        backgroundColor: '#050608',
      }}
      aria-label="Opening experience"
      role="dialog"
      aria-modal="true"
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Radial Studio Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.12) 0%, rgba(5, 6, 8, 0.4) 45%, rgba(3, 4, 6, 0.95) 100%)',
        }}
      />

      {/* Optical Lens Refraction Flare that aligns with passing through the lenses */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: portalOpacity,
          background:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(30, 58, 138, 0.35) 30%, rgba(255, 255, 255, 0.25) 55%, transparent 75%)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        }}
      />

      {/* Discreet visionOS Style Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/70 hover:text-white text-xs font-mono tracking-wider uppercase transition-all duration-200 backdrop-blur-xl shadow-lg cursor-pointer flex items-center gap-2 group"
      >
        <span>Skip intro</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
      </button>

      {/* Subtle Spatial Status Indicator */}
      <div className="absolute bottom-8 left-8 z-20 text-[11px] font-mono tracking-widest uppercase text-white/35 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>Spatial Gateway</span>
      </div>
    </div>
  );
};
