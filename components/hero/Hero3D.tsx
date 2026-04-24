'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full pointer-events-auto">
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} color="#1D9E75" intensity={1.5} />
      <pointLight position={[-10, -5, -5]} color="#7F77DD" intensity={0.8} />
      
      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.5}>
        <group>
          {/* Outer wireframe */}
          <mesh>
            <icosahedronGeometry args={[1.6, 1]} />
            <meshStandardMaterial color="#7F77DD" wireframe={true} />
          </mesh>
          {/* Inner core */}
          <mesh>
            <icosahedronGeometry args={[1.4, 1]} />
            <MeshDistortMaterial
              color="#1D9E75"
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.1}
              metalness={0.8}
              wireframe={false}
            />
          </mesh>
        </group>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
