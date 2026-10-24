import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/audio';
import { ALL_ENVIRONMENTS } from './Environment';

interface IntroExperienceProps {
  onComplete: () => void;
  currentEnvId?: string;
}

// Procedural texture for soft background stars
function createSoftStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.25, 'rgba(240, 248, 255, 0.85)');
    gradient.addColorStop(0.55, 'rgba(180, 215, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({
  onComplete,
  currentEnvId = 'cupertino-studio'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const [environmentOpacity, setEnvironmentOpacity] = useState(0);

  const hasFinishedRef = useRef(false);

  // Find active background: defaults to 'cupertino-studio'
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
    }, 550);
  }, [onComplete]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let headsetGroup: THREE.Group | null = null;
    let starfieldGroup: THREE.Group | null = null;

    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Scene setup
      scene = new THREE.Scene();

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
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      // 4. Lighting Rig (Moody, soft cosmic and studio illumination)
      const ambientLight = new THREE.AmbientLight(0x22183c, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3.2, 4.2, 4.5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x818cf8, 1.4);
      fillLight.position.set(-4.0, -3.2, 2.5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xa855f7, 1.8);
      rimLight.position.set(0, 3.5, -3.5);
      scene.add(rimLight);

      const centerGlow = new THREE.PointLight(0xe0e7ff, 2.2, 12);
      centerGlow.position.set(0, 0.5, 4);
      scene.add(centerGlow);

      // 5. Background Soft Stars (Strictly behind headset)
      starfieldGroup = new THREE.Group();
      starfieldGroup.position.set(0, 0, -12);
      scene.add(starfieldGroup);

      const roundStarTex = createSoftStarTexture();
      disposableTextures.push(roundStarTex);

      const starCount = 200;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3 + 0] = (Math.random() - 0.5) * 36;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      disposableGeometries.push(starGeo);

      const starMat = new THREE.PointsMaterial({
        size: 0.22,
        map: roundStarTex,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposableMaterials.push(starMat);
      const starsMesh = new THREE.Points(starGeo, starMat);
      starfieldGroup.add(starsMesh);

      // 6. SPATIAL VR HEADSET (GOGGLES)
      headsetGroup = new THREE.Group();
      scene.add(headsetGroup);
      headsetGroup.visible = false;

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
        emissiveIntensity: 0.35,
      });
      disposableMaterials.push(interiorLensesMaterial);

      const strapKnitMaterial = new THREE.MeshStandardMaterial({
        color: 0xe4e4e7,
        roughness: 0.85,
        metalness: 0.1,
      });
      disposableMaterials.push(strapKnitMaterial);

      // Visor Front Curved Glass
      const visorGeo = new THREE.SphereGeometry(1.6, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.45);
      visorGeo.scale(1.5, 0.82, 0.75);
      disposableGeometries.push(visorGeo);
      const visorMesh = new THREE.Mesh(visorGeo, frontGlassMaterial);
      visorMesh.rotation.x = Math.PI * 0.52;
      visorMesh.position.set(0, 0, 0.4);
      headsetGroup.add(visorMesh);

      // Aluminum Enclosure Frame
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

      // Interior Optical Display Lenses
      const lensGeo = new THREE.CylinderGeometry(0.52, 0.56, 0.18, 36);
      lensGeo.rotateX(Math.PI / 2);
      disposableGeometries.push(lensGeo);

      const leftLens = new THREE.Mesh(lensGeo, interiorLensesMaterial);
      leftLens.position.set(-0.75, 0.05, 0.05);
      headsetGroup.add(leftLens);

      const rightLens = new THREE.Mesh(lensGeo, interiorLensesMaterial);
      rightLens.position.set(0.75, 0.05, 0.05);
      headsetGroup.add(rightLens);

      const bezelGeo = new THREE.TorusGeometry(0.58, 0.04, 24, 48);
      disposableGeometries.push(bezelGeo);
      const leftBezel = new THREE.Mesh(bezelGeo, darkTitaniumMaterial);
      leftBezel.position.copy(leftLens.position);
      headsetGroup.add(leftBezel);

      const rightBezel = new THREE.Mesh(bezelGeo, darkTitaniumMaterial);
      rightBezel.position.copy(rightLens.position);
      headsetGroup.add(rightBezel);

      // Controls
      const crownGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 24);
      disposableGeometries.push(crownGeo);
      const crown = new THREE.Mesh(crownGeo, aluminumMaterial);
      crown.position.set(1.4, 0.95, -0.05);
      crown.rotation.z = -Math.PI * 0.2;
      headsetGroup.add(crown);

      const buttonGeo = new THREE.BoxGeometry(0.35, 0.08, 0.12);
      disposableGeometries.push(buttonGeo);
      const button = new THREE.Mesh(buttonGeo, aluminumMaterial);
      button.position.set(-1.25, 0.95, -0.05);
      button.rotation.z = Math.PI * 0.15;
      headsetGroup.add(button);

      // Straps
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

      const bandCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2.6, 0, -0.5),
        new THREE.Vector3(0, 0.3, -2.8),
        new THREE.Vector3(2.6, 0, -0.5)
      );
      const bandGeo = new THREE.TubeGeometry(bandCurve, 40, 0.28, 16, false);
      disposableGeometries.push(bandGeo);
      const bandMesh = new THREE.Mesh(bandGeo, strapKnitMaterial);
      headsetGroup.add(bandMesh);

      const rearDialGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32);
      rearDialGeo.rotateX(Math.PI / 2);
      disposableGeometries.push(rearDialGeo);
      const rearDial = new THREE.Mesh(rearDialGeo, aluminumMaterial);
      rearDial.position.set(0, 0.3, -2.8);
      headsetGroup.add(rearDial);

      headsetGroup.position.set(0, 0, 0);
      headsetGroup.rotation.set(-0.1, -0.65, 0.08);
      headsetGroup.scale.set(0.92, 0.92, 0.92);

      // Precompile shaders
      renderer.compile(scene, camera);
      renderer.render(scene, camera);

      let transitionStartTime = 0;
      let isTransitionStarted = false;
      const TOTAL_TRANSITION_DURATION = 2150;

      // Start goggles animation after brief loading indication
      setTimeout(() => {
        setLoadingVisible(false);
        isTransitionStarted = true;
        if (headsetGroup) {
          headsetGroup.visible = true;
        }
        try {
          sounds.playGlassChime();
        } catch {
          // Audio errors are non-blocking
        }
      }, 500);

      const smoothStep = (t: number) => t * t * (3 - 2 * t);
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = (currentTime: number) => {
        if (hasFinishedRef.current) return;

        if (isTransitionStarted) {
          if (transitionStartTime === 0) {
            transitionStartTime = currentTime;
          }

          const elapsed = currentTime - transitionStartTime;
          const progress = Math.min(elapsed / TOTAL_TRANSITION_DURATION, 1);

          // 1. Spatial Environment fades in behind
          const envFadeT = Math.max(0, Math.min(progress / 0.7, 1));
          setEnvironmentOpacity(envFadeT);

          // 2. VR Headset rotates smoothly from angled view to facing straight
          const rotProgress = Math.min(progress / 0.65, 1);
          const smoothRot = smoothStep(rotProgress);

          // 3. VR Headset and camera zoom through lenses
          const zoomT = Math.max(0, (progress - 0.2) / 0.8);
          const smoothZoom = Math.pow(zoomT, 2.7);

          if (headsetGroup) {
            headsetGroup.rotation.y = lerp(-0.65, 0.0, smoothRot);
            headsetGroup.rotation.x = lerp(-0.1, 0.0, smoothRot);
            headsetGroup.rotation.z = lerp(0.08, 0.0, smoothRot);

            const s = lerp(0.92, 2.9, smoothZoom);
            headsetGroup.scale.set(s, s, s);
          }

          if (camera) {
            camera.position.z = lerp(7.5, 0.25, smoothZoom);
          }

          const lensProximity = Math.max(0, (progress - 0.45) / 0.55);
          interiorLensesMaterial.emissiveIntensity = lerp(0.35, 3.2, Math.pow(lensProximity, 2));

          if (progress > 0.62) {
            const portalP = (progress - 0.62) / 0.38;
            setPortalOpacity(Math.min(portalP * 1.35, 1));
          }

          if (progress >= 1.0) {
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

        disposableGeometries.forEach((g) => g.dispose());
        disposableMaterials.forEach((m) => m.dispose());
        disposableTextures.forEach((t) => t.dispose());
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
      };
    } catch {
      finish();
    }
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none transition-opacity duration-600 ease-out overflow-hidden touch-none overscroll-none"
      style={{
        opacity: containerOpacity,
        backgroundColor: '#07060e',
        color: '#ffffff',
      }}
      aria-label="Loading and Entering Portfolio"
      role="dialog"
      aria-modal="true"
    >
      {/* Dynamic Background Room Environment (revealed during goggles flight) */}
      {activeBg && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden scale-105 transition-opacity duration-700 ease-out z-[2]"
          style={{ opacity: environmentOpacity }}
        >
          <img
            src={activeBg.url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter blur-[6px] brightness-[0.55] saturate-[1.2]"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(5, 8, 16, 0.35) 0%, rgba(5, 6, 8, 0.75) 100%)',
            }}
          />
        </div>
      )}

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-[8]"
      />

      {/* Loading Spinner & Label */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3.5 pointer-events-none z-30 transition-opacity duration-400 ease-out ${
          loadingVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[2px] border-white/10" />
          <div className="w-10 h-10 rounded-full border-[2px] border-transparent border-t-sky-400 border-r-blue-500 animate-spin" />
        </div>
        <span
          className="text-[10px] font-medium tracking-widest uppercase text-white/50"
          style={{
            fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif',
          }}
        >
          Loading...
        </span>
      </div>

      {/* Optical Lens Refraction Flare that aligns with passing through the lenses */}
      <div
        className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-300 ease-out"
        style={{
          opacity: portalOpacity,
          background:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(99, 102, 241, 0.35) 30%, rgba(255, 255, 255, 0.25) 55%, transparent 75%)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        }}
      />
    </div>
  );
};
