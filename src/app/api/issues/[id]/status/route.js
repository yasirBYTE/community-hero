import { NextResponse } from 'next/server'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const { status, userId } = await request.json()
    await updateDoc(doc(db, 'issues', id), {
      status,
      statusHistory: arrayUnion({ status, at: new Date().toISOString(), by: userId })
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Status update failed' }, { status: 500 })
  }
}
