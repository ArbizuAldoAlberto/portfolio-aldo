'use client'
import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, RoundedBox, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Camera, Image, Layers, Smartphone } from 'lucide-react'
import { useCursor } from '../theme/CursorContext'
import * as THREE from 'three'

// Interactive ThreeJS Centerpiece Component representing the 3D phone model and abstract telemetry
// Interactive ThreeJS centerpiece representing the Pixal3D Neural Scanner & Blender Reconstructor
interface BarProps {
  position: [number, number, number]
  color: string
  emissive: string
  index: number
}

function HolographicBar({ position, color, emissive, index }: BarProps) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const offset = index * 0.4
    const s = 1.0 + Math.sin(time * 3.0 + offset) * 0.45
    if (ref.current) {
      ref.current.scale.set(1, s, 1)
      ref.current.position.y = position[1] + (s * 0.15) - 0.15
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.15, 0.3, 0.15]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8} 
        transparent 
        opacity={0.8}
        emissive={emissive}
      />
    </mesh>
  )
}

function HolographicPhoneCore() {
  const phoneGroupRef = useRef<THREE.Group>(null)
  const panel1Ref = useRef<THREE.Group>(null)
  const panel2Ref = useRef<THREE.Group>(null)
  const panel3Ref = useRef<THREE.Group>(null)
  const coreGroupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const projectBeamRef = useRef<THREE.Mesh>(null)

  const phoneMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Load Hunyuan3D-2 generated smartphone model
  const { scene: phoneScene } = useGLTF('/models/phone.glb')

  useEffect(() => {
    phoneScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        // Apply premium dark chrome smartphone material
        const mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#121217'),
          roughness: 0.08,
          metalness: 0.95,
          emissive: new THREE.Color('#0a1d30'),
          emissiveIntensity: 0.3,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0,
          envMapIntensity: 2.0,
        })
        child.material = mat
        phoneMaterialRef.current = mat
      }
    })
  }, [phoneScene])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Pulse phone body reflections dynamically
    if (phoneMaterialRef.current) {
      phoneMaterialRef.current.emissiveIntensity = 0.2 + Math.sin(time * 1.5) * 0.15
    }

    // 1. Slow, premium phone idle float and tilt rotation
    if (phoneGroupRef.current) {
      phoneGroupRef.current.rotation.x = -0.45 + Math.sin(time * 0.4) * 0.05
      phoneGroupRef.current.rotation.y = 0.35 + Math.cos(time * 0.35) * 0.04
      phoneGroupRef.current.rotation.z = 0.12 + Math.sin(time * 0.3) * 0.02
      phoneGroupRef.current.position.y = Math.sin(time * 0.8) * 0.08
    }

    // 2. Animate floating panels (emerging from screen along local Z axis)
    if (panel1Ref.current) {
      panel1Ref.current.position.z = 0.35 + Math.sin(time * 1.5) * 0.03
      panel1Ref.current.position.y = Math.cos(time * 1.0) * 0.02
    }

    if (panel2Ref.current) {
      panel2Ref.current.position.z = 0.75 + Math.cos(time * 1.2) * 0.04
      panel2Ref.current.position.y = Math.sin(time * 1.1) * 0.03
    }

    if (panel3Ref.current) {
      panel3Ref.current.position.z = 1.25 + Math.sin(time * 1.8) * 0.05
      panel3Ref.current.position.x = Math.sin(time * 0.8) * 0.04
      
      if (coreGroupRef.current) {
        coreGroupRef.current.rotation.y = time * 0.8
        coreGroupRef.current.rotation.x = time * 0.4
      }
      if (ringRef.current) {
        ringRef.current.rotation.z = -time * 1.2
        ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
      }
    }

    // 3. Pulse the main projection beam
    if (projectBeamRef.current) {
      const pulse = 0.85 + Math.sin(time * 6.0) * 0.15
      projectBeamRef.current.scale.set(pulse, 1, pulse)
      const mat = projectBeamRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.05 + Math.sin(time * 5.0) * 0.02
    }
  })

  return (
    <group>
      {/* 📱 SMARTPHONE CHASSIS */}
      <group ref={phoneGroupRef}>
        {/* Render the generated Pixal3D GLB smartphone model */}
        <primitive object={phoneScene} scale={[2.4, 2.4, 2.4]} position={[0, 0, -0.1]} rotation={[0, 0, 0]} />
        
        {/* Screen Interface elements (wallpaper or static UI glowing components) */}
        <group position={[0, 0, 0.057]}>
          {/* Glow grid layout */}
          <gridHelper args={[1.8, 10, '#1D9E75', '#161d1a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.001]} />
          
          {/* Status indicators */}
          <mesh position={[-0.7, 1.65, 0.001]}>
            <planeGeometry args={[0.15, 0.03]} />
            <meshBasicMaterial color="#7f7f8f" />
          </mesh>
          <mesh position={[0.7, 1.65, 0.001]}>
            <planeGeometry args={[0.12, 0.04]} />
            <meshBasicMaterial color="#1D9E75" />
          </mesh>

          {/* Home Screen App Grid (circular glowing badges) */}
          {[-0.5, 0, 0.5].map((x, idx) => (
            [0.8, 0.2, -0.4, -1.0].map((y, idy) => (
              <mesh key={`${idx}-${idy}`} position={[x, y, 0.001]}>
                <circleGeometry args={[0.12, 16]} />
                <meshBasicMaterial 
                  color={idx === 0 ? "#1D9E75" : idx === 1 ? "#7F77DD" : "#EF9F27"} 
                  transparent 
                  opacity={0.35} 
                />
              </mesh>
            ))
          ))}
        </group>

        {/* 📐 VOLUMETRIC PROJECTOR BEAM */}
        {/* Conical light beam emerging from screen */}
        <mesh ref={projectBeamRef} position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.1, 0.7, 1.3, 32, 1, true]} />
          <meshBasicMaterial 
            color="#1D9E75" 
            transparent 
            opacity={0.06} 
            side={THREE.DoubleSide} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 🚀 HOLOGRAPHIC PROJECTIONS (EMERGING LAYERS) */}
        
        {/* --- LAYER 1: WIREFRAME APP UX BLUEPRINT --- */}
        <group ref={panel1Ref} position={[0, 0, 0.35]}>
          {/* Transparent glassmorphic panel */}
          <mesh>
            <planeGeometry args={[1.5, 3.2]} />
            <meshPhysicalMaterial 
              color="#0b1b17" 
              transparent 
              opacity={0.2} 
              roughness={0.2} 
              transmission={0.8}
              depthWrite={false}
            />
          </mesh>
          {/* Glow Border */}
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.5, 3.2)]} />
            <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
          </lineSegments>

          {/* UI Layout Blueprint Elements */}
          {/* Top Header Card */}
          <mesh position={[0, 1.2, 0.01]}>
            <planeGeometry args={[1.2, 0.4]} />
            <meshBasicMaterial color="#1D9E75" transparent opacity={0.2} />
          </mesh>
          <lineSegments position={[0, 1.2, 0.015]}>
            <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.2, 0.4)]} />
            <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.4} />
          </lineSegments>
          
          {/* Mid Hero Section Grid */}
          <mesh position={[0, 0.2, 0.01]}>
            <planeGeometry args={[1.2, 1.0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
          </mesh>
          <lineSegments position={[0, 0.2, 0.015]}>
            <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.2, 1.0)]} />
            <lineBasicMaterial attach="material" color="#7F77DD" transparent opacity={0.3} />
          </lineSegments>
          
          {/* Circular Button wireframes */}
          {[-0.4, 0, 0.4].map((x, i) => (
            <group key={i} position={[x, -0.6, 0.01]}>
              <mesh>
                <ringGeometry args={[0.11, 0.12, 32]} />
                <meshBasicMaterial color="#EF9F27" transparent opacity={0.6} />
              </mesh>
              <mesh>
                <circleGeometry args={[0.1, 16]} />
                <meshBasicMaterial color="#EF9F27" transparent opacity={0.15} />
              </mesh>
            </group>
          ))}

          {/* Text lines (simulated) */}
          {[-1.0, -1.2, -1.4].map((y, i) => (
            <mesh key={i} position={[0, y, 0.01]}>
              <planeGeometry args={[1.2, 0.05]} />
              <meshBasicMaterial color="#1D9E75" transparent opacity={0.25} />
            </mesh>
          ))}
        </group>

        {/* --- LAYER 2: 3D DATA / APP ANALYTICS PANEL --- */}
        <group ref={panel2Ref} position={[0, 0, 0.75]}>
          {/* Transparent panel */}
          <mesh>
            <planeGeometry args={[1.3, 2.8]} />
            <meshPhysicalMaterial 
              color="#0f0f1d" 
              transparent 
              opacity={0.3} 
              roughness={0.1} 
              transmission={0.8}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.3, 2.8)]} />
            <lineBasicMaterial attach="material" color="#7F77DD" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
          </lineSegments>

          {/* Dashboard 3D Bar Chart Emergence */}
          <group position={[0, -0.3, 0.02]} rotation={[0.4, -0.2, 0]}>
            {[-0.3, 0, 0.3].map((x, ix) => (
              [-0.3, 0, 0.3].map((y, iy) => (
                <HolographicBar
                  key={`${ix}-${iy}`}
                  position={[x, y, 0]}
                  color={ix % 2 === 0 ? "#7F77DD" : "#1D9E75"}
                  emissive={ix % 2 === 0 ? "#251240" : "#082d22"}
                  index={ix * 3 + iy}
                />
              ))
            ))}
          </group>

          {/* Small floating HUD UI metrics */}
          <group position={[0, 0.8, 0.02]}>
            <mesh position={[0, 0.2, 0]}>
              <planeGeometry args={[1.0, 0.3]} />
              <meshBasicMaterial color="#7F77DD" transparent opacity={0.15} />
            </mesh>
            <lineSegments position={[0, 0.2, 0.005]}>
              <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.0, 0.3)]} />
              <lineBasicMaterial attach="material" color="#7F77DD" transparent opacity={0.4} />
            </lineSegments>
            <mesh position={[-0.35, 0.2, 0.01]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#EF9F27" />
            </mesh>
          </group>
        </group>

        {/* --- LAYER 3: 3D OPTIMIZED MODEL CORE (THE BLENDER / PIXAL3D ASSET) --- */}
        <group ref={panel3Ref} position={[0, 0, 1.25]}>
          {/* Stylized wireframe backboard */}
          <mesh>
            <ringGeometry args={[0.8, 0.82, 32]} />
            <meshBasicMaterial color="#EF9F27" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.9, 0.91, 6]} />
            <meshBasicMaterial color="#7F77DD" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>

          {/* The 3D optimized model inside the hologram */}
          <group ref={coreGroupRef}>
            <mesh castShadow>
              <icosahedronGeometry args={[0.42, 1]} />
              <meshPhysicalMaterial 
                color="#EF9F27" 
                metalness={0.9} 
                roughness={0.1}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                transmission={0.4}
                thickness={0.5}
                emissive="#382202"
              />
            </mesh>
            
            <mesh>
              <icosahedronGeometry args={[0.43, 1]} />
              <meshBasicMaterial 
                color="#ffffff" 
                wireframe={true} 
                transparent 
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>

          {/* Telemetry Ring orbiting the asset */}
          <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.65, 0.015, 8, 48]} />
            <meshBasicMaterial color="#EF9F27" />
          </mesh>

          {/* Small digital crosshair pointers */}
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
            <mesh key={i} position={[Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#1D9E75" />
            </mesh>
          ))}
        </group>

        {/* 🕸️ TELEMETRY CORNER LIGHT BEAMS */}
        {useMemo(() => {
          const cScreen = [
            new THREE.Vector3(-0.94, -1.94, 0.06),
            new THREE.Vector3(0.94, -1.94, 0.06),
            new THREE.Vector3(0.94, 1.94, 0.06),
            new THREE.Vector3(-0.94, 1.94, 0.06)
          ]
          const cPanel = [
            new THREE.Vector3(-0.75, -1.6, 0.35),
            new THREE.Vector3(0.75, -1.6, 0.35),
            new THREE.Vector3(0.75, 1.6, 0.35),
            new THREE.Vector3(-0.75, 1.6, 0.35)
          ]
          return cScreen.map((screenPt, idx) => ({ from: screenPt, to: cPanel[idx] }))
        }, []).map((line, i) => {
          const dir = new THREE.Vector3().subVectors(line.to, line.from)
          const len = dir.length()
          const mid = new THREE.Vector3().addVectors(line.from, line.to).multiplyScalar(0.5)
          const up = new THREE.Vector3(0, 1, 0)
          const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize())
          return (
            <mesh key={i} position={mid} quaternion={quat}>
              <cylinderGeometry args={[0.006, 0.006, len, 4]} />
              <meshBasicMaterial color="#1D9E75" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>
          )
        })}

        {/* ✨ DATA PARTICLES EMERGING FROM THE PHONE */}
        <Sparkles count={45} scale={[1.6, 3.4, 1.2]} size={1.4} speed={0.9} color="#1D9E75" position={[0, 0, 0.7]} />
        <Sparkles count={25} scale={[1.4, 3.0, 1.2]} size={1.1} speed={1.2} color="#7F77DD" position={[0, 0, 0.7]} />
      </group>
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
          Combino la potencia de la IA generativa 3D de <strong>Pixal3D</strong> (DinoV3 y MoGe-2) con el modelado tradicional en <strong>Blender</strong>. Reconstruyo assets fotorrealistas en segundos y luego los optimizo poligonalmente para crear experiencias WebGL interactivas, fluidas y ultraligeras.
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
              
              <Suspense fallback={null}>
                <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.4}>
                  <HolographicPhoneCore />
                </Float>
              </Suspense>
              
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
                <h3 className="font-serif text-lg text-white mb-2">Reconstrucción Pixal3D</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  Generación automatizada de mallas 3D de alta densidad con Pixal3D, seguida de una retopología controlada en Blender y compresión Draco para integraciones web instantáneas.
                </p>
              </motion.div>

            </div>

            <div className="glass-surface p-6 border-l-4 border-l-[var(--color-orbital-teal)]">
              <span className="font-mono text-xs text-white block mb-1">IA-ASSISTED 3D PIPELINE:</span>
              <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                "La sinergia entre la generación neuronal con Pixal3D y la optimización en Blender redefine los tiempos de desarrollo. Assets complejos que antes tomaban días, ahora se reconstruyen y pulen en minutos."
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
