"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";

export type WorkbenchMode = "pbr" | "wireframe" | "xray";

export interface CyberneticOperatorProps {
  mode?: WorkbenchMode;
  scrollProgress?: number;
  energySurge?: number;
}

const VISOR_VERTEX_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform float uDisplacementScale;
  uniform float uTime;
  uniform float uEnergySurge;

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

    float centeredX = (uv.x - 0.5) * 2.0;
    float centeredY = (uv.y - 0.5) * 2.0;
    float cylinderArc = -0.16 * (centeredX * centeredX) - 0.05 * (centeredY * centeredY);

    // Transición anatómica en V hacia adentro de la gola biónica (Gorget)
    float neckTuck = -0.12 * (1.0 - smoothstep(0.05, 0.34, uv.y));

    // Onda de choque cuántica radial al hacer clic (energySurge)
    float radialDist = length(vec2(centeredX, centeredY));
    float shockRipple = sin(radialDist * 18.0 - uTime * 12.0) * 0.025 * uEnergySurge;

    vec3 displaced = position;
    displaced.z += (disp * uDisplacementScale + cylinderArc + neckTuck + shockRipple) * mask;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = -mvPosition.xyz;
    vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const VISOR_PBR_FRAGMENT_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uAlbedoMap;
  uniform float uTime;
  uniform float uEnergySurge;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vHeight;
  varying float vMask;
  varying vec3 vViewPos;
  varying vec3 vWorldPos;
  varying mat3 vNormalMat;

  void main() {
    // Corte anatómico en V clavicular que encaja dentro del collarín biónico dorado
    float vNeckCurve = pow(abs(vUv.x - 0.5) * 2.15, 1.35) * 0.22;
    float collarTrim = smoothstep(0.11 + vNeckCurve, 0.28 + vNeckCurve, vUv.y);
    float mask = texture2D(uMaskMap, vUv).r * collarTrim;
    if (mask < 0.12) discard;

    float albedo = texture2D(uAlbedoMap, vUv).r;
    vec3 tNormal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    tNormal.xy *= 0.54;
    vec3 N = normalize(vNormalMat * normalize(tNormal));
    vec3 V = normalize(vViewPos);

    vec3 obsidianDark = vec3(0.027, 0.043, 0.071);   // #070B12
    vec3 darkBronze   = vec3(0.22, 0.18, 0.14);
    vec3 warmTitanium = vec3(0.62, 0.60, 0.56);
    vec3 solarGold    = vec3(0.831, 0.686, 0.216);   // #D4AF37
    vec3 pureTitanium = vec3(0.86, 0.89, 0.94);      // #E2E8F0
    vec3 cyanPulse    = vec3(0.0, 0.941, 1.0);       // #00F0FF

    float tonedAlbedo = pow(clamp(albedo, 0.0, 1.0), 1.32);
    vec3 portraitMetal = mix(obsidianDark, darkBronze, smoothstep(0.04, 0.36, tonedAlbedo));
    portraitMetal = mix(portraitMetal, warmTitanium * 0.76, smoothstep(0.30, 0.78, tonedAlbedo));
    portraitMetal = mix(portraitMetal, pureTitanium * 0.80, smoothstep(0.76, 0.99, tonedAlbedo) * 0.45);

    vec3 lightKeyDir = normalize(vec3(0.38 + uPointer.x * 0.45, 0.42 + uPointer.y * 0.35, 0.92));
    vec3 lightFillDir = normalize(vec3(-0.55, 0.18, 0.78));

    float diffKey = max(dot(N, lightKeyDir), 0.0);
    float diffFill = max(dot(N, lightFillDir), 0.0);

    vec3 HKey = normalize(lightKeyDir + V);
    float specBronze = pow(max(dot(N, HKey), 0.0), 28.0);
    float specClearcoat = pow(max(dot(N, HKey), 0.0), 92.0);

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float edgeBevel = smoothstep(0.52, 0.14, mask) * mask;

    vec3 color = portraitMetal * (0.40 + 0.45 * diffKey + 0.20 * diffFill);
    color += solarGold * specBronze * (0.18 + 0.28 * tonedAlbedo);
    color += pureTitanium * specClearcoat * 0.15;
    color += solarGold * (fresnel * 0.40 + edgeBevel * 0.52);
    color += cyanPulse * (fresnel * uEnergySurge * 0.65);

    // Compresión Filmic Roll-off bajo el umbral de Bloom (0.85)
    color = color / (vec3(1.0) + color * 0.44);

    float alpha = smoothstep(0.12, 0.32, mask);
    gl_FragColor = vec4(color, alpha);
  }
`;

const VISOR_WIREFRAME_FRAGMENT_GLSL = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform sampler2D uMaskMap;
  uniform sampler2D uAlbedoMap;
  uniform float uTime;
  uniform float uEnergySurge;

  varying vec2 vUv;
  varying float vHeight;
  varying float vMask;
  varying vec3 vViewPos;

  void main() {
    float vNeckCurve = pow(abs(vUv.x - 0.5) * 2.15, 1.35) * 0.22;
    float collarTrim = smoothstep(0.11 + vNeckCurve, 0.28 + vNeckCurve, vUv.y);
    float mask = texture2D(uMaskMap, vUv).r * collarTrim;
    if (mask < 0.12) discard;

    float albedo = texture2D(uAlbedoMap, vUv).r;
    float height = texture2D(uDisplacementMap, vUv).r;

    float contour = abs(fract(height * 22.0 - uTime * 0.25) - 0.5);
    float contourLine = 1.0 - smoothstep(0.02, 0.09, contour);

    float scanPos = fract(uTime * 0.22);
    float laserScan = exp(-pow((vUv.y - scanPos) * 18.0, 2.0));

    vec3 obsidianBase = vec3(0.027, 0.043, 0.071);
    vec3 solarGold    = vec3(0.831, 0.686, 0.216);
    vec3 cyanLaser    = vec3(0.0, 0.941, 1.0);

    vec3 col = mix(obsidianBase, cyanLaser * 0.72, albedo * 0.58 + contourLine * 0.35);
    col = mix(col, solarGold, laserScan * 0.85 + contourLine * 0.30 + uEnergySurge * 0.35);
    col = col / (vec3(1.0) + col * 0.38);

    float alpha = smoothstep(0.12, 0.30, mask) * (0.48 + 0.44 * albedo + 0.28 * contourLine);
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.92));
  }
`;

const CHASSIS_COMMON_VERTEX_GLSL = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vLocalPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Shader PBR Anisotrópico de Titanio Cepillado, Fibra de Carbono y Biseles en Oro Solar (#D4AF37)
const CHASSIS_PBR_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergySurge;
  uniform vec2 uPointer;
  uniform float uVariant; // 0.0 = Torso Obsidiana, 1.0 = Hombreras Titanio/Bronce

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    vec3 obsidianDark = vec3(0.027, 0.043, 0.071);   // #070B12
    vec3 darkBronze   = vec3(0.18, 0.15, 0.12);
    vec3 warmTitanium = vec3(0.42, 0.45, 0.50);
    vec3 solarGold    = vec3(0.831, 0.686, 0.216);   // #D4AF37
    vec3 pureTitanium = vec3(0.82, 0.86, 0.92);      // #E2E8F0
    vec3 cyanPulse    = vec3(0.0, 0.941, 1.0);       // #00F0FF

    // Micro-textura de paneles CNC y fibra de carbono cepillada
    float carbonWeave = sin(vLocalPos.x * 95.0) * sin(vLocalPos.y * 95.0) * 0.025;
    float panelSeamY = 1.0 - smoothstep(0.012, 0.035, abs(fract(vLocalPos.y * 5.5) - 0.5));
    float panelSeamX = 1.0 - smoothstep(0.010, 0.030, abs(fract(abs(vLocalPos.x) * 4.2) - 0.5));
    float armorSeam = clamp(panelSeamY * 0.65 + panelSeamX * 0.45, 0.0, 1.0);

    vec3 lightKeyDir = normalize(vec3(0.38 + uPointer.x * 0.45, 0.52 + uPointer.y * 0.35, 0.88));
    vec3 lightFillDir = normalize(vec3(-0.62, 0.22, 0.74));

    float diffKey = max(dot(N, lightKeyDir), 0.0);
    float diffFill = max(dot(N, lightFillDir), 0.0);

    vec3 HKey = normalize(lightKeyDir + V);
    float specAniso = pow(max(dot(N, HKey), 0.0), 34.0);
    float specClearcoat = pow(max(dot(N, HKey), 0.0), 96.0);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    vec3 baseAlloy = mix(obsidianDark, darkBronze, uVariant * 0.45 + diffFill * 0.35 + carbonWeave);
    baseAlloy = mix(baseAlloy, warmTitanium, (diffKey * 0.55 + uVariant * 0.22));

    // Pulso energético recorriendo las juntas de las clavículas y hombros
    float pulseWave = 0.5 + 0.5 * sin(uTime * 3.2 - abs(vLocalPos.x) * 6.0 + vLocalPos.y * 4.0);

    vec3 color = baseAlloy * (0.38 + 0.52 * diffKey + 0.24 * diffFill);
    color += solarGold * specAniso * 0.32;
    color += pureTitanium * specClearcoat * 0.20;
    color += solarGold * (fresnel * 0.52 + armorSeam * (0.22 + 0.16 * pulseWave));
    color += cyanPulse * (armorSeam * 0.12 * pulseWave + fresnel * uEnergySurge * 0.55);

    color = color / (vec3(1.0) + color * 0.44);
    gl_FragColor = vec4(color, 0.98);
  }
`;

const CHASSIS_CAD_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergySurge;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

    float gridY = 1.0 - smoothstep(0.02, 0.07, abs(fract(vWorldPos.y * 16.0 - uTime * 0.25) - 0.5));
    float gridX = 1.0 - smoothstep(0.02, 0.06, abs(fract(vWorldPos.x * 14.0) - 0.5));
    float gridZ = 1.0 - smoothstep(0.02, 0.06, abs(fract(vWorldPos.z * 14.0) - 0.5));
    float cadNet = clamp(gridY * 0.75 + gridX * 0.45 + gridZ * 0.35, 0.0, 1.0);

    float scanBeam = exp(-pow((fract(vWorldPos.y * 0.65 - uTime * 0.22) - 0.5) * 9.0, 2.0));

    vec3 obsidianDark = vec3(0.027, 0.043, 0.071);
    vec3 cyanLaser    = vec3(0.0, 0.941, 1.0);
    vec3 solarGold    = vec3(0.831, 0.686, 0.216);

    vec3 col = mix(obsidianDark, cyanLaser * 0.68, cadNet * 0.62);
    col += solarGold * (fresnel * 0.65 + scanBeam * 0.55 + uEnergySurge * 0.35);
    col = col / (vec3(1.0) + col * 0.42);

    float alpha = clamp(0.45 + cadNet * 0.38 + fresnel * 0.42, 0.0, 0.92);
    gl_FragColor = vec4(col, alpha);
  }
`;

const CHASSIS_XRAY_FRAGMENT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergySurge;
  uniform vec3 uRimColor;
  uniform vec3 uCoreColor;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.3);
    float scanWave = 0.76 + 0.24 * sin(vWorldPos.y * 14.0 - uTime * 4.8);
    float surgeWave = sin(length(vWorldPos.xy) * 12.0 - uTime * 10.0) * 0.5 + 0.5;

    vec3 color = mix(uCoreColor * 0.28, uRimColor * 0.78, fresnel) * scanWave;
    color += uCoreColor * surgeWave * uEnergySurge * 0.55;
    color = color / (vec3(1.0) + color * 0.48);

    float alpha = clamp(fresnel * 0.72 + 0.10 + uEnergySurge * 0.16, 0.0, 0.82);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function CyberneticOperator3D({
  mode = "pbr",
  scrollProgress = 0,
  energySurge = 0,
}: CyberneticOperatorProps) {
  const viewport = useThree((s) => s.viewport);
  const isMobileViewport = viewport.width < 3.6;

  const groupRef = useRef<THREE.Group>(null);
  const headAssemblyRef = useRef<THREE.Group>(null);
  const pauldronLRef = useRef<THREE.Group>(null);
  const pauldronRRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Group>(null);
  const equatorialPulseRef = useRef<THREE.Mesh>(null);

  const { scene: gltfScene } = useGLTF("/models/cyber_operator_sotd.glb", "/draco/gltf/");

  const [displacementMap, maskMap, normalMap, albedoMap] = useTexture([
    "/textures/face_displacement.png",
    "/textures/face_mask.png",
    "/textures/face_normal.png",
    "/textures/face_albedo.png",
  ]);

  useMemo(() => {
    [displacementMap, maskMap, normalMap, albedoMap].forEach((tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [displacementMap, maskMap, normalMap, albedoMap]);

  const bionicParts = useMemo(() => {
    const thorax: THREE.BufferGeometry[] = [];
    const pauldronL: THREE.BufferGeometry[] = [];
    const pauldronR: THREE.BufferGeometry[] = [];
    const goldStruts: THREE.BufferGeometry[] = [];
    const spine: THREE.BufferGeometry[] = [];
    const helmet: THREE.BufferGeometry[] = [];
    const core: THREE.BufferGeometry[] = [];
    const tendrils: THREE.BufferGeometry[] = [];

    gltfScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geo = mesh.geometry.clone();
        mesh.updateMatrixWorld(true);
        geo.applyMatrix4(mesh.matrixWorld);
        geo.computeVertexNormals();

        const n = mesh.name;
        if (n.includes("Pauldron_L")) {
          pauldronL.push(geo);
        } else if (n.includes("Pauldron_R")) {
          pauldronR.push(geo);
        } else if (n.includes("Clavicle") || n.includes("Sternum_Trim")) {
          goldStruts.push(geo);
        } else if (n.includes("Cervical_Spine")) {
          spine.push(geo);
        } else if (n.includes("Cranium_Bionic_Helmet")) {
          helmet.push(geo);
        } else if (n.includes("Quantum_Core")) {
          core.push(geo);
        } else if (n.includes("DataStream")) {
          tendrils.push(geo);
        } else {
          thorax.push(geo);
        }
      }
    });

    return { thorax, pauldronL, pauldronR, goldStruts, spine, helmet, core, tendrils };
  }, [gltfScene]);

  const { visorGeo, quantumPointsGeo } = useMemo(() => {
    const vGeo = new THREE.PlaneGeometry(1.16, 1.22, 128, 128);
    const pGeo = new THREE.PlaneGeometry(1.16, 1.22, 112, 112);
    return { visorGeo: vGeo, quantumPointsGeo: pGeo };
  }, []);

  const materials = useMemo(() => {
    const thoraxPbrShader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uVariant: { value: 0.0 },
      },
      vertexShader: CHASSIS_COMMON_VERTEX_GLSL,
      fragmentShader: CHASSIS_PBR_FRAGMENT_GLSL,
    });

    const pauldronPbrShader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uVariant: { value: 1.0 },
      },
      vertexShader: CHASSIS_COMMON_VERTEX_GLSL,
      fragmentShader: CHASSIS_PBR_FRAGMENT_GLSL,
    });

    const solarGoldPbr = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4AF37"),
      metalness: 0.96,
      roughness: 0.16,
      emissive: new THREE.Color("#D4AF37"),
      emissiveIntensity: 0.16,
    });

    const dataStreamMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#00F0FF"),
      metalness: 0.85,
      roughness: 0.14,
      emissive: new THREE.Color("#00F0FF"),
      emissiveIntensity: 0.24,
      transparent: true,
      opacity: 0.78,
    });

    const cadWireframeGold = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D4AF37"),
      wireframe: true,
      transparent: true,
      opacity: 0.52,
    });

    const chassisCadShader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
      },
      vertexShader: CHASSIS_COMMON_VERTEX_GLSL,
      fragmentShader: CHASSIS_CAD_FRAGMENT_GLSL,
    });

    const chassisXrayShader = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uEnergySurge: { value: 0 },
        uRimColor: { value: new THREE.Color("#00F0FF") },
        uCoreColor: { value: new THREE.Color("#D4AF37") },
      },
      vertexShader: CHASSIS_COMMON_VERTEX_GLSL,
      fragmentShader: CHASSIS_XRAY_FRAGMENT_GLSL,
    });

    const visorSharedUniforms = {
      uDisplacementMap: { value: displacementMap },
      uMaskMap: { value: maskMap },
      uNormalMap: { value: normalMap },
      uAlbedoMap: { value: albedoMap },
      uDisplacementScale: { value: 0.28 },
      uTime: { value: 0 },
      uEnergySurge: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const visorPbrShader = new THREE.ShaderMaterial({
      vertexShader: VISOR_VERTEX_GLSL,
      fragmentShader: VISOR_PBR_FRAGMENT_GLSL,
      uniforms: THREE.UniformsUtils.clone(visorSharedUniforms),
      transparent: true,
      side: THREE.DoubleSide,
    });

    const visorWireframeShader = new THREE.ShaderMaterial({
      vertexShader: VISOR_VERTEX_GLSL,
      fragmentShader: VISOR_WIREFRAME_FRAGMENT_GLSL,
      uniforms: THREE.UniformsUtils.clone(visorSharedUniforms),
      transparent: true,
      wireframe: true,
    });

    const visorXrayPointsShader = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        uniform sampler2D uDisplacementMap;
        uniform sampler2D uMaskMap;
        uniform sampler2D uAlbedoMap;
        uniform float uDisplacementScale;
        uniform float uTime;
        uniform float uEnergySurge;

        varying vec2 vUv;
        varying float vMask;
        varying float vAlbedo;

        void main() {
          vUv = uv;
          float vNeckCurve = pow(abs(uv.x - 0.5) * 2.15, 1.35) * 0.22;
          float collarTrim = smoothstep(0.11 + vNeckCurve, 0.28 + vNeckCurve, uv.y);
          float disp = texture2D(uDisplacementMap, uv).r;
          float mask = texture2D(uMaskMap, uv).r * collarTrim;
          float albedo = texture2D(uAlbedoMap, uv).r;
          vMask = mask;
          vAlbedo = albedo;

          float centeredX = (uv.x - 0.5) * 2.0;
          float centeredY = (uv.y - 0.5) * 2.0;
          float cylinderArc = -0.16 * (centeredX * centeredX) - 0.05 * (centeredY * centeredY);
          float neckTuck = -0.12 * (1.0 - smoothstep(0.05, 0.34, uv.y));

          vec3 displaced = position;
          displaced.z += (disp * uDisplacementScale + cylinderArc + neckTuck) * mask;
          displaced.z += sin(uTime * 2.6 + uv.y * 16.0) * 0.008 * mask;

          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = mix(1.8, 3.6 + uEnergySurge * 1.4, albedo) * (4.2 / max(-mvPosition.z, 1.0)) * step(0.12, mask);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uEnergySurge;
        varying vec2 vUv;
        varying float vMask;
        varying float vAlbedo;

        void main() {
          if (vMask < 0.12) discard;
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;

          float softDot = 1.0 - smoothstep(0.15, 1.0, r);
          vec3 obsidianDeep = vec3(0.04, 0.10, 0.16);
          vec3 cyanCore     = vec3(0.0, 0.941, 1.0);
          vec3 solarGold    = vec3(0.831, 0.686, 0.216);

          float energyWave = 0.5 + 0.5 * sin(uTime * 3.4 - vUv.y * 14.0);
          float toned = pow(clamp(vAlbedo, 0.0, 1.0), 1.38);
          vec3 particleCol = mix(obsidianDeep, cyanCore * 0.72, smoothstep(0.08, 0.75, toned));
          particleCol = mix(particleCol, solarGold * 0.85, smoothstep(0.54, 0.96, toned) * (0.60 + 0.40 * energyWave));
          particleCol += solarGold * uEnergySurge * 0.28;
          particleCol = particleCol / (vec3(1.0) + particleCol * 0.42);

          float alpha = softDot * vMask * (0.25 + 0.36 * toned);
          gl_FragColor = vec4(particleCol, alpha);
        }
      `,
      uniforms: THREE.UniformsUtils.clone(visorSharedUniforms),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      thoraxPbrShader,
      pauldronPbrShader,
      solarGoldPbr,
      dataStreamMat,
      cadWireframeGold,
      chassisCadShader,
      chassisXrayShader,
      visorPbrShader,
      visorWireframeShader,
      visorXrayPointsShader,
    };
  }, [displacementMap, maskMap, normalMap, albedoMap]);

  useEffect(() => {
    return () => {
      visorGeo.dispose();
      quantumPointsGeo.dispose();
      Object.values(bionicParts).forEach((arr) => arr.forEach((g) => g.dispose()));
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [visorGeo, quantumPointsGeo, bionicParts, materials]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const px = state.pointer.x;
    const py = state.pointer.y;

    materials.chassisCadShader.uniforms.uTime.value = t;
    materials.chassisCadShader.uniforms.uEnergySurge.value = energySurge;
    materials.chassisXrayShader.uniforms.uTime.value = t;
    materials.chassisXrayShader.uniforms.uEnergySurge.value = energySurge;
    materials.solarGoldPbr.emissiveIntensity = 0.16 + energySurge * 0.55 + Math.sin(t * 3.0) * 0.04;

    [
      materials.thoraxPbrShader,
      materials.pauldronPbrShader,
      materials.visorPbrShader,
      materials.visorWireframeShader,
      materials.visorXrayPointsShader,
    ].forEach((mat) => {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uEnergySurge.value = energySurge;
      if (mat.uniforms.uPointer) {
        mat.uniforms.uPointer.value.lerp(new THREE.Vector2(px, py), 0.08);
      }
    });

    if (groupRef.current) {
      const breathing = Math.sin(t * 1.8) * 0.036;
      const baseY = isMobileViewport ? 0.46 : 0.40;
      groupRef.current.position.y = baseY + breathing + scrollProgress * 0.22;

      const targetRotY = px * 0.32;
      const targetRotX = -py * 0.20 + 0.05 + scrollProgress * 0.12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    }

    if (headAssemblyRef.current) {
      headAssemblyRef.current.rotation.y = THREE.MathUtils.lerp(headAssemblyRef.current.rotation.y, px * 0.14, 0.1);
      headAssemblyRef.current.rotation.x = THREE.MathUtils.lerp(headAssemblyRef.current.rotation.x, -py * 0.10, 0.1);
    }

    const shoulderLift = Math.sin(t * 1.8 - 0.3) * 0.022 + energySurge * 0.035;
    if (pauldronLRef.current) {
      pauldronLRef.current.position.y = shoulderLift;
      pauldronLRef.current.rotation.z = shoulderLift * 0.40;
    }
    if (pauldronRRef.current) {
      pauldronRRef.current.position.y = shoulderLift;
      pauldronRRef.current.rotation.z = -shoulderLift * 0.40;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.24 + scrollProgress * 0.8;
      ringGroupRef.current.rotation.y = Math.sin(t * 0.32) * 0.20 + px * 0.16;
    }

    if (coreMeshRef.current) {
      const pulse = 1.0 + Math.sin(t * 4.2) * 0.09 + energySurge * 0.25;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
      coreMeshRef.current.rotation.y = t * 1.2;
    }

    if (equatorialPulseRef.current) {
      const s = 0.65 + (1.0 - energySurge) * 1.35;
      equatorialPulseRef.current.scale.set(s, s, 1);
      const mat = equatorialPulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = energySurge * 0.55;
    }
  });

  const selectChassisMat = (pbrMat: THREE.Material, isGoldAccent = false) => {
    if (mode === "wireframe") {
      return isGoldAccent ? materials.cadWireframeGold : materials.chassisCadShader;
    }
    if (mode === "xray") return materials.chassisXrayShader;
    return pbrMat;
  };

  const baseScale = isMobileViewport ? 0.86 : 1.06;

  return (
    <group ref={groupRef} position={[0, 0.40, -0.22]} scale={baseScale}>
      <directionalLight position={[0, 6, -5]} intensity={2.2} color="#00F0FF" />
      <spotLight position={[5, 4, 4]} intensity={1.8} angle={0.65} penumbra={0.85} color="#D4AF37" />
      <directionalLight position={[-5, -2, 4]} intensity={1.1} color="#E2E8F0" />

      {/* Anillos Cardán Orbitales Exteriores (Astrolabio CNC de Precisión) */}
      <group ref={ringGroupRef} position={[0, 0.34, -0.10]}>
        <mesh>
          <torusGeometry args={[1.36, 0.012, 16, 128]} />
          <primitive
            object={mode === "wireframe" ? materials.cadWireframeGold : materials.solarGoldPbr}
            attach="material"
          />
        </mesh>
        <mesh rotation={[Math.PI / 3.1, 0.28, 0]}>
          <torusGeometry args={[1.50, 0.009, 16, 128]} />
          <primitive
            object={mode === "wireframe" ? materials.chassisCadShader : materials.pauldronPbrShader}
            attach="material"
          />
        </mesh>
      </group>

      {/* Onda Ecuatorial Cuántica Horizontal en el Reactor (plano XZ) */}
      <mesh
        ref={equatorialPulseRef}
        position={[0, -0.08, 0.08]}
        rotation={[Math.PI / 2, 0, 0]}
        visible={energySurge > 0.02}
      >
        <ringGeometry args={[0.38, 0.44, 64]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Chasis Biónico Hard-Surface Forjado en Blender */}
      <group position={[0, -0.14, 0.04]}>
        {/* 1. Peto Torácico Anisotrópico CNC + Gola Cervical */}
        {bionicParts.thorax.map((geo, i) => (
          <mesh key={`thorax-${i}`} geometry={geo}>
            <primitive object={selectChassisMat(materials.thoraxPbrShader)} attach="material" />
          </mesh>
        ))}

        {/* 2. Hombrera Tectónica Izquierda Articulada */}
        <group ref={pauldronLRef}>
          {bionicParts.pauldronL.map((geo, i) => (
            <mesh key={`pl-${i}`} geometry={geo}>
              <primitive object={selectChassisMat(materials.pauldronPbrShader)} attach="material" />
            </mesh>
          ))}
        </group>

        {/* 3. Hombrera Tectónica Derecha Articulada */}
        <group ref={pauldronRRef}>
          {bionicParts.pauldronR.map((geo, i) => (
            <mesh key={`pr-${i}`} geometry={geo}>
              <primitive object={selectChassisMat(materials.pauldronPbrShader)} attach="material" />
            </mesh>
          ))}
        </group>

        {/* 4. Collarín Gorget, Clavículas Mecánicas y Nervaduras en Oro Solar (#D4AF37) */}
        {bionicParts.goldStruts.map((geo, i) => (
          <mesh key={`gold-${i}`} geometry={geo}>
            <primitive object={selectChassisMat(materials.solarGoldPbr, true)} attach="material" />
          </mesh>
        ))}

        {/* 5. Pistones Cervicales Hidráulicos */}
        {bionicParts.spine.map((geo, i) => (
          <mesh key={`spine-${i}`} geometry={geo}>
            <primitive object={selectChassisMat(materials.pauldronPbrShader, true)} attach="material" />
          </mesh>
        ))}

        {/* 6. Extremidades de Flujo de Datos (Data-Stream Tendrils) */}
        {bionicParts.tendrils.map((geo, i) => (
          <mesh key={`tendril-${i}`} geometry={geo}>
            <primitive object={selectChassisMat(materials.dataStreamMat)} attach="material" />
          </mesh>
        ))}

        {/* 7. Reactor Cardíaco Cuántico Interno */}
        <group ref={coreMeshRef}>
          {bionicParts.core.map((geo, i) => (
            <mesh key={`core-${i}`} geometry={geo}>
              <primitive
                object={mode === "xray" ? materials.chassisXrayShader : materials.solarGoldPbr}
                attach="material"
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Ensamble Craneal Articulado: Arcos Temporales CNC + Relieve Facial Real de Aldo Arbizu */}
      <group ref={headAssemblyRef} position={[0, 0, 0]}>
        <group position={[0, -0.16, 0]}>
          {bionicParts.helmet.map((geo, i) => (
            <mesh key={`helm-${i}`} geometry={geo}>
              <primitive object={selectChassisMat(materials.solarGoldPbr, true)} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Relieve Escultórico Real de Aldo Arbizu (Integrado dentro de la Gola Biónica en V) */}
        <group position={[0, 0.56, 0.16]} scale={0.96}>
          {mode === "pbr" && (
            <mesh geometry={visorGeo} material={materials.visorPbrShader} />
          )}
          {mode === "wireframe" && (
            <mesh geometry={visorGeo} material={materials.visorWireframeShader} />
          )}
          {mode === "xray" && (
            <points geometry={quantumPointsGeo} material={materials.visorXrayPointsShader} />
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/cyber_operator_sotd.glb", "/draco/gltf/");
