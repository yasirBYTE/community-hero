'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import IssueCard from '@/components/IssueCard'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { ArrowRight, MapPin, Camera, Brain, Users, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  const [issues, setIssues] = useState([])
  const [stats, setStats] = useState({ total: 0, resolved: 0, verified: 0 })

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'), limit(6))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setIssues(items)

      const all = await getDocs(collection(db, 'issues'))
      const total = all.size
      let resolved = 0, verified = 0
      all.forEach(d => {
        const data = d.data()
        if (data.status === 'resolved') resolved++
        if (data.verified) verified++
      })
      setStats({ total, resolved, verified })
    }
    load()
  }, [])

  const features = [
    { icon: Camera, title: 'AI-Powered Reporting', desc: 'Snap a photo and our AI categorizes, assesses severity, and tags the issue automatically using Gemini Vision.' },
    { icon: MapPin, title: 'Geo-Tagged Mapping', desc: 'Pin issues on an interactive map for precise location tracking and community awareness.' },
    { icon: Brain, title: 'Predictive Insights', desc: 'AI predicts which issues may escalate, helping authorities prioritize effectively.' },
    { icon: Users, title: 'Community Verification', desc: 'Upvote and verify issues reported by neighbors. Collective validation drives action.' },
    { icon: Shield, title: 'Transparent Tracking', desc: 'Every issue has a public status timeline — from report to resolution, nothing is hidden.' },
    { icon: TrendingUp, title: 'Impact Dashboards', desc: 'Real-time dashboards show community impact, resolution rates, and issue trends.' },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Turn Community Problems Into{' '}
                <span className="text-primary-200">Collective Action</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
                Report potholes, broken streetlights, water leaks, and more. Our AI helps categorize, prioritize, and track issues until they&apos;re resolved — making your neighborhood better, together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/report" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors">
                  <Camera size={20} /> Report an Issue
                </Link>
                <Link href="/issues" className="inline-flex items-center gap-2 bg-primary-800 bg-opacity-40 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-800 transition-colors border border-primary-400">
                  Browse Issues <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-3 gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {[
              { label: 'Issues Reported', value: stats.total, color: 'text-accent-600' },
              { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
              { label: 'Community Verified', value: stats.verified, color: 'text-primary-600' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-3xl sm:text-4xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Spot & Snap', desc: 'See an issue? Take a photo and describe it.' },
              { step: '2', title: 'AI Analyzes', desc: 'Gemini AI categorizes, tags, and sets priority.' },
              { step: '3', title: 'Community Validates', desc: 'Neighbors verify, comment, and amplify.' },
              { step: '4', title: 'Authorities Resolve', desc: 'Track progress until the issue is fixed.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Powered by AI, Driven by Community</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Every feature is designed to make issue reporting effortless, tracking transparent, and resolution faster.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="card hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon size={24} className="text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recent Issues */}
        {issues.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Issues</h2>
              <Link href="/issues" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join your neighbors in building a better community. Every report counts.
            </p>
            <Link href="/report" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors text-lg">
              <Camera size={22} /> Report an Issue Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
