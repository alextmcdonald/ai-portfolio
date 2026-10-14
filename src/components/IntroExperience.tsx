import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/audio';
import { ALL_ENVIRONMENTS } from './Environment';

interface IntroExperienceProps {
  onComplete: () => void;
  isLightMode?: boolean;
  currentEnvId?: string;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({
  onComplete,
  isLightMode = false,
  currentEnvId = 'cupertino-studio'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const hasFinishedRef = useRef(false);

  // Find active background: defaults to 'cupertino-studio' ("Design studio")
  const activeBg =
    ALL_ENVIRONMENTS.find((e) => e.id === currentEnvId) ||
    ALL_ENVIRONMENTS.find((e) => e.id === 'cupertino-studio') ||
    ALL_ENVIRONMENTS[0];

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setContainerOpacity(0);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    // Intercept and prevent wheel, touchmove, and scroll keys (Space, PageUp/Down, Arrows)
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
      if (keys.includes(e.code) || keys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });

    const container = mountRef.current;
    if (!container) {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
      return;
    }

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
      headsetGroup.rotation.set(-0.1, -0.65, 0.08);
      headsetGroup.scale.set(0.92, 0.92, 0.92);

      // Play soft ambient initiation sound if sound is on
      try {
        sounds.playGlassChime();
      } catch {
        // ignore audio errors
      }

      // Timing and Animation Loop (Total Duration ~2.5s continuous fluid motion)
      const startTime = performance.now();
      const TOTAL_DURATION = 2500; // ms

      // Easing helper functions
      const smoothStep = (t: number) => t * t * (3 - 2 * t);
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = (currentTime: number) => {
        if (hasFinishedRef.current) return;

        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / TOTAL_DURATION, 1);

        // One continuous master curve for orientation settling and camera approach
        // 0.0 -> 0.55: floating settle and smooth rotation to front
        // 0.45 -> 1.0: acceleration straight through lenses into portfolio
        const rotT = Math.min(rawProgress / 0.65, 1);
        const smoothRot = smoothStep(rotT);

        // Camera zoom: begins gently and smoothly curves into dynamic forward acceleration
        const zoomT = Math.max(0, (rawProgress - 0.25) / 0.75);
        const smoothZoom = Math.pow(zoomT, 2.8);

        // Continuous floating micro-drift
        const floatY = Math.sin(elapsed * 0.0028) * (1 - rawProgress) * 0.05;

        if (headsetGroup) {
          // Continuous rotation without stopping: starts at angle -0.65 and flows directly to 0
          headsetGroup.rotation.y = lerp(-0.65, 0.0, smoothRot);
          headsetGroup.rotation.x = lerp(-0.1, 0.0, smoothRot);
          headsetGroup.rotation.z = lerp(0.08, 0.0, smoothRot);

          headsetGroup.position.y = floatY + smoothZoom * 0.04;

          // Headset gracefully expands as the lenses approach near plane
          const s = lerp(0.92, 2.8, smoothZoom);
          headsetGroup.scale.set(s, s, s);
        }

        if (camera) {
          // Camera glides continuously from 7.5 to passing through the lenses at 0.3
          camera.position.z = lerp(7.5, 0.3, smoothZoom);
        }

        // Continuous light glint sweeping across visor and lenses
        visorPointLight.position.x = lerp(-3.0, 3.5, smoothStep(rawProgress));
        keyLight.intensity = lerp(1.6, 3.2, smoothStep(rawProgress));

        // Lens bloom and refractive flare continuously increases as camera gets closer
        const lensProximity = Math.max(0, (rawProgress - 0.55) / 0.45);
        interiorLensesMaterial.emissiveIntensity = lerp(0.2, 2.8, Math.pow(lensProximity, 2));

        // Seamless transition into the glass surfaces of the website
        if (rawProgress > 0.68) {
          const fadeP = (rawProgress - 0.68) / 0.32;
          setPortalOpacity(Math.min(fadeP * 1.3, 1));
        }

        if (rawProgress >= 1.0) {
          finish();
          return;
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
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventScrollKeys);
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
      // Graceful fallback
      finish();
    }
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none transition-opacity duration-600 ease-out overflow-hidden touch-none overscroll-none"
      style={{
        opacity: containerOpacity,
        backgroundColor: '#050608',
      }}
      aria-label="Opening experience"
      role="dialog"
      aria-modal="true"
    >
      {/* Dynamic Background (Design Studio default or user selected room) */}
      {activeBg && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden scale-105">
          <img
            src={activeBg.url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter blur-[6px] brightness-[0.55] saturate-[1.2] transition-transform duration-1000 ease-out"
          />
          {/* Ambient Lighting & Darkness Overlay for realistic floating contrast */}
          <div
            className="absolute inset-0"
            style={{
              background: isLightMode
                ? 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 100%)'
                : 'radial-gradient(circle at 50% 50%, rgba(5, 8, 16, 0.35) 0%, rgba(5, 6, 8, 0.75) 100%)',
            }}
          />
        </div>
      )}

      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Radial Studio Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.08) 0%, rgba(5, 6, 8, 0.35) 50%, rgba(3, 4, 6, 0.85) 100%)',
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

      {/* Subtle Entering Portfolio Status Indicator */}
      <div className="absolute bottom-8 left-8 z-20 text-[11px] font-mono tracking-widest uppercase text-white/40 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>Entering Portfolio</span>
      </div>
    </div>
  );
};
