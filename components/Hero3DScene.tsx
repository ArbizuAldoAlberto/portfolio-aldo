"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useMotionPreferences } from "./system/MotionPreferences";
import { soundEngine } from "./system/SoundEngine";

// 1. Base AgTech: Terreno Topográfico / Rejilla de Mapeo Agrícola
function AgTechGrid() {
  const gridRef = useRef<THREE.Mesh>(null);

  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(26, 20, 52, 40);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.38) * 0.65 +
        Math.cos(y * 0.28) * 0.5 +
        Math.sin((x + y) * 0.18) * 0.38;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -2.25 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      gridRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  return (
    <mesh
      ref={gridRef}
      geometry={geometry}
      rotation={[-1.2, 0, 0]}
      position={[0, -2.25, -1.3]}
    >
      <meshBasicMaterial
        wireframe
        color="#10B981"
        transparent
        opacity={0.16}
      />
    </mesh>
  );
}

// 2. Rayos Sagrados Multidimensionales (Beacon Rays)
function SacredBeaconRays() {
  const raysGroupRef = useRef<THREE.Group>(null);

  const rays = useMemo(() => {
    const lines = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 3.8;
      const y = Math.sin(angle) * 3.8;
      lines.push({ x, y, angle });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (raysGroupRef.current) {
      raysGroupRef.current.rotation.z = -state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={raysGroupRef} position={[0, 0.1, -0.2]}>
      {rays.map((ray, i) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              const pts = new Float32Array([0, 0, 0, ray.x, ray.y, (i % 2 === 0 ? 0.4 : -0.4)]);
              self.setAttribute("position", new THREE.BufferAttribute(pts, 3));
            }}
          />
          <lineBasicMaterial
            attach="material"
            color={i % 3 === 0 ? "#10B981" : i % 3 === 1 ? "#06B6D4" : "#F59E0B"}
            transparent
            opacity={0.18}
          />
        </line>
      ))}
    </group>
  );
}

// 3. Núcleo Sagrado: Cubo de Metatrón Monumental (Vertical, Multicromático & Iridiscente)
function MetatronCore({ energySurge }: { energySurge: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerIcosahedronRef = useRef<THREE.Mesh>(null);
  const innerOctahedronRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);

  const { scene } = useGLTF("/models/metatron.glb");

  // Clonar y configurar materiales PBR multicromáticos e iridiscentes
  const { solidScene, wireframeScene, scaleMultiplier } = useMemo(() => {
    const solid = scene.clone(true);
    const wire = scene.clone(true);

    // 1. Reorientar la geometría verticalmente en 90° para que quede erguida y frontal
    solid.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.geometry = child.geometry.clone();
        child.geometry.rotateX(Math.PI / 2);
      }
    });

    wire.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.geometry = child.geometry.clone();
        child.geometry.rotateX(Math.PI / 2);
      }
    });

    // 2. Centrar y normalizar a escala monumental (targetSize = 4.1)
    const box = new THREE.Box3().setFromObject(solid);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4.15; // Tamaño monumental dominante en el hero
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    const center = new THREE.Vector3();
    box.getCenter(center);
    solid.position.sub(center);
    wire.position.sub(center);

    // 3. Material 1: Cristal PBR Iridiscente Multicromático (Cuarzo, Esmeralda, Cian y Oro)
    const chromaticPhysicalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#059669"),
      emissive: new THREE.Color("#0d9488"),
      emissiveIntensity: 0.7,
      roughness: 0.08,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transmission: 0.32,
      ior: 1.6,
      iridescence: 1.0,
      iridescenceIOR: 1.85,
      iridescenceThicknessRange: [120, 850],
      transparent: true,
      opacity: 0.92,
      depthWrite: true,
    });

    // 4. Material 2: Armadura Wireframe con pulso de color dinámico
    const wireMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: new THREE.Color("#34D399"),
      transparent: true,
      opacity: 0.55,
    });

    solid.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = chromaticPhysicalMaterial;
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });

    wire.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = wireMaterial;
      }
    });

    return {
      solidScene: solid,
      wireframeScene: wire,
      scaleMultiplier: scale,
    };
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const boost = 1 + energySurge * 2.5;

    if (groupRef.current) {
      // Rotación giroscópica sagrada multidimensional con impulso de energía
      groupRef.current.rotation.y = t * 0.18 * boost;
      groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.12;
      groupRef.current.rotation.z = Math.cos(t * 0.1) * 0.08;

      // Respiración armónica sutil del Metatrón + expansión por energía de clic
      const breathScale = scaleMultiplier * (1 + Math.sin(t * 1.6) * 0.025 + energySurge * 0.08);
      groupRef.current.scale.set(breathScale, breathScale, breathScale);
    }

    // Rotación de los sólidos platónicos internos anidados
    if (innerIcosahedronRef.current) {
      innerIcosahedronRef.current.rotation.y = -t * 0.35 * boost;
      innerIcosahedronRef.current.rotation.z = t * 0.25;
    }
    if (innerOctahedronRef.current) {
      innerOctahedronRef.current.rotation.x = t * 0.45 * boost;
      innerOctahedronRef.current.rotation.y = t * 0.3;
    }

    // Respiración del núcleo de luz central
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 3.2 + Math.sin(t * 2.4) * 1.4 + energySurge * 6.0;
    }

    // Pulso cromático continuo del wireframe (Esmeralda -> Cian -> Ámbar -> Púrpura)
    if (wireframeScene) {
      wireframeScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.color.setHSL((t * 0.06 + energySurge * 0.2) % 1, 0.95, 0.62);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={scaleMultiplier}>
      <primitive object={solidScene} />
      <primitive object={wireframeScene} scale={1.006} />

      {/* Sólido Platónico Interno 1: Icosaedro Cuántico Púrpura/Cian */}
      <mesh ref={innerIcosahedronRef} scale={0.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial wireframe color="#8B5CF6" transparent opacity={0.65} />
      </mesh>

      {/* Sólido Platónico Interno 2: Octaedro Solar Ámbar */}
      <mesh ref={innerOctahedronRef} scale={0.42}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#F59E0B" wireframe transparent opacity={0.85} />
      </mesh>

      {/* Núcleo de Energía Interno (Quantum Singularity) */}
      <pointLight ref={coreLightRef} position={[0, 0, 0]} color="#06B6D4" intensity={3.5} distance={9} />
    </group>
  );
}

// 4. Escudo de Ciberseguridad: 4 Anillos Orbitales Sagrados con Marcadores Giroscópicos
function SecurityShield({ energySurge }: { energySurge: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const boost = 1 + energySurge * 2.0;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.24 * boost;
      ring1Ref.current.rotation.y = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.18;
      ring2Ref.current.rotation.z = t * 0.26 * boost;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = -t * 0.16 * boost;
      ring3Ref.current.rotation.z = -t * 0.12;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x = t * 0.12;
      ring4Ref.current.rotation.z = -t * 0.2 * boost;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Anillo Orbital 1 - Ámbar / Oro Solar */}
      <mesh ref={ring1Ref} scale={2.45}>
        <torusGeometry args={[1, 0.012, 16, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.75} />
      </mesh>

      {/* Anillo Orbital 2 - Cian Eléctrico */}
      <mesh ref={ring2Ref} scale={2.95}>
        <torusGeometry args={[1, 0.009, 16, 64]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.65} />
      </mesh>

      {/* Anillo Orbital 3 - Púrpura Cuántico con segmentación */}
      <mesh ref={ring3Ref} scale={3.45}>
        <torusGeometry args={[1, 0.008, 12, 48]} />
        <meshBasicMaterial wireframe color="#A855F7" transparent opacity={0.45} />
      </mesh>

      {/* Anillo Orbital 4 - Perímetro Esmeralda Criptográfico */}
      <mesh ref={ring4Ref} scale={3.95}>
        <torusGeometry args={[1, 0.006, 8, 36]} />
        <meshBasicMaterial wireframe color="#10B981" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// 5. Luces Multicromáticas Orbitales (Matriz Esmeralda, Cian, Ámbar, Púrpura)
function ChromaticLightsMatrix({ energySurge }: { energySurge: number }) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const light4Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.45;
    const r = 4.8;
    const boost = 1 + energySurge * 1.5;

    // Órbita 3D de las 4 fuentes de luz multicromáticas
    if (light1Ref.current) {
      light1Ref.current.position.set(Math.cos(t) * r, Math.sin(t * 0.8) * 2.6, Math.sin(t) * r);
      light1Ref.current.intensity = 2.8 * boost;
    }
    if (light2Ref.current) {
      light2Ref.current.position.set(
        Math.cos(t + Math.PI * 0.5) * r,
        Math.sin(t * 0.6 + 1) * 2.6,
        Math.sin(t + Math.PI * 0.5) * r
      );
      light2Ref.current.intensity = 2.8 * boost;
    }
    if (light3Ref.current) {
      light3Ref.current.position.set(
        Math.cos(t + Math.PI) * r,
        Math.sin(t * 0.7 + 2) * 2.6,
        Math.sin(t + Math.PI) * r
      );
      light3Ref.current.intensity = 2.8 * boost;
    }
    if (light4Ref.current) {
      light4Ref.current.position.set(
        Math.cos(t + Math.PI * 1.5) * r,
        Math.sin(t * 0.9 + 3) * 2.6,
        Math.sin(t + Math.PI * 1.5) * r
      );
      light4Ref.current.intensity = 2.8 * boost;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color="#10B981" intensity={2.8} distance={10} />
      <pointLight ref={light2Ref} color="#06B6D4" intensity={2.8} distance={10} />
      <pointLight ref={light3Ref} color="#F59E0B" intensity={2.8} distance={10} />
      <pointLight ref={light4Ref} color="#A855F7" intensity={2.8} distance={10} />
    </>
  );
}

// 6. Composición Interactiva con Parallax de Puntero, Pulso de Energía & Niebla
function SceneContent({ isVisible, energySurge }: { isVisible: boolean; energySurge: number }) {
  const sceneGroup = useRef<THREE.Group>(null);
  const dynamicLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!isVisible) return;

    // 1. Parallax elástico responsivo al cursor del mouse
    if (sceneGroup.current) {
      const targetX = state.pointer.x * 0.55;
      const targetY = state.pointer.y * 0.45;
      sceneGroup.current.position.x = THREE.MathUtils.lerp(sceneGroup.current.position.x, targetX, 0.06);
      sceneGroup.current.position.y = THREE.MathUtils.lerp(sceneGroup.current.position.y, targetY, 0.06);

      // Inclinación 3D en tiempo real hacia la dirección del puntero
      sceneGroup.current.rotation.y = THREE.MathUtils.lerp(sceneGroup.current.rotation.y, state.pointer.x * 0.45, 0.05);
      sceneGroup.current.rotation.x = THREE.MathUtils.lerp(sceneGroup.current.rotation.x, -state.pointer.y * 0.35, 0.05);
    }

    // 2. Haz de luz interactivo que sigue el puntero e ilumina las facetas iridiscentes
    if (dynamicLightRef.current) {
      dynamicLightRef.current.position.x = state.pointer.x * 5;
      dynamicLightRef.current.position.y = state.pointer.y * 4;
      dynamicLightRef.current.intensity = 3.0 + energySurge * 5.0;
    }
  });

  return (
    <group ref={sceneGroup}>
      {/* Niebla exponencial para profundidad atmosférica cinematográfica */}
      <fog attach="fog" args={["#0A0A0C", 4.0, 11.5]} />

      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} color="#FFFFFF" />
      <pointLight ref={dynamicLightRef} position={[0, 0, 3.5]} intensity={3.0} color="#34D399" distance={10} />

      {/* Matriz de 4 Luces Multicromáticas Orbitando */}
      <ChromaticLightsMatrix energySurge={energySurge} />

      {/* Rayos Sagrados Multidimensionales */}
      <SacredBeaconRays />

      {/* Partículas de Telemetría Multicromáticas */}
      <Sparkles count={55} scale={8} size={2.0} speed={0.4} opacity={0.5} color="#10B981" />
      <Sparkles count={45} scale={7} size={2.2} speed={0.35} opacity={0.5} color="#06B6D4" />
      <Sparkles count={35} scale={6} size={2.4} speed={0.3} opacity={0.45} color="#F59E0B" />
      <Sparkles count={30} scale={7} size={2.2} speed={0.25} opacity={0.4} color="#A855F7" />

      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.45}>
        <Suspense fallback={null}>
          <MetatronCore energySurge={energySurge} />
        </Suspense>
        <SecurityShield energySurge={energySurge} />
      </Float>

      <AgTechGrid />
    </group>
  );
}

export function Hero3DScene() {
  const { reducedMotion } = useMotionPreferences();
  const [inViewport, setInViewport] = useState(true);
  const [energySurge, setEnergySurge] = useState(0);

  // Performance budget: pausar cómputo WebGL cuando la escena sale de vista
  useEffect(() => {
    const handleScroll = () => {
      const isPastHero = window.scrollY > window.innerHeight * 1.2;
      setInViewport(!isPastHero);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animación de decaimiento del impulso de energía interactivo
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
      className="w-full h-full cursor-3d select-none"
      data-cursor="3d"
      title="Clic para detonar pulso cuántico en el Cubo de Metatrón"
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 46 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? "never" : inViewport ? "always" : "demand"}
        className="w-full h-full pointer-events-auto"
      >
        <SceneContent isVisible={inViewport && !reducedMotion} energySurge={energySurge} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/metatron.glb");
