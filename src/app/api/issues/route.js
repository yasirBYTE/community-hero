import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { adminDb } = await import('@/lib/firebaseAdmin')
    if (!adminDb) throw new Error('Admin DB not configured')
    const { searchParams } = new URL(request.url)
    const lim = parseInt(searchParams.get('limit') || '50')
    const snap = await adminDb.collection('issues').orderBy('reportedAt', 'desc').limit(lim).get()
    const issues = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json(issues)
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Failed to fetch issues', note: 'Use client-side Firebase SDK directly' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { adminDb } = await import('@/lib/firebaseAdmin')
    if (!adminDb) throw new Error('Admin DB not configured')
    const body = await request.json()
    const ref = await adminDb.collection('issues').add(body)
    return NextResponse.json({ id: ref.id }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Failed to create issue' }, { status: 500 })
  }
}
