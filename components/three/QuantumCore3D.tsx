"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export type WorkbenchMode = "pbr" | "wireframe" | "xray";

export interface QuantumCore3DProps {
  mode?: WorkbenchMode;
  scrollProgress?: number;
  energySurge?: number;
}

const CAD_BLUEPRINT_VERTEX_GLSL = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vLocalPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPosition.xyz;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const CAD_BLUEPRINT_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergySurge;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vec3 V = normalize(vViewPos);
    vec3 N = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);

    // Isolíneas de plano técnico CAD en espacio local y mundial
    float isoY = 1.0 - smoothstep(0.015, 0.06, abs(fract(vWorldPos.y * 16.0 - uTime * 0.18) - 0.5));
    float isoX = 1.0 - smoothstep(0.015, 0.06, abs(fract(vWorldPos.x * 16.0) - 0.5));
    float isoRadial = 1.0 - smoothstep(0.015, 0.06, abs(fract(length(vLocalPos) * 14.0) - 0.5));
    float cadGrid = clamp(isoY * 0.70 + isoX * 0.45 + isoRadial * 0.55, 0.0, 1.0);

    float scanSweep = exp(-pow((fract(vWorldPos.y * 0.55 - uTime * 0.20) - 0.5) * 10.0, 2.0));

    vec3 obsidian   = vec3(0.027, 0.043, 0.071); // #070B12
    vec3 techSteel  = vec3(0.580, 0.639, 0.722); // #94A3B8
    vec3 solarGold  = vec3(0.831, 0.686, 0.216); // #D4AF37
    vec3 platinum   = vec3(0.973, 0.980, 0.988); // #F8FAFC

    vec3 col = mix(obsidian, techSteel * 0.75, cadGrid * 0.65);
    col = mix(col, solarGold, fresnel * 0.72 + scanSweep * 0.65 + uEnergySurge * 0.40);
    col += platinum * (scanSweep * cadGrid * 0.35);
    col = col / (vec3(1.0) + col * 0.42);

    float alpha = clamp(0.42 + cadGrid * 0.42 + fresnel * 0.45, 0.0, 0.94);
    gl_FragColor = vec4(col, alpha);
  }
`;

const XRAY_QUANTUM_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergySurge;
  uniform vec3 uGoldColor;
  uniform vec3 uPlatinumColor;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vec3 V = normalize(vViewPos);
    vec3 N = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(N, V)), 2.2);

    float radialDist = length(vLocalPos);
    float emWave = 0.75 + 0.25 * sin(radialDist * 18.0 - uTime * 5.2);
    float shockWave = sin(radialDist * 22.0 - uTime * 12.0) * 0.5 + 0.5;

    vec3 col = mix(uGoldColor * 0.35, uPlatinumColor * 0.85, fresnel) * emWave;
    col += uGoldColor * (fresnel * 0.55 + shockWave * uEnergySurge * 0.70);
    col = col / (vec3(1.0) + col * 0.45);

    float alpha = clamp(fresnel * 0.78 + 0.12 + uEnergySurge * 0.22, 0.0, 0.88);
    gl_FragColor = vec4(col, alpha);
  }
`;

function createMicrometricTicksGeometry(radius: number, count: number, baseTickLen: number): THREE.BufferGeometry {
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const isMajor = i % 6 === 0;
    const isMedium = i % 3 === 0;
    const len = isMajor ? baseTickLen * 2.1 : isMedium ? baseTickLen * 1.45 : baseTickLen;
    const rInner = radius + 0.018;
    const rOuter = rInner + len;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    positions.push(c * rInner, s * rInner, 0);
    positions.push(c * rOuter, s * rOuter, 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

export function QuantumCore3D({
  mode = "pbr",
  scrollProgress = 0,
  energySurge = 0,
}: QuantumCore3DProps) {
  const viewport = useThree((s) => s.viewport);
  const isMobileViewport = viewport.width < 3.6;

  const rootGroupRef = useRef<THREE.Group>(null);
  const equatorialVernierRef = useRef<THREE.Group>(null);
  const outerGimbalRef = useRef<THREE.Group>(null);
  const middleGimbalRef = useRef<THREE.Group>(null);
  const innerGimbalRef = useRef<THREE.Group>(null);
  const satellitesGroupRef = useRef<THREE.Group>(null);
  const crystalCoreRef = useRef<THREE.Mesh>(null);
  const innerPulseCoreRef = useRef<THREE.Mesh>(null);
  const quantumLatticeRef = useRef<THREE.Points>(null);
  const shockwaveRing1Ref = useRef<THREE.Mesh>(null);
  const shockwaveRing2Ref = useRef<THREE.Mesh>(null);

  // Estado de amortiguación elástica (Spring Damping) para impulsos rotacionales en clic o cambio de modo
  const springStateRef = useRef({
    offsetRotY: 0,
    offsetRotX: 0,
    velRotY: 0,
    velRotX: 0,
    localSurge: 0,
  });

  // Impulso rotacional suave con amortiguación elástica al cambiar entre PBR, Wireframe CAD y X-Ray Núcleo
  useEffect(() => {
    springStateRef.current.velRotY += 3.6;
    springStateRef.current.velRotX += 1.8;
    springStateRef.current.localSurge = 1.0;
  }, [mode]);

  const handleAstrolabeClick = () => {
    springStateRef.current.velRotY += 4.5;
    springStateRef.current.velRotX -= 2.2;
    springStateRef.current.localSurge = 1.0;
  };

  // Geometrías de Alta Relojería CNC: 3 Anillos Cardán, Pernos de Acoplamiento, Vernier Ecuatorial y 4 Satélites
  const geometries = useMemo(() => {
    // 0. Anillo Ecuatorial Fijo de Referencia con Retícula Micrométrica Fina (Vernier, R = 1.54)
    const vernierReferenceTorus = new THREE.TorusGeometry(1.54, 0.009, 16, 160);
    const vernierReferenceTicks = createMicrometricTicksGeometry(1.56, 120, 0.026);

    // 1. Anillo Cardán Exterior (Titanio Cepillado, R = 1.38)
    const outerTorus = new THREE.TorusGeometry(1.38, 0.026, 32, 160);
    const outerBevel = new THREE.TorusGeometry(1.43, 0.008, 16, 144);
    const outerTicks = createMicrometricTicksGeometry(1.44, 72, 0.036);

    // 2. Anillo Cardán Intermedio (Bronce Anodizado / Oro Solar, R = 1.08)
    const middleTorus = new THREE.TorusGeometry(1.08, 0.022, 32, 144);
    const middleRail = new THREE.TorusGeometry(1.02, 0.009, 16, 128);
    const middleTicks = createMicrometricTicksGeometry(1.11, 48, 0.032);

    // 3. Anillo Cardán Interior (Obsidiana & Oro Solar, R = 0.78)
    const innerTorus = new THREE.TorusGeometry(0.78, 0.020, 28, 128);
    const innerTicks = createMicrometricTicksGeometry(0.81, 36, 0.028);

    // 4. Uniones Mecánicas Reales (Gimbal Pivots & Coupling Pins en CylinderGeometry)
    // Conector físico Exterior (1.38) <-> Medio (1.08), longitud = 0.30
    const pivotOuterToMidPin = new THREE.CylinderGeometry(0.022, 0.022, 0.30, 24);
    const pivotCollarFlange = new THREE.CylinderGeometry(0.044, 0.044, 0.065, 24);
    // Conector físico Medio (1.08) <-> Interior (0.78), longitud = 0.30
    const pivotMidToInnerPin = new THREE.CylinderGeometry(0.019, 0.019, 0.30, 24);
    // Conector físico Interior (0.78) <-> Jaula Núcleo (0.52), longitud = 0.26
    const pivotInnerToCorePin = new THREE.CylinderGeometry(0.015, 0.015, 0.26, 20);

    // 5. 4 Nodos Orbitales Satelitales (Giroscopios Auxiliares)
    const satelliteCoreGeo = new THREE.OctahedronGeometry(0.044, 0);
    const satelliteHaloGeo = new THREE.TorusGeometry(0.076, 0.006, 12, 36);

    // 6. Esfera / Poliedro Central de Cristal Óptico (IcosahedronGeometry con refracción)
    const opticalCrystalGeo = new THREE.IcosahedronGeometry(0.48, 3);
    const innerReactorGeo = new THREE.IcosahedronGeometry(0.28, 1);
    const coreCageGeo = new THREE.IcosahedronGeometry(0.52, 1);

    // 7. Campo de Puntos Cuánticos Orbitales alrededor del núcleo
    const ptCount = 420;
    const ptPositions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / ptCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.34 + ((i * 19) % 100) * 0.009;
      ptPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      ptPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ptPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const quantumPointsGeo = new THREE.BufferGeometry();
    quantumPointsGeo.setAttribute("position", new THREE.BufferAttribute(ptPositions, 3));

    // 8. Anillos de onda de choque electromagnética (X-Ray / Clic)
    const shockRingGeo = new THREE.RingGeometry(0.52, 0.56, 96);

    return {
      vernierReferenceTorus,
      vernierReferenceTicks,
      outerTorus,
      outerBevel,
      outerTicks,
      middleTorus,
      middleRail,
      middleTicks,
      innerTorus,
      innerTicks,
      pivotOuterToMidPin,
      pivotCollarFlange,
      pivotMidToInnerPin,
      pivotInnerToCorePin,
      satelliteCoreGeo,
      satelliteHaloGeo,
      opticalCrystalGeo,
      innerReactorGeo,
      coreCageGeo,
      quantumPointsGeo,
      shockRingGeo,
    };
  }, []);

  // Materiales Ejecutivos Titanium & Warm Bronze (#070B12, #E2E8F0, #94A3B8, #D4AF37)
  const materials = useMemo(() => {
    // 1. Titanio Cepillado Aeroespacial (#E2E8F0 / #CBD5E1)
    const brushedTitaniumMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#E2E8F0"),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.10,
      reflectivity: 0.95,
      envMapIntensity: 1.35,
    });

    // 2. Bronce Cálido / Oro Solar Anodizado (#D4AF37)
    const anodizedBronzeGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4AF37"),
      metalness: 0.95,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color("#8C6D46"),
      emissiveIntensity: 0.18,
      envMapIntensity: 1.4,
    });

    // 3. Obsidiana Profunda Anodizada (#070B12)
    const obsidianTitaniumMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#070B12"),
      metalness: 0.94,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.28,
      iridescenceIOR: 1.5,
      envMapIntensity: 1.3,
    });

    // 4. Cristal Óptico Refractivo Central (IcosahedronGeometry con MeshPhysicalMaterial)
    const opticalCrystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F8FAFC"),
      metalness: 0.08,
      roughness: 0.06,
      transmission: 0.92,
      ior: 1.68,
      thickness: 1.4,
      attenuationColor: new THREE.Color("#D4AF37"),
      attenuationDistance: 1.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 0.35,
      iridescenceIOR: 1.6,
      transparent: true,
      opacity: 0.95,
    });

    // 5. Núcleo Energético Interior en Oro Solar Pulsante
    const innerPulseMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4AF37"),
      metalness: 0.90,
      roughness: 0.12,
      emissive: new THREE.Color("#D4AF37"),
      emissiveIntensity: 0.48,
      wireframe: false,
    });

    const coreCageWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D4AF37"),
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });

    // Marcas de graduación micrométrica
    const goldTicksMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#D4AF37"),
      transparent: true,
      opacity: 0.68,
    });

    const steelTicksMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#94A3B8"),
      transparent: true,
      opacity: 0.52,
    });

    // Shaders para Modo 2 (Wireframe CAD) y Modo 3 (X-Ray Núcleo)
    const cadShaderMat = new THREE.ShaderMaterial({
      vertexShader: CAD_BLUEPRINT_VERTEX_GLSL,
      fragmentShader: CAD_BLUEPRINT_FRAGMENT_GLSL,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
      },
      transparent: true,
    });

    const cadWireframeOverlayMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D4AF37"),
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const xrayShaderMat = new THREE.ShaderMaterial({
      vertexShader: CAD_BLUEPRINT_VERTEX_GLSL,
      fragmentShader: XRAY_QUANTUM_FRAGMENT_GLSL,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
        uGoldColor: { value: new THREE.Color("#D4AF37") },
        uPlatinumColor: { value: new THREE.Color("#E2E8F0") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const quantumPointsMat = new THREE.PointsMaterial({
      color: new THREE.Color("#D4AF37"),
      size: 0.026,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const shockwaveMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D4AF37"),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const shockwaveMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#E2E8F0"),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    return {
      brushedTitaniumMat,
      anodizedBronzeGoldMat,
      obsidianTitaniumMat,
      opticalCrystalMat,
      innerPulseMat,
      coreCageWireMat,
      goldTicksMat,
      steelTicksMat,
      cadShaderMat,
      cadWireframeOverlayMat,
      xrayShaderMat,
      quantumPointsMat,
      shockwaveMat1,
      shockwaveMat2,
    };
  }, []);

  // Liberación determinista de recursos GPU en desmontaje
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [geometries, materials]);

  // Animación de Rotación Sincrónica Multi-Eje + Spring Damping Elástico + Seguimiento del Cursor
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Integración física del resorte amortiguado (Spring Damping)
    const sp = springStateRef.current;
    const stiffness = 18.0;
    const damping = 4.2;
    const accelY = -stiffness * sp.offsetRotY - damping * sp.velRotY;
    const accelX = -stiffness * sp.offsetRotX - damping * sp.velRotX;
    sp.velRotY += accelY * dt;
    sp.velRotX += accelX * dt;
    sp.offsetRotY += sp.velRotY * dt;
    sp.offsetRotX += sp.velRotX * dt;
    sp.localSurge = Math.max(0, sp.localSurge - dt * 1.4);

    const combinedSurge = Math.max(energySurge, sp.localSurge);

    materials.cadShaderMat.uniforms.uTime.value = t;
    materials.cadShaderMat.uniforms.uEnergySurge.value = combinedSurge;
    materials.xrayShaderMat.uniforms.uTime.value = t;
    materials.xrayShaderMat.uniforms.uEnergySurge.value = combinedSurge;

    // 1. Seguimiento global amortiguado (lerp) + impulso elástico + levitación armónica
    if (rootGroupRef.current) {
      const floatY = Math.sin(t * 1.5) * 0.04;
      const baseY = isMobileViewport ? 0.56 : 0.52;
      rootGroupRef.current.position.y = baseY + floatY + scrollProgress * 0.18;

      const targetRotY = px * 0.44 + sp.offsetRotY * 0.35;
      const targetRotX = -py * 0.30 + scrollProgress * 0.25 + sp.offsetRotX * 0.25;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, 0.08);
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Anillo Ecuatorial Vernier de Referencia (oscilación micrométrica muy sutil)
    if (equatorialVernierRef.current) {
      equatorialVernierRef.current.rotation.z = Math.sin(t * 0.25) * 0.06;
    }

    // 3. Rotación Sincrónica de los 3 Anillos Cardán Concéntricos (Astrolabio CNC)
    if (outerGimbalRef.current) {
      outerGimbalRef.current.rotation.z = t * 0.22 + scrollProgress * 0.9 + sp.offsetRotY * 0.45;
      outerGimbalRef.current.rotation.x = Math.sin(t * 0.35) * 0.18 + py * 0.15 + sp.offsetRotX * 0.30;
    }

    if (middleGimbalRef.current) {
      middleGimbalRef.current.rotation.y = -t * 0.34 - scrollProgress * 1.2 - sp.offsetRotY * 0.65;
      middleGimbalRef.current.rotation.x = Math.PI / 5.5 + Math.cos(t * 0.42) * 0.24 + px * 0.20;
    }

    if (innerGimbalRef.current) {
      innerGimbalRef.current.rotation.x = t * 0.48 + scrollProgress * 1.5 + sp.offsetRotX * 0.85;
      innerGimbalRef.current.rotation.z = Math.PI / 4.0 + Math.sin(t * 0.55) * 0.30 + sp.offsetRotY * 0.55;
    }

    // 4. 4 Nodos Orbitales Satelitales alrededor del núcleo
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y = t * 0.62 + sp.offsetRotY * 0.5;
      satellitesGroupRef.current.rotation.z = Math.sin(t * 0.4) * 0.22;
    }

    // 5. Esfera / Núcleo Central de Cristal Óptico + Pulso de Energía Interno
    if (crystalCoreRef.current) {
      crystalCoreRef.current.rotation.y = t * 0.38 + sp.offsetRotY * 0.4;
      crystalCoreRef.current.rotation.z = t * 0.24;
      const crystalScale = 1.0 + Math.sin(t * 2.8) * 0.03 + combinedSurge * 0.12;
      crystalCoreRef.current.scale.setScalar(crystalScale);
    }

    if (innerPulseCoreRef.current) {
      innerPulseCoreRef.current.rotation.y = -t * 0.85;
      innerPulseCoreRef.current.rotation.x = t * 0.62;
      const corePulse = 1.0 + Math.sin(t * 4.5) * 0.10 + combinedSurge * 0.32;
      innerPulseCoreRef.current.scale.setScalar(corePulse);
      materials.innerPulseMat.emissiveIntensity = 0.45 + Math.sin(t * 4.5) * 0.18 + combinedSurge * 0.85;
    }

    if (quantumLatticeRef.current) {
      quantumLatticeRef.current.rotation.y = t * 0.16;
      quantumLatticeRef.current.rotation.z = -t * 0.10;
      materials.quantumPointsMat.opacity = mode === "xray" ? 0.85 : mode === "wireframe" ? 0.55 : 0.38;
    }

    // 6. Onda de Choque Electromagnética (en clic o en modo X-Ray)
    const activePulse = Math.max(combinedSurge, mode === "xray" ? (Math.sin(t * 2.6) * 0.5 + 0.5) * 0.45 : 0);
    if (shockwaveRing1Ref.current && shockwaveRing2Ref.current) {
      const s1 = 0.85 + (1.0 - activePulse) * 1.45;
      const s2 = 0.65 + (1.0 - activePulse) * 1.85;
      shockwaveRing1Ref.current.scale.set(s1, s1, 1);
      shockwaveRing2Ref.current.scale.set(s2, s2, 1);
      materials.shockwaveMat1.opacity = activePulse * 0.58;
      materials.shockwaveMat2.opacity = activePulse * 0.38;
    }
  });

  const selectRingMat = (pbrMat: THREE.Material, isGold = false) => {
    if (mode === "wireframe") {
      return isGold ? materials.cadWireframeOverlayMat : materials.cadShaderMat;
    }
    if (mode === "xray") return materials.xrayShaderMat;
    return pbrMat;
  };

  const baseScale = isMobileViewport ? 0.68 : 0.86;

  return (
    <group
      ref={rootGroupRef}
      position={[0, 0.52, -0.15]}
      scale={baseScale}
      onClick={(e) => {
        e.stopPropagation();
        handleAstrolabeClick();
      }}
    >
      {/* Iluminación de Estudio Ejecutiva: Oro Solar (#D4AF37), Platino (#F8FAFC) y Acero (#94A3B8) */}
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#F8FAFC" />
      <spotLight position={[-5, 4, 4]} intensity={2.0} angle={0.6} penumbra={0.85} color="#D4AF37" />
      <pointLight position={[0, 0, 0]} intensity={1.6 + energySurge * 2.5} color="#D4AF37" distance={4.5} />

      {/* =====================================================================
          0. ANILLO ECUATORIAL FIJO DE REFERENCIA CON RETÍCULA VERNIER (R=1.54)
         ===================================================================== */}
      <group ref={equatorialVernierRef} rotation={[Math.PI / 2.15, 0.12, 0]}>
        <mesh geometry={geometries.vernierReferenceTorus}>
          <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
        </mesh>
        <lineSegments geometry={geometries.vernierReferenceTicks} material={materials.steelTicksMat} />
      </group>

      {/* =====================================================================
          1. ANILLO CARDÁN EXTERIOR (Titanio Cepillado + Pernos de Acoplamiento Exterior->Medio)
         ===================================================================== */}
      <group ref={outerGimbalRef}>
        <mesh geometry={geometries.outerTorus}>
          <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
        </mesh>
        <mesh geometry={geometries.outerBevel}>
          <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
        </mesh>
        <lineSegments geometry={geometries.outerTicks} material={materials.goldTicksMat} />

        {/* Pernos de Acoplamiento Mecánico (0° y 180°) conectando Anillo Exterior (1.38) con Medio (1.08) */}
        {[0, Math.PI].map((ang, idx) => (
          <group
            key={`outer-mid-pivot-${idx}`}
            position={[Math.cos(ang) * 1.23, Math.sin(ang) * 1.23, 0]}
            rotation={[0, 0, ang + Math.PI / 2]}
          >
            {/* Perno cilíndrico en Bronce #D4AF37 */}
            <mesh geometry={geometries.pivotOuterToMidPin}>
              <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
            </mesh>
            {/* Collarines de bloqueo en Acero #E2E8F0 */}
            <mesh geometry={geometries.pivotCollarFlange} position={[0, 0.11, 0]}>
              <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
            </mesh>
            <mesh geometry={geometries.pivotCollarFlange} position={[0, -0.11, 0]}>
              <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Cojinetes Axiales Exteriores (90° y 270°) */}
        {[Math.PI / 2, (Math.PI * 3) / 2].map((ang, idx) => (
          <mesh
            key={`outer-collar-${idx}`}
            geometry={geometries.pivotCollarFlange}
            position={[Math.cos(ang) * 1.38, Math.sin(ang) * 1.38, 0]}
            rotation={[0, 0, ang + Math.PI / 2]}
          >
            <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
          </mesh>
        ))}
      </group>

      {/* =====================================================================
          2. ANILLO CARDÁN INTERMEDIO (Bronce Anodizado + Pernos Medio->Interior)
         ===================================================================== */}
      <group ref={middleGimbalRef}>
        <mesh geometry={geometries.middleTorus}>
          <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
        </mesh>
        <mesh geometry={geometries.middleRail}>
          <primitive object={selectRingMat(materials.obsidianTitaniumMat)} attach="material" />
        </mesh>
        <lineSegments geometry={geometries.middleTicks} material={materials.steelTicksMat} />

        {/* Pernos de Acoplamiento Mecánico (90° y 270°) conectando Anillo Medio (1.08) con Interior (0.78) */}
        {[Math.PI / 2, (Math.PI * 3) / 2].map((ang, idx) => (
          <group
            key={`mid-inner-pivot-${idx}`}
            position={[Math.cos(ang) * 0.93, Math.sin(ang) * 0.93, 0]}
            rotation={[0, 0, ang + Math.PI / 2]}
          >
            {/* Perno cilíndrico en Acero #E2E8F0 */}
            <mesh geometry={geometries.pivotMidToInnerPin}>
              <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
            </mesh>
            {/* Collarines en Bronce #D4AF37 */}
            <mesh geometry={geometries.pivotCollarFlange} position={[0, 0.10, 0]} scale={[0.85, 0.85, 0.85]}>
              <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
            </mesh>
            <mesh geometry={geometries.pivotCollarFlange} position={[0, -0.10, 0]} scale={[0.85, 0.85, 0.85]}>
              <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* =====================================================================
          3. ANILLO CARDÁN INTERIOR (Obsidiana & Pernos Interior->Núcleo)
         ===================================================================== */}
      <group ref={innerGimbalRef}>
        <mesh geometry={geometries.innerTorus}>
          <primitive object={selectRingMat(materials.obsidianTitaniumMat)} attach="material" />
        </mesh>
        <lineSegments geometry={geometries.innerTicks} material={materials.goldTicksMat} />

        {/* Pernos de Acoplamiento Mecánico (0° y 180°) conectando Anillo Interior (0.78) con Jaula Núcleo (0.52) */}
        {[0, Math.PI].map((ang, idx) => (
          <group
            key={`inner-core-pivot-${idx}`}
            position={[Math.cos(ang) * 0.65, Math.sin(ang) * 0.65, 0]}
            rotation={[0, 0, ang + Math.PI / 2]}
          >
            <mesh geometry={geometries.pivotInnerToCorePin}>
              <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
            </mesh>
            <mesh geometry={geometries.pivotCollarFlange} position={[0, 0.08, 0]} scale={[0.72, 0.72, 0.72]}>
              <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* =====================================================================
          4. 4 NODOS ORBITALES SATELITALES ALREDEDOR DEL NÚCLEO DE CRISTAL ÓPTICO
         ===================================================================== */}
      <group ref={satellitesGroupRef} rotation={[0.42, 0, -0.28]}>
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((ang, idx) => {
          const satRadius = 0.64;
          const x = Math.cos(ang) * satRadius;
          const z = Math.sin(ang) * satRadius;
          const y = (idx % 2 === 0 ? 1 : -1) * 0.12;
          return (
            <group key={`orbital-satellite-${idx}`} position={[x, y, z]} rotation={[ang, ang * 0.5, 0]}>
              <mesh geometry={geometries.satelliteCoreGeo}>
                <primitive object={selectRingMat(materials.anodizedBronzeGoldMat, true)} attach="material" />
              </mesh>
              <mesh geometry={geometries.satelliteHaloGeo} rotation={[Math.PI / 3, 0, 0]}>
                <primitive object={selectRingMat(materials.brushedTitaniumMat)} attach="material" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* =====================================================================
          5. ESFERA / NÚCLEO CENTRAL DE CRISTAL ÓPTICO & PULSO CUÁNTICO
         ===================================================================== */}
      <group>
        {/* Poliedro Refractivo Exterior de Cristal Óptico */}
        <mesh ref={crystalCoreRef} geometry={geometries.opticalCrystalGeo}>
          <primitive
            object={
              mode === "wireframe"
                ? materials.cadWireframeOverlayMat
                : mode === "xray"
                  ? materials.xrayShaderMat
                  : materials.opticalCrystalMat
            }
            attach="material"
          />
        </mesh>

        {/* Jaula Geodésica Fina de Contención */}
        <mesh geometry={geometries.coreCageGeo} material={materials.coreCageWireMat} />

        {/* Núcleo Energético Interior Pulsante (#D4AF37) */}
        <mesh ref={innerPulseCoreRef} geometry={geometries.innerReactorGeo}>
          <primitive
            object={mode === "wireframe" ? materials.cadShaderMat : materials.innerPulseMat}
            attach="material"
          />
        </mesh>
      </group>

      {/* =====================================================================
          6. CAMPO DE PARTÍCULAS CUÁNTICAS & ONDA DE CHOQUE ELECTROMAGNÉTICA
         ===================================================================== */}
      <points ref={quantumLatticeRef} geometry={geometries.quantumPointsGeo} material={materials.quantumPointsMat} />

      <mesh
        ref={shockwaveRing1Ref}
        geometry={geometries.shockRingGeo}
        material={materials.shockwaveMat1}
        rotation={[Math.PI / 2.4, 0.2, 0]}
      />
      <mesh
        ref={shockwaveRing2Ref}
        geometry={geometries.shockRingGeo}
        material={materials.shockwaveMat2}
        rotation={[-Math.PI / 3.0, -0.3, 0]}
      />
    </group>
  );
}
export default QuantumCore3D;
