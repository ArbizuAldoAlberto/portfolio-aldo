'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useCursor } from '../theme/CursorContext'

function NexusNeuralCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const cageRef = useRef<THREE.Mesh>(null)
  const cage2Ref = useRef<THREE.Mesh>(null)
  const pingRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const packetsMeshRef = useRef<THREE.InstancedMesh>(null)
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null)

  const { pointer } = useThree()

  const nodeCount = 32
  const maxLines = 150

  // 1. Generate node definitions
  const nodes = useMemo(() => {
    const arr = []
    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.6 + Math.random() * 2.2
      const speed = 0.15 + Math.random() * 0.3
      const phase = Math.random() * Math.PI * 2
      const inclinationX = (Math.random() - 0.5) * Math.PI * 0.4
      const inclinationZ = (Math.random() - 0.5) * Math.PI * 0.4
      const color = i % 3 === 0 ? '#1D9E75' : i % 3 === 1 ? '#7F77DD' : '#EF9F27'
      arr.push({ radius, speed, phase, inclinationX, inclinationZ, color })
    }
    return arr
  }, [])

  // 2. Node positions references
  const nodePositions = useRef<THREE.Vector3[]>(nodes.map(() => new THREE.Vector3()))

  // 3. Pre-allocated arrays and temp variables
  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [])

  // 4. Data packets traveling along the network
  const packetCount = 8
  const packets = useMemo(() => {
    const arr = []
    for (let i = 0; i < packetCount; i++) {
      arr.push({
        t: Math.random(),
        speed: 0.5 + Math.random() * 0.8,
        sourceIdx: Math.floor(Math.random() * nodeCount),
        targetIdx: Math.floor(Math.random() * nodeCount),
      })
    }
    return arr
  }, [])

  // 5. Interactive Ping Shockwave state
  const pingState = useRef({ active: false, time: 0 })

  const handleCoreClick = () => {
    pingState.current.active = true
    pingState.current.time = 0
  }

  // Set colors on mount
  useEffect(() => {
    if (instancedMeshRef.current) {
      nodes.forEach((node, idx) => {
        instancedMeshRef.current!.setColorAt(idx, new THREE.Color(node.color))
      })
      instancedMeshRef.current.instanceColor!.needsUpdate = true
    }
    if (packetsMeshRef.current) {
      for (let i = 0; i < packetCount; i++) {
        packetsMeshRef.current.setColorAt(i, new THREE.Color('#EF9F27'))
      }
      packetsMeshRef.current.instanceColor!.needsUpdate = true
    }
  }, [nodes, packetCount])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // A. Rotate and pulse core
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.25
      coreRef.current.rotation.z = time * 0.1
      const pulse = 1.0 + Math.sin(time * 3) * 0.05
      coreRef.current.scale.set(pulse, pulse, pulse)
    }

    // B. Rotate outer cages in opposing directions
    if (cageRef.current) {
      cageRef.current.rotation.y = -time * 0.15
      cageRef.current.rotation.z = time * 0.2
    }
    if (cage2Ref.current) {
      cage2Ref.current.rotation.x = time * 0.12
      cage2Ref.current.rotation.y = time * 0.18
    }

    // C. Update node positions and update InstancedMesh
    nodes.forEach((node, idx) => {
      const angle = time * node.speed + node.phase
      const x = Math.cos(angle) * node.radius
      const y = Math.sin(angle) * node.radius * Math.cos(node.inclinationX)
      const z = Math.sin(angle) * node.radius * Math.sin(node.inclinationZ)

      nodePositions.current[idx].set(x, y, z)

      if (instancedMeshRef.current) {
        tempObject.position.copy(nodePositions.current[idx])
        const pulseScale = 0.05 + Math.sin(time * 6 + node.phase) * 0.015
        tempObject.scale.set(pulseScale, pulseScale, pulseScale)
        tempObject.updateMatrix()
        instancedMeshRef.current.setMatrixAt(idx, tempObject.matrix)
      }
    })
    if (instancedMeshRef.current) {
      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // D. Update line connections
    let lineCount = 0
    for (let i = 0; i < nodeCount; i++) {
      const posA = nodePositions.current[i]

      // Connect to Core if close
      const distToCore = posA.length()
      if (distToCore < 2.8 && lineCount < maxLines) {
        const idx = lineCount * 6
        linePositions[idx] = posA.x
        linePositions[idx + 1] = posA.y
        linePositions[idx + 2] = posA.z
        linePositions[idx + 3] = 0
        linePositions[idx + 4] = 0
        linePositions[idx + 5] = 0
        lineCount++
      }

      // Connect to other nearby nodes
      for (let j = i + 1; j < nodeCount; j++) {
        const posB = nodePositions.current[j]
        const dist = posA.distanceTo(posB)
        if (dist < 1.8 && lineCount < maxLines) {
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

    if (lineGeometryRef.current) {
      const positionAttr = lineGeometryRef.current.getAttribute('position') as THREE.BufferAttribute
      positionAttr.needsUpdate = true
      lineGeometryRef.current.setDrawRange(0, lineCount * 2)
    }

    // E. Update data packets
    packets.forEach((packet, idx) => {
      packet.t += delta * packet.speed
      if (packet.t >= 1.0) {
        packet.t = 0
        packet.sourceIdx = packet.targetIdx
        packet.targetIdx = Math.floor(Math.random() * nodeCount)
      }

      const posA = nodePositions.current[packet.sourceIdx]
      const posB = nodePositions.current[packet.targetIdx]

      if (packetsMeshRef.current) {
        tempObject.position.lerpVectors(posA, posB, packet.t)
        const pulse = 0.035 + Math.sin(time * 12 + idx) * 0.008
        tempObject.scale.set(pulse, pulse, pulse)
        tempObject.updateMatrix()
        packetsMeshRef.current.setMatrixAt(idx, tempObject.matrix)
      }
    })
    if (packetsMeshRef.current) {
      packetsMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // F. Animate Ping Shockwave
    if (pingState.current.active) {
      pingState.current.time += delta
      const elapsed = pingState.current.time
      const duration = 1.0

      if (elapsed >= duration) {
        pingState.current.active = false
        if (pingRef.current) {
          pingRef.current.visible = false
        }
      } else {
        if (pingRef.current) {
          pingRef.current.visible = true
          const progress = elapsed / duration
          const scale = 1.0 + progress * 4.5
          pingRef.current.scale.set(scale, scale, scale)
          const mat = pingRef.current.material as THREE.MeshBasicMaterial
          mat.opacity = 1.0 - progress
        }
      }
    }

    // G. Pointer tracking lerp rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.5, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.5, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      {/* ⚛️ INNER REACTOR CORE: Intensive Plasma Core */}
      <mesh 
        ref={coreRef} 
        castShadow 
        onClick={(e) => {
          e.stopPropagation()
          handleCoreClick()
        }}
      >
        <sphereGeometry args={[0.9, 32, 32]} />
        <MeshDistortMaterial
          color="#1D9E75"
          emissive="#1D9E75"
          emissiveIntensity={2.5}
          attach="material"
          distort={0.25}
          speed={2.2}
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 🛡️ CAGE 1: Icosahedron wireframe */}
      <mesh ref={cageRef}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial
          color="#7F77DD"
          emissive="#7F77DD"
          emissiveIntensity={1.5}
          roughness={0}
          metalness={1}
          wireframe={true}
        />
      </mesh>

      {/* 🛡️ CAGE 2: Outer dodecahedron wireframe */}
      <mesh ref={cage2Ref}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#EF9F27"
          emissive="#EF9F27"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={1}
          wireframe={true}
        />
      </mesh>

      {/* 💫 NEURAL NETWORK NODES */}
      <instancedMesh ref={instancedMeshRef} args={[null as any, null as any, nodeCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial roughness={0.1} metalness={0.9} emissiveIntensity={3} />
      </instancedMesh>

      {/* ⚡ DATA PACKETS */}
      <instancedMesh ref={packetsMeshRef} args={[null as any, null as any, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#EF9F27" />
      </instancedMesh>

      {/* 🕸️ DYNAMIC CONNECTION LINES */}
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#1D9E75"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 🌊 PING SHOCKWAVE */}
      <mesh ref={pingRef} visible={false}>
        <torusGeometry args={[1.0, 0.015, 8, 64]} />
        <meshBasicMaterial
          color="#1D9E75"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ✨ QUANTUM SPARKS: Cinematic particles */}
      <Sparkles count={60} scale={4.5} size={2.0} speed={1.2} color="#1D9E75" />
      <Sparkles count={30} scale={3.5} size={1.5} speed={1.6} color="#7F77DD" />
    </group>
  )
}

export default function Hero3D() {
  const { setCursorState } = useCursor()

  return (
    <div 
      onMouseEnter={() => setCursorState('drag')}
      onMouseLeave={() => setCursorState('default')}
      className="w-full h-full"
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 42 }} 
        className="w-full h-full pointer-events-auto"
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.1} />
        
        <pointLight position={[8, 8, 8]} color="#1D9E75" intensity={5} />
        <pointLight position={[-8, -8, -8]} color="#7F77DD" intensity={4} />
        <pointLight position={[0, 0, 4]} color="#EF9F27" intensity={2} />

        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
          <NexusNeuralCore />
        </Float>
        
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
