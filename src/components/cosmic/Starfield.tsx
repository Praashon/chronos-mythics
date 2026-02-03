'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

// Generate random points in a sphere
function generateStarPositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random()) // Cube root for uniform distribution
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

// Star field that slowly rotates
function Stars({ count = 5000, radius = 50 }) {
  const ref = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => generateStarPositions(count, radius), [count, radius])
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.01
      ref.current.rotation.y += delta * 0.015
    }
  })
  
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Distant nebula clouds
function NebulaCloud({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const ref = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => generateStarPositions(500, 10 * scale), [scale])
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.02
    }
  })
  
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Points ref={ref} positions={positions} stride={3} position={position}>
        <PointMaterial
          transparent
          color={color}
          size={0.3}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </Float>
  )
}

// Animated constellation lines
function ConstellationLines() {
  const ref = useRef<THREE.LineSegments>(null)
  
  const [positions, colors] = useMemo(() => {
    const points: number[] = []
    const cols: number[] = []
    
    // Create some random constellation-like lines
    for (let i = 0; i < 30; i++) {
      const x1 = (Math.random() - 0.5) * 40
      const y1 = (Math.random() - 0.5) * 40
      const z1 = (Math.random() - 0.5) * 20
      
      const x2 = x1 + (Math.random() - 0.5) * 10
      const y2 = y1 + (Math.random() - 0.5) * 10
      const z2 = z1 + (Math.random() - 0.5) * 5
      
      points.push(x1, y1, z1, x2, y2, z2)
      
      // Blue to violet gradient
      const t = Math.random()
      cols.push(
        0.23 + t * 0.32, 0.51 - t * 0.15, 0.96 - t * 0.1, // Start color
        0.54 + t * 0.1, 0.36 + t * 0.2, 0.96, // End color
      )
    }
    
    return [new Float32Array(points), new Float32Array(cols)]
  }, [])
  
  useFrame((state) => {
    if (ref.current && ref.current.material instanceof THREE.LineBasicMaterial) {
      ref.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        transparent
        opacity={0.15}
        color="#8b5cf6"
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// Main cosmic scene
function CosmicScene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />
      
      {/* Main star field */}
      <Stars count={8000} radius={100} />
      
      {/* Closer stars for depth */}
      <Stars count={2000} radius={30} />
      
      {/* Nebula clouds */}
      <NebulaCloud position={[-30, 20, -50]} color="#8b5cf6" scale={2} />
      <NebulaCloud position={[40, -15, -40]} color="#3b82f6" scale={1.5} />
      <NebulaCloud position={[0, -30, -60]} color="#fbbf24" scale={1} />
      
      {/* Constellation lines */}
      <ConstellationLines />
    </>
  )
}

// Exported component
export default function Starfield() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a0f 50%, #0f0f14 100%)' }}
        dpr={[1, 2]}
      >
        <CosmicScene />
      </Canvas>
    </div>
  )
}
