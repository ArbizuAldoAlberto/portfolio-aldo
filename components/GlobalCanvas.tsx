/**
 * @file GlobalCanvas.tsx
 * @description Core 3D Scrollytelling Engine for the Elite Fusion Portfolio.
 * This component manages a dynamic 3D scene that reacts to user scroll progress,
 * symbolizing the fusion between Agriculture (Organic) and Technology (Technical).
 * 
 * DESIGN FRAMEWORK: UI-UX-PRO-MAX
 * ARTISTIC CONCEPT: "The Seed of Evolution"
 */

'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Environment, Stars, Icosahedron, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

/**
 * AgroTechObject: The main 3D entity that transforms based on scroll.
 * Uses a dual-layer approach: 
 * 1. An organic, distortable core (Agro).
 * 2. A rigid, technical wireframe shell (Tech).
 */
function AgroTechObject() {
  // Refs to access 3D objects directly without triggering React re-renders (Performance optimization)
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const wireMaterialRef = useRef<any>(null)

  // Viewport tracking for responsive positioning
  const { viewport } = useThree()
  const travelX = viewport.width * 0.35 // Horizontal travel distance relative to screen size

  // Brand Color Palette (High-vibrancy Neon)
  const colorAgro = new THREE.Color("#00ff88") // Neon Emerald (Land / Roots)
  const colorTech = new THREE.Color("#00ccff") // Electric Blue (Mobile / Code)
  const colorPulse = new THREE.Color("#ffffff") // White Spark (Innovation)

  /**
   * useFrame: The high-performance animation loop (running at 60-120fps).
   * This is where the magic happens: scroll data is translated into 3D transformations.
   */
  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current || !materialRef.current || !wireMaterialRef.current) return

    const t = state.clock.elapsedTime

    // 1. CALCULATE SCROLL PROGRESS (0 to 1)
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const p = maxScroll > 0 ? scrollY / maxScroll : 0

    // 2. BASE ROTATION (Constant movement for a "living" feel)
    meshRef.current.rotation.y = t * 0.4
    meshRef.current.rotation.z = t * 0.2
    wireframeRef.current.rotation.y = -t * 0.6
    wireframeRef.current.rotation.x = t * 0.3

    // 3. TARGET STATE INITIALIZATION
    let targetX = 0
    let targetY = 0
    let targetScale = 2.5
    let targetDistort = 0.5
    let targetWireOpacity = 0.4
    let targetColor = colorAgro.clone()
    let targetSpeed = 2

    /**
     * 4. SECTION-BASED LOGIC (The Narrative Flow)
     * Maps the scroll percentage (p) to specific 3D behaviors.
     */
    if (p < 0.20) {
      // --- STAGE 0: HERO (The Synthesis) ---
      targetX = 0
      targetScale = 2.5
      targetDistort = 0.5
      targetColor.lerpColors(colorAgro, colorTech, p * 5)
    }
    else if (p < 0.40) {
      // --- STAGE 1: SENTINEL (The Technical Audit) ---
      // Moves left to give space to the "Sentinel" showcase text.
      const localP = (p - 0.20) / 0.20
      targetX = THREE.MathUtils.lerp(0, -travelX, localP)
      targetScale = THREE.MathUtils.lerp(2.5, 1.2, localP)
      targetDistort = THREE.MathUtils.lerp(0.5, 0.05, localP) // Becomes more rigid/precise
      targetWireOpacity = THREE.MathUtils.lerp(0.4, 1.0, localP) // Technical grid becomes clear
      targetColor = colorTech
      targetSpeed = 4 // Higher frequency for data-feeling pulses
    }
    else if (p < 0.60) {
      // --- STAGE 2: WORKLINE (The Massive Growth) ---
      // Symbolizes the rapid expansion of skills and professional transition.
      const localP = (p - 0.40) / 0.20
      targetX = THREE.MathUtils.lerp(-travelX, travelX, localP)
      targetY = Math.sin(t * 2) * 1.5 // Active "searching" movement
      targetScale = THREE.MathUtils.lerp(1.2, 4.5, localP) // Becomes massive
      targetDistort = THREE.MathUtils.lerp(0.05, 1.2, localP) // High chaos/innovation
      targetWireOpacity = 0.6
      targetColor.lerpColors(colorTech, colorPulse, localP)
    }
    else if (p < 0.80) {
      // --- STAGE 3: ORIGIN STORY (The Deep Roots) ---
      // Returns to the land. Very organic and distorted.
      const localP = (p - 0.60) / 0.20
      targetX = THREE.MathUtils.lerp(travelX, 0, localP)
      targetScale = THREE.MathUtils.lerp(4.5, 2.0, localP)
      targetDistort = 1.5 // Maximum organic liquidity
      targetWireOpacity = 0.2
      targetColor = colorAgro
      targetSpeed = 1 // Slower, rhythmic pulses like a heartbeat
    }
    else {
      // --- STAGE 4: FOOTER (The Future Explosion) ---
      // The identity expands beyond the screen limits.
      const localP = (p - 0.80) / 0.20
      targetX = 0
      targetScale = THREE.MathUtils.lerp(2.0, 15, localP)
      targetDistort = 0.2
      targetWireOpacity = 0.1
      targetColor.lerpColors(colorAgro, colorTech, localP)
    }

    // 5. SMOOTH INTERPOLATION (Lerp)
    // Ensures transitions aren't jarring. Values move 10% towards target every frame.
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    wireframeRef.current.position.copy(meshRef.current.position)

    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    meshRef.current.scale.setScalar(newScale)
    wireframeRef.current.scale.setScalar(newScale * 1.2)

    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05)
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05)

    const currentColor = materialRef.current.color as THREE.Color
    currentColor.lerp(targetColor, 0.05)
    materialRef.current.emissive.copy(currentColor).multiplyScalar(2.0)

    wireMaterialRef.current.opacity = THREE.MathUtils.lerp(wireMaterialRef.current.opacity, targetWireOpacity, 0.05)
    wireMaterialRef.current.color.lerp(targetColor, 0.05)
  })

  return (
    <group>
      {/* 
          ORGANIC CORE: Représents the "Agro" side. 
          Uses a high-density sphere with a specialized Distortion Material.
      */}
      <mesh ref={meshRef}>
        <Sphere args={[1.5, 128, 128]}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#00ff88"
            speed={2}
            roughness={0.2}
            metalness={0.9}
            emissiveIntensity={2}
          />
        </Sphere>
      </mesh>

      {/* 
          TECHNICAL SHELL: Represents the "Tech" side.
          A complex icosahedron geometry rendered as a wireframe grid.
      */}
      <mesh ref={wireframeRef}>
        <Icosahedron args={[1.6, 3]}>
          <meshBasicMaterial
            ref={wireMaterialRef}
            wireframe
            transparent
            opacity={0.5}
            color="#00ccff"
          />
        </Icosahedron>
      </mesh>
    </group>
  )
}

/**
 * GlobalCanvas: The primary export component.
 * Sets up the WebGL scene, lighting, and environmental effects.
 */
export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Absolute dark background to make neon colors pop */}
        <color attach="background" args={['#020202']} />

        {/* Lights setup for volume and highlights */}
        <ambientLight intensity={0.6} />
        <spotLight position={[20, 20, 20]} intensity={10} color="#ffffff" />
        <pointLight position={[-20, -20, -20]} intensity={5} color="#00ff88" />

        {/* Environmental details */}
        <Environment preset="night" />
        <Stars radius={100} depth={50} count={7000} factor={6} saturation={1} fade speed={2} />

        {/* Float component adds a subtle secondary "antigravity" sway */}
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
          <AgroTechObject />
        </Float>
      </Canvas>
    </div>
  )
}
