'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/Map'), { ssr: false })
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, increment, onSnapshot } from 'firebase/firestore'
// prediction via API route (key stays server-side)
import { formatDate, getStatusColor, getSeverityColor, timeAgo } from '@/lib/helpers'
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, MapPin, Clock, Share2, Sparkles, AlertTriangle, CheckCircle, Send, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function IssueDetail() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [submittingVote, setSubmittingVote] = useState(false)

  useEffect(() => {
    const ref = doc(db, 'issues', id)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setIssue({ id: snap.id, ...snap.data() })
      setLoading(false)
    })
    return () => unsub()
  }, [id])

  const handleVote = async (type) => {
    if (!user) { toast.error('Please sign in to vote'); return }
    if (submittingVote) return
    setSubmittingVote(true)
    try {
      const ref = doc(db, 'issues', id)
      await updateDoc(ref, { [type === 'up' ? 'upvotes' : 'downvotes']: increment(1) })
    } catch (e) { toast.error('Failed to vote') }
    setSubmittingVote(false)
  }

  const handleComment = async () => {
    if (!user) { toast.error('Please sign in to comment'); return }
    if (!comment.trim()) return
    try {
      const ref = doc(db, 'issues', id)
      await updateDoc(ref, {
        comments: arrayUnion({
          id: Date.now().toString(),
          text: comment.trim(),
          userId: user.uid,
          userName: profile?.displayName || 'Anonymous',
          userPhoto: profile?.photoURL || '',
          createdAt: new Date().toISOString(),
        })
      })
      setComment('')
      toast.success('Comment added')
    } catch { toast.error('Failed to add comment') }
  }

  const handlePrediction = async () => {
    if (!issue) return
    setPredicting(true)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: issue.title,
          category: issue.category,
          severity: issue.severity,
          status: issue.status,
          upvotes: issue.upvotes,
          daysSinceReport: issue.reportedAt ? Math.floor((Date.now() - issue.reportedAt.toDate()) / (1000 * 60 * 60 * 24)) : 0,
        }),
      })
      const result = await res.json()
      setPrediction(result)
    } catch { setPrediction({ willEscalate: false, reason: 'Failed to analyze', recommendedAction: '', confidence: 0 }) }
    setPredicting(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!issue) return <div className="flex items-center justify-center min-h-screen text-gray-400">Issue not found</div>

  const statusActions = {
    reported: ['verified'],
    verified: ['in-progress'],
    'in-progress': ['resolved'],
    resolved: ['closed'],
  }

  const canAdvance = statusActions[issue.status]
  const isCreator = user?.uid === issue.reportedBy

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {issue.images?.[0] && (
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={issue.images[0]} alt={issue.title} className="w-full h-72 object-cover" />
              </div>
            )}

            {/* Title & Meta */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`badge ${getStatusColor(issue.status)}`}>{issue.status}</span>
                <span className={`badge ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                <span className="badge bg-gray-100 text-gray-600">{issue.category}</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{issue.title}</h1>
              <p className="text-gray-600 mb-4">{issue.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Clock size={14} /> {issue.reportedAt ? timeAgo(issue.reportedAt) : 'Recently'}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {issue.address || 'Unknown location'}</span>
                <span className="flex items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {issue.reportedByPhoto && <img src={issue.reportedByPhoto} alt="" className="w-5 h-5 rounded-full" />}
                  {issue.reportedByName || 'Anonymous'}
                </span>
              </div>
            </div>

            {/* AI Prediction */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-2"><Sparkles size={18} className="text-accent-600" /> AI Insights</h2>
                <button onClick={handlePrediction} disabled={predicting} className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                  {predicting ? 'Analyzing...' : prediction ? 'Refresh' : 'Predict Escalation'}
                </button>
              </div>
              {prediction ? (
                <div className={`p-4 rounded-lg ${prediction.willEscalate ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {prediction.willEscalate ? <AlertTriangle size={18} className="text-red-600" /> : <CheckCircle size={18} className="text-green-600" />}
                    <span className={`font-medium ${prediction.willEscalate ? 'text-red-700' : 'text-green-700'}`}>
                      {prediction.willEscalate ? 'May Escalate' : 'Low Risk'}
                    </span>
                    <span className="text-xs text-gray-400">({(prediction.confidence * 100).toFixed(0)}% confidence)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {prediction.reason}</p>
                  <p className="text-sm text-gray-600"><strong>Action:</strong> {prediction.recommendedAction}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Use AI to predict if this issue may escalate and needs urgent attention.</p>
              )}
            </div>

            {/* Status Timeline */}
            <div className="card">
              <h2 className="font-semibold mb-4">Status Timeline</h2>
              <div className="space-y-3">
                {issue.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <div>
                      <span className={`badge ${getStatusColor(h.status)}`}>{h.status}</span>
                      <span className="text-xs text-gray-400 ml-2">{formatDate(h.at)}</span>
                    </div>
                  </div>
                )) || <p className="text-sm text-gray-400">No status history</p>}
              </div>
            </div>

            {/* Comments */}
            <div className="card">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={18} /> Comments ({issue.comments?.length || 0})
              </h2>
              {user && (
                <div className="flex gap-2 mb-4">
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="input-field flex-1" maxLength={500} />
                  <button onClick={handleComment} disabled={!comment.trim()} className="btn-primary !py-2 !px-3"><Send size={18} /></button>
                </div>
              )}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {issue.comments?.length === 0 && <p className="text-sm text-gray-400">No comments yet</p>}
                {issue.comments?.slice().reverse().map((c) => (
                  <div key={c.id} className="flex gap-2 text-sm p-3 bg-gray-50 rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {c.userPhoto && <img src={c.userPhoto} alt="" className="w-7 h-7 rounded-full shrink-0" />}
                    <div>
                      <span className="font-medium">{c.userName}</span>
                      <span className="text-xs text-gray-400 ml-2">{timeAgo(c.createdAt)}</span>
                      <p className="text-gray-600 mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting */}
            <div className="card text-center">
              <h2 className="font-semibold mb-3">Community Verdict</h2>
              <div className="flex justify-center gap-6 mb-3">
                <button onClick={() => handleVote('up')} className="flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors">
                  <ThumbsUp size={28} />
                  <span className="text-lg font-bold mt-1">{issue.upvotes || 0}</span>
                </button>
                <button onClick={() => handleVote('down')} className="flex flex-col items-center text-gray-500 hover:text-red-600 transition-colors">
                  <ThumbsDown size={28} />
                  <span className="text-lg font-bold mt-1">{issue.downvotes || 0}</span>
                </button>
              </div>
              <p className="text-xs text-gray-400">Vote to verify this issue</p>
            </div>

            {/* Map */}
            <div className="card !p-0 overflow-hidden">
              <div className="h-48">
                <Map issues={[issue]} height="192px" interactive={false} />
              </div>
            </div>

            {/* Admin Actions */}
            {canAdvance && isCreator && (
              <div className="card">
                <h2 className="font-semibold mb-3">Update Status</h2>
                <div className="space-y-2">
                  {canAdvance.map((s) => (
                    <button key={s} onClick={async () => {
                      try {
                        const ref = doc(db, 'issues', id)
                        await updateDoc(ref, {
                          status: s,
                          statusHistory: arrayUnion({ status: s, at: new Date().toISOString(), by: user.uid })
                        })
                        toast.success(`Status updated to "${s}"`)
                      } catch { toast.error('Failed to update') }
                    }} className="btn-secondary w-full justify-center text-sm">
                      Mark as {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!') }} className="btn-secondary w-full justify-center">
              <Share2 size={16} /> Share Issue
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
