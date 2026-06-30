'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import IssueCard from '@/components/IssueCard'
import DashboardStats from '@/components/DashboardStats'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore'
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [myIssues, setMyIssues] = useState([])
  const [recentIssues, setRecentIssues] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'issues'), where('reportedBy', '==', user.uid), orderBy('reportedAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setMyIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user])

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'))
      const snap = await getDocs(q)
      setRecentIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setDashboardLoading(false)
    }
    load()
  }, [])

  if (loading || !user) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-primary-600" /></div>

  const statsCards = [
    { label: 'My Reports', value: myIssues.length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Resolved', value: myIssues.filter(i => i.status === 'resolved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: myIssues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Community Impact', value: recentIssues.filter(i => i.status === 'resolved').length, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-100' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Track your community impact at a glance</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon size={20} className={s.color} />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            )
          })}
        </div>

        <DashboardStats issues={recentIssues} />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">My Reports</h2>
            {myIssues.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                <Activity size={40} className="mx-auto mb-3 opacity-50" />
                <p>No issues reported yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myIssues.slice(0, 5).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Community Issues</h2>
            <div className="space-y-4">
              {recentIssues.slice(0, 5).map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
