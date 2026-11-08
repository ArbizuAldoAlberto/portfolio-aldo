"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useMotionPreferences } from "./system/MotionPreferences";
import { soundEngine } from "./system/SoundEngine";
import { QuantumCore3D, WorkbenchMode } from "./three/QuantumCore3D";

// ============================================================================
// 1. MOD-03: Grilla Topográfica LiDAR AgTech (Núcleo Pampeano Bolívar / Cuyo)
// ============================================================================
function AgTechGrid({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const gridRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<{ uniforms: { uScanY: { value: number }; uTime: { value: number } } } | null>(null);

  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 28, 72, 56);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Topografía de cuenca agrícola pampeana: suaves lomas y cuencas aluviales
      const z =
        Math.sin(x * 0.28) * 0.85 * Math.cos(y * 0.22) +
        Math.sin((x + y) * 0.18) * 0.45 +
        Math.cos(x * 0.55) * 0.22;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: new THREE.Color("#D4AF37"),
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uScanY = { value: 0 };
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = `
        varying vec3 vCustomWorldPos;
        ${shader.vertexShader}
      `;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vCustomWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        `
      );
      shader.fragmentShader = `
        varying vec3 vCustomWorldPos;
        uniform float uScanY;
        uniform float uTime;
        ${shader.fragmentShader}
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        // Haz de Escaneo Láser LiDAR Titanium & Solar Gold (#D4AF37 / #E2E8F0)
        float distToScan = abs(vCustomWorldPos.y - uScanY);
        float scanPulse = smoothstep(1.5, 0.0, distToScan);
        vec3 laserColor = mix(vec3(0.831, 0.686, 0.216), vec3(0.886, 0.910, 0.941), scanPulse);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, laserColor * 1.55, scanPulse * 0.60);
        `
      );
      shaderRef.current = shader as unknown as { uniforms: { uScanY: { value: number }; uTime: { value: number } } };
    };

    return mat;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (gridRef.current) {
      gridRef.current.position.y = -2.6 + Math.sin(t * 0.2) * 0.04;
      gridRef.current.rotation.z = Math.sin(t * 0.08) * 0.012;
    }
    if (shaderRef.current && !reducedMotion) {
      // Barrido continuo del haz LiDAR de norte a sur
      const scanProgress = ((t * 2.2) % 36.0) - 18.0;
      shaderRef.current.uniforms.uScanY.value = scanProgress;
      shaderRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <mesh
      ref={gridRef}
      geometry={geometry}
      material={material}
      rotation={[-1.28, 0, 0]}
      position={[0, -2.6, -1.8]}
    />
  );
}

// ============================================================================
// 2. MOD-03: HUD Táctico Aeroespacial 3D (Gimbal Rings + Retículas de Puntería)
// ============================================================================
function TacticalAerospaceHUD({
  currentRoll,
  currentPitch,
  pointer,
  reducedMotion = false,
}: {
  currentRoll: number;
  currentPitch: number;
  pointer: { x: number; y: number };
  reducedMotion?: boolean;
}) {
  const outerGimbalRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const reticleLRef = useRef<THREE.Group>(null);
  const reticleRRef = useRef<THREE.Group>(null);

  // Anillo exterior con marcas radiales cada 30°
  const { ringGeometry, tickGeometry } = useMemo(() => {
    const ringGeo = new THREE.RingGeometry(4.35, 4.40, 64);

    const tickPts: number[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const len = i % 2 === 0 ? 0.35 : 0.18;
      const r1 = 4.42;
      const r2 = 4.42 + len;
      tickPts.push(Math.cos(a) * r1, Math.sin(a) * r1, 0);
      tickPts.push(Math.cos(a) * r2, Math.sin(a) * r2, 0);
    }
    const tickGeo = new THREE.BufferGeometry();
    tickGeo.setAttribute("position", new THREE.Float32BufferAttribute(tickPts, 3));

    return { ringGeometry: ringGeo, tickGeometry: tickGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (outerGimbalRef.current) {
      // Rotación en contra-fase al alabeo del giroscopio (Horizonte Artificial)
      outerGimbalRef.current.rotation.z = -currentRoll * 0.45 + (reducedMotion ? 0 : Math.sin(t * 0.1) * 0.02);
      outerGimbalRef.current.rotation.x = currentPitch * 0.25;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = (reducedMotion ? 0 : t * 0.04);
    }

    // Retículas vectoriales que apuntan ligeramente adelantadas al cursor
    if (reticleLRef.current && reticleRRef.current) {
      const rx = pointer.x * 0.65;
      const ry = pointer.y * 0.45;
      reticleLRef.current.position.set(-0.6 + rx * 0.25, 1.45 + ry * 0.2, 0.45);
      reticleRRef.current.position.set(0.6 + rx * 0.25, 1.45 + ry * 0.2, 0.45);
    }
  });

  return (
    <group position={[0, 0.35, -0.2]}>
      {/* Gimbal Primario: Horizonte Artificial */}
      <group ref={outerGimbalRef}>
        <mesh geometry={ringGeometry}>
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.18} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments geometry={tickGeometry}>
          <lineBasicMaterial color="#E2E8F0" transparent opacity={0.22} depthWrite={false} />
        </lineSegments>
      </group>

      {/* Anillo de Telemetría Secundario Concéntrico */}
      <group ref={innerRingRef} scale={0.72}>
        <lineSegments geometry={tickGeometry}>
          <lineBasicMaterial color="#D4AF37" transparent opacity={0.14} depthWrite={false} />
        </lineSegments>
      </group>

      {/* Retículas Oculares 3D de Puntería */}
      <group ref={reticleLRef}>
        <mesh>
          <ringGeometry args={[0.07, 0.085, 16]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>
      <group ref={reticleRRef}>
        <mesh>
          <ringGeometry args={[0.07, 0.085, 16]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// 3. Rayos Sagrados Multidimensionales (Beacon Rays)
// ============================================================================
function SacredBeaconRays() {
  const raysGroupRef = useRef<THREE.Group>(null);

  const rays = useMemo(() => {
    const lines = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 4.2;
      const y = Math.sin(angle) * 4.2;
      lines.push({ x, y, angle });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (raysGroupRef.current) {
      raysGroupRef.current.rotation.z = -state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <group ref={raysGroupRef} position={[0, 0.1, -0.4]}>
      {rays.map((ray, i) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              const pts = new Float32Array([0, 0, 0, ray.x, ray.y, (i % 2 === 0 ? 0.35 : -0.35)]);
              self.setAttribute("position", new THREE.BufferAttribute(pts, 3));
            }}
          />
          <lineBasicMaterial
            attach="material"
            color={i % 2 === 0 ? "#D4AF37" : "#94A3B8"}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}

// ============================================================================
// 4. Matriz de Luces Dinámicas & Entorno PBR Offline
// ============================================================================
function ChromaticLightsMatrix({ energySurge }: { energySurge: number }) {
  const lightGroupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (lightGroupRef.current) {
      lightGroupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      lightGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.14) * 0.14;
    }
  });

  const surgeIntensity = energySurge * 1.5;

  return (
    <group ref={lightGroupRef}>
      <pointLight position={[3.8, 2.4, 0]} color="#D4AF37" intensity={0.8 + surgeIntensity} distance={7} />
      <pointLight position={[-3.8, -2.0, 0]} color="#94A3B8" intensity={0.8 + surgeIntensity} distance={7} />
      <pointLight position={[0, 3.5, 3.0]} color="#F8FAFC" intensity={0.7 + surgeIntensity} distance={7} />
      <pointLight position={[0, -3.0, -3.0]} color="#8C6D46" intensity={0.7 + surgeIntensity} distance={7} />
    </group>
  );
}

function OfflinePBREnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      pmrem.dispose();
      env.dispose();
    };
  }, [gl, scene]);
  return null;
}

// ============================================================================
// 6. Contenido Principal de la Escena 3D
// ============================================================================
function SceneContent({
  isVisible,
  energySurge,
  scrollProgress = 0,
  renderMode,
  reducedMotion = false,
}: {
  isVisible: boolean;
  energySurge: number;
  scrollProgress?: number;
  renderMode: 'chromatic' | 'wireframe' | 'xray';
  reducedMotion?: boolean;
}) {
  const sceneGroup = useRef<THREE.Group>(null);
  const dynamicLightRef = useRef<THREE.PointLight>(null);

  const [attitude, setAttitude] = useState({ roll: 0, pitch: 0, pointer: { x: 0, y: 0 } });

  useFrame((state) => {
    if (!isVisible) return;

    if (dynamicLightRef.current) {
      dynamicLightRef.current.position.x = state.pointer.x * 5.5;
      dynamicLightRef.current.position.y = state.pointer.y * 4.5;
      dynamicLightRef.current.intensity = 1.2 + energySurge * 3.0;
    }
  });

  return (
    <group ref={sceneGroup}>
      {/* Niebla exponencial para fundir el fondo suavemente en la oscuridad profunda sin bordes duros */}
      <fogExp2 attach="fog" args={["#070A0F", 0.035]} />

      {/* Iluminación PBR de Estudio 100% Offline (Sin dependencias remotas) */}
      <OfflinePBREnvironment />

      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 6]} intensity={1.5} color="#F8FAFC" />
      <directionalLight position={[-5, -3, -3]} intensity={0.8} color="#94A3B8" />
      <pointLight ref={dynamicLightRef} position={[0, 0, 3.5]} intensity={1.2} color="#D4AF37" distance={8} />

      <ChromaticLightsMatrix energySurge={energySurge} />
      <SacredBeaconRays />

      {/* HUD Táctico 3D Aeroespacial (MOD-03) */}
      <TacticalAerospaceHUD
        currentRoll={attitude.roll}
        currentPitch={attitude.pitch}
        pointer={attitude.pointer}
        reducedMotion={reducedMotion}
      />

      {/* Partículas de Telemetría Titanium & Warm Bronze */}
      <Sparkles count={45} scale={9} size={1.8} speed={0.35} opacity={0.45} color="#D4AF37" />
      <Sparkles count={35} scale={8} size={2.0} speed={0.3} opacity={0.4} color="#F8FAFC" />
      <Sparkles count={25} scale={7} size={2.2} speed={0.25} opacity={0.35} color="#94A3B8" />

      <Float speed={reducedMotion ? 0.3 : 1.0} rotationIntensity={reducedMotion ? 0.01 : 0.04} floatIntensity={reducedMotion ? 0.05 : 0.14}>
        <Suspense fallback={null}>
          <QuantumCore3D
            mode={renderMode === "wireframe" ? "wireframe" : renderMode === "xray" ? "xray" : "pbr"}
            scrollProgress={scrollProgress}
            energySurge={energySurge}
          />
        </Suspense>
      </Float>

      {/* Grilla Topográfica LiDAR AgTech (MOD-03) */}
      <AgTechGrid reducedMotion={reducedMotion} />

      {/* Postprocessing Cinematográfico: Bloom Calibrado (sin quemar alas ni geometría PBR) */}
      <EffectComposer enableNormalPass={false} multisampling={4}>
        <Bloom
          luminanceThreshold={0.85}
          mipmapBlur
          intensity={0.35}
          radius={0.55}
        />
      </EffectComposer>
    </group>
  );
}

export interface Hero3DSceneProps {
  renderMode?: 'chromatic' | 'wireframe' | 'xray';
  onRenderModeChange?: (mode: 'chromatic' | 'wireframe' | 'xray') => void;
  showOverlayControls?: boolean;
}

export function Hero3DScene({
  renderMode: externalRenderMode,
  onRenderModeChange,
  showOverlayControls = false,
}: Hero3DSceneProps = {}) {
  const { reducedMotion } = useMotionPreferences();
  const [inViewport, setInViewport] = useState(true);
  const [energySurge, setEnergySurge] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [internalRenderMode, setInternalRenderMode] = useState<'chromatic' | 'wireframe' | 'xray'>('chromatic');

  const renderMode = externalRenderMode || internalRenderMode;
  const setRenderMode = onRenderModeChange || setInternalRenderMode;

  useEffect(() => {
    const handleScroll = () => {
      const vh = Math.max(window.innerHeight, 1);
      const isPastHero = window.scrollY > vh * 1.2;
      setInViewport(!isPastHero);
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / vh)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (energySurge <= 0.01) return;
    const timer = requestAnimationFrame(() => {
      setEnergySurge((prev) => Math.max(0, prev * 0.92 - 0.005));
    });
    return () => cancelAnimationFrame(timer);
  }, [energySurge]);

  const handleCanvasClick = () => {
    soundEngine.playSuccess();
    setEnergySurge(1.0);
  };

  return (
    <div
      onClick={handleCanvasClick}
      className="relative w-full h-full cursor-3d select-none"
      data-cursor="3d"
      title="Clic para detonar pulso electromagnético en el Servidor Cuántico Orbital // Astrolabio CNC"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 46 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.5]}
        frameloop={inViewport ? "always" : "demand"}
        className="w-full h-full pointer-events-auto"
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn("[Hero3DScene] WebGL context lost. Initiating graceful recovery watchdog.");
          };
          const handleContextRestored = () => {
            console.info("[Hero3DScene] WebGL context restored successfully.");
          };
          dom.addEventListener("webglcontextlost", handleContextLost, false);
          dom.addEventListener("webglcontextrestored", handleContextRestored, false);
        }}
      >
        <SceneContent
          isVisible={inViewport}
          energySurge={energySurge}
          scrollProgress={scrollProgress}
          renderMode={renderMode}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      {showOverlayControls && (
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-[#070B12]/85 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D4AF37]/30 text-xs font-mono shadow-2xl pointer-events-auto">
          <span className="text-[#D4AF37] font-bold mr-1 tracking-wider text-[11px]">// ASTROLABIO CNC // NÚCLEO:</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('chromatic'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'chromatic' ? 'bg-[#D4AF37] text-[#070B12] font-bold shadow-md shadow-[#D4AF37]/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            PBR FÍSICO
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('wireframe'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'wireframe' ? 'bg-[#D4AF37] text-[#070B12] font-bold shadow-md shadow-[#D4AF37]/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            WIREFRAME
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('xray'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'xray' ? 'bg-[#D4AF37] text-[#070B12] font-bold shadow-md shadow-[#D4AF37]/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            X-RAY NÚCLEO
          </button>
        </div>
      )}
    </div>
  );
}

// Astrolabio CNC & Servidor Cuántico Orbital 100% Procedural (0 KB latencia externa)
