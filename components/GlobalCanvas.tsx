'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Environment, Stars } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function ScrollytellingCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  
  // 1. OPTIMIZACIÓN RESPONSIVA: Adaptamos la distancia de viaje al tamaño de pantalla.
  const { viewport } = useThree()
  const travelX = viewport.width * 0.25 // El objeto viaja el 25% del ancho de la pantalla

  // Colores para cada sección
  const colorHero = new THREE.Color("#1D9E75") // Teal (Inicio)
  const colorOffline = new THREE.Color("#7F77DD") // Purple (Sólido)
  const colorWeb3 = new THREE.Color("#FFB800") // Oro (Líquido/Volátil)
  const colorContact = new THREE.Color("#ffffff") // Blanco puro (Energía)

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    const t = state.clock.elapsedTime
    
    // Obtener progreso de scroll normalizado (0 a 1)
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const p = maxScroll > 0 ? scrollY / maxScroll : 0

    // Rotación base continua
    meshRef.current.rotation.y = t * 0.2
    meshRef.current.rotation.x = t * 0.1

    let targetX = 0
    let targetY = 0
    let targetScale = 1
    let targetDistort = 0.3
    let targetSpeed = 2
    let targetColor = colorHero.clone()

    if (p < 0.25) {
      // 0. HERO (0% - 25%): Centro de la pantalla
      const localP = p / 0.25
      targetX = 0
      targetScale = 1
      targetDistort = 0.3
      targetColor.lerpColors(colorHero, colorOffline, localP)

    } else if (p < 0.5) {
      // 1. MANIFESTO (25% - 50%): Viaja a la DERECHA dinámicamente
      const localP = (p - 0.25) / 0.25
      targetX = THREE.MathUtils.lerp(0, travelX, localP)
      targetScale = THREE.MathUtils.lerp(1, 0.7, localP)
      targetDistort = THREE.MathUtils.lerp(0.3, 0.05, localP)
      targetSpeed = 1
      targetColor.lerpColors(colorOffline, colorWeb3, localP)

    } else if (p < 0.75) {
      // 2. MISIONES (50% - 75%): Cruza a la IZQUIERDA dinámicamente
      const localP = (p - 0.5) / 0.25
      targetX = THREE.MathUtils.lerp(travelX, -travelX, localP)
      targetScale = THREE.MathUtils.lerp(0.7, 1.2, localP)
      targetDistort = THREE.MathUtils.lerp(0.05, 0.7, localP)
      targetSpeed = 6
      targetColor.lerpColors(colorWeb3, colorContact, localP)

    } else {
      // 3. CONTACTO (75% - 100%): Regresa al CENTRO y explota
      const localP = (p - 0.75) / 0.25
      targetX = THREE.MathUtils.lerp(-travelX, 0, localP)
      targetScale = THREE.MathUtils.lerp(1.2, 3.5, localP)
      targetDistort = THREE.MathUtils.lerp(0.7, 0.2, localP)
      targetSpeed = 3
      targetColor = colorContact
    }

    // Interpolación de físicas suavizadas
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    
    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    meshRef.current.scale.setScalar(newScale)

    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05)
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05)
    
    const currentColor = materialRef.current.color as THREE.Color
    currentColor.lerp(targetColor, 0.05)
    materialRef.current.emissive.copy(currentColor)
  })

  return (
    <mesh ref={meshRef}>
      {/* 2. OPTIMIZACIÓN DE RENDIMIENTO: 64x64 vértices (Caída de polígonos sin pérdida visual, fluido en celulares) */}
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#1D9E75"
          emissive="#1D9E75"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </mesh>
  )
}

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} intensity={3} color="#ffffff" angle={0.5} penumbra={1} />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#7F77DD" />

        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1} />
        
        <ScrollytellingCore />
      </Canvas>
    </div>
  )
}
