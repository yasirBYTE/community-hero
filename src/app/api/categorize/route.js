import { categorizeIssue } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { imageBase64, description } = await request.json()
    const result = await categorizeIssue(imageBase64, description)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: 'Categorization failed' }, { status: 500 })
  }
}
