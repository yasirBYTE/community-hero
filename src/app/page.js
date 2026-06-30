'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Impact from '@/components/Impact'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import IssueCard from '@/components/IssueCard'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { ArrowRight, Camera } from 'lucide-react'

export default function Home() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'), limit(3))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setIssues(items)
    }
    load()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Impact />

        {/* Recent Issues */}
        {issues.length > 0 && (
          <section className="relative py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
              >
                <div>
                  <h2 className="section-title text-left">Recent Reports</h2>
                  <p className="text-gray-400 mt-3 max-w-xl">
                    Latest issues reported by community members near you.
                  </p>
                </div>
                <Link href="/issues"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors group">
                  View All Issues <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue, i) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Testimonials />
        <FAQ />

        {/* CTA */}
        <section id="get-started" className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="section-title">Ready to Make a Difference?</h2>
              <p className="text-gray-400 text-lg mt-4 mb-8 max-w-xl mx-auto leading-relaxed">
                Join thousands of neighbors building better communities. Every report counts.
              </p>
              <Link
                href="/report"
                className="btn-primary text-base !py-4 !px-10 group"
              >
                <Camera size={20} /> Report an Issue Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
