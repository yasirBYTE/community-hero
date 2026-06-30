import { NextResponse } from 'next/server'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50))
    const snap = await getDocs(q)
    const users = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }))
    return NextResponse.json(users)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
