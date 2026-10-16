import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Rotate3d } from 'lucide-react';

export default function LaptopHero3D() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [progress, setProgress] = useState(0);

  const finishLoading = () => {
    setLoaded(true);
    setTimeout(() => {
      setRemoved(true);
    }, 600);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 4.8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minPolarAngle = Math.PI / 6;

    let isUserInteracting = false;
    let resumeTimeout = null;

    controls.addEventListener('start', () => {
      isUserInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    });

    controls.addEventListener('end', () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 1500);
    });

    // 5. Studio & Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    // Key front light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Secondary fill light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    // High-tech Cyan Rim Light (back-right)
    const rimLightCyan = new THREE.PointLight(0x06b6d4, 4.2, 15);
    rimLightCyan.position.set(3, 2, -3);
    scene.add(rimLightCyan);

    // Electric Purple Rim Light (back-left)
    const rimLightPurple = new THREE.PointLight(0xa855f7, 3.6, 15);
    rimLightPurple.position.set(-3, 2, -3);
    scene.add(rimLightPurple);

    // Undercarriage Neon Blue Glow
    const underLight = new THREE.PointLight(0x38bdf8, 3.2, 10);
    underLight.position.set(0, -1.2, 0);
    scene.add(underLight);

    // 6. Holographic Pedestal / Ring Effects
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Outer neon ring
    const ringGeo1 = new THREE.RingGeometry(1.65, 1.68, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -0.75;
    ringGroup.add(ring1);

    // Inner pulsed ring
    const ringGeo2 = new THREE.RingGeometry(1.15, 1.18, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.75;
    ringGroup.add(ring2);

    // Cyber particle field surrounding the laptop
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Load 3D Laptop Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let laptopScene = null;
    const loader = new GLTFLoader();

    loader.load(
      '/models/laptop.glb',
      (gltf) => {
        laptopScene = gltf.scene;

        // Auto-center & auto-fit
        const box = new THREE.Box3().setFromObject(laptopScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Shift model so its geometric center is at (0, 0, 0)
        laptopScene.position.x = -center.x;
        laptopScene.position.y = -center.y;
        laptopScene.position.z = -center.z;

        // Scale model appropriately to fit viewport beautifully
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.05 / maxDim;
        laptopScene.scale.set(targetScale, targetScale, targetScale);

        // Enhance materials
        laptopScene.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.metalness !== undefined) {
              child.material.metalness = Math.min(child.material.metalness, 0.85);
            }
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.max(child.material.roughness, 0.15);
            }
          }
        });

        // Initial sleek tilt toward camera
        modelGroup.add(laptopScene);
        modelGroup.rotation.y = -0.35;
        modelGroup.rotation.x = 0.2;

        finishLoading();
      },
      (xhr) => {
        if (xhr.total > 0) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error('Error loading 3D laptop model:', error);
        finishLoading();
      }
    );

    // 8. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth auto-orbit when user is not manually interacting
      if (!isUserInteracting) {
        modelGroup.rotation.y += 0.0055;
        // Gentle organic levitation / floating sine wave
        modelGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.06;
        modelGroup.rotation.z = Math.sin(elapsedTime * 0.7) * 0.015;
      }

      // Rotate particle cloud and cyber rings gently
      particleSystem.rotation.y = elapsedTime * 0.025;
      ringGroup.rotation.z = elapsedTime * 0.06;
      ring1.scale.setScalar(1 + Math.sin(elapsedTime * 1.8) * 0.03);
      ring2.scale.setScalar(1 - Math.sin(elapsedTime * 1.8) * 0.03);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 520;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      cancelAnimationFrame(animationFrameId);

      controls.dispose();
      renderer.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background select-none">
      {/* Radiant Cybernetic Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/15 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[180px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay for futuristic aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Interesting & Minimalist Wireframe Laptop Loading Overlay */}
      {!removed && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/85 backdrop-blur-md transition-all duration-700 select-none ${
            loaded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Minimalist Tech Wireframe Laptop Icon with animated radar & scan beam */}
            <div className="relative mb-5 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <svg
                width="92"
                height="68"
                viewBox="0 0 92 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id="lidStroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <linearGradient id="scanGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Holographic Concentric Pulse Rings underneath */}
                <ellipse cx="46" cy="58" rx="34" ry="7" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.35">
                  <animate attributeName="rx" values="28;38;28" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="46" cy="58" rx="20" ry="4" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6">
                  <animate attributeName="rx" values="16;24;16" dur="2s" repeatCount="indefinite" />
                </ellipse>

                {/* Laptop Lid / Screen Chassis */}
                <rect
                  x="24"
                  y="12"
                  width="44"
                  height="28"
                  rx="3.5"
                  stroke="url(#lidStroke)"
                  strokeWidth="1.5"
                  fill="#0b1329"
                  fillOpacity="0.75"
                />

                {/* Screen Bezel Interior */}
                <rect x="27" y="15" width="38" height="22" rx="2" fill="#030712" fillOpacity="0.9" />

                {/* Laser Scanning Beam gliding vertically across the screen */}
                <line x1="28" y1="20" x2="64" y2="20" stroke="url(#scanGlow)" strokeWidth="1.8">
                  <animate attributeName="y1" values="16;35;16" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="16;35;16" dur="2s" repeatCount="indefinite" />
                </line>

                {/* Minimal Center Core Processor Dot */}
                <circle cx="46" cy="26" r="2.2" fill="#38bdf8">
                  <animate attributeName="r" values="1.8;2.8;1.8" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
                </circle>

                {/* Top Webcam Indicator */}
                <circle cx="46" cy="13.5" r="0.8" fill="#38bdf8" opacity="0.9" />

                {/* Laptop Base */}
                <path
                  d="M16 42 L76 42 L71 50 C70.5 51 69.5 51.5 68.5 51.5 L23.5 51.5 C22.5 51.5 21.5 51 21 50 L16 42 Z"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  fill="#090e1a"
                  fillOpacity="0.85"
                />

                {/* Trackpad Accent */}
                <rect x="39" y="44" width="14" height="3.5" rx="1" fill="#38bdf8" opacity="0.5" />
              </svg>
            </div>

            {/* Slender Minimalist 2px Laser Progress Track */}
            <div className="w-40 h-[2px] bg-muted/60 rounded-full overflow-hidden relative mb-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(progress, 18)}%` }}
              />
            </div>

            {/* Monospace Micro-Telemetry Badge */}
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>CALIBRATING 3D RIG</span>
              {progress > 0 && <span className="text-cyan-400 font-bold">[{progress}%]</span>}
            </div>
          </div>
        </div>
      )}

      {/* Sleek Minimalist 360 Interactive Badge (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/70 backdrop-blur-md border border-border/60 shadow-lg text-muted-foreground text-xs font-medium tracking-wide">
          <Rotate3d className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>360° Drag to Rotate</span>
        </div>
      </div>
    </div>
  );
}
