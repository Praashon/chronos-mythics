'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useAppStore } from '@/stores/useAppStore'
import { format } from 'date-fns'
import type { ConstellationStar, Memory } from '@/types/database'
import { Plus, X } from 'lucide-react'
import Button from '@/components/ui/Button'

// Individual star component
function Star({ 
  star, 
  onClick,
  isSelected 
}: { 
  star: ConstellationStar
  onClick: () => void
  isSelected: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Get emotion color or default
  const color = useMemo(() => {
    // Map emotion to color based on ID or use default golden color
    const colors = ['#fbbf24', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#ef4444']
    const index = parseInt(star.emotion_id?.slice(-1) || '0', 16) % colors.length
    return colors[index]
  }, [star.emotion_id])
  
  useFrame((state) => {
    if (ref.current) {
      // Gentle floating animation
      ref.current.position.y = star.y_pos + Math.sin(state.clock.elapsedTime * 0.5 + star.x_pos) * 0.1
      
      // Scale on hover/select
      const targetScale = hovered || isSelected ? 1.5 : 1
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={ref}
        position={[star.x_pos, star.y_pos, star.z_pos]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15 * star.brightness, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[star.x_pos, star.y_pos, star.z_pos]}>
        <sphereGeometry args={[0.3 * star.brightness, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2}
        />
      </mesh>
    </Float>
  )
}

// Constellation lines between stars
function ConstellationLines({ stars }: { stars: ConstellationStar[] }) {
  const lineRef = useRef<THREE.LineSegments>(null)
  
  const positions = useMemo(() => {
    const points: number[] = []
    
    // Connect nearby stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x_pos - stars[j].x_pos
        const dy = stars[i].y_pos - stars[j].y_pos
        const dz = stars[i].z_pos - stars[j].z_pos
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Connect if close enough
        if (distance < 5) {
          points.push(
            stars[i].x_pos, stars[i].y_pos, stars[i].z_pos,
            stars[j].x_pos, stars[j].y_pos, stars[j].z_pos
          )
        }
      }
    }
    
    return new Float32Array(points)
  }, [stars])
  
  useFrame((state) => {
    if (lineRef.current?.material instanceof THREE.LineBasicMaterial) {
      lineRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  if (positions.length === 0) return null
  
  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()
  
  useFrame((state) => {
    // Slow camera rotation
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 2
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.03) * 1
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// The 3D constellation scene
function ConstellationScene({ 
  stars, 
  selectedStar,
  onSelectStar 
}: { 
  stars: ConstellationStar[]
  selectedStar: ConstellationStar | null
  onSelectStar: (star: ConstellationStar | null) => void
}) {
  return (
    <>
      <CameraController />
      <ambientLight intensity={0.1} />
      
      <ConstellationLines stars={stars} />
      
      {stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          isSelected={selectedStar?.id === star.id}
          onClick={() => onSelectStar(selectedStar?.id === star.id ? null : star)}
        />
      ))}
    </>
  )
}

// Memory detail panel
function MemoryPanel({ 
  memory, 
  onClose 
}: { 
  memory: Memory | null
  onClose: () => void
}) {
  if (!memory) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-24 right-4 w-96 max-w-[calc(100%-2rem)] glass rounded-2xl p-6 z-10"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/5 transition-colors"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
      
      <div className="pr-8">
        <p className="text-sm text-[#fbbf24] mb-2">
          {format(new Date(memory.memory_date), 'MMMM d, yyyy')}
        </p>
        <h3 className="text-xl font-semibold text-white mb-3">
          {memory.title}
        </h3>
        
        {memory.description && (
          <p className="text-gray-400 mb-4">
            {memory.description}
          </p>
        )}
        
        {memory.mythic_prose && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-[#8b5cf6] mb-2 font-medium">Mythic Translation</p>
            <p className="text-gray-300 leading-relaxed italic">
              {memory.mythic_prose}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Main Cosmic Overview component
export default function CosmicOverview() {
  const { stars, memories, selectedStar, setSelectedStar, toggleAddMemory } = useAppStore()
  
  // Find memory for selected star
  const selectedMemory = useMemo(() => {
    if (!selectedStar?.memory_id) return null
    return memories.find(m => m.id === selectedStar.memory_id) || null
  }, [selectedStar, memories])
  
  return (
    <div className="relative h-[calc(100vh-5rem)]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ConstellationScene
          stars={stars}
          selectedStar={selectedStar}
          onSelectStar={setSelectedStar}
        />
      </Canvas>
      
      {/* Empty state */}
      {stars.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-4 pointer-events-auto"
          >
            <div className="w-20 h-20 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-[#8b5cf6]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Your Cosmos Awaits
            </h2>
            <p className="text-gray-400 mb-6">
              Add your first memory to begin forming your personal constellation. 
              Each emotion becomes a star in your universe.
            </p>
            <Button variant="cosmic" onClick={toggleAddMemory}>
              Add First Memory
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Memory detail panel */}
      <AnimatePresence>
        {selectedStar && (
          <MemoryPanel 
            memory={selectedMemory} 
            onClose={() => setSelectedStar(null)}
          />
        )}
      </AnimatePresence>
      
      {/* Legend */}
      {stars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 glass rounded-xl p-4"
        >
          <p className="text-sm text-gray-400 mb-2">Your Constellation</p>
          <p className="text-2xl font-bold text-white">{stars.length} <span className="text-lg text-gray-400">stars</span></p>
          <p className="text-sm text-[#8b5cf6]">{memories.length} memories</p>
        </motion.div>
      )}
    </div>
  )
}
