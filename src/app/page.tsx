import HeroSection from '@/components/landing/HeroSection'
import PillarsSection from '@/components/landing/PillarsSection'
import CTASection from '@/components/landing/CTASection'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <HeroSection />
      <div id="pillars">
        <PillarsSection />
      </div>
      <CTASection />
      
      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center">
                <span className="text-white text-sm">C</span>
              </div>
              <span className="text-gray-500">
                Chronos Mythica
              </span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-gray-600">
              Your story is eternal
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
