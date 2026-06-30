import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lim = parseInt(searchParams.get('limit') || '50')
  try {
    const q = query(collection(db, 'issues'), orderBy('reportedAt', 'desc'), limit(lim))
    const snap = await getDocs(q)
    const issues = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json(issues)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const docRef = await addDoc(collection(db, 'issues'), body)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 })
  }
}
