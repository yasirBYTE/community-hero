'use client'
import { motion } from 'framer-motion'
import { Camera, Cpu, Users, CheckCircle2 } from 'lucide-react'

const steps = [
  { icon: Camera, title: 'Spot & Snap', desc: 'See a pothole, broken light, or water leak? Take a photo and describe the issue.' },
  { icon: Cpu, title: 'AI Analyzes', desc: 'Gemini AI categorizes, tags severity, and sets priority automatically.' },
  { icon: Users, title: 'Community Validates', desc: 'Neighbors verify, upvote, and amplify the issue to drive action.' },
  { icon: CheckCircle2, title: 'Resolution Tracked', desc: 'Authorities resolve the issue and the community gets notified. Impact measured.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From spotting an issue to seeing it resolved — four simple steps powered by AI and community action.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-500/40 via-emerald-500/40 to-indigo-500/40" />

          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center">
                    <Icon size={28} className="text-indigo-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 border-2 border-charcoal flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg text-white mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
