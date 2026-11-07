"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Configurar decoder Draco local offline si está disponible
if (typeof window !== "undefined" && typeof useGLTF.setDecoderPath === "function") {
  useGLTF.setDecoderPath("/draco/gltf/");
}

export type WorkbenchMode = "pbr" | "wireframe" | "xray";

export interface HalconWorkbenchProps {
  mode?: WorkbenchMode;
  scrollProgress?: number;
}

interface FeatherMeta {
  mesh: THREE.Mesh;
  side: number; // -1 izq, 1 der, 0 centro/cola
  spanFactor: number; // 0.0 (raíz) -> 1.0 (punta)
  kind: "primary" | "secondary" | "covert" | "tail" | "body";
  baseRot: THREE.Euler;
  basePos: THREE.Vector3;
}

const BASE_POS_Y = 1.15;
const BASE_POS_Z = -0.4;
const BASE_PITCH_X = Math.PI * 0.28; // ~50°: cabeza, pico dorado, pecho y alas dominan el tercio superior coronando el titular

export function HalconWorkbench({ mode = "pbr", scrollProgress = 0 }: HalconWorkbenchProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF("/models/halcon_sotd_pbr.glb", true);

  // Materiales tácticos precompilados para conmutación a 60 FPS sin memory leaks
  const tacticalMaterials = useMemo(() => {
    const obsidianPBR = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#070B12"),
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.35,
      iridescenceIOR: 1.6,
      reflectivity: 0.9,
      envMapIntensity: 1.35,
    });

    const solarGoldPBR = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4AF37"),
      metalness: 0.96,
      roughness: 0.16,
      clearcoat: 0.8,
      emissive: new THREE.Color("#F59E0B"),
      emissiveIntensity: 0.12, // Controlado para no quemar el Bloom
    });

    const cadWireframe = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00F0FF"),
      wireframe: true,
      transparent: true,
      opacity: 0.72,
    });

    const xrayFresnel = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uRimColor: { value: new THREE.Color("#00F0FF") },
        uCoreColor: { value: new THREE.Color("#6366F1") },
        uPower: { value: 2.2 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uRimColor;
        uniform vec3 uCoreColor;
        uniform float uPower;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPos;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), uPower);
          float scanline = 0.85 + 0.15 * sin(vWorldPos.y * 18.0 - uTime * 4.0);
          vec3 finalColor = mix(uCoreColor * 0.25, uRimColor, fresnel) * scanline;
          gl_FragColor = vec4(finalColor, clamp(fresnel * 0.9 + 0.12, 0.0, 0.92));
        }
      `,
    });

    return { obsidianPBR, solarGoldPBR, cadWireframe, xrayFresnel };
  }, []);

  // Indexación anatómica de plumas y preservación de transformaciones base
  const feathers = useMemo<FeatherMeta[]>(() => {
    const list: FeatherMeta[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name;
        const baseRot = mesh.rotation.clone();
        const basePos = mesh.position.clone();

        let side = 0;
        if (name.includes("_L_")) side = -1;
        else if (name.includes("_R_")) side = 1;

        const idxMatch = name.match(/_(\d+)$/);
        const idx = idxMatch ? parseInt(idxMatch[1], 10) : 0;

        let kind: FeatherMeta["kind"] = "body";
        let spanFactor = 0;

        if (name.startsWith("Primary_")) {
          kind = "primary";
          spanFactor = 1.0 - idx / 9.0; // 0 es la punta exterior, 9 es el carpo interior
        } else if (name.startsWith("Secondary_")) {
          kind = "secondary";
          spanFactor = 0.45 * (1.0 - idx / 11.0);
        } else if (name.startsWith("Covert_")) {
          kind = "covert";
          spanFactor = 0.65 * (1.0 - idx / 13.0);
        } else if (name.startsWith("Tail_")) {
          kind = "tail";
          spanFactor = Math.abs(idx / 11.0 - 0.5) * 2.0;
        }

        list.push({ mesh, side, spanFactor, kind, baseRot, basePos });
      }
    });
    return list;
  }, [scene]);

  // Conmutación de materiales según el modo activo en Halcón Workbench
  useEffect(() => {
    feathers.forEach(({ mesh, kind }) => {
      if (mode === "pbr") {
        // En modo PBR, las puntas primarias y bordes usan acento dorado y el cuerpo/plumas obsidiana
        mesh.material =
          kind === "primary" && mesh.name.endsWith("_0")
            ? tacticalMaterials.solarGoldPBR
            : tacticalMaterials.obsidianPBR;
      } else if (mode === "wireframe") {
        mesh.material = tacticalMaterials.cadWireframe;
      } else if (mode === "xray") {
        mesh.material = tacticalMaterials.xrayFresnel;
      }
    });
  }, [mode, feathers, tacticalMaterials]);

  // Cinemática de vuelo orgánica con retraso de fase aerodinámico en puntas alares
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    tacticalMaterials.xrayFresnel.uniforms.uTime.value = t;

    if (groupRef.current) {
      const responsiveScale = state.viewport.aspect < 1 ? 0.72 : 1.18;
      const basePosY = state.viewport.aspect < 1 ? 0.96 : BASE_POS_Y;
      groupRef.current.scale.setScalar(responsiveScale);
      groupRef.current.position.y = basePosY + Math.sin(t * 1.6) * 0.10;
      groupRef.current.position.z = BASE_POS_Z;
      groupRef.current.rotation.x =
        BASE_PITCH_X + Math.cos(t * 1.6) * 0.04 + scrollProgress * 0.25;
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.14;
      groupRef.current.rotation.z = Math.cos(t * 0.8) * 0.03;
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = mode === "xray" ? 3.2 + Math.sin(t * 5.0) * 0.8 : 0.6;
    }

    for (let i = 0; i < feathers.length; i++) {
      const f = feathers[i];
      if (f.kind === "body") continue;

      if (f.kind === "tail") {
        const tailWave = Math.sin(t * 1.6 - 0.8) * 0.045;
        f.mesh.rotation.x = f.baseRot.x + tailWave;
        continue;
      }

      // Onda de aleteo con desfase según distancia a la punta del ala (spanFactor)
      const flapCycle = Math.sin(t * 2.1 - f.spanFactor * 0.85);
      const aeroTwist = Math.cos(t * 2.1 - f.spanFactor * 1.1);

      const amp =
        f.kind === "primary"
          ? 0.16 * (0.4 + f.spanFactor * 0.6)
          : f.kind === "secondary"
            ? 0.09
            : 0.07;

      // Aplicamos flexión diedral y torsión de borde de ataque sin romper la simetría L/R
      f.mesh.rotation.y = f.baseRot.y + f.side * flapCycle * amp;
      f.mesh.rotation.x = f.baseRot.x + aeroTwist * (amp * 0.35);
    }
  });

  return (
    <group ref={groupRef} scale={1.18} position={[0, BASE_POS_Y, BASE_POS_Z]}>
      {/* Iluminación de estudio de 3 puntos para perfilar cada pluma sin quemar la escena */}
      <directionalLight position={[0, 5, -6]} intensity={2.6} color="#00F0FF" />
      <spotLight
        position={[5, 3, 4]}
        intensity={1.85}
        angle={0.55}
        penumbra={0.8}
        color="#F59E0B"
      />
      <directionalLight position={[-5, -2, 3]} intensity={1.1} color="#6366F1" />
      <pointLight ref={coreLightRef} position={[0, 0, 0.2]} intensity={0.6} color="#00F0FF" distance={3.5} />

      {/* Núcleo interno visible en modo X-Ray */}
      {mode === "xray" && (
        <mesh position={[0, 0.1, 0]}>
          <octahedronGeometry args={[0.32, 2]} />
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.85} />
        </mesh>
      )}

      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/halcon_sotd_pbr.glb", true);

