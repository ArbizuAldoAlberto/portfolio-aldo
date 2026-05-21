'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Camera, Image, Layers, Smartphone } from 'lucide-react'
import { useCursor } from '../theme/CursorContext'

// Interactive ThreeJS Centerpiece Component representing the 3D phone model and abstract telemetry
function Floating3DMockup() {
  return (
    <group>
      {/* 3D Smartphone Frame Mockup */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 3.4, 0.15]} />
        <meshStandardMaterial 
          color="#111118" 
          roughness={0.2} 
          metalness={0.9} 
          transparent 
          opacity={0.8}
          border-width={1}
        />
      </mesh>

      {/* Holographic Glowing Screen */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.6, 3.2]} />
        <MeshDistortMaterial
          color="#1D9E75"
          attach="material"
          distort={0.15}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Screen Orbit Wireframe Satellites */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1.5, 3.1]} />
        <meshStandardMaterial 
          color="#7F77DD" 
          wireframe={true} 
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Orbital Floating Spheres */}
      <group position={[0, 0, 0.2]}>
        <mesh position={[0.8, 1.2, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#EF9F27" />
        </mesh>
        <mesh position={[-0.8, -1.0, 0.4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#1D9E75" />
        </mesh>
        <mesh position={[0.6, -0.6, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#7F77DD" />
        </mesh>
      </group>

      {/* Ambient Particle Field */}
      <Sparkles count={40} scale={3.5} size={1.5} speed={0.6} color="#1D9E75" />
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
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
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
