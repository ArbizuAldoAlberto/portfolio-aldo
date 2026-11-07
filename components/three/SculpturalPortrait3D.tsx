"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export type WorkbenchMode = "pbr" | "wireframe" | "xray";

export interface SculpturalPortrait3DProps {
  mode?: WorkbenchMode;
  scrollProgress?: number;
}

const VERTEX_DISPLACEMENT_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform float uDisplacementScale;
  uniform float uTime;

  varying vec2 vUv;
  varying float vHeight;
  varying float vMask;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying mat3 vNormalMat;

  void main() {
    vUv = uv;
    float disp = texture2D(uDisplacementMap, uv).r;
    float mask = texture2D(uMaskMap, uv).r;
    vHeight = disp;
    vMask = mask;
    vNormalMat = normalMatrix;

    // Curvatura de busto escultórico + extrusión volumétrica calibrada sin distorsión facial
    float centeredX = (uv.x - 0.5) * 2.0;
    float centeredY = (uv.y - 0.5) * 2.0;
    float cylinderArc = -0.14 * (centeredX * centeredX) - 0.05 * (centeredY * centeredY);

    vec3 displaced = position;
    displaced.z += (disp * uDisplacementScale + cylinderArc) * mask;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = -mvPosition.xyz;
    vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PBR_TITANIUM_BRONZE_FRAGMENT_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uAlbedoMap;
  uniform float uTime;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vHeight;
  varying float vMask;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying mat3 vNormalMat;

  void main() {
    float mask = texture2D(uMaskMap, vUv).r;
    if (mask < 0.10) discard;

    float albedo = texture2D(uAlbedoMap, vUv).r;
    float height = texture2D(uDisplacementMap, vUv).r;
    vec3 tNormal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    tNormal.xy *= 0.52; // Normales suaves de bronce/titanio pulido sin artefactos plásticos
    vec3 N = normalize(vNormalMat * normalize(tNormal));
    vec3 V = normalize(vViewPos);

    // Paleta Ejecutiva: Obsidian Dark (#070B12), Warm Bronze (#8C6D46), Titanium (#CBD5E1) & Solar Gold (#D4AF37)
    vec3 obsidianDark = vec3(0.027, 0.043, 0.071);   // #070B12
    vec3 darkBronze   = vec3(0.24, 0.19, 0.14);      // Bronce oxidado profundo
    vec3 warmTitanium = vec3(0.68, 0.64, 0.58);      // Aleación Titanio-Bronce cálido
    vec3 solarGold    = vec3(0.831, 0.686, 0.216);   // #D4AF37
    vec3 pureTitanium = vec3(0.88, 0.91, 0.95);      // #E2E8F0

    // Gradiente tonal de alta fidelidad en Obsidian Dark (#070B12), Bronce Cálido y Titanio Anodizado (sin quemar el Bloom)
    float tonedAlbedo = pow(clamp(albedo, 0.0, 1.0), 1.28);
    vec3 portraitMetal = mix(obsidianDark, darkBronze, smoothstep(0.04, 0.36, tonedAlbedo));
    portraitMetal = mix(portraitMetal, warmTitanium * 0.78, smoothstep(0.30, 0.78, tonedAlbedo));
    portraitMetal = mix(portraitMetal, pureTitanium * 0.82, smoothstep(0.76, 0.99, tonedAlbedo) * 0.45);

    // Iluminación PBR de Estudio (metalness: 0.9, roughness: 0.18, clearcoat: 1.0)
    vec3 lightKeyDir = normalize(vec3(0.38 + uPointer.x * 0.45, 0.42 + uPointer.y * 0.35, 0.92));
    vec3 lightFillDir = normalize(vec3(-0.55, 0.18, 0.78));

    float diffKey = max(dot(N, lightKeyDir), 0.0);
    float diffFill = max(dot(N, lightFillDir), 0.0);

    vec3 HKey = normalize(lightKeyDir + V);
    float specBronze = pow(max(dot(N, HKey), 0.0), 28.0);
    float specClearcoat = pow(max(dot(N, HKey), 0.0), 92.0);

    // Rim Light Fresnel y bisel perimetral en Oro Solar (#D4AF37)
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float edgeBevel = smoothstep(0.52, 0.14, mask) * mask;

    vec3 color = portraitMetal * (0.42 + 0.46 * diffKey + 0.22 * diffFill);
    color += solarGold * specBronze * (0.18 + 0.28 * tonedAlbedo);
    color += pureTitanium * specClearcoat * 0.16;
    color += solarGold * (fresnel * 0.38 + edgeBevel * 0.48);

    // Compresión de altas luces (Filmic Roll-off) debajo del umbral de Bloom (0.85) para preservar textura en frente y nariz
    color = color / (vec3(1.0) + color * 0.42);

    float alpha = smoothstep(0.10, 0.28, mask);
    gl_FragColor = vec4(color, alpha);
  }
`;

const WIREFRAME_CAD_FRAGMENT_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uAlbedoMap;
  uniform float uTime;

  varying vec2 vUv;
  varying float vHeight;
  varying float vMask;
  varying vec3 vViewPos;
  varying mat3 vNormalMat;

  void main() {
    float mask = texture2D(uMaskMap, vUv).r;
    if (mask < 0.10) discard;

    float albedo = texture2D(uAlbedoMap, vUv).r;
    float height = texture2D(uDisplacementMap, vUv).r;
    vec3 tNormal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    vec3 N = normalize(vNormalMat * normalize(tNormal));
    vec3 V = normalize(vViewPos);

    // Isolíneas topográficas láser + retícula CAD X/Y
    float isoLines = abs(fract(height * 28.0 - uTime * 0.20) - 0.5) * 2.0;
    float topoContour = smoothstep(0.82, 0.97, isoLines);

    float gridX = smoothstep(0.91, 0.99, cos(vUv.x * 360.0));
    float gridY = smoothstep(0.91, 0.99, cos(vUv.y * 360.0));
    float cadGrid = max(gridX, gridY) * 0.65;

    // Haz de escaneo láser vertical periódico
    float scanY = fract(uTime * 0.22);
    float laserBeam = exp(-pow((vUv.y - scanY) * 16.0, 2.0));

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);

    vec3 cyanLaser = vec3(0.0, 0.94, 1.0);      // #00F0FF
    vec3 emeraldCAD = vec3(0.06, 0.78, 0.54);   // #10B981
    vec3 solarGold = vec3(0.831, 0.686, 0.216); // #D4AF37

    vec3 baseHologram = mix(vec3(0.02, 0.06, 0.10), mix(emeraldCAD, cyanLaser, 0.55), albedo * 0.85);
    vec3 color = baseHologram * (0.65 + 0.45 * fresnel);
    color += cyanLaser * (topoContour * 0.80 + cadGrid * 0.50);
    color += solarGold * (laserBeam * 0.90 + smoothstep(0.50, 0.14, mask) * 0.65);

    float alpha = smoothstep(0.10, 0.28, mask) * clamp(0.62 + topoContour * 0.35 + albedo * 0.35, 0.0, 0.98);
    gl_FragColor = vec4(color, alpha);
  }
`;

const XRAY_POINTS_VERTEX_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform sampler2D uAlbedoMap;
  uniform float uDisplacementScale;
  uniform float uTime;

  varying vec2 vUv;
  varying float vMask;
  varying float vAlbedo;
  varying float vHeight;

  void main() {
    vUv = uv;
    float disp = texture2D(uDisplacementMap, uv).r;
    float mask = texture2D(uMaskMap, uv).r;
    float albedo = texture2D(uAlbedoMap, uv).r;

    vMask = mask;
    vAlbedo = albedo;
    vHeight = disp;

    float centeredX = (uv.x - 0.5) * 2.0;
    float centeredY = (uv.y - 0.5) * 2.0;
    float cylinderArc = -0.14 * (centeredX * centeredX) - 0.05 * (centeredY * centeredY);

    vec3 displaced = position;
    float pulse = sin(uTime * 2.8 - length(uv - 0.5) * 10.0) * 0.02;
    displaced.z += (disp * uDisplacementScale + cylinderArc + pulse) * mask;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float featureSize = 2.0 + albedo * 3.2 + disp * 1.4;
    gl_PointSize = mask > 0.12 ? (featureSize * (4.4 / -mvPosition.z)) : 0.0;
  }
`;

const XRAY_POINTS_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vMask;
  varying float vAlbedo;
  varying float vHeight;

  void main() {
    if (vMask < 0.12) discard;

    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    float softDot = 1.0 - r;
    vec3 obsidianDeep = vec3(0.04, 0.10, 0.18);
    vec3 cyanCore = vec3(0.0, 0.94, 1.0);       // #00F0FF
    vec3 solarGold = vec3(0.831, 0.686, 0.216); // #D4AF37

    float energyWave = 0.5 + 0.5 * sin(uTime * 3.2 - vUv.y * 14.0);
    float toned = pow(clamp(vAlbedo, 0.0, 1.0), 1.35);
    vec3 particleCol = mix(obsidianDeep, cyanCore * 0.78, smoothstep(0.08, 0.75, toned));
    particleCol = mix(particleCol, solarGold * 0.85, smoothstep(0.55, 0.96, toned) * (0.60 + 0.40 * energyWave));

    float alpha = softDot * vMask * (0.26 + 0.38 * toned);
    gl_FragColor = vec4(particleCol, alpha);
  }
`;

const BASE_POS_Y = 0.50;
const BASE_POS_Z = 0.35;

export function SculpturalPortrait3D({ mode = "pbr", scrollProgress = 0 }: SculpturalPortrait3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);

  const [dispTex, maskTex, normalTex, albedoTex] = useTexture([
    "/textures/face_displacement.png",
    "/textures/face_mask.png",
    "/textures/face_normal.png",
    "/textures/face_albedo.png",
  ]);

  useMemo(() => {
    [dispTex, maskTex, normalTex, albedoTex].forEach((tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [dispTex, maskTex, normalTex, albedoTex]);

  // Geometrías de alta resolución (160x160 para PBR/Puntos y 128x128 para Malla CAD)
  const highResGeo = useMemo(() => new THREE.PlaneGeometry(2.82, 2.82, 160, 160), []);
  const cadGridGeo = useMemo(() => new THREE.PlaneGeometry(2.82, 2.82, 128, 128), []);

  const materials = useMemo(() => {
    const pbrShader = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      uniforms: {
        uDisplacementMap: { value: dispTex },
        uMaskMap: { value: maskTex },
        uNormalMap: { value: normalTex },
        uAlbedoMap: { value: albedoTex },
        uDisplacementScale: { value: 0.42 },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.12, 0.10) },
      },
      vertexShader: VERTEX_DISPLACEMENT_GLSL,
      fragmentShader: PBR_TITANIUM_BRONZE_FRAGMENT_GLSL,
    });

    const cadTopoShader = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      uniforms: {
        uDisplacementMap: { value: dispTex },
        uMaskMap: { value: maskTex },
        uNormalMap: { value: normalTex },
        uAlbedoMap: { value: albedoTex },
        uDisplacementScale: { value: 0.42 },
        uTime: { value: 0 },
      },
      vertexShader: VERTEX_DISPLACEMENT_GLSL,
      fragmentShader: WIREFRAME_CAD_FRAGMENT_GLSL,
    });

    const cadWireframeOverlay = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      wireframe: true,
      uniforms: {
        uDisplacementMap: { value: dispTex },
        uMaskMap: { value: maskTex },
        uNormalMap: { value: normalTex },
        uAlbedoMap: { value: albedoTex },
        uDisplacementScale: { value: 0.43 },
        uTime: { value: 0 },
      },
      vertexShader: VERTEX_DISPLACEMENT_GLSL,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMaskMap;
        uniform sampler2D uAlbedoMap;
        varying vec2 vUv;
        void main() {
          float mask = texture2D(uMaskMap, vUv).r;
          if (mask < 0.14) discard;
          float albedo = texture2D(uAlbedoMap, vUv).r;
          vec3 wireCol = mix(vec3(0.0, 0.94, 1.0), vec3(0.831, 0.686, 0.216), smoothstep(0.42, 0.85, albedo));
          gl_FragColor = vec4(wireCol, mask * (0.24 + 0.36 * albedo));
        }
      `,
    });

    const xrayPointsShader = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uDisplacementMap: { value: dispTex },
        uMaskMap: { value: maskTex },
        uAlbedoMap: { value: albedoTex },
        uDisplacementScale: { value: 0.44 },
        uTime: { value: 0 },
      },
      vertexShader: XRAY_POINTS_VERTEX_GLSL,
      fragmentShader: XRAY_POINTS_FRAGMENT_GLSL,
    });

    const obsidianFramePBR = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#070B12"),
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const solarGoldRingPBR = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4AF37"),
      metalness: 0.95,
      roughness: 0.16,
      clearcoat: 1.0,
      emissive: new THREE.Color("#D4AF37"),
      emissiveIntensity: 0.18,
    });

    return {
      pbrShader,
      cadTopoShader,
      cadWireframeOverlay,
      xrayPointsShader,
      obsidianFramePBR,
      solarGoldRingPBR,
    };
  }, [dispTex, maskTex, normalTex, albedoTex]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    materials.pbrShader.uniforms.uTime.value = t;
    materials.cadTopoShader.uniforms.uTime.value = t;
    materials.cadWireframeOverlay.uniforms.uTime.value = t;
    materials.xrayPointsShader.uniforms.uTime.value = t;

    const px = state.pointer.x || Math.sin(t * 0.5) * 0.18;
    const py = state.pointer.y || Math.cos(t * 0.4) * 0.12;
    materials.pbrShader.uniforms.uPointer.value.lerp(new THREE.Vector2(px, py), 0.08);

    if (groupRef.current) {
      const isMobile = state.viewport.aspect < 1;
      const targetScale = isMobile ? 0.86 : 1.12;
      const basePosY = isMobile ? 0.64 : BASE_POS_Y;

      groupRef.current.scale.setScalar(targetScale);
      groupRef.current.position.y = basePosY + Math.sin(t * 1.2) * 0.035;
      groupRef.current.position.z = BASE_POS_Z;

      const targetRotY = px * 0.22 + Math.sin(t * 0.55) * 0.05;
      const targetRotX = -py * 0.12 + Math.cos(t * 0.45) * 0.025 + scrollProgress * 0.12;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.07);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.07);
    }

    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y = t * 0.85;
      coreMeshRef.current.rotation.x = t * 0.55;
      const pulseScale = 1.0 + Math.sin(t * 3.5) * 0.12;
      coreMeshRef.current.scale.setScalar(pulseScale);
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = mode === "xray" ? 3.4 + Math.sin(t * 4.0) * 0.8 : 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, BASE_POS_Y, BASE_POS_Z]}>
      <directionalLight position={[4, 5, 5]} intensity={2.4} color="#D4AF37" />
      <directionalLight position={[-4, 2, 4]} intensity={1.8} color="#E2E8F0" />
      <spotLight position={[0, 5, -4]} intensity={2.2} angle={0.6} penumbra={0.8} color="#D4AF37" />
      <pointLight ref={coreLightRef} position={[0, 0.1, 0.8]} intensity={1.2} color="#D4AF37" distance={4.5} />

      {/* Anillo Astrolabio Escultórico Posterior (Obsidian Dark + Solar Gold) */}
      <group position={[0, 0.06, -0.18]}>
        <mesh material={materials.obsidianFramePBR}>
          <torusGeometry args={[1.36, 0.022, 24, 96]} />
        </mesh>
        <mesh material={materials.solarGoldRingPBR}>
          <torusGeometry args={[1.41, 0.008, 16, 96]} />
        </mesh>
      </group>

      {/* MODO 1: PBR Físico (Busto de Titanio & Bronce con Vertex Displacement) */}
      {mode === "pbr" && <mesh geometry={highResGeo} material={materials.pbrShader} />}

      {/* MODO 2: Wireframe CAD (Malla Topográfica Láser 128x128) */}
      {mode === "wireframe" && (
        <group>
          <mesh geometry={cadGridGeo} material={materials.cadTopoShader} />
          <mesh geometry={cadGridGeo} material={materials.cadWireframeOverlay} position={[0, 0, 0.006]} />
        </group>
      )}

      {/* MODO 3: X-Ray Núcleo (Holograma de Puntos Cuánticos + Núcleo Energético) */}
      {mode === "xray" && (
        <group>
          <points geometry={highResGeo} material={materials.xrayPointsShader} />
          <mesh ref={coreMeshRef} position={[0, 0.12, -0.08]}>
            <icosahedronGeometry args={[0.42, 2]} />
            <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.45} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default SculpturalPortrait3D;
