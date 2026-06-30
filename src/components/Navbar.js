'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import { Menu, X, Plus, LayoutDashboard, List, Trophy, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#impact', label: 'Impact' },
  { href: '/#community', label: 'Community' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const { user, profile, loginWithGoogle, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = pathname === '/'

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled || !isLanding
        ? 'bg-charcoal/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              CH
            </div>
            <span className="font-heading font-bold text-lg text-white">Community Hero</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isLanding ? (
              navLinks.map((l) => (
                <a key={l.href} href={l.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))
            ) : user ? (
              [
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/issues', label: 'Issues', icon: List },
                { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
                { href: '/profile', label: 'Profile', icon: User },
              ].map((l) => {
                const Icon = l.icon
                return (
                  <Link key={l.href} href={l.href}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      pathname === l.href ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                    }`}>
                    <Icon size={16} /> {l.label}
                  </Link>
                )
              })
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/report" className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20">
                  <Plus size={16} /> Report
                </Link>
                <div className="hidden md:flex items-center gap-2.5">
                  {profile?.photoURL && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.photoURL} alt="" className="w-7 h-7 rounded-full ring-2 ring-white/10" />
                  )}
                  <span className="text-sm text-gray-300">{profile?.displayName}</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">{profile?.points || 0}</span>
                </div>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white px-3 py-2 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link
                href={isLanding ? '/#get-started' : '/login'}
                onClick={(e) => {
                  if (!isLanding) {
                    e.preventDefault()
                    loginWithGoogle()
                  }
                }}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20"
              >
                Get Started
              </Link>
            )}
            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-charcoal/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {isLanding && navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-gray-300 hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
              {user && (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2.5 text-gray-300 hover:text-white">Dashboard</Link>
                  <Link href="/issues" onClick={() => setMenuOpen(false)} className="block py-2.5 text-gray-300 hover:text-white">Issues</Link>
                  <Link href="/report" onClick={() => setMenuOpen(false)} className="block py-2.5 text-indigo-400 font-medium">+ Report</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
