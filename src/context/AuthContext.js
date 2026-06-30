'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile(snap.data())
        } else {
          const newProfile = {
            displayName: firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || '/images/avatar.png',
            points: 0,
            badges: [],
            issuesReported: 0,
            issuesVerified: 0,
            issuesResolved: 0,
            createdAt: serverTimestamp(),
          }
          await setDoc(ref, newProfile)
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return signInWithPopup(auth, provider)
  }

  const logout = () => signOut(auth)

  const refreshProfile = async () => {
    if (!user) return
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (snap.exists()) setProfile(snap.data())
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
