'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Camera, Image, Layers, Smartphone } from 'lucide-react'
import { useCursor } from '../theme/CursorContext'
import * as THREE from 'three'

// Interactive ThreeJS Centerpiece Component representing the 3D phone model and abstract telemetry
function Floating3DMockup() {
  const phoneRef = useRef<THREE.Group>(null)
  const gridRef = useRef<THREE.Mesh>(null)
  const hudCircleRef = useRef<THREE.Group>(null)
  const hudLeftPanelRef = useRef<THREE.Group>(null)
  const hudRightPanelRef = useRef<THREE.Group>(null)

  // Pre-calculated circuit track positions (behind the screen)
  const circuitPositions = useMemo(() => {
    const positions = [
      // Left traces
      -0.6, 1.2, -0.05,  -0.3, 1.2, -0.05,
      -0.3, 1.2, -0.05,  -0.1, 0.9, -0.05,
      
      -0.5, 0.8, -0.05,  -0.2, 0.8, -0.05,
      -0.2, 0.8, -0.05,  -0.1, 0.6, -0.05,

      // Right traces
      0.6, 1.2, -0.05,   0.3, 1.2, -0.05,
      0.3, 1.2, -0.05,   0.1, 0.9, -0.05,

      0.5, 0.8, -0.05,   0.2, 0.8, -0.05,
      0.2, 0.8, -0.05,   0.1, 0.6, -0.05,

      // Bottom traces
      -0.6, -1.2, -0.05, -0.3, -1.2, -0.05,
      -0.3, -1.2, -0.05, -0.1, -0.9, -0.05,

      0.6, -1.2, -0.05,  0.3, -1.2, -0.05,
      0.3, -1.2, -0.05,  0.1, -0.9, -0.05,

      // Chip boundaries
      -0.15, -0.2, -0.05, 0.15, -0.2, -0.05,
      0.15, -0.2, -0.05,  0.15, 0.2, -0.05,
      0.15, 0.2, -0.05,  -0.15, 0.2, -0.05,
      -0.15, 0.2, -0.05, -0.15, -0.2, -0.05
    ]
    return new Float32Array(positions)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // A. Animate Phone Mesh Wave Telemetry Screen
    if (gridRef.current) {
      const geo = gridRef.current.geometry as THREE.PlaneGeometry
      const posAttr = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i)
        const vy = posAttr.getY(i)
        // 3D waves running through screen
        const z = Math.sin(vx * 4 + time * 2.5) * Math.cos(vy * 3 + time * 1.8) * 0.08
        posAttr.setZ(i, z)
      }
      posAttr.needsUpdate = true
    }

    // B. Floating HUD telemetry animations
    if (hudCircleRef.current) {
      hudCircleRef.current.rotation.z = -time * 0.4
      hudCircleRef.current.position.z = 0.35 + Math.sin(time * 2.2) * 0.03
    }

    if (hudLeftPanelRef.current) {
      hudLeftPanelRef.current.position.y = 0.6 + Math.sin(time * 1.8) * 0.04
      hudLeftPanelRef.current.position.z = 0.25 + Math.cos(time * 1.5) * 0.02
    }

    if (hudRightPanelRef.current) {
      hudRightPanelRef.current.position.y = -0.6 + Math.cos(time * 2.0) * 0.04
      hudRightPanelRef.current.position.z = 0.25 + Math.sin(time * 1.7) * 0.02
    }

    // C. Tilt phone group based on clock for passive floating rotation
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(time * 0.6) * 0.15
      phoneRef.current.rotation.x = Math.cos(time * 0.5) * 0.1
    }
  })

  return (
    <group ref={phoneRef}>
      {/* 📱 GLASSMORPHIC SMARTPHONE FRAME */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 3.4, 0.12]} />
        <meshPhysicalMaterial 
          color="#06060c" 
          roughness={0.2} 
          metalness={0.3} 
          transmission={0.7}
          thickness={1.2}
          transparent 
          opacity={0.5}
          depthWrite={false}
        />
        {/* Glowing Neon Outline Border */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.82, 3.42, 0.13)]} />
          <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.35} />
        </lineSegments>
      </mesh>

      {/* 🕸️ CIRCUITS INTEGRATION (Behind Screen) */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[circuitPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7F77DD" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* 📡 MOVING 3D TELEMETRY WAVE GRID SCREEN */}
      <mesh ref={gridRef} position={[0, 0, 0.07]}>
        <planeGeometry args={[1.65, 3.25, 16, 32]} />
        <meshStandardMaterial 
          color="#1D9E75" 
          wireframe={true} 
          transparent 
          opacity={0.5}
          emissive="#1D9E75"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* 🛸 HUD CENTRAL Telemetry Ring Constellation */}
      <group position={[0, 0, 0.35]} ref={hudCircleRef}>
        <mesh>
          <ringGeometry args={[0.45, 0.47, 64]} />
          <meshBasicMaterial color="#EF9F27" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.32, 0.33, 32]} />
          <meshBasicMaterial color="#7F77DD" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 🖥️ LEFT HUD PANEL */}
      <group ref={hudLeftPanelRef} position={[-1.3, 0.6, 0.25]}>
        {/* Panel outline */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.7, 0.9)]} />
          <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.4} />
        </lineSegments>
        {/* Floating details inside panel */}
        <mesh position={[-0.15, 0.25, 0]}>
          <planeGeometry args={[0.25, 0.05]} />
          <meshBasicMaterial color="#1D9E75" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.15, 0.1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#EF9F27" />
        </mesh>
        <mesh position={[-0.1, -0.15, 0]}>
          <planeGeometry args={[0.35, 0.02]} />
          <meshBasicMaterial color="#7F77DD" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 🖥️ RIGHT HUD PANEL */}
      <group ref={hudRightPanelRef} position={[1.3, -0.6, 0.25]}>
        {/* Panel outline */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.7, 0.9)]} />
          <lineBasicMaterial attach="material" color="#7F77DD" transparent opacity={0.4} />
        </lineSegments>
        {/* Floating details inside panel */}
        <mesh position={[0.15, 0.25, 0]}>
          <planeGeometry args={[0.25, 0.05]} />
          <meshBasicMaterial color="#7F77DD" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.15, 0.1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#1D9E75" />
        </mesh>
        <mesh position={[0.1, -0.15, 0]}>
          <planeGeometry args={[0.35, 0.02]} />
          <meshBasicMaterial color="#EF9F27" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 🔮 ORBITAL SATELLITES */}
      <group position={[0, 0, 0.1]}>
        <mesh position={[1.0, 1.3, 0.2]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-1.0, -1.1, 0.3]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.8, -0.7, 0.1]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#7F77DD" emissive="#7F77DD" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Ambient Particle Field */}
      <Sparkles count={45} scale={3.8} size={1.8} speed={0.8} color="#1D9E75" />
    </group>
  )
}

export default function StudioLab() {
  const { setCursorState } = useCursor()

  return (
    <section id="studio-lab" className="relative py-32 border-t border-[var(--color-space-border)] bg-[var(--color-space-black)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        05
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          3D Studio Lab
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          No solo programo interfaces —<br/>las diseño en 3D primero.
        </h2>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
          Blender es mi lienzo para el prototipado físico y visual de aplicaciones móviles. El resultado final son interfaces tridimensionales intuitivas y fluidas que los usuarios experimentan con un sentido de fisicalidad y tactilidad premium.
        </p>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* THREE.JS CANVAS: 6 cols */}
          <div 
            onMouseEnter={() => setCursorState('drag')}
            onMouseLeave={() => setCursorState('default')}
            className="lg:col-span-6 h-[500px] bg-[var(--color-deep-space)]/40 border border-[var(--color-space-border)] rounded-xl relative overflow-hidden group"
          >
            
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-ping"></span>
              <span className="font-space text-[10px] uppercase tracking-wider text-[var(--color-mist-gray)]">Render Virtual Interactivo (R3F)</span>
            </div>

            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} color="#1D9E75" intensity={1.8} />
              <pointLight position={[-10, -5, -5]} color="#7F77DD" intensity={1.2} />
              <pointLight position={[0, 0, 5]} color="#EF9F27" intensity={0.5} />
              
              <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
                <Floating3DMockup />
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} enableDamping={true} dampingFactor={0.05} rotateSpeed={0.7} />
            </Canvas>

            <div className="absolute bottom-4 right-4 z-20 text-right pointer-events-none">
              <span className="font-space text-[9px] text-[var(--color-mist-gray)]/40 block">INTERACT: CLICK & DRAG TO ROTATE</span>
            </div>
          </div>

          {/* COPY & CORE INFO: 6 cols */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="grid sm:grid-cols-2 gap-4">
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-surface p-6 hover:border-[var(--color-orbital-teal)]/20 transition-all duration-300"
              >
                <div className="p-3 bg-[var(--color-orbital-teal)]/10 text-[var(--color-orbital-teal)] rounded-lg w-fit mb-4">
                  <Smartphone size={20} />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">Prototipado Mobile</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  Modelado tridimensional de teléfonos robustos y pantallas para validar la ergonomía de botones táctiles amplios (56px) idóneos para uso industrial con guantes.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-surface p-6 hover:border-[var(--color-electric-purple)]/20 transition-all duration-300"
              >
                <div className="p-3 bg-[var(--color-electric-purple)]/10 text-[var(--color-electric-purple)] rounded-lg w-fit mb-4">
                  <Layers size={20} />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">Texturas Materialistas</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  Materiales físicos realistas y reflexivos en Blender para simular la textura de interfaces táctiles premium y hardware móvil de alta gama.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-surface p-6 hover:border-[var(--color-coral-burn)]/20 transition-all duration-300"
              >
                <div className="p-3 bg-[var(--color-coral-burn)]/10 text-[var(--color-coral-burn)] rounded-lg w-fit mb-4">
                  <Camera size={20} />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">Composición del Entorno</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  Estudio detallado de iluminación y sombras dinámicas HDRI que proyectan una sensación de profundidad cinemática antes de escribir una línea de código frontend.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="glass-surface p-6 hover:border-[var(--color-amber-gold)]/20 transition-all duration-300"
              >
                <div className="p-3 bg-[var(--color-amber-gold)]/10 text-[var(--color-amber-gold)] rounded-lg w-fit mb-4">
                  <Image size={20} />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">Exportación WebGL</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  Optimización de activos GLB exportados de Blender a menos de 1.5MB con compresión de malla Draco y WebGL para cargas web instantáneas de Awwwards-grade.
                </p>
              </motion.div>

            </div>

            <div className="glass-surface p-6 border-l-4 border-l-[var(--color-orbital-teal)]">
              <span className="font-mono text-xs text-white block mb-1">PRO-LEVEL HARDWARE INTEGRATION:</span>
              <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                "Cada aplicación móvil o SaaS industrial que construyo en Antigravity Studio pasa primero por un riguroso laboratorio 3D en Blender. El resultado: interfaces físicas que el usuario puede sentir con sus manos."
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
