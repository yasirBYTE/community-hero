import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  try {
    const { adminDb } = await import('@/lib/firebaseAdmin')
    if (!adminDb) throw new Error('Admin DB not configured')
    const { id } = params
    const { status, userId } = await request.json()
    await adminDb.collection('issues').doc(id).update({
      status,
      statusHistory: adminDb.FieldValue.arrayUnion({ status, at: new Date().toISOString(), by: userId })
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Status update failed' }, { status: 500 })
  }
}
