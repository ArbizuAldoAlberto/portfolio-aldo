/* eslint-disable */
'use client'
import { useRef, useMemo, useEffect, Suspense, useState } from 'react'
import { useInView } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, MeshDistortMaterial, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useCursor } from '../theme/CursorContext'
import { usePersona } from '../theme/PersonaContext'

interface BranchProps {
  from: THREE.Vector3
  to: THREE.Vector3
  radiusStart: number
  radiusEnd: number
  color?: string
}

// Procedural branch component to render thick volumetric 3D branches oriented correctly
function CylinderBranch({ from, to, radiusStart, radiusEnd, color = "#121217" }: BranchProps) {
  const direction = new THREE.Vector3().subVectors(to, from)
  const length = direction.length()
  const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
  
  const up = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize())
  
  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radiusEnd, radiusStart, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.65} />
    </mesh>
  )
}

function InteractiveStarRings({ clickPing }: { clickPing: { active: boolean; time: number } }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { pointer } = useThree()
  const { persona } = usePersona()
  
  const [particleCount, setParticleCount] = useState(150)
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setParticleCount(50) // Reduce particles on mobile for performance
    }
  }, [])
  
  const particles = useMemo(() => {
    const arr = []
    const colorsMap = {
      engineer: { primary: '#00FF66', secondary: '#00F0FF', accent: '#FF007F' },
      'agtech': { primary: '#FFFFFF', secondary: '#8B8B9B', accent: '#DFDFEF' },
      security: { primary: '#1D9E75', secondary: '#7F77DD', accent: '#EF9F27' },
    }
    const colors = colorsMap[persona] || colorsMap.engineer

    for (let i = 0; i < particleCount; i++) {
      const orbitType = i % 2 === 0 ? 0 : 1
      const radius = orbitType === 0 ? 1.9 + Math.random() * 0.45 : 2.6 + Math.random() * 0.65
      const speed = orbitType === 0 ? 0.4 + Math.random() * 0.2 : -0.3 - Math.random() * 0.15
      const phase = Math.random() * Math.PI * 2
      const inclineX = orbitType === 0 ? Math.PI / 4.5 : -Math.PI / 5
      const inclineZ = orbitType === 0 ? Math.PI / 7 : -Math.PI / 4.5
      
      arr.push({
        radius,
        speed,
        phase,
        inclineX,
        inclineZ,
        orbitType,
        baseColor: orbitType === 0 ? colors.primary : colors.secondary
      })
    }
    return arr
  }, [persona])

  const tempObj = useMemo(() => new THREE.Object3D(), [])
  const colorObj = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, idx) => {
        meshRef.current!.setColorAt(idx, new THREE.Color(p.baseColor))
      })
      meshRef.current.instanceColor!.needsUpdate = true
    }
  }, [particles])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const mouseIntensity = Math.abs(pointer.x) + Math.abs(pointer.y)
    const speedMultiplier = 1.0 + mouseIntensity * 1.8

    const colorsMap = {
      engineer: { primary: '#00FF66', secondary: '#00F0FF', accent: '#FF007F', hoverPrimary: '#a6ffc9', hoverSecondary: '#a6f8ff' },
      'agtech': { primary: '#FFFFFF', secondary: '#8B8B9B', accent: '#DFDFEF', hoverPrimary: '#ffffff', hoverSecondary: '#d9d9e3' },
      security: { primary: '#1D9E75', secondary: '#7F77DD', accent: '#EF9F27', hoverPrimary: '#55fcd0', hoverSecondary: '#bfaaff' },
    }
    const colors = colorsMap[persona] || colorsMap.engineer

    particles.forEach((p, idx) => {
      let angle = time * p.speed * speedMultiplier + p.phase
      let radialOffset = 0
      
      if (clickPing.active) {
        const duration = 1.2
        const progress = clickPing.time / duration
        const wavefront = progress * 4.0
        const width = 0.6
        const dist = p.radius - wavefront
        
        if (Math.abs(dist) < width) {
          const pushForce = (1.0 - Math.abs(dist) / width) * 0.7 * (1.0 - progress)
          radialOffset = pushForce
        }
      }

      const currentRadius = p.radius + radialOffset
      const basePos = new THREE.Vector3(
        Math.cos(angle) * currentRadius,
        0,
        Math.sin(angle) * currentRadius
      )
      
      basePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), p.inclineX)
      basePos.applyAxisAngle(new THREE.Vector3(0, 0, 1), p.inclineZ)

      tempObj.position.copy(basePos)
      const scale = 0.015 + Math.sin(time * 4 + p.phase) * 0.005 + (radialOffset * 0.01)
      tempObj.scale.set(scale, scale, scale)
      tempObj.updateMatrix()
      
      meshRef.current!.setMatrixAt(idx, tempObj.matrix)
      
      if (meshRef.current && meshRef.current.instanceColor) {
        if (radialOffset > 0.05) {
          colorObj.set(colors.accent)
        } else {
          const distToMouse = basePos.distanceTo(new THREE.Vector3(pointer.x * 2.2, pointer.y * 2.2, 0))
          if (distToMouse < 1.4) {
            colorObj.set(p.orbitType === 0 ? colors.hoverPrimary : colors.hoverSecondary)
          } else {
            colorObj.set(p.baseColor)
          }
        }
        meshRef.current.setColorAt(idx, colorObj)
      }
    })

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, particleCount]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

function CyberOrganicTree() {
  const trunkRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const pingRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const packetsMeshRef = useRef<THREE.InstancedMesh>(null)
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null)

  const { pointer } = useThree()
  const { persona } = usePersona()

  const treeMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Procedural geometries for 100% WebGL compatibility (No GLTF loading)
  const GeometryComponent = useMemo(() => {
    switch (persona) {
      case 'engineer': return <icosahedronGeometry args={[1.2, 1]} />
      case 'security': return <torusKnotGeometry args={[0.8, 0.25, 128, 16]} />
      case 'agtech': return <octahedronGeometry args={[1.2, 0]} />
      default: return <sphereGeometry args={[1.2, 32, 32]} />
    }
  }, [persona])

  const colorsMap = useMemo(() => ({
    engineer: { primary: '#00FF66', secondary: '#00F0FF', accent: '#FF007F', emissive: '#00FF66' },
    'agtech': { primary: '#FFFFFF', secondary: '#8B8B9B', accent: '#DFDFEF', emissive: '#8B8B9B' },
    security: { primary: '#1D9E75', secondary: '#7F77DD', accent: '#EF9F27', emissive: '#104f38' },
  }), [])

  const currentColors = useMemo(() => colorsMap[persona] || colorsMap.engineer, [persona, colorsMap])

  const nodeCount = 32
  const maxLines = 120

  // 1. Procedural definition of the trunk and branch hierarchy
  const treeStructure = useMemo(() => {
    return [
      // Trunk Segments (from, to, radiusStart, radiusEnd)
      { from: new THREE.Vector3(0, -2.4, 0), to: new THREE.Vector3(0.05, -1.8, 0), rStart: 0.28, rEnd: 0.24 },
      { from: new THREE.Vector3(0.05, -1.8, 0), to: new THREE.Vector3(-0.05, -1.2, 0.05), rStart: 0.24, rEnd: 0.20 },
      { from: new THREE.Vector3(-0.05, -1.2, 0.05), to: new THREE.Vector3(-0.15, -0.6, 0.1), rStart: 0.20, rEnd: 0.17 },
      { from: new THREE.Vector3(-0.15, -0.6, 0.1), to: new THREE.Vector3(0.0, 0.0, 0.15), rStart: 0.17, rEnd: 0.14 },
      { from: new THREE.Vector3(0.0, 0.0, 0.15), to: new THREE.Vector3(0.05, 0.6, 0.2), rStart: 0.14, rEnd: 0.11 },

      // Left Major Branch
      { from: new THREE.Vector3(-0.05, -1.2, 0.05), to: new THREE.Vector3(-0.8, -0.6, 0.4), rStart: 0.16, rEnd: 0.12 },
      { from: new THREE.Vector3(-0.8, -0.6, 0.4), to: new THREE.Vector3(-1.6, 0.4, 0.9), rStart: 0.12, rEnd: 0.08 },

      // Right Major Branch
      { from: new THREE.Vector3(-0.15, -0.6, 0.1), to: new THREE.Vector3(0.7, 0.1, -0.2), rStart: 0.15, rEnd: 0.11 },
      { from: new THREE.Vector3(0.7, 0.1, -0.2), to: new THREE.Vector3(1.5, 0.9, -0.7), rStart: 0.11, rEnd: 0.07 },

      // Middle/Back Branch
      { from: new THREE.Vector3(0.05, 0.6, 0.2), to: new THREE.Vector3(0.1, 1.2, 0.5), rStart: 0.10, rEnd: 0.07 },
      { from: new THREE.Vector3(0.1, 1.2, 0.5), to: new THREE.Vector3(-0.3, 1.8, 0.8), rStart: 0.07, rEnd: 0.05 },

      // Front/Top Branch
      { from: new THREE.Vector3(0.05, 0.6, 0.2), to: new THREE.Vector3(-0.4, 1.1, -0.4), rStart: 0.10, rEnd: 0.07 },
      { from: new THREE.Vector3(-0.4, 1.1, -0.4), to: new THREE.Vector3(-0.8, 1.6, -1.0), rStart: 0.07, rEnd: 0.05 }
    ]
  }, [])

  // Branch tip coordinates where leaves/nodos cluster
  const branchTips = useMemo(() => [
    new THREE.Vector3(-1.6, 0.4, 0.9),
    new THREE.Vector3(1.5, 0.9, -0.7),
    new THREE.Vector3(-0.3, 1.8, 0.8),
    new THREE.Vector3(-0.8, 1.6, -1.0)
  ], [])

  // Spline paths for sap-like energy packets traveling from root up to branch tips
  const paths = useMemo(() => {
    const p0 = [
      new THREE.Vector3(0, -2.4, 0),
      new THREE.Vector3(0.05, -1.8, 0),
      new THREE.Vector3(-0.05, -1.2, 0.05),
      new THREE.Vector3(-0.8, -0.6, 0.4),
      new THREE.Vector3(-1.6, 0.4, 0.9)
    ]
    const p1 = [
      new THREE.Vector3(0, -2.4, 0),
      new THREE.Vector3(0.05, -1.8, 0),
      new THREE.Vector3(-0.05, -1.2, 0.05),
      new THREE.Vector3(-0.15, -0.6, 0.1),
      new THREE.Vector3(0.7, 0.1, -0.2),
      new THREE.Vector3(1.5, 0.9, -0.7)
    ]
    const p2 = [
      new THREE.Vector3(0, -2.4, 0),
      new THREE.Vector3(0.05, -1.8, 0),
      new THREE.Vector3(-0.05, -1.2, 0.05),
      new THREE.Vector3(-0.15, -0.6, 0.1),
      new THREE.Vector3(0.0, 0.0, 0.15),
      new THREE.Vector3(0.05, 0.6, 0.2),
      new THREE.Vector3(0.1, 1.2, 0.5),
      new THREE.Vector3(-0.3, 1.8, 0.8)
    ]
    const p3 = [
      new THREE.Vector3(0, -2.4, 0),
      new THREE.Vector3(0.05, -1.8, 0),
      new THREE.Vector3(-0.05, -1.2, 0.05),
      new THREE.Vector3(-0.15, -0.6, 0.1),
      new THREE.Vector3(0.0, 0.0, 0.15),
      new THREE.Vector3(0.05, 0.6, 0.2),
      new THREE.Vector3(-0.4, 1.1, -0.4),
      new THREE.Vector3(-0.8, 1.6, -1.0)
    ]
    return [
      new THREE.CatmullRomCurve3(p0),
      new THREE.CatmullRomCurve3(p1),
      new THREE.CatmullRomCurve3(p2),
      new THREE.CatmullRomCurve3(p3)
    ]
  }, [])

  // 2. Generate data leaf nodes orbiting each branch tip
  const nodes = useMemo(() => {
    const arr = []
    const palette = [currentColors.primary, currentColors.secondary, currentColors.accent]
    for (let i = 0; i < nodeCount; i++) {
      const radius = 0.35 + Math.random() * 0.45
      const speed = 0.25 + Math.random() * 0.35
      const phase = Math.random() * Math.PI * 2
      const inclinationX = (Math.random() - 0.5) * Math.PI * 0.5
      const inclinationZ = (Math.random() - 0.5) * Math.PI * 0.5
      const color = palette[i % palette.length]
      arr.push({ radius, speed, phase, inclinationX, inclinationZ, color })
    }
    return arr
  }, [currentColors])

  const nodePositions = useRef<THREE.Vector3[]>(nodes.map(() => new THREE.Vector3()))

  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [])

  const packetCount = 10
  const packets = useMemo(() => {
    const arr = []
    for (let i = 0; i < packetCount; i++) {
      arr.push({
        t: Math.random(),
        speed: 0.35 + Math.random() * 0.35,
        pathIdx: Math.floor(Math.random() * 4)
      })
    }
    return arr
  }, [])

  const pingState = useRef({ active: false, time: 0 })

  const handleTreeClick = () => {
    pingState.current.active = true
    pingState.current.time = 0
  }

  useEffect(() => {
    if (instancedMeshRef.current) {
      nodes.forEach((node, idx) => {
        instancedMeshRef.current!.setColorAt(idx, new THREE.Color(node.color))
      })
      instancedMeshRef.current.instanceColor!.needsUpdate = true
    }
    if (packetsMeshRef.current) {
      for (let i = 0; i < packetCount; i++) {
        packetsMeshRef.current.setColorAt(i, new THREE.Color(currentColors.accent))
      }
      packetsMeshRef.current.instanceColor!.needsUpdate = true
    }
  }, [nodes, packetCount, currentColors])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // A. Pulse tree emissive veins
    if (treeMaterialRef.current) {
      treeMaterialRef.current.emissiveIntensity = 0.5 + Math.sin(time * 2.0) * 0.3
    }

    // A. Pulse trunk cybernetic rings
    if (ring1Ref.current) {
      const s = 1.0 + Math.sin(time * 3.5 + 0.0) * 0.06
      ring1Ref.current.scale.set(s, 1, s)
    }
    if (ring2Ref.current) {
      const s = 1.0 + Math.sin(time * 3.5 + 1.2) * 0.06
      ring2Ref.current.scale.set(s, 1, s)
    }
    if (ring3Ref.current) {
      const s = 1.0 + Math.sin(time * 3.5 + 2.4) * 0.06
      ring3Ref.current.scale.set(s, 1, s)
    }

    // B. Rotate group slightly based on time
    if (trunkRef.current) {
      trunkRef.current.rotation.y = Math.sin(time * 0.15) * 0.05
    }

    // C. Orbit data leaves around their respective branch tips
    nodes.forEach((node, idx) => {
      const parentTipIdx = Math.floor(idx / 8)
      const tip = branchTips[parentTipIdx]
      const angle = time * node.speed + node.phase
      
      const x = tip.x + Math.cos(angle) * node.radius
      const y = tip.y + Math.sin(angle) * node.radius * Math.cos(node.inclinationX)
      const z = tip.z + Math.sin(angle) * node.radius * Math.sin(node.inclinationZ)

      nodePositions.current[idx].set(x, y, z)

      if (instancedMeshRef.current) {
        tempObject.position.copy(nodePositions.current[idx])
        const pulseScale = 0.045 + Math.sin(time * 6 + node.phase) * 0.015
        tempObject.scale.set(pulseScale, pulseScale, pulseScale)
        tempObject.updateMatrix()
        instancedMeshRef.current.setMatrixAt(idx, tempObject.matrix)
      }
    })
    if (instancedMeshRef.current) {
      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // D. Build connections inside each digital foliage cluster
    let lineCount = 0
    for (let k = 0; k < 4; k++) {
      const tip = branchTips[k]
      const startIdx = k * 8
      const endIdx = startIdx + 8

      // Draw connection from branch tip to cluster nodes
      for (let i = startIdx; i < endIdx; i++) {
        const posA = nodePositions.current[i]
        if (lineCount < maxLines) {
          const idx = lineCount * 6
          linePositions[idx] = posA.x
          linePositions[idx + 1] = posA.y
          linePositions[idx + 2] = posA.z
          linePositions[idx + 3] = tip.x
          linePositions[idx + 4] = tip.y
          linePositions[idx + 5] = tip.z
          lineCount++
        }
      }

      // Draw internal cluster lines between nodes
      for (let i = startIdx; i < endIdx; i++) {
        const posA = nodePositions.current[i]
        for (let j = i + 1; j < endIdx; j++) {
          const posB = nodePositions.current[j]
          const dist = posA.distanceTo(posB)
          if (dist < 0.95 && lineCount < maxLines) {
            const idx = lineCount * 6
            linePositions[idx] = posA.x
            linePositions[idx + 1] = posA.y
            linePositions[idx + 2] = posA.z
            linePositions[idx + 3] = posB.x
            linePositions[idx + 4] = posB.y
            linePositions[idx + 5] = posB.z
            lineCount++
          }
        }
      }
    }

    if (lineGeometryRef.current) {
      const positionAttr = lineGeometryRef.current.getAttribute('position') as THREE.BufferAttribute
      positionAttr.needsUpdate = true
      lineGeometryRef.current.setDrawRange(0, lineCount * 2)
    }

    // E. Travel energy packets up spline paths
    packets.forEach((packet, idx) => {
      packet.t += delta * packet.speed
      if (packet.t >= 1.0) {
        packet.t = 0
        packet.pathIdx = Math.floor(Math.random() * 4)
        packet.speed = 0.35 + Math.random() * 0.4
      }

      const curve = paths[packet.pathIdx]
      const pos = curve.getPointAt(packet.t)

      if (packetsMeshRef.current) {
        tempObject.position.copy(pos)
        const pulse = 0.03 + Math.sin(time * 12 + idx) * 0.008
        tempObject.scale.set(pulse, pulse, pulse)
        tempObject.updateMatrix()
        packetsMeshRef.current.setMatrixAt(idx, tempObject.matrix)
      }
    })
    if (packetsMeshRef.current) {
      packetsMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // F. Animate shockwave ping
    if (pingState.current.active) {
      pingState.current.time += delta
      const elapsed = pingState.current.time
      const duration = 1.2

      if (elapsed >= duration) {
        pingState.current.active = false
        if (pingRef.current) {
          pingRef.current.visible = false
        }
      } else {
        if (pingRef.current) {
          pingRef.current.visible = true
          const progress = elapsed / duration
          const scale = 1.0 + progress * 5.0
          pingRef.current.scale.set(scale, scale, scale)
          const mat = pingRef.current.material as THREE.MeshBasicMaterial
          mat.opacity = 0.8 * (1.0 - progress)
        }
      }
    }

    // G. Pointer mouse tracking rotation & displacement
    if (groupRef.current) {
      const targetRotY = pointer.x * 0.45
      const targetRotX = -pointer.y * 0.35
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06)

      // Add dynamic 3D positional shift towards cursor (magnetic attraction)
      const targetPosX = pointer.x * 0.25
      const targetPosY = pointer.y * 0.15
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      {/* 🌳 CYBER-ORGANIC CORE (Procedural replacement for GLTF) */}
      <group ref={trunkRef} onClick={(e) => { e.stopPropagation(); handleTreeClick() }}>
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          {GeometryComponent}
          <meshPhysicalMaterial 
            color={persona === 'security' ? '#020205' : '#0a0e12'}
            roughness={persona === 'agtech' ? 0.3 : 0.65}
            metalness={persona === 'agtech' ? 0.9 : 0.7}
            emissive={currentColors.emissive}
            emissiveIntensity={persona === 'security' ? 1.5 : 0.8}
            clearcoat={persona === 'agtech' ? 0.8 : 0.4}
            clearcoatRoughness={0.3}
            envMapIntensity={1.5}
            wireframe={persona === 'engineer'}
            transparent={persona === 'security'}
            opacity={persona === 'security' ? 0.85 : 1.0}
          />
        </mesh>

        {/* Pulsing sap cyber rings around trunk */}
        <mesh ref={ring1Ref} position={[0.02, -1.8, 0]} rotation={[0.1, 0, 0.05]}>
          <torusGeometry args={[0.27, 0.008, 6, 24]} />
          <meshBasicMaterial color={currentColors.primary} transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring2Ref} position={[-0.05, -1.2, 0.05]} rotation={[0.1, 0, 0.05]}>
          <torusGeometry args={[0.23, 0.008, 6, 24]} />
          <meshBasicMaterial color={currentColors.secondary} transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring3Ref} position={[-0.15, -0.6, 0.1]} rotation={[0.1, 0, 0.05]}>
          <torusGeometry args={[0.19, 0.008, 6, 24]} />
          <meshBasicMaterial color={currentColors.accent} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 💫 NEURAL DATA LEAVES (FOLIAGE NODES) */}
      <instancedMesh ref={instancedMeshRef} args={[null as any, null as any, nodeCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial roughness={0.1} metalness={0.9} emissiveIntensity={3} />
      </instancedMesh>

      {/* ⚡ SAP DATA PACKETS */}
      <instancedMesh ref={packetsMeshRef} args={[null as any, null as any, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={currentColors.accent} />
      </instancedMesh>

      {/* 🕸️ VEIN CONNECTIONS (DIGITAL LEAF GRID) */}
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={currentColors.primary}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 🌊 BIOMETRIC ENERGY PING */}
      <mesh ref={pingRef} visible={false}>
        <torusGeometry args={[1.0, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={currentColors.primary}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ✨ BIO-POLLEN SPARKLES */}
      <Sparkles count={50} scale={4.5} size={1.8} speed={1.0} color={currentColors.primary} />
      <Sparkles count={25} scale={3.5} size={1.4} speed={1.3} color={currentColors.secondary} />

      {/* 🌌 INTERACTIVE STAR ORBITS (UCP & ESG DATA RINGS) */}
      <InteractiveStarRings clickPing={pingState.current} />
    </group>
  )
}

// GLTF preloading removed for 100% WebGL performance

function ProjectSatellites() {
  const satellitesRef = useRef<THREE.Group>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const projectsList = useMemo(() => [
    { name: 'TitanFlow', desc: 'DeFi Copy Trading & Algorithmic Bot', color: '#1D9E75', radius: 2.0, speed: 0.35 },
    { name: 'AgroMarket Pro', desc: 'AgriTech Logistics & Marketplace', color: '#EF9F27', radius: 2.3, speed: 0.25 },
    { name: 'SentinelOS', desc: 'Security Dispatch & Command Center', color: '#EF4444', radius: 2.6, speed: -0.3 },
    { name: 'AeroShot', desc: 'Agricultural Drone Processing SaaS', color: '#7F77DD', radius: 2.9, speed: 0.2 },
    { name: 'SabioBosque', desc: 'E-commerce & Legal Compliance SaaS', color: '#10b981', radius: 3.2, speed: -0.15 },
    { name: 'Hábitat', desc: 'Decentralized Direct Rentals', color: '#EF9F27', radius: 3.5, speed: 0.1 },
    { name: 'PawHero', desc: 'Pet Tracking & IoT Telemetry', color: '#7F77DD', radius: 3.8, speed: -0.08 }
  ], [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!satellitesRef.current) return

    satellitesRef.current.children.forEach((child, idx) => {
      const p = projectsList[idx]
      if (!p) return
      
      const currentSpeed = hoveredIdx === idx ? p.speed * 0.1 : p.speed
      const angle = time * currentSpeed + (idx * Math.PI * 2 / projectsList.length)
      
      const x = Math.cos(angle) * p.radius
      const z = Math.sin(angle) * p.radius
      const y = Math.sin(angle * 1.5) * 0.25

      child.position.set(x, y, z)
      
      const targetScale = hoveredIdx === idx ? 0.14 : 0.07
      child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    })
  })

  const handlePointerOver = (idx: number, e: any) => {
    e.stopPropagation()
    setHoveredIdx(idx)
    const p = projectsList[idx]
    window.dispatchEvent(new CustomEvent('satellite-hover', { 
      detail: { active: true, name: p.name, desc: p.desc, color: p.color } 
    }))
  }

  const handlePointerOut = (idx: number, e: any) => {
    e.stopPropagation()
    setHoveredIdx(null)
    window.dispatchEvent(new CustomEvent('satellite-hover', { 
      detail: { active: false } 
    }))
  }

  return (
    <group ref={satellitesRef}>
      {projectsList.map((p, idx) => (
        <mesh 
          key={idx}
          onPointerOver={(e) => handlePointerOver(idx, e)}
          onPointerOut={(e) => handlePointerOut(idx, e)}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color={p.color} 
            emissive={p.color}
            emissiveIntensity={hoveredIdx === idx ? 3.0 : 1.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}


export default function Hero3D() {
  const { setCursorState } = useCursor()
  const { persona } = usePersona()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { margin: "200px 0px" })

  const colorsMap = {
    engineer: { primary: '#00FF66', secondary: '#00F0FF', accent: '#FF007F' },
    'agtech': { primary: '#FFFFFF', secondary: '#8B8B9B', accent: '#DFDFEF' },
    security: { primary: '#1D9E75', secondary: '#7F77DD', accent: '#EF9F27' },
  }
  const currentColors = colorsMap[persona] || colorsMap.engineer

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setCursorState('drag')}
      onMouseLeave={() => setCursorState('default')}
      className="w-full h-full"
    >
      <Canvas 
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 42 }} 
        className="w-full h-full pointer-events-auto"
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.1} />
        
        <pointLight position={[8, 8, 8]} color={currentColors.primary} intensity={5} />
        <pointLight position={[-8, -8, -8]} color={currentColors.secondary} intensity={4} />
        <pointLight position={[0, 0, 4]} color={currentColors.accent} intensity={2} />

        <Suspense fallback={null}>
          <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
            <CyberOrganicTree />
          </Float>
          <ProjectSatellites />
        </Suspense>
        
        <EffectComposer enableNormalPass={false} multisampling={4}>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={2.5} 
            mipmapBlur 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.002, 0.002)} 
          />
        </EffectComposer>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  )
}
