'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import { Menu, X, Plus, LayoutDashboard, List, Trophy, User } from 'lucide-react'

export default function Navbar() {
  const { user, profile, loginWithGoogle, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/issues', label: 'Issues', icon: List },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦸</span>
            <span className="font-bold text-xl text-primary-700">Community Hero</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user && navLinks.map((l) => {
              const Icon = l.icon
              return (
                <Link key={l.href} href={l.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    pathname === l.href ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}>
                  <Icon size={16} /> {l.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/report" className="btn-primary text-sm !py-2 !px-4">
                  <Plus size={16} /> Report
                </Link>
                <div className="hidden md:flex items-center gap-2">
                  {profile?.photoURL && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-sm font-medium text-gray-700">{profile?.displayName}</span>
                  <span className="badge bg-primary-100 text-primary-800">{profile?.points || 0} pts</span>
                </div>
                <button onClick={logout} className="btn-secondary text-sm !py-2 !px-3">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={loginWithGoogle} className="btn-accent text-sm !py-2 !px-4">
                Sign in with Google
              </button>
            )}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          {user && navLinks.map((l) => {
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600">
                <Icon size={18} /> {l.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
