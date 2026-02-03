'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Sparkles, BookOpen, Star, Mail } from 'lucide-react'

const pillars = [
  {
    icon: BookOpen,
    title: 'Myth Weaving',
    description: 'Transform your ordinary moments into extraordinary tales. Every memory becomes a chapter in your personal epic, written in poetic prose that elevates your lived experience into legend.',
    color: '#fbbf24'
  },
  {
    icon: Star,
    title: 'Emotional Cosmos',
    description: 'Watch your feelings become stars in an ever-expanding universe. Your joys, sorrows, hopes, and fears form constellations that map the territory of your inner world.',
    color: '#8b5cf6'
  },
  {
    icon: Mail,
    title: 'Future Echoes',
    description: 'Send letters across time to the person you will become. When the moment arrives, receive wisdom from your future mythic self—a voice shaped by your own evolving story.',
    color: '#3b82f6'
  }
]

function PillarCard({ pillar, index }: { pillar: typeof pillars[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ 
        duration: 1,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f] pointer-events-none" />
      
      <div className="relative glass rounded-2xl p-8 md:p-10 h-full overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
          style={{ background: pillar.color }}
        />
        
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={isInView ? { scale: 1 } : { scale: 0.8 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6"
          style={{ background: `${pillar.color}20` }}
        >
          <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
        </motion.div>
        
        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {pillar.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 leading-relaxed text-lg">
          {pillar.description}
        </p>
        
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left"
          style={{ background: `linear-gradient(to right, transparent, ${pillar.color}50, transparent)` }}
        />
      </div>
    </motion.div>
  )
}

export default function PillarsSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  
  return (
    <section ref={containerRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background elements */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#8b5cf6]/5 blur-3xl pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -150]) }}
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#3b82f6]/5 blur-3xl pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[#fbbf24] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The Three Pillars
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Life, <span className="gradient-text-cosmic">Mythologized</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Every soul carries an epic waiting to be told. We provide the canvas for your eternal narrative.
          </p>
        </motion.div>
        
        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
