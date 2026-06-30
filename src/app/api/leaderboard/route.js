import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { adminDb } = await import('@/lib/firebaseAdmin')
    if (!adminDb) throw new Error('Admin DB not configured')
    const snap = await adminDb.collection('users').orderBy('points', 'desc').limit(50).get()
    const users = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }))
    return NextResponse.json(users)
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
