'use client'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: 'Community Hero transformed how our neighborhood handles civic issues. The AI categorization saves hours and the transparency keeps everyone accountable.',
    name: 'Sarah Chen',
    role: 'Community Organizer, Austin',
    avatar: 'SC',
  },
  {
    quote: 'We\'ve seen a 40% faster resolution time since adopting this platform. The predictive insights help us allocate resources where they\'re needed most.',
    name: 'Marcus Johnson',
    role: 'City Council Member, Denver',
    avatar: 'MJ',
  },
  {
    quote: 'Finally, a tool that bridges the gap between residents and local authorities. The verification system ensures real issues get real attention.',
    name: 'Priya Patel',
    role: 'NGO Director, Seattle',
    avatar: 'PP',
  },
]

export default function Testimonials() {
  return (
    <section id="community" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Trusted by Communities</h2>
          <p className="section-subtitle">
            Hear from the people and organizations using Community Hero to drive real change.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="card-gradient card-hover p-6 sm:p-8 relative"
            >
              <Quote size={28} className="text-indigo-500/30 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
