'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  const handleLogin = async () => {
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (e) {
      if (e.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Please allow popups for this site.')
      } else if (e.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled.')
      } else {
        toast.error('Failed to sign in. Please try again.')
      }
    }
    setSigningIn(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-charcoal via-charcoal to-charcoal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-400 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              CH
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue making a difference</p>
          </div>
          <div className="card-gradient p-6 sm:p-8">
            <button
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-white/10 rounded-xl hover:border-indigo-400 hover:bg-white/5 transition-all font-medium text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingIn ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {signingIn ? 'Signing in...' : 'Continue with Google'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-5">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
