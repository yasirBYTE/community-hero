'use client'
import { motion } from 'framer-motion'
import { Camera, MapPin, Brain, Users, Shield, TrendingUp } from 'lucide-react'

const features = [
  { icon: Camera, title: 'AI-Powered Reporting', desc: 'Snap a photo and Gemini AI automatically categorizes, assesses severity, and tags the issue in seconds.' },
  { icon: MapPin, title: 'Geo-Tagged Mapping', desc: 'Pin issues on an interactive map powered by OpenStreetMap for precise location tracking.' },
  { icon: Brain, title: 'Predictive Insights', desc: 'AI predicts which issues may escalate, helping authorities prioritize effectively and prevent crises.' },
  { icon: Users, title: 'Community Verification', desc: 'Upvote and verify issues reported by neighbors. Collective validation drives real action.' },
  { icon: Shield, title: 'Transparent Tracking', desc: 'Every issue has a public status timeline — from report to resolution, nothing is hidden.' },
  { icon: TrendingUp, title: 'Impact Dashboards', desc: 'Real-time dashboards show community impact, resolution rates, and emerging issue trends.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Powered by AI, Driven by Community</h2>
          <p className="section-subtitle">
            Every feature is designed to make issue reporting effortless, tracking transparent, and resolution faster.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={cardVariants}
                className="card-gradient card-hover group p-6 sm:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                  <Icon size={22} className="text-indigo-300" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
