'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/Map'), { ssr: false })
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/gemini'
import { compressImage } from '@/lib/helpers'
import { Camera, MapPin, Loader2, Sparkles, Upload, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReportPage() {
  const { user, loading, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 3) {
      toast.error('Maximum 3 images allowed')
      return
    }
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large (max 5MB)')
        continue
      }
      const compressed = await compressImage(file)
      setImages(prev => [...prev, { data: compressed, file }])
    }
  }

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const analyzeWithAI = async () => {
    if (!description && images.length === 0) {
      toast.error('Add a description or image first')
      return
    }
    setAiAnalyzing(true)
    try {
      const base64 = images[0]?.data?.split(',')[1]
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, description }),
      })
      const result = await res.json()
      if (result.error) throw new Error(result.error)
      setAiResult(result)
      setCategory(result.category)
      setStep(2)
      toast.success('AI analysis complete!')
    } catch (e) {
      toast.error('AI analysis failed. Please categorize manually.')
    }
    setAiAnalyzing(false)
  }

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, { headers: { 'User-Agent': 'CommunityHero/1.0' } })
      const data = await res.json()
      if (data.display_name) setAddress(data.display_name)
    } catch {}
  }

  const handleLocationSelect = (loc) => {
    setLocation(loc)
    getAddressFromCoords(loc.lat, loc.lng)
  }

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return }
    if (!description.trim()) { toast.error('Please enter a description'); return }
    if (!category) { toast.error('Please select a category'); return }
    if (!location) { toast.error('Please pin the location on the map'); return }
    if (images.length === 0) { toast.error('Please add at least one image'); return }

    setSubmitting(true)
    try {
      const issue = {
        images: images.map(i => i.data),
        title: title.trim(),
        description: description.trim(),
        category,
        severity: aiResult?.severity || 'Medium',
        urgencyDays: aiResult?.urgencyDays || 7,
        tags: aiResult?.tags || [],
        location: new (await import('firebase/firestore')).GeoPoint(location.lat, location.lng),
        address: address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        reportedBy: user.uid,
        reportedByName: profile?.displayName || 'Anonymous',
        reportedByPhoto: profile?.photoURL || '',
        status: 'reported',
        upvotes: 0,
        downvotes: 0,
        verified: false,
        comments: [],
        statusHistory: [{ status: 'reported', at: new Date().toISOString(), by: user.uid }],
        reportedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'issues'), issue)
      await refreshProfile()
      toast.success('Issue reported successfully!')
      router.push(`/issue/${docRef.id}`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to submit. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading || !user) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Camera size={24} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Report an Issue</h1>
            <p className="text-gray-400">Help your community by reporting local problems</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {['Details & AI', 'Location', 'Review'].map((s, i) => (
            <div key={s} className={`flex items-center gap-2 ${step === i + 1 ? 'text-indigo-500 font-semibold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-charcoal-50'}`}>{i + 1}</div>
              {s}
              {i < 2 && <div className="w-8 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="card-gradient">
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Large pothole on Main Street" className="input-field" maxLength={100} />
            </div>

            <div className="card-gradient">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail. How long has it been there? Is it hazardous?" className="input-field" rows={4} maxLength={1000} />
              <p className="text-xs text-gray-500 mt-1">{description.length}/1000</p>
            </div>

            <div className="card-gradient">
              <label className="block text-sm font-medium text-gray-300 mb-2">Photos * (max 3)</label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.data} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"><X size={14} /></button>
                  </div>
                ))}
                {images.length < 3 && (
                  <button onClick={() => fileInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-400 transition-colors">
                    <Upload size={24} /><span className="text-xs mt-1">Add Photo</span>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </div>

            <div className="card-gradient">
              <button onClick={analyzeWithAI} disabled={aiAnalyzing || (!description && images.length === 0)} className="btn-accent w-full justify-center">
                {aiAnalyzing ? <><Loader2 size={18} className="animate-spin" /> AI Analyzing...</> : <><Sparkles size={18} /> Analyze with Gemini AI</>}
              </button>
              {aiResult && (
                <div className="mt-4 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <p className="text-sm font-medium text-indigo-300 flex items-center gap-1"><Sparkles size={14} /> AI Suggestion</p>
                  <p className="text-sm mt-1">Category: <strong>{aiResult.category}</strong> | Severity: <strong>{aiResult.severity}</strong> | Urgency: <strong>{aiResult.urgencyDays} days</strong></p>
                  {aiResult.tags?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {aiResult.tags.map(t => <span key={t} className="badge bg-indigo-500/20 text-indigo-400">{t}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card-gradient">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`py-2 px-3 rounded-lg text-sm border transition-all ${category === c ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 font-medium' : 'bg-charcoal-50 border-white/10 text-gray-300 hover:border-white/20'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!title || !description || !category || images.length === 0} className="btn-primary w-full justify-center">
              Next: Pin Location <MapPin size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="card-gradient">
              <label className="block text-sm font-medium text-gray-300 mb-2">Pin the exact location on the map *</label>
              <p className="text-xs text-gray-500 mb-3">Click on the map where the issue is located</p>
              <div className="h-[400px] rounded-xl overflow-hidden border border-white/10">
                <Map onLocationSelect={handleLocationSelect} selectedLocation={location} height="400px" />
              </div>
              {address && (
                <div className="mt-3 flex items-start gap-2 text-sm text-gray-300">
                  <MapPin size={16} className="mt-0.5 text-indigo-500 shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              {location && (
                <p className="text-xs text-gray-500 mt-1">Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
              <button onClick={() => setStep(3)} disabled={!location} className="btn-primary flex-1 justify-center">
                Next: Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card-gradient">
              <h2 className="font-semibold text-lg mb-4">Review Your Report</h2>
              <div className="space-y-3">
                {images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[0].data} alt="" className="w-full h-48 object-cover rounded-lg" />
                )}
                <div>
                  <span className="text-xs text-gray-500 uppercase">Title</span>
                  <p className="font-medium">{title}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Description</span>
                  <p className="text-sm text-gray-300">{description}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="badge bg-indigo-500/20 text-indigo-400">{category}</span>
                  <span className="badge bg-emerald-500/20 text-emerald-400">{aiResult?.severity || 'Medium'} Severity</span>
                  <span className="badge bg-orange-500/20 text-orange-400">Urgency: {aiResult?.urgencyDays || 7} days</span>
                </div>
                {address && (
                  <div className="flex items-start gap-2 text-sm text-gray-400">
                    <MapPin size={14} className="mt-0.5" />
                    <span>{address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">Back</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 justify-center">
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
