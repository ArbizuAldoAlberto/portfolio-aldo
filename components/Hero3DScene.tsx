"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useMotionPreferences } from "./system/MotionPreferences";
import { soundEngine } from "./system/SoundEngine";
import {
  createAnisotropicRoughnessTexture,
  createMicroPebbleNormalTexture,
} from "./3d/pbrTextures";
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
      shader.fragmentShader = `
        uniform float uScanY;
        uniform float uTime;
        ${shader.fragmentShader}
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        // Haz de Escaneo Láser LiDAR Titanium & Solar Gold (#D4AF37 / #E2E8F0)
        float distToScan = abs(vViewPosition.y - uScanY);
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
      // Rotación en contra-fase al alabeo del Halcón (Horizonte Artificial)
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
// 4. MOD-01 & MOD-02: Halcón Peregrino Cibernético AAA (PBR Físico + GLSL Fresnel)
// ============================================================================
function CyberFalcon({
  energySurge,
  renderMode,
  reducedMotion = false,
  onAttitudeUpdate,
}: {
  energySurge: number;
  renderMode: 'chromatic' | 'wireframe' | 'xray';
  reducedMotion?: boolean;
  onAttitudeUpdate?: (roll: number, pitch: number, pointer: { x: number; y: number }) => void;
}) {
  const falconGroupRef = useRef<THREE.Group>(null);
  const headPivotRef = useRef<THREE.Object3D | null>(null);
  const wingLPivotRef = useRef<THREE.Object3D | null>(null);
  const wingLWristRef = useRef<THREE.Object3D | null>(null);
  const wingRPivotRef = useRef<THREE.Object3D | null>(null);
  const wingRWristRef = useRef<THREE.Object3D | null>(null);
  const tailPivotRef = useRef<THREE.Object3D | null>(null);
  const reactorRef = useRef<THREE.Object3D | null>(null);
  const reactorLightRef = useRef<THREE.PointLight>(null);

  // Estado inercial de resorte crítico (Critically Damped Inverted Spring)
  const rollRef = useRef(0);
  const pitchRef = useRef(0);
  const yawRef = useRef(0);

  const { scene } = useGLTF("/models/cyber_falcon.glb");

  // Materiales físicos de grado cinematográfico (PBR Awwwards Grade)
  const materials = useMemo(() => {
    const anisoRoughnessMap = createAnisotropicRoughnessTexture(256);
    const microNormalMap = createMicroPebbleNormalTexture(256);

    // 1. Titanio Grado 5 con Clearcoat & Rim Light GLSL + Texturas Anisotrópicas PBR
    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#506272"),
      metalness: 0.96,
      roughness: 0.18,
      roughnessMap: anisoRoughnessMap,
      normalMap: microNormalMap,
      normalScale: new THREE.Vector2(0.25, 0.25),
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98,
      envMapIntensity: 2.6,
    });
    titaniumMat.customProgramCacheKey = () => "FalconTitaniumFresnel_v3";
    titaniumMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uSurge = { value: 0 };
      shader.fragmentShader = `
        uniform float uTime;
        uniform float uSurge;
        ${shader.fragmentShader}
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        vec3 viewDirNorm = normalize(vViewPosition);
        float fresnel = pow(1.0 - clamp(dot(geometryNormal, -viewDirNorm), 0.0, 1.0), 3.0);
        vec3 rimCol = mix(vec3(0.06, 0.72, 0.51), vec3(0.02, 0.85, 0.95), fresnel);
        float pulse = 0.85 + sin(uTime * 2.5) * 0.25 + uSurge * 2.5;
        gl_FragColor.rgb += rimCol * fresnel * pulse * 0.85;
        `
      );
      titaniumMat.userData.shader = shader;
    };

    // 2. Oro Aeroespacial 24K con Anisotropía Óptica
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FBBF24"),
      emissive: new THREE.Color("#92400e"),
      emissiveIntensity: 0.35,
      metalness: 0.98,
      roughness: 0.10,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98,
      envMapIntensity: 2.5,
    });
    goldMat.customProgramCacheKey = () => "FalconGoldFresnel_v3";
    goldMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.fragmentShader = `
        uniform float uTime;
        ${shader.fragmentShader}
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        vec3 viewDirNorm = normalize(vViewPosition);
        float fresnel = pow(1.0 - clamp(dot(geometryNormal, -viewDirNorm), 0.0, 1.0), 3.2);
        vec3 goldRim = mix(vec3(0.98, 0.75, 0.14), vec3(1.0, 0.92, 0.65), fresnel);
        gl_FragColor.rgb += goldRim * fresnel * 0.65;
        `
      );
      goldMat.userData.shader = shader;
    };

    // 3. Reactor Cuántico & Ojos con Núcleo de Plasma Procedural
    const quantumMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#059669"),
      emissive: new THREE.Color("#34D399"),
      emissiveIntensity: 3.2,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.25,
      thickness: 0.5,
    });
    quantumMat.customProgramCacheKey = () => "FalconQuantumPlasma_v3";
    quantumMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uSurge = { value: 0 };
      shader.fragmentShader = `
        uniform float uTime;
        uniform float uSurge;
        ${shader.fragmentShader}
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        float plasma = sin(vViewPosition.x * 12.0 + uTime * 6.0) * cos(vViewPosition.y * 12.0 + uTime * 4.0);
        vec3 coreGlow = mix(vec3(0.06, 0.72, 0.51), vec3(0.20, 0.95, 0.65), plasma * 0.5 + 0.5);
        gl_FragColor.rgb += coreGlow * (1.2 + uSurge * 3.0);
        `
      );
      quantumMat.userData.shader = shader;
    };

    // 4. Modo Wireframe de Ingeniería
    const wireMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: new THREE.Color("#10B981"),
      transparent: true,
      opacity: 0.85,
    });

    // 5. Modo X-Ray Núcleo Dieléctrico
    const xrayMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.28,
      roughness: 0.06,
      transmission: 0.82,
      ior: 1.45,
    });

    return { titaniumMat, goldMat, quantumMat, wireMat, xrayMat };
  }, []);

  // Clonar y centrar la escena del Halcón
  const clonedScene = useMemo(() => {
    const root = scene.clone(true);

    // Orientación natural: planeo dinámico hacia el observador (45° pitch)
    root.rotation.x = Math.PI / 3.2;

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 7.0; // Envergadura monumental alar que enmarca el titular del Hero
    const s = maxDim > 0 ? targetSize / maxDim : 1;
    root.scale.set(s, s, s);

    const center = new THREE.Vector3();
    box.getCenter(center);
    root.position.sub(center.multiplyScalar(s));

    return root;
  }, [scene]);

  // MOD-01: Corrección Integral de Traversal de Mallas y Asignación de Nodos
  useEffect(() => {
    headPivotRef.current = clonedScene.getObjectByName("Falcon_Head_Pivot") || null;
    wingLPivotRef.current = clonedScene.getObjectByName("Falcon_WingL_Pivot") || null;
    wingLWristRef.current = clonedScene.getObjectByName("Falcon_WingL_Wrist_Pivot") || null;
    wingRPivotRef.current = clonedScene.getObjectByName("Falcon_WingR_Pivot") || null;
    wingRWristRef.current = clonedScene.getObjectByName("Falcon_WingR_Wrist_Pivot") || null;
    tailPivotRef.current = clonedScene.getObjectByName("Falcon_Tail_Pivot") || null;
    reactorRef.current = clonedScene.getObjectByName("Falcon_Chest_Reactor") || null;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mName = mesh.name;
        const pName = mesh.parent?.name || "";

        if (renderMode === "wireframe") {
          mesh.material = materials.wireMat;
        } else if (renderMode === "xray") {
          if (
            mName.includes("Reactor") ||
            pName.includes("Reactor") ||
            mName.includes("Eye") ||
            mName.startsWith("Icosphere")
          ) {
            mesh.material = materials.quantumMat;
          } else {
            mesh.material = materials.xrayMat;
          }
        } else {
          // Modo PBR Físico Élite
          if (
            mName.includes("Reactor") ||
            pName.includes("Reactor") ||
            mName.includes("Eye") ||
            mName.startsWith("Icosphere")
          ) {
            mesh.material = materials.quantumMat;
          } else if (
            mName.includes("Talons") ||
            pName.includes("Talons") ||
            mName.includes("Beak") ||
            mName === "Falcon_Skull_Mesh_1" ||
            mName === "Cube006_1" ||
            mName === "Cube013_1" ||
            mName === "Cube020_1" ||
            mName.includes("Vanes") ||
            pName.includes("Vanes")
          ) {
            // Remiges primarias chevron, pico raptor y garras en Oro 24K
            mesh.material = materials.goldMat;
          } else {
            // Fuselaje y largueros alares en Titanio Grado 5 con Fresnel
            mesh.material = materials.titaniumMat;
          }
        }
      }
    });
  }, [clonedScene, renderMode, materials]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const boost = 1 + energySurge * 2.2;
    const pointer = state.pointer;

    // Actualización de uniforms en shaders GLSL personalizados
    if (materials.titaniumMat.userData.shader) {
      materials.titaniumMat.userData.shader.uniforms.uTime.value = t;
      materials.titaniumMat.userData.shader.uniforms.uSurge.value = energySurge;
    }
    if (materials.goldMat.userData.shader) {
      materials.goldMat.userData.shader.uniforms.uTime.value = t;
    }
    if (materials.quantumMat.userData.shader) {
      materials.quantumMat.userData.shader.uniforms.uTime.value = t;
      materials.quantumMat.userData.shader.uniforms.uSurge.value = energySurge;
    }

    // ========================================================================
    // MOD-02: Cinemática Aeroelástica Multicapa (Desfase de Fase en Remiges)
    // ========================================================================
    const cycleTime = t % 5.0;
    const isFlapping = !reducedMotion && (cycleTime < 3.2 || energySurge > 0.05);

    let flapAngle = 0;
    let wristLag = 0;

    if (isFlapping) {
      const flapFreq = 4.8 * boost;
      const strokeProgress = Math.sin(t * flapFreq);
      const nonLinearFlap = strokeProgress > 0 ? Math.pow(strokeProgress, 0.85) : -Math.pow(-strokeProgress, 1.15);
      flapAngle = nonLinearFlap * (0.38 + energySurge * 0.28);

      // Desfase aeroelástico en la muñeca (efecto látigo en remiges)
      const aeroelasticPhase = Math.sin(t * flapFreq - 0.45);
      const aeroFlutter = Math.sin(t * 14.0) * 0.025; // Micro-turbulencia alar
      wristLag = aeroelasticPhase * (0.35 + energySurge * 0.2) + aeroFlutter;
    } else {
      // Planeo térmico con suave absorción de brisa
      flapAngle = Math.sin(t * 1.6) * 0.05;
      wristLag = Math.sin(t * 1.6 - 0.3) * 0.035 + (reducedMotion ? 0 : Math.sin(t * 8.0) * 0.01);
    }

    if (wingLPivotRef.current) {
      wingLPivotRef.current.rotation.z = flapAngle;
      wingLPivotRef.current.rotation.x = Math.cos(t * 4.8) * 0.06;
    }
    if (wingLWristRef.current) {
      wingLWristRef.current.rotation.z = wristLag;
    }

    if (wingRPivotRef.current) {
      wingRPivotRef.current.rotation.z = -flapAngle;
      wingRPivotRef.current.rotation.x = Math.cos(t * 4.8) * 0.06;
    }
    if (wingRWristRef.current) {
      wingRWristRef.current.rotation.z = -wristLag;
    }

    // ========================================================================
    // MOD-02: Inercia de Combate con Resorte Crítico (Critically Damped Banking)
    // ========================================================================
    const targetRoll = -pointer.x * 0.82;
    const targetPitch = -pointer.y * 0.42 + (reducedMotion ? 0 : Math.sin(t * 1.8) * 0.04);
    const targetYaw = pointer.x * 0.52;

    rollRef.current = THREE.MathUtils.damp(rollRef.current, targetRoll, 7.0, delta);
    pitchRef.current = THREE.MathUtils.damp(pitchRef.current, targetPitch, 6.0, delta);
    yawRef.current = THREE.MathUtils.damp(yawRef.current, targetYaw, 6.5, delta);

    if (falconGroupRef.current) {
      falconGroupRef.current.rotation.z = rollRef.current;
      falconGroupRef.current.rotation.x = pitchRef.current;
      falconGroupRef.current.rotation.y = yawRef.current;

      falconGroupRef.current.position.y = THREE.MathUtils.damp(
        falconGroupRef.current.position.y,
        0.08 + (reducedMotion ? 0 : Math.sin(t * 2.2) * 0.12) + pointer.y * 0.35,
        6.0,
        delta
      );
      falconGroupRef.current.position.x = THREE.MathUtils.damp(
        falconGroupRef.current.position.x,
        pointer.x * 0.65,
        6.0,
        delta
      );
    }

    // Estabilizador Caudal: Guiñada y Alabeo Compensatorio
    if (tailPivotRef.current) {
      tailPivotRef.current.rotation.x = pitchRef.current * 0.45 - 0.06;
      tailPivotRef.current.rotation.z = -yawRef.current * 0.55;
    }

    // Seguimiento Ocular Predatorio por Cursor con Micro-Saccades
    if (headPivotRef.current) {
      headPivotRef.current.rotation.z = THREE.MathUtils.damp(headPivotRef.current.rotation.z, -pointer.x * 0.85, 9.0, delta);
      headPivotRef.current.rotation.x = THREE.MathUtils.damp(headPivotRef.current.rotation.x, -pointer.y * 0.55, 9.0, delta);
    }

    // Reactor Pectoral y Destello Cuántico
    if (reactorRef.current) {
      const pulse = 1 + Math.sin(t * 3.8) * 0.06 + energySurge * 0.35;
      reactorRef.current.scale.set(pulse, pulse, pulse);
    }

    if (reactorLightRef.current) {
      reactorLightRef.current.intensity = 1.6 + Math.sin(t * 3.2) * 0.4 + energySurge * 4.0;
    }

    // Notificar actitud actual al HUD Táctico
    if (onAttitudeUpdate) {
      onAttitudeUpdate(rollRef.current, pitchRef.current, pointer);
    }
  });

  return (
    <group ref={falconGroupRef} position={[0, 0.08, -0.2]}>
      <primitive object={clonedScene} />

      {/* Luz Cuántica Central del Reactor Pectoral */}
      <pointLight
        ref={reactorLightRef}
        position={[0, 0.25, 0.25]}
        color="#10B981"
        distance={4.5}
        intensity={1.6}
      />
    </group>
  );
}

// ============================================================================
// 5. Matriz de Luces Dinámicas & Entorno PBR Offline
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
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-xs font-mono shadow-2xl pointer-events-auto">
          <span className="text-emerald-400 font-bold mr-1 tracking-wider text-[11px]">// HALCÓN WORKBENCH:</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('chromatic'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'chromatic' ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            PBR FÍSICO
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('wireframe'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'wireframe' ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            WIREFRAME
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); soundEngine.playClick(); setRenderMode('xray'); }}
            className={`px-3 py-1 rounded-full transition-all text-[11px] ${renderMode === 'xray' ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/25' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            X-RAY NÚCLEO
          </button>
        </div>
      )}
    </div>
  );
}

// Astrolabio CNC & Servidor Cuántico Orbital 100% Procedural (0 KB latencia externa)
