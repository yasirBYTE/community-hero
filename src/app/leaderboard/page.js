'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { Trophy, Medal, Award, Loader2, Star, TrendingUp } from 'lucide-react'

const RANK_ICONS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50))
      const snap = await getDocs(q)
      const items = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }))
      setLeaders(items)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Trophy size={48} className="text-yellow-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Community Leaderboard</h1>
          <p className="text-gray-500">Top contributors making a difference in their community</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
        ) : (
          <div className="space-y-3">
            {leaders.map((user, idx) => (
              <div key={user.id} className={`card flex items-center gap-4 ${idx < 3 ? 'border-2 border-yellow-200 bg-yellow-50' : ''}`}>
                <div className="w-12 text-center">
                  {idx < 3 ? (
                    <span className="text-2xl">{RANK_ICONS[idx]}</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  )}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {user.photoURL ? <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"><Star size={20} className="text-primary-400" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.displayName || 'Anonymous'}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{user.issuesReported || 0} reports</span>
                    <span>{user.issuesResolved || 0} resolved</span>
                    <span>{user.badges?.length || 0} badges</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg text-primary-700">{user.points || 0}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            ))}
            {leaders.length === 0 && (
              <div className="card text-center py-12 text-gray-400">
                <TrendingUp size={40} className="mx-auto mb-3 opacity-50" />
                <p>No community members yet</p>
                <p className="text-sm">Be the first to report an issue!</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
