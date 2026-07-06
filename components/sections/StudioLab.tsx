'use client'
import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles, useGLTF } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import { Camera, Image, Layers, Smartphone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCursor } from '../theme/CursorContext'
import { useSound } from '../theme/SoundManager'
import * as THREE from 'three'

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
  const radarRef = useRef<THREE.Mesh>(null)
  const siloRef = useRef<THREE.Mesh>(null)

  const phoneMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const { playClick, playBoot } = useSound()

  // Interactive phone states
  const [phoneStatus, setPhoneStatus] = useState<'sleep' | 'booting' | 'active'>('sleep')
  const [activeApp, setActiveApp] = useState<'menu' | 'sentinel' | 'techzone' | 'agro'>('menu')
  const [bootProgress, setBootProgress] = useState(0)

  // Procedural Monolithic Glass Slab (100% WebGL performance)
  // No GLTF loading needed.

  // GLTF traversal removed for procedural mesh

  // Handle boot timer
  useEffect(() => {
    let interval: any
    if (phoneStatus === 'booting') {
      setBootProgress(0)
      interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval)
            setPhoneStatus('active')
            setActiveApp('menu')
            return 1
          }
          return prev + 0.1
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [phoneStatus])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Pulse phone body reflections
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

    // Animate silo rotation in AgroMarket app screen
    if (siloRef.current) {
      siloRef.current.rotation.y = time * 0.4
    }

    // Pulse the main projection beam
    if (projectBeamRef.current) {
      const pulse = 0.85 + Math.sin(time * 6.0) * 0.15
      projectBeamRef.current.scale.set(pulse, 1, pulse)
      const mat = projectBeamRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.05 + Math.sin(time * 5.0) * 0.02
    }

    // Pulse radar ring inside Sentinel app
    if (radarRef.current) {
      const radarScale = 0.1 + (time % 1.5) * 0.6
      radarRef.current.scale.set(radarScale, radarScale, 1)
      const radarMat = radarRef.current.material as THREE.MeshBasicMaterial
      radarMat.opacity = 0.8 * (1.0 - (time % 1.5) / 1.5)
    }
  })

  // Boot device trigger
  const handleSleepClick = (e: any) => {
    e.stopPropagation()
    playBoot()
    setPhoneStatus('booting')
  }

  return (
    <group>
      {/* 📱 SMARTPHONE CHASSIS (Procedural Monolith) */}
      <group ref={phoneGroupRef}>
        <mesh position={[0, 0, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 3.8, 0.15]} />
          <meshPhysicalMaterial 
            color="#121217"
            roughness={0.08}
            metalness={0.95}
            emissive="#0a1d30"
            emissiveIntensity={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            reflectivity={1.0}
            envMapIntensity={2.0}
          />
        </mesh>
        
        {/* SCREEN CANVAS AREA */}
        <group position={[0, 0, 0.057]}>
          
          {/* --- PHONE STATE: SLEEP --- */}
          {phoneStatus === 'sleep' && (
            <mesh onClick={handleSleepClick} position={[0, 0, 0.005]}>
              <planeGeometry args={[1.8, 3.6]} />
              <meshBasicMaterial color="#020205" />
              {/* Pulse tap indicator */}
              <mesh position={[0, 0, 0.001]}>
                <ringGeometry args={[0.2, 0.22, 32]} />
                <meshBasicMaterial color="#1D9E75" transparent opacity={0.3} />
              </mesh>
            </mesh>
          )}

          {/* --- PHONE STATE: BOOTING --- */}
          {phoneStatus === 'booting' && (
            <group position={[0, 0, 0.005]}>
              {/* Screen Base */}
              <mesh>
                <planeGeometry args={[1.8, 3.6]} />
                <meshBasicMaterial color="#050508" />
              </mesh>

              {/* Progress Bar background */}
              <mesh position={[0, -0.2, 0.01]}>
                <planeGeometry args={[1.2, 0.06]} />
                <meshBasicMaterial color="#1a1a25" />
              </mesh>

              {/* Dynamic Progress Bar */}
              <mesh position={[-0.6 + (bootProgress * 0.6), -0.2, 0.015]} scale={[bootProgress, 1, 1]}>
                <planeGeometry args={[1.2, 0.06]} />
                <meshBasicMaterial color="#00FF66" />
              </mesh>

              {/* Micro diagnostic beeps/text boxes */}
              <mesh position={[0, 0.4, 0.01]}>
                <planeGeometry args={[1.0, 0.12]} />
                <meshBasicMaterial color="#00FF66" transparent opacity={0.1} />
              </mesh>
              <mesh position={[0, 0.1, 0.01]}>
                <planeGeometry args={[0.8, 0.08]} />
                <meshBasicMaterial color="#7F77DD" transparent opacity={0.1} />
              </mesh>
            </group>
          )}

          {/* --- PHONE STATE: ACTIVE --- */}
          {phoneStatus === 'active' && (
            <group position={[0, 0, 0.001]}>
              {/* Base active wallpaper */}
              <mesh>
                <planeGeometry args={[1.8, 3.6]} />
                <meshBasicMaterial color="#07070F" />
              </mesh>
              <gridHelper args={[1.8, 10, '#1D9E75', '#11151b']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.002]} />

              {/* APP VIEW: MENU */}
              {activeApp === 'menu' && (
                <group position={[0, 0, 0.01]}>
                  {/* APP 1: SentinelOS (Red) */}
                  <group position={[-0.45, 0.8, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('sentinel') }}>
                    <mesh>
                      <planeGeometry args={[0.35, 0.35]} />
                      <meshBasicMaterial color="#FF3C00" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.35, 0.35)]} />
                      <lineBasicMaterial attach="material" color="#FF3C00" />
                    </lineSegments>
                  </group>

                  {/* APP 2: TechZone (Teal) */}
                  <group position={[0.45, 0.8, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('techzone') }}>
                    <mesh>
                      <planeGeometry args={[0.35, 0.35]} />
                      <meshBasicMaterial color="#00FF66" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.35, 0.35)]} />
                      <lineBasicMaterial attach="material" color="#00FF66" />
                    </lineSegments>
                  </group>

                  {/* APP 3: AgroMarket (Gold) */}
                  <group position={[-0.45, 0.1, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('agro') }}>
                    <mesh>
                      <planeGeometry args={[0.35, 0.35]} />
                      <meshBasicMaterial color="#EF9F27" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.35, 0.35)]} />
                      <lineBasicMaterial attach="material" color="#EF9F27" />
                    </lineSegments>
                  </group>

                  {/* APP 4: Sleep/Lock (White) */}
                  <group position={[0.45, 0.1, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setPhoneStatus('sleep') }}>
                    <mesh>
                      <planeGeometry args={[0.35, 0.35]} />
                      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(0.35, 0.35)]} />
                      <lineBasicMaterial attach="material" color="#ffffff" />
                    </lineSegments>
                  </group>
                </group>
              )}

              {/* APP VIEW: SENTINELOS */}
              {activeApp === 'sentinel' && (
                <group position={[0, 0, 0.01]}>
                  {/* Title Bar */}
                  <mesh position={[0, 1.4, 0]}>
                    <planeGeometry args={[1.5, 0.3]} />
                    <meshBasicMaterial color="#FF3C00" transparent opacity={0.15} />
                  </mesh>

                  {/* Radar Scanning Ring */}
                  <group position={[0, 0.3, 0.01]}>
                    <mesh>
                      <circleGeometry args={[0.5, 32]} />
                      <meshBasicMaterial color="#FF3C00" transparent opacity={0.05} />
                    </mesh>
                    <mesh ref={radarRef}>
                      <ringGeometry args={[0.01, 0.5, 32]} />
                      <meshBasicMaterial color="#FF3C00" transparent />
                    </mesh>
                  </group>

                  {/* Telemetry data boxes */}
                  <mesh position={[0, -0.5, 0]}>
                    <planeGeometry args={[1.4, 0.5]} />
                    <meshBasicMaterial color="#1a0c0c" transparent opacity={0.7} />
                  </mesh>

                  {/* Back/Volver Button */}
                  <group position={[0, -1.3, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('menu') }}>
                    <mesh>
                      <planeGeometry args={[1.0, 0.3]} />
                      <meshBasicMaterial color="#555565" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.0, 0.3)]} />
                      <lineBasicMaterial attach="material" color="#ffffff" />
                    </lineSegments>
                  </group>
                </group>
              )}

              {/* APP VIEW: TECHZONE */}
              {activeApp === 'techzone' && (
                <group position={[0, 0, 0.01]}>
                  {/* Title Bar */}
                  <mesh position={[0, 1.4, 0]}>
                    <planeGeometry args={[1.5, 0.3]} />
                    <meshBasicMaterial color="#00FF66" transparent opacity={0.15} />
                  </mesh>

                  {/* Simulated cart items */}
                  {[-0.2, 0.2, 0.6].map((y, idx) => (
                    <mesh key={idx} position={[0, y, 0.01]}>
                      <planeGeometry args={[1.4, 0.22]} />
                      <meshBasicMaterial color="#092212" transparent opacity={0.6} />
                    </mesh>
                  ))}

                  {/* Blinking sync indicator */}
                  <mesh position={[0, -0.6, 0.01]}>
                    <planeGeometry args={[1.0, 0.2]} />
                    <meshBasicMaterial color="#00FF66" transparent opacity={0.08} />
                  </mesh>

                  {/* Back/Volver Button */}
                  <group position={[0, -1.3, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('menu') }}>
                    <mesh>
                      <planeGeometry args={[1.0, 0.3]} />
                      <meshBasicMaterial color="#555565" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.0, 0.3)]} />
                      <lineBasicMaterial attach="material" color="#ffffff" />
                    </lineSegments>
                  </group>
                </group>
              )}

              {/* APP VIEW: AGROMARKET */}
              {activeApp === 'agro' && (
                <group position={[0, 0, 0.01]}>
                  {/* Title Bar */}
                  <mesh position={[0, 1.4, 0]}>
                    <planeGeometry args={[1.5, 0.3]} />
                    <meshBasicMaterial color="#EF9F27" transparent opacity={0.15} />
                  </mesh>

                  {/* Wireframe Cylinder silo-simulator */}
                  <mesh ref={siloRef} position={[0, 0.2, 0.01]} rotation={[0.4, 0, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.8, 12, 4, true]} />
                    <meshBasicMaterial color="#EF9F27" wireframe />
                  </mesh>

                  {/* Metric display box */}
                  <mesh position={[0, -0.6, 0.01]}>
                    <planeGeometry args={[1.4, 0.35]} />
                    <meshBasicMaterial color="#201809" transparent opacity={0.7} />
                  </mesh>

                  {/* Back/Volver Button */}
                  <group position={[0, -1.3, 0]} onClick={(e) => { e.stopPropagation(); playClick(); setActiveApp('menu') }}>
                    <mesh>
                      <planeGeometry args={[1.0, 0.3]} />
                      <meshBasicMaterial color="#555565" transparent opacity={0.2} />
                    </mesh>
                    <lineSegments>
                      <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.0, 0.3)]} />
                      <lineBasicMaterial attach="material" color="#ffffff" />
                    </lineSegments>
                  </group>
                </group>
              )}

            </group>
          )}

        </group>

        {/* PROJECTOR BEAM */}
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

        {/* HOLOGRAPHIC PROJECTIONS (EMERGING LAYERS - ONLY RENDERED ON ACTIVE MENU OR APPS) */}
        {phoneStatus === 'active' && (
          <>
            {/* LAYER 1: BLUEPRINT */}
            <group ref={panel1Ref} position={[0, 0, 0.35]}>
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
              <lineSegments>
                <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.5, 3.2)]} />
                <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
              </lineSegments>

              {/* Wireframe widgets */}
              <mesh position={[0, 1.2, 0.01]}>
                <planeGeometry args={[1.2, 0.4]} />
                <meshBasicMaterial color="#1D9E75" transparent opacity={0.2} />
              </mesh>
              <lineSegments position={[0, 1.2, 0.015]}>
                <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1.2, 0.4)]} />
                <lineBasicMaterial attach="material" color="#1D9E75" transparent opacity={0.4} />
              </lineSegments>
            </group>

            {/* LAYER 2: CHART */}
            <group ref={panel2Ref} position={[0, 0, 0.75]}>
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
            </group>

            {/* LAYER 3: 3D MODEL CORE */}
            <group ref={panel3Ref} position={[0, 0, 1.25]}>
              <mesh>
                <ringGeometry args={[0.8, 0.82, 32]} />
                <meshBasicMaterial color="#EF9F27" transparent opacity={0.4} side={THREE.DoubleSide} />
              </mesh>
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
              </group>
              <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.65, 0.015, 8, 48]} />
                <meshBasicMaterial color="#EF9F27" />
              </mesh>
            </group>
          </>
        )}

        {/* CORNER CONNECTING BEAMS */}
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

        {/* SPARKLES */}
        <Sparkles count={45} scale={[1.6, 3.4, 1.2]} size={1.4} speed={0.9} color="#1D9E75" position={[0, 0, 0.7]} />
        <Sparkles count={25} scale={[1.4, 3.0, 1.2]} size={1.1} speed={1.2} color="#7F77DD" position={[0, 0, 0.7]} />
      </group>
    </group>
  )
}

export default function StudioLab() {
  const { setCursorState } = useCursor()
  const t = useTranslations('StudioLab')
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { margin: "200px 0px" })

  return (
    <section id="studio-lab" className="relative py-32 border-t border-[var(--color-space-border)] bg-[var(--color-space-black)]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none">
          {t('sectionLabel')}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          {t('titleLine1')}<br/>{t('titleLine2')}
        </h2>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
          {t.rich('desc', { strong: (chunks) => <strong>{chunks}</strong> })}
        </p>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* THREE.JS CANVAS: 6 cols */}
          <div 
            ref={containerRef}
            onMouseEnter={() => setCursorState('drag')}
            onMouseLeave={() => setCursorState('default')}
            className="lg:col-span-6 h-[500px] bg-[var(--color-deep-space)]/40 border border-[var(--color-space-border)] rounded-xl relative overflow-hidden group"
          >
            
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 select-none">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-ping"></span>
              <span className="font-space text-[10px] uppercase tracking-wider text-[var(--color-mist-gray)]">{t('emulator')}</span>
            </div>

            <Canvas frameloop={isInView ? 'always' : 'never'} camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
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

            <div className="absolute bottom-4 right-4 z-20 text-right pointer-events-none select-none">
              <span className="font-space text-[9px] text-[var(--color-mist-gray)]/40 block">{t('emulatorHint')}</span>
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
                <h3 className="font-serif text-lg text-white mb-2">{t('features.mobile.title')}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  {t('features.mobile.desc')}
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
                <h3 className="font-serif text-lg text-white mb-2">{t('features.textures.title')}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  {t('features.textures.desc')}
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
                <h3 className="font-serif text-lg text-white mb-2">{t('features.lighting.title')}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  {t('features.lighting.desc')}
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
                <h3 className="font-serif text-lg text-white mb-2">{t('features.reconstruction.title')}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                  {t('features.reconstruction.desc')}
                </p>
              </motion.div>

            </div>

            <div className="glass-surface p-6 border-l-4 border-l-[var(--color-orbital-teal)]">
              <span className="font-mono text-xs text-white block mb-1">{t('pipelineLabel')}</span>
              <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                {t('pipelineDesc')}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
