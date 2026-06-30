import { NextResponse } from 'next/server'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { type } = await request.json()
    const field = type === 'up' ? 'upvotes' : 'downvotes'
    await updateDoc(doc(db, 'issues', id), { [field]: increment(1) })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
