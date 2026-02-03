'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#8b5cf6]/5 blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Write Your
            <br />
            <span className="gradient-text-cosmic">Eternal Story?</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the mythmakers. Transform your everyday moments into an epic narrative 
            that will echo through the ages.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button variant="cosmic" size="lg">
              Begin Your Myth — It&apos;s Free
            </Button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-sm text-gray-500"
          >
            No credit card required. Free forever with optional AI enhancements.
          </motion.p>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
