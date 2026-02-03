import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBackground from '@/components/cosmic/CosmicBackground'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Chronos Mythica | Your Life as Eternal Myth',
  description: 'A private sanctuary where your memories become legends, your emotions form constellations, and letters to your future self echo across time.',
  keywords: ['journaling', 'mythology', 'personal narrative', 'constellations', 'future self', 'memories'],
  authors: [{ name: 'Chronos Mythica' }],
  openGraph: {
    title: 'Chronos Mythica | Your Life as Eternal Myth',
    description: 'Transform your life into an epic heroic narrative.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <CosmicBackground />
        {children}
      </body>
    </html>
  )
}
