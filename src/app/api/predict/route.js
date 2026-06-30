import { predictEscalation } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const issueData = await request.json()
    const result = await predictEscalation(issueData)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: 'Prediction failed' }, { status: 500 })
  }
}
