import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { adminDb } = await import('@/lib/firebaseAdmin')
    if (!adminDb) throw new Error('Admin DB not configured')
    const { id } = params
    const { type } = await request.json()
    const field = type === 'up' ? 'upvotes' : 'downvotes'
    await adminDb.collection('issues').doc(id).update({ [field]: adminDb.FieldValue.increment(1) })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Verification failed' }, { status: 500 })
  }
}
