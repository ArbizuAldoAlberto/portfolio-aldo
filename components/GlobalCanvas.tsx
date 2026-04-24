'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'

function CoreCrystal() {
  const mesh = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshPhysicalMaterial 
          color="#FF007F" 
          emissive="#FF007F"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.9}
          transmission={0.9}
          thickness={1}
          wireframe={true}
        />
      </mesh>
      
      {/* Internal core */}
      <Sphere args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={2}
          distort={0.6}
          speed={4}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#030014']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#00F0FF" />
        <directionalLight position={[-10, -10, -5]} intensity={3} color="#FF007F" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
        
        <CoreCrystal />

        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={2} 
            mipmapBlur
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.003, 0.003)} 
          />
          <Noise opacity={0.03} />
        </EffectComposer>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
