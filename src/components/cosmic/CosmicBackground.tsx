'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Three.js
const Starfield = dynamic(() => import('./Starfield'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#050508] via-[#0a0a0f] to-[#0f0f14]" />
  )
})

export default function CosmicBackground() {
  return <Starfield />
}
