import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/audio';
import { ALL_ENVIRONMENTS } from './Environment';
import { ChevronDown } from 'lucide-react';

interface IntroExperienceProps {
  onComplete: () => void;
  currentEnvId?: string;
}

// Procedural texture for soft round background stars
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
  const [isReady, setIsReady] = useState(false);
  const [stage, setStage] = useState<'loading' | 'landing' | 'transitioning' | 'completed'>('loading');
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const [landingOpacity, setLandingOpacity] = useState(1);
  const [environmentOpacity, setEnvironmentOpacity] = useState(0);
  const [isSecretLightMode, setIsSecretLightMode] = useState(false);

  const toggleSecretLightMode = useCallback(() => {
    if (stageRef.current !== 'landing') return;
    sounds.playTap();
    setIsSecretLightMode((prev) => !prev);
  }, []);

  const stageRef = useRef<'loading' | 'landing' | 'transitioning' | 'completed'>('loading');
  const hasFinishedRef = useRef(false);
  const startTransitionFnRef = useRef<() => void>(() => {});

  // Mouse tracking references
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

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
    }, 600);
  }, [onComplete]);

  // Trigger transition from landing page to VR goggles sequence
  const startEnterTransition = useCallback(() => {
    if (stageRef.current !== 'landing' || hasFinishedRef.current) return;
    stageRef.current = 'transitioning';
    setStage('transitioning');
    setLandingOpacity(0);

    try {
      sounds.playGlassChime();
    } catch {
      // Audio errors are non-blocking
    }
  }, []);

  useEffect(() => {
    startTransitionFnRef.current = startEnterTransition;
  }, [startEnterTransition]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDraggingOrb = false;
    let orbHovered = false;
    const orbDragOffset = new THREE.Vector3();
    const orbCurrentPos = new THREE.Vector3(0, 0, 0);
    const orbTargetPos = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();

    // Pointer events for interactive 3D responsiveness & Click-and-Grab of the middle orb
    const handlePointerDown = (e: PointerEvent) => {
      if (stageRef.current !== 'landing' || !camera || !heroOrbGroup) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouseNDC = new THREE.Vector2(normX, normY);
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObjects(heroOrbGroup.children, true);
      if (hits.length > 0 && hits[0].distance < 16) {
        isDraggingOrb = true;
        document.body.style.cursor = 'grabbing';
        if (raycaster.ray.intersectPlane(dragPlane, intersectPoint)) {
          orbDragOffset.set(
            intersectPoint.x - orbCurrentPos.x,
            intersectPoint.y - orbCurrentPos.y,
            0
          );
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseRef.current.x = normX;
      targetMouseRef.current.y = normY;

      if (stageRef.current !== 'landing' || !camera || !heroOrbGroup) return;

      const mouseNDC = new THREE.Vector2(normX, normY);
      raycaster.setFromCamera(mouseNDC, camera);

      if (isDraggingOrb) {
        if (raycaster.ray.intersectPlane(dragPlane, intersectPoint)) {
          orbTargetPos.x = THREE.MathUtils.clamp(intersectPoint.x - orbDragOffset.x, -5.2, 5.2);
          orbTargetPos.y = THREE.MathUtils.clamp(intersectPoint.y - orbDragOffset.y, -3.2, 3.2);
        }
      } else {
        const hits = raycaster.intersectObjects(heroOrbGroup.children, true);
        const isOver = hits.length > 0 && hits[0].distance < 16;
        if (isOver !== orbHovered) {
          orbHovered = isOver;
          document.body.style.cursor = isOver ? 'grab' : '';
        }
      }
    };

    const handlePointerUp = () => {
      if (isDraggingOrb) {
        isDraggingOrb = false;
        document.body.style.cursor = orbHovered ? 'grab' : '';
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // Scroll / Gesture interception for landing page transition
    const handleWheel = (e: WheelEvent) => {
      if (stageRef.current === 'landing') {
        if (e.deltaY > 8 || Math.abs(e.deltaY) > 20) {
          e.preventDefault();
          startTransitionFnRef.current();
        }
      } else {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (stageRef.current === 'landing') {
        if (!isDraggingOrb && e.touches.length > 0) {
          const deltaY = touchStartY - e.touches[0].clientY;
          if (deltaY > 20) {
            e.preventDefault();
            startTransitionFnRef.current();
          }
        }
      } else {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (stageRef.current === 'landing') {
        if (['Space', 'ArrowDown', 'PageDown', 'Enter'].includes(e.code) || ['Space', 'ArrowDown', 'PageDown', 'Enter'].includes(e.key)) {
          e.preventDefault();
          startTransitionFnRef.current();
        }
      } else {
        const preventKeys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
        if (preventKeys.includes(e.code) || preventKeys.includes(e.key)) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let heroOrbGroup: THREE.Group | null = null;
    let floatingBubblesGroup: THREE.Group | null = null;
    let starfieldGroup: THREE.Group | null = null;
    let headsetGroup: THREE.Group | null = null;
    let plasmaMaterial: THREE.ShaderMaterial | null = null;

    interface OrbitingCompanion {
      group: THREE.Group;
      mesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      radiusX: number;
      radiusZ: number;
      heightAmp: number;
      speed: number;
      phase: number;
      inclination: number;
    }
    const orbitingCompanions: OrbitingCompanion[] = [];

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

      // 4. Lighting Rig (Moody, soft cosmic illumination)
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

      const cursorPointLight = new THREE.PointLight(0xe0e7ff, 2.5, 12);
      cursorPointLight.position.set(0, 0.5, 4);
      scene.add(cursorPointLight);

      // -------------------------------------------------------------
      // 5. BACKGROUND STARS (Strictly BEHIND all objects)
      // -------------------------------------------------------------
      starfieldGroup = new THREE.Group();
      // Pushed far back along Z so it is strictly behind all hero objects
      starfieldGroup.position.set(0, 0, -12);
      scene.add(starfieldGroup);

      const roundStarTex = createSoftStarTexture();
      disposableTextures.push(roundStarTex);

      const starCount = 280;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPositions[i3] = (Math.random() - 0.5) * 60;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 45;
        // Deep behind objects
        starPositions[i3 + 2] = -Math.random() * 25 - 5;

        // Darkened starlight (subtle & whisper-quiet)
        const lum = 0.16 + Math.random() * 0.18;
        starColors[i3] = lum;
        starColors[i3 + 1] = lum * 0.95;
        starColors[i3 + 2] = lum * 1.0;
      }

      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      disposableGeometries.push(starGeo);

      const starMat = new THREE.PointsMaterial({
        size: 1.2,
        map: roundStarTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      disposableMaterials.push(starMat);

      const starMesh = new THREE.Points(starGeo, starMat);
      starMesh.renderOrder = -10;
      starfieldGroup.add(starMesh);

      // -------------------------------------------------------------
      // 6. HERO IRIDESCENT CRYSTAL ORB WITH BLINKING EYES
      // -------------------------------------------------------------
      heroOrbGroup = new THREE.Group();
      scene.add(heroOrbGroup);

      // A. Main Hero Cosmic Orb (Single seamless borderless sphere with smooth fluid shading, NO eyes)
      const heroOrbGeo = new THREE.SphereGeometry(1.90, 64, 64);
      disposableGeometries.push(heroOrbGeo);

      const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Dynamic organic traveling surface ripples randomly traversing across the body
          // Wandering epicenter 1
          vec3 epic1 = vec3(
            sin(uTime * 0.85) * 1.8,
            cos(uTime * 0.65) * 1.8,
            sin(uTime * 1.1 + 1.2) * 1.8
          );
          float d1 = length(position - epic1);
          float ripple1 = sin(d1 * 4.8 - uTime * 4.2);
          float env1 = max(0.0, sin(uTime * 0.7 + 0.6));

          // Wandering epicenter 2 (different trajectory and speed)
          vec3 epic2 = vec3(
            cos(uTime * 0.72 + 2.2) * 1.8,
            sin(uTime * 0.95) * 1.6,
            cos(uTime * 0.55 + 1.7) * 1.8
          );
          float d2 = length(position - epic2);
          float ripple2 = sin(d2 * 5.4 - uTime * 4.8);
          float env2 = max(0.0, cos(uTime * 0.85 + 1.8));

          // Alive surface tension wave undulation
          float livingWave = sin(position.x * 2.4 + position.y * 2.2 - uTime * 2.6) * cos(position.z * 2.0 + uTime * 1.8) * 0.45;

          // Fine high-frequency water ripple shimmer
          float fineShimmer = sin(position.y * 6.5 + position.x * 5.5 - uTime * 5.2) * 0.18;

          float totalDisplacement = (ripple1 * env1 * 0.085) + (ripple2 * env2 * 0.075) + (livingWave * 0.05) + (fineShimmer * 0.02);
          vec3 newPos = position + normal * totalDisplacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `;

      const fragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
          float diff = max(dot(n, lightDir), 0.0) * 0.45 + 0.55;
          
          float t = uTime * 0.35;
          float w1 = sin(vPosition.x * 2.0 + t * 1.1) * cos(vPosition.y * 1.8 + t * 0.9);
          float w2 = sin(vPosition.z * 2.2 - t * 1.0) * cos(vPosition.x * 1.7 + t * 1.2);
          float w3 = sin((vPosition.x + vPosition.y + vPosition.z) * 1.3 + t * 0.75);
          
          float pattern = (w1 + w2 + w3) * 0.33 + 0.5;
          pattern = clamp(pattern + uMouse.x * 0.12, 0.0, 1.0);
          
          // Deep moody cosmic velvet tones (slate violet, cosmic plum, midnight twilight - NOT bright)
          vec3 colSky = vec3(0.18, 0.22, 0.38);       // deep slate periwinkle
          vec3 colPeriwinkle = vec3(0.24, 0.20, 0.44);// rich cosmic indigo-violet
          vec3 colViolet = vec3(0.32, 0.18, 0.46);    // deep plum twilight
          vec3 colMagenta = vec3(0.38, 0.22, 0.44);   // muted dark cosmic wine
          
          vec3 fluidCol = mix(colSky, colPeriwinkle, smoothstep(0.0, 0.35, pattern));
          fluidCol = mix(fluidCol, colViolet, smoothstep(0.35, 0.68, pattern));
          fluidCol = mix(fluidCol, colMagenta, smoothstep(0.68, 1.0, pattern));
          
          // Natural soft shading without any harsh border or edge ring
          vec3 finalColor = fluidCol * diff;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      plasmaMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        transparent: false,
        depthWrite: true,
      });
      disposableMaterials.push(plasmaMaterial);

      const heroOrbMesh = new THREE.Mesh(heroOrbGeo, plasmaMaterial);
      heroOrbGroup.add(heroOrbMesh);

      // -------------------------------------------------------------
      // 7. COMPANION OBJECTS THAT ROTATE SLOWLY AROUND THE HERO ORB
      // (Style matches big orb: organic fluid turbulence shader, 4-stop gradients, natural diffuse lighting)
      // Colors: Green, Blue, Yellow, Rose
      // -------------------------------------------------------------
      floatingBubblesGroup = new THREE.Group();
      scene.add(floatingBubblesGroup);

      const baseBubbleGeo = new THREE.SphereGeometry(1, 48, 48);
      disposableGeometries.push(baseBubbleGeo);

      const companionVertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uCol1;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Unique phase offset per companion orb so they ripple randomly and independently
          float phaseOffset = uCol1.r * 12.0 + uCol1.g * 8.0;
          float t = uTime + phaseOffset;

          // Traveling surface ripples across the companion body
          vec3 epic1 = vec3(
            sin(t * 0.9) * 1.3,
            cos(t * 0.7) * 1.3,
            sin(t * 1.2 + 1.4) * 1.3
          );
          float d1 = length(position - epic1);
          float ripple1 = sin(d1 * 5.2 - t * 4.4);
          float env1 = max(0.0, sin(t * 0.75 + 0.4));

          vec3 epic2 = vec3(
            cos(t * 0.8 + 2.0) * 1.3,
            sin(t * 1.0) * 1.2,
            cos(t * 0.6 + 1.9) * 1.3
          );
          float d2 = length(position - epic2);
          float ripple2 = sin(d2 * 5.8 - t * 5.0);
          float env2 = max(0.0, cos(t * 0.9 + 1.6));

          float livingWave = sin(position.x * 2.8 + position.y * 2.6 - t * 2.8) * cos(position.z * 2.4 + t * 2.0) * 0.45;
          float fineShimmer = sin(position.y * 7.0 + position.x * 6.0 - t * 5.5) * 0.18;

          float totalDisplacement = (ripple1 * env1 * 0.07) + (ripple2 * env2 * 0.06) + (livingWave * 0.045) + (fineShimmer * 0.02);
          vec3 newPos = position + normal * totalDisplacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `;

      const companionFragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec3 uCol1;
        uniform vec3 uCol2;
        uniform vec3 uCol3;
        uniform vec3 uCol4;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
          float diff = max(dot(n, lightDir), 0.0) * 0.45 + 0.55;
          
          float t = uTime * 0.35;
          float w1 = sin(vPosition.x * 2.0 + t * 1.1) * cos(vPosition.y * 1.8 + t * 0.9);
          float w2 = sin(vPosition.z * 2.2 - t * 1.0) * cos(vPosition.x * 1.7 + t * 1.2);
          float w3 = sin((vPosition.x + vPosition.y + vPosition.z) * 1.3 + t * 0.75);
          
          float pattern = (w1 + w2 + w3) * 0.33 + 0.5;
          pattern = clamp(pattern + uMouse.x * 0.12, 0.0, 1.0);
          
          vec3 fluidCol = mix(uCol1, uCol2, smoothstep(0.0, 0.35, pattern));
          fluidCol = mix(fluidCol, uCol3, smoothstep(0.35, 0.68, pattern));
          fluidCol = mix(fluidCol, uCol4, smoothstep(0.68, 1.0, pattern));
          
          // Natural soft shading without any harsh border or edge ring
          vec3 finalColor = fluidCol * diff;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      const companionConfigs = [
        {
          name: 'blue',
          scale: 0.52,
          radiusX: 3.2,
          radiusZ: 2.7,
          heightAmp: 0.65,
          speed: 0.00012, // slow orbit
          phase: 0.0,
          inclination: 0.26, // ~15 deg
          col1: new THREE.Vector3(0.08, 0.16, 0.38), // deep midnight sapphire
          col2: new THREE.Vector3(0.12, 0.28, 0.58), // rich cobalt
          col3: new THREE.Vector3(0.20, 0.48, 0.80), // vibrant azure
          col4: new THREE.Vector3(0.38, 0.74, 0.96), // celestial cyan glow
        },
        {
          name: 'green',
          scale: 0.62,
          radiusX: 3.9,
          radiusZ: 3.3,
          heightAmp: 0.95,
          speed: -0.00009, // slow orbit
          phase: 2.2,
          inclination: -0.34, // ~ -20 deg
          col1: new THREE.Vector3(0.04, 0.20, 0.14), // deep forest jade
          col2: new THREE.Vector3(0.08, 0.38, 0.26), // rich emerald
          col3: new THREE.Vector3(0.18, 0.60, 0.42), // luminous seafoam
          col4: new THREE.Vector3(0.38, 0.84, 0.62), // radiant mint frost
        },
        {
          name: 'yellow',
          scale: 0.44,
          radiusX: 4.5,
          radiusZ: 3.8,
          heightAmp: 1.15,
          speed: 0.00007, // slow orbit
          phase: 4.1,
          inclination: 0.44, // ~25 deg
          col1: new THREE.Vector3(0.38, 0.18, 0.05), // warm burnt amber
          col2: new THREE.Vector3(0.62, 0.34, 0.08), // golden honey
          col3: new THREE.Vector3(0.86, 0.56, 0.12), // luminous topaz gold
          col4: new THREE.Vector3(0.98, 0.82, 0.32), // radiant champagne sunbeam
        },
        {
          name: 'rose',
          scale: 0.38,
          radiusX: 2.65,
          radiusZ: 2.3,
          heightAmp: 0.5,
          speed: -0.00014, // slow orbit
          phase: 1.1,
          inclination: -0.16, // ~ -9 deg
          col1: new THREE.Vector3(0.36, 0.10, 0.22), // deep velvet burgundy
          col2: new THREE.Vector3(0.58, 0.16, 0.34), // ruby crimson
          col3: new THREE.Vector3(0.84, 0.26, 0.48), // sunset rose
          col4: new THREE.Vector3(0.98, 0.54, 0.70), // coral blush glow
        },
      ];

      companionConfigs.forEach((cfg) => {
        const compGroup = new THREE.Group();
        floatingBubblesGroup!.add(compGroup);

        const compMat = new THREE.ShaderMaterial({
          vertexShader: companionVertexShader,
          fragmentShader: companionFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uCol1: { value: cfg.col1 },
            uCol2: { value: cfg.col2 },
            uCol3: { value: cfg.col3 },
            uCol4: { value: cfg.col4 },
          },
          transparent: false,
          depthWrite: true,
        });
        disposableMaterials.push(compMat);

        const bodyMesh = new THREE.Mesh(baseBubbleGeo, compMat);
        bodyMesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
        compGroup.add(bodyMesh);

        orbitingCompanions.push({
          group: compGroup,
          mesh: bodyMesh,
          material: compMat,
          radiusX: cfg.radiusX,
          radiusZ: cfg.radiusZ,
          heightAmp: cfg.heightAmp,
          speed: cfg.speed,
          phase: cfg.phase,
          inclination: cfg.inclination,
        });
      });

      heroOrbGroup.position.set(0, 0, 0);

      // -------------------------------------------------------------
      // 8. CINEMATIC SPATIAL VR HEADSET (Vision Pro Gateway)
      // -------------------------------------------------------------
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

      // Compile shader pipeline
      renderer.compile(scene, camera);
      renderer.render(scene, camera);

      setTimeout(() => {
        setIsReady(true);
        setStage('landing');
        stageRef.current = 'landing';
      }, 500);

      // Animation timings
      let transitionStartTime = 0;
      const TOTAL_TRANSITION_DURATION = 2300;

      // Natural eye blinking parameters
      let lastBlinkTime = 0;
      let nextBlinkDelay = 3200;
      let isBlinking = false;
      let isDoubleBlink = false;

      const smoothStep = (t: number) => t * t * (3 - 2 * t);
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = (currentTime: number) => {
        if (hasFinishedRef.current) return;

        // Smooth mouse damping
        currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
        currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;

        const mx = currentMouseRef.current.x;
        const my = currentMouseRef.current.y;

        // -----------------------------------------------------------------
        // STATE 1: LANDING PAGE (Orb with Blinking Eyes Active)
        // -----------------------------------------------------------------
        if (stageRef.current === 'landing') {
          // Update shader uniforms
          if (plasmaMaterial) {
            plasmaMaterial.uniforms.uTime.value = currentTime * 0.001;
            plasmaMaterial.uniforms.uMouse.value.set(mx, my);
          }

          // Orb position calculation incorporating interactive click-and-drag + inertia spring + zero-g float
          if (isDraggingOrb) {
            orbCurrentPos.x += (orbTargetPos.x - orbCurrentPos.x) * 0.24;
            orbCurrentPos.y += (orbTargetPos.y - orbCurrentPos.y) * 0.24;
          } else {
            // Smooth zero-g return towards resting center
            orbCurrentPos.x += (0 - orbCurrentPos.x) * 0.06;
            orbCurrentPos.y += (0 - orbCurrentPos.y) * 0.06;
          }

          const idleFloatY = Math.sin(currentTime * 0.0012) * 0.08;
          const parallaxX = mx * (isDraggingOrb ? 0.04 : 0.18);
          const parallaxY = my * (isDraggingOrb ? 0.04 : 0.14);

          const orbFinalX = orbCurrentPos.x + parallaxX;
          const orbFinalY = orbCurrentPos.y + idleFloatY + parallaxY;

          // Gentle zero-g floating and rotation of hero orb, responding to drag velocity & tilt
          if (heroOrbGroup) {
            heroOrbGroup.position.x = orbFinalX;
            heroOrbGroup.position.y = orbFinalY;

            const dragTiltZ = -(orbTargetPos.x - orbCurrentPos.x) * 0.22;
            const dragTiltX = (orbTargetPos.y - orbCurrentPos.y) * 0.22;
            heroOrbGroup.rotation.y = currentTime * 0.00025 + mx * 0.28;
            heroOrbGroup.rotation.x = Math.sin(currentTime * 0.0008) * 0.05 - my * 0.2 + dragTiltX;
            heroOrbGroup.rotation.z = THREE.MathUtils.lerp(heroOrbGroup.rotation.z, dragTiltZ, 0.1);
          }

          // Orbit the smaller objects smoothly around wherever the hero orb is located in 3D
          orbitingCompanions.forEach((comp) => {
            // Update fluid shader animation uniforms matching the hero orb
            if (comp.material && comp.material.uniforms) {
              comp.material.uniforms.uTime.value = currentTime * 0.001;
              comp.material.uniforms.uMouse.value.set(mx, my);
            }

            const angle = currentTime * comp.speed + comp.phase;
            const rawX = Math.cos(angle) * comp.radiusX;
            const rawZ = Math.sin(angle) * comp.radiusZ;
            const rawY = Math.sin(angle * 1.4 + comp.phase) * comp.heightAmp;

            // Inclination rotation around orbital plane
            const cosI = Math.cos(comp.inclination);
            const sinI = Math.sin(comp.inclination);
            const rotatedX = rawX * cosI - rawY * sinI;
            const rotatedY = rawX * sinI + rawY * cosI;
            const rotatedZ = rawZ;

            // Position companion in 3D orbit centered around the hero orb's dynamic position
            comp.group.position.set(
              orbFinalX + rotatedX,
              orbFinalY + rotatedY,
              rotatedZ
            );

            // Gentle slow rotation of each sphere on its own axis
            comp.mesh.rotation.y = currentTime * 0.00015;
            comp.mesh.rotation.x = currentTime * 0.00008;
          });

          // Background stars subtle drift (stays strictly behind)
          if (starfieldGroup) {
            starfieldGroup.rotation.y = currentTime * 0.00002 + mx * 0.04;
          }

          cursorPointLight.position.set(mx * 3.5, my * 3.0 + 0.4, 4.2);
        }

        // -----------------------------------------------------------------
        // STATE 2: TRANSITIONING (Seamless handoff to VR Goggles)
        // -----------------------------------------------------------------
        else if (stageRef.current === 'transitioning') {
          if (transitionStartTime === 0) {
            transitionStartTime = currentTime;
            if (headsetGroup) {
              headsetGroup.visible = true;
            }
          }

          const elapsed = currentTime - transitionStartTime;
          const progress = Math.min(elapsed / TOTAL_TRANSITION_DURATION, 1);

          // 1. Hero crystal orb & eyes dissolve & shrink out
          const shrinkT = Math.min(progress / 0.42, 1);
          const formScale = lerp(1.0, 0.0, Math.pow(shrinkT, 2));
          if (heroOrbGroup) {
            heroOrbGroup.scale.set(formScale, formScale, formScale);
            heroOrbGroup.rotation.y += 0.03;
          }
          if (floatingBubblesGroup) {
            floatingBubblesGroup.scale.set(formScale, formScale, formScale);
          }
          if (starfieldGroup) {
            starfieldGroup.scale.set(formScale, formScale, formScale);
          }

          if (progress >= 0.45 && heroOrbGroup) {
            heroOrbGroup.visible = false;
          }

          // 2. Spatial Studio Environment fades in behind
          const envFadeT = Math.max(0, Math.min((progress - 0.12) / 0.55, 1));
          setEnvironmentOpacity(envFadeT);

          // 3. VR Headset appears and zooms forward through lenses
          const rotProgress = Math.min(progress / 0.68, 1);
          const smoothRot = smoothStep(rotProgress);

          const zoomT = Math.max(0, (progress - 0.32) / 0.68);
          const smoothZoom = Math.pow(zoomT, 2.7);

          if (headsetGroup) {
            headsetGroup.rotation.y = lerp(-0.65, 0.0, smoothRot);
            headsetGroup.rotation.x = lerp(-0.1, 0.0, smoothRot);
            headsetGroup.rotation.z = lerp(0.08, 0.0, smoothRot);

            const s = lerp(0.92, 2.85, smoothZoom);
            headsetGroup.scale.set(s, s, s);
          }

          if (camera) {
            camera.position.z = lerp(7.5, 0.3, smoothZoom);
          }

          const lensProximity = Math.max(0, (progress - 0.55) / 0.45);
          interiorLensesMaterial.emissiveIntensity = lerp(0.25, 3.0, Math.pow(lensProximity, 2));

          if (progress > 0.66) {
            const portalP = (progress - 0.66) / 0.34;
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
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        document.body.style.cursor = '';
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown);
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
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none transition-opacity duration-600 ease-out overflow-hidden touch-none overscroll-none intro-landing-text keep-white force-white"
      style={{
        opacity: containerOpacity,
        backgroundColor: '#07060e',
        color: '#ffffff',
        filter: isSecretLightMode ? 'invert(1)' : 'none',
        transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out',
      }}
      aria-label="Opening Landing Page"
      role="dialog"
      aria-modal="true"
    >
      {/* Soft ethereal ambient glow behind the iridescent crystal orb */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.12) 0%, rgba(192, 132, 252, 0.08) 35%, transparent 65%), radial-gradient(circle at 50% 50%, transparent 40%, #07060e 95%)',
        }}
      />

      {/* Dynamic Background Room Environment (revealed during transition to VR Goggles) */}
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

      {/* Architectural Perspective Grid & Crosshairs (Soft & subtle) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-out z-[5]"
        style={{ opacity: isReady ? landingOpacity * 0.45 : 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1">
          <line x1="0" y1="22%" x2="100%" y2="22%" />
          <line x1="0" y1="78%" x2="100%" y2="78%" />
          <line x1="32%" y1="0" x2="32%" y2="100%" />
          <line x1="68%" y1="0" x2="68%" y2="100%" />
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255, 255, 255, 0.02)" />
          <line x1="0" y1="100%" x2="100%" y2="0%" stroke="rgba(255, 255, 255, 0.02)" />
        </g>

        {[
          { cx: '32%', cy: '22%' },
          { cx: '50%', cy: '22%' },
          { cx: '68%', cy: '22%' },
          { cx: '32%', cy: '78%' },
          { cx: '43%', cy: '78%' },
          { cx: '68%', cy: '78%' },
        ].map((pt, idx) => (
          <g key={idx}>
            <circle cx={pt.cx} cy={pt.cy} r="1.5" fill="rgba(255, 255, 255, 0.3)" />
          </g>
        ))}
      </svg>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out z-[8] ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ------------------------------------------------------------- */}
      {/* OPENING LANDING PAGE HTML OVERLAY */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between transition-all duration-500 ease-out intro-landing-text keep-white force-white"
        style={{
          opacity: isReady ? landingOpacity : 0,
          transform: landingOpacity === 0 ? 'scale(0.97)' : 'scale(1)',
          color: '#ffffff',
        }}
      >
        {/* TOP BAR: Logo centered with secret light mode trigger and hover text */}
        <header className="w-full pt-6 sm:pt-8 px-6 flex items-center justify-center relative z-30">
          <button
            type="button"
            onClick={toggleSecretLightMode}
            className="group relative flex flex-col items-center justify-center pointer-events-auto cursor-pointer focus:outline-none p-2 -m-2 rounded-lg transition-transform active:scale-95"
            aria-label="Toggle secret light mode"
          >
            <img
              src="/assets/icons/logo-white.svg"
              alt="Alex McDonald Logo"
              className="h-4 sm:h-[18px] w-auto object-contain select-none opacity-85 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
              draggable={false}
            />
            {/* on hover of the logo have text show underneath that says "Click me!" */}
            <span
              className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-white/80 select-none pointer-events-none whitespace-nowrap"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              Click me!
            </span>
          </button>
        </header>

        {/* CENTER STAGE: Big Serif Name (reduced letter spacing) & Subtitle with Sparkle */}
        <main className="flex flex-col items-center justify-center text-center px-4 -mt-2 sm:-mt-4 relative intro-landing-text keep-white force-white">
          <h1
            className="relative font-serif-display font-light text-6xl sm:text-7xl md:text-8xl lg:text-[116px] xl:text-[132px] leading-none select-none intro-landing-text keep-white force-white"
            style={{
              color: '#ffffff',
              fontWeight: 300,
              letterSpacing: '-0.035em',
              textWrap: 'balance',
              textShadow: '0 0 32px rgba(255, 255, 255, 0.5), 0 4px 24px rgba(0, 0, 0, 0.95)',
            }}
          >
            Alex McDonald
          </h1>

          <p
            className="relative text-[13px] sm:text-[15px] md:text-[17px] font-mono font-normal uppercase mt-5 sm:mt-7 select-none intro-landing-text keep-white force-white text-center flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-3.5"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: 'rgba(255, 255, 255, 0.92)',
              letterSpacing: '0.18em',
              lineHeight: 1.35,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 2px 12px rgba(0, 0, 0, 0.95)',
            }}
          >
            <span>Senior Product Designer | Design Engineer</span>
            <span
              className="inline-block text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.85)] text-[14px] sm:text-[16px] md:text-[18px]"
              style={{ letterSpacing: '0.12em' }}
            >
              ✦
            </span>
            <span>Based in Seattle</span>
          </p>
        </main>

        {/* BOTTOM AFFORDANCE: Scroll to enter (comfortable arrow spacing & matching typography) */}
        <footer className="w-full pb-7 sm:pb-9 flex flex-col items-center justify-center intro-landing-text keep-white force-white">
          <button
            onClick={startEnterTransition}
            className="pointer-events-auto flex flex-col items-center cursor-pointer group focus:outline-none transition-transform active:scale-95 intro-landing-text keep-white force-white"
            aria-label="Scroll down or tap to enter portfolio"
          >
            <span
              className="text-[11px] sm:text-[12px] md:text-[13px] font-mono font-light uppercase select-none intro-landing-text keep-white force-white group-hover:text-white transition-colors"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                color: 'rgba(255, 255, 255, 0.88)',
                letterSpacing: '0.18em',
                lineHeight: 1.2,
                textShadow: '0 0 16px rgba(255, 255, 255, 0.35), 0 2px 10px rgba(0, 0, 0, 0.95)',
              }}
            >
              Scroll to enter
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-all mt-2.5 animate-bounce" />
          </button>
        </footer>
      </div>

      {/* Subtle Loading Spinner in center while 3D assets & shaders prepare */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 pointer-events-none z-30 transition-opacity duration-300">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[2px] border-white/10" />
            <div className="w-10 h-10 rounded-full border-[2px] border-transparent border-t-sky-400 border-r-blue-500 animate-spin" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/45">
            Loading...
          </span>
        </div>
      )}

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
