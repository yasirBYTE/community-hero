'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, MapPin, CheckCircle, TrendingUp, Award, Building } from 'lucide-react'

function Counter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { icon: Users, value: 520, suffix: '+', label: 'Active Users', color: 'from-indigo-500/20 to-blue-500/20' },
  { icon: MapPin, value: 1280, suffix: '+', label: 'Issues Reported', color: 'from-emerald-500/20 to-teal-500/20' },
  { icon: CheckCircle, value: 92, suffix: '%', label: 'Resolution Rate', color: 'from-blue-500/20 to-indigo-500/20' },
  { icon: Building, value: 45, suffix: '+', label: 'Communities Served', color: 'from-violet-500/20 to-purple-500/20' },
]

export default function Impact() {
  return (
    <section id="impact" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Community Impact</h2>
          <p className="section-subtitle">
            Real metrics from real communities using Community Hero to make a difference.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="card-gradient card-hover p-6 sm:p-8 text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-5 rounded-xl bg-gradient-to-br ${s.color} border border-white/10 flex items-center justify-center`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2 tabular-nums">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
