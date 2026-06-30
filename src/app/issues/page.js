'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import IssueCard from '@/components/IssueCard'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/Map'), { ssr: false })
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/gemini'
import { Search, Filter, Map as MapIcon, List, Loader2 } from 'lucide-react'

export default function IssuesPage() {
  const [issues, setIssues] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setIssues(items)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    let result = [...issues]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(i => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s) || i.address?.toLowerCase().includes(s))
    }
    if (statusFilter) result = result.filter(i => i.status === statusFilter)
    if (categoryFilter) result = result.filter(i => i.category === categoryFilter)
    setFiltered(result)
  }, [issues, search, statusFilter, categoryFilter])

  const statuses = ['reported', 'verified', 'in-progress', 'resolved', 'closed']

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Community Issues</h1>
            <p className="text-gray-400">{filtered.length} issue{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-2 bg-charcoal-50 rounded-xl border border-white/10 p-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}><List size={18} /></button>
            <button onClick={() => setViewMode('map')} className={`p-2 rounded ${viewMode === 'map' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}><MapIcon size={18} /></button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-gradient mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search issues..." className="input-field pl-10" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field sm:w-44">
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field sm:w-44">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>
        ) : viewMode === 'map' ? (
          <div className="h-[600px] rounded-xl overflow-hidden border border-white/10">
            <Map issues={filtered} height="600px" interactive={false} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-gradient text-center py-20 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No issues found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
