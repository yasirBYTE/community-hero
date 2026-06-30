'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { generateBadges } from '@/lib/helpers'
import { Loader2, Camera, Trophy, CheckCircle, Award, TrendingUp } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [myIssues, setMyIssues] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        const q = query(collection(db, 'issues'), where('reportedBy', '==', user.uid))
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        items.sort((a, b) => (b.reportedAt?.toDate?.() || 0) - (a.reportedAt?.toDate?.() || 0))
        setMyIssues(items)
      } catch (e) {
        console.error('Profile load error:', e)
      }
      setProfileLoading(false)
    }
    load()
  }, [user])

  if (loading || !user || profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>

  const badges = generateBadges(profile?.points || 0)
  const resolved = myIssues.filter(i => i.status === 'resolved').length
  const verified = myIssues.filter(i => i.verified).length

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card-gradient text-center mb-8">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-indigo-500/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {profile?.photoURL ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-3xl">?</div>}
          </div>
          <h1 className="text-2xl font-bold">{profile?.displayName || 'Anonymous'}</h1>
          <p className="text-gray-400 text-sm">{profile?.email}</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-indigo-500/10 px-4 py-2 rounded-full">
            <Trophy size={18} className="text-indigo-500" />
            <span className="font-bold text-indigo-400">{profile?.points || 0}</span>
            <span className="text-indigo-400">points</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Reported', value: myIssues.length, icon: Camera, color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
            { label: 'Verified', value: verified, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card-gradient text-center">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={20} className={s.color} />
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Badges */}
        <div className="card-gradient mb-8">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Award size={20} className="text-indigo-500" /> Badges & Achievements</h2>
          {badges.length === 0 ? (
            <p className="text-gray-500 text-sm">Report and verify issues to earn badges</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-charcoal-50 rounded-lg">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Issues */}
        <div className="card-gradient">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Camera size={20} className="text-indigo-500" /> My Reports</h2>
          {myIssues.length === 0 ? (
            <p className="text-gray-500 text-sm">No issues reported yet</p>
          ) : (
            <div className="space-y-3">
              {myIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push(`/issue/${issue.id}`)}>
                  <div className="flex items-center gap-3 min-w-0">
                    {issue.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={issue.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{issue.title}</p>
                      <p className="text-xs text-gray-500">{issue.category} | {issue.address?.slice(0, 30) || ''}</p>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ${issue.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{issue.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
