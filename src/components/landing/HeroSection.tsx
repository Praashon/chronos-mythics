'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AuthModal from '@/components/modals/AuthModal'
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleAuthSuccess = () => {
    window.location.href = '/dashboard'
  }
  
  return (
    <>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Chronos Mythica
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#pillars" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <Button variant="ghost" size="sm" onClick={() => setIsAuthOpen(true)}>
                Sign In
              </Button>
              <Button variant="cosmic" size="sm" onClick={() => setIsAuthOpen(true)}>
                Begin Your Myth
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#pillars" className="block text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <Button variant="ghost" className="w-full" onClick={() => setIsAuthOpen(true)}>
                Sign In
              </Button>
              <Button variant="cosmic" className="w-full" onClick={() => setIsAuthOpen(true)}>
                Begin Your Myth
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale, y }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbbf24]"></span>
            </span>
            <span className="text-sm text-gray-400">Your personal mythology awaits</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-display-xl mb-6"
          >
            <span className="text-white">Chronos</span>{' '}
            <span className="gradient-text-cosmic">Mythica</span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
          >
            Your life as eternal myth.
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
          >
            A private sanctuary where your memories become legends, your emotions form constellations, 
            and letters to your future self echo across time.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="cosmic"
              size="lg"
              onClick={() => setIsAuthOpen(true)}
              className="group"
            >
              <span className="flex items-center gap-2">
                Begin Your Myth
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </Button>
            <Button variant="ghost" size="lg">
              Watch Demo
            </Button>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full bg-white/50"
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />
      </section>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
