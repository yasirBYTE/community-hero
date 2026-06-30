'use client'
import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Impact', href: '/#impact' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Community: [
    { label: 'Issues', href: '/issues' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Profile', href: '/profile' },
  ],
  Company: [
    { label: 'About', href: '/#' },
    { label: 'Blog', href: '/#' },
    { label: 'Contact', href: '/#' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-charcoal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CH
              </div>
              <span className="font-heading font-bold text-lg text-white">Community Hero</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Empowering communities through AI-powered collaboration and transparent civic issue resolution.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Community Hero. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Built with <Heart size={12} className="text-red-400" /> for communities everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
