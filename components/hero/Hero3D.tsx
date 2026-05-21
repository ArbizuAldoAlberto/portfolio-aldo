'use client'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useCursor } from '../theme/CursorContext'

function QuantumReactor() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const { pointer } = useThree()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.35
      coreRef.current.rotation.z = time * 0.15
      const pulse = 1 + Math.sin(time * 3) * 0.08
      coreRef.current.scale.set(pulse, pulse, pulse)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.35
      ring1Ref.current.rotation.y = time * 0.15
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * 0.28
      ring2Ref.current.rotation.z = -time * 0.4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = -time * 0.4
      ring3Ref.current.rotation.x = time * 0.25
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.6, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.6, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      {/* ⚛️ INNER REACTOR CORE: Intensive Plasma Core */}
      <mesh ref={coreRef} castShadow>
        <dodecahedronGeometry args={[1.1, 1]} />
        <MeshDistortMaterial
          color="#1D9E75"
          emissive="#1D9E75"
          emissiveIntensity={2.5}
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.1}
          metalness={1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 🛸 ORBIT 1: Horizontal Outer Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.4, 0.015, 16, 100]} />
        <meshStandardMaterial 
          color="#7F77DD" 
          emissive="#7F77DD"
          emissiveIntensity={4}
          roughness={0} 
          metalness={1} 
          wireframe={true}
        />
      </mesh>

      {/* 🛸 ORBIT 2: Tilted Medium Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.7, 0.015, 12, 100]} />
        <meshStandardMaterial 
          color="#EF9F27" 
          emissive="#EF9F27"
          emissiveIntensity={3}
          roughness={0} 
          metalness={1} 
          wireframe={true}
        />
      </mesh>

      {/* 🛸 ORBIT 3: Counter-tilted Inner Ring */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 3, -Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.015, 12, 80]} />
        <meshStandardMaterial 
          color="#1D9E75" 
          emissive="#1D9E75"
          emissiveIntensity={4}
          roughness={0} 
          metalness={1} 
          wireframe={true}
        />
      </mesh>

      {/* ✨ QUANTUM SPARKS: Cinematic particles */}
      <Sparkles count={80} scale={4.5} size={2.5} speed={1.5} color="#1D9E75" />
      <Sparkles count={40} scale={3.5} size={2.0} speed={2} color="#7F77DD" />
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
        gl={{ antialias: false, powerPreference: "high-performance" }} // Antialias false is recommended when using EffectComposer
      >
        <ambientLight intensity={0.1} />
        
        {/* Intense lights to feed the Bloom shader */}
        <pointLight position={[8, 8, 8]} color="#1D9E75" intensity={5} />
        <pointLight position={[-8, -8, -8]} color="#7F77DD" intensity={4} />
        <pointLight position={[0, 0, 4]} color="#EF9F27" intensity={2} />

        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
          <QuantumReactor />
        </Float>
        
        {/* 🎬 CINEMATIC POST-PROCESSING */}
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
