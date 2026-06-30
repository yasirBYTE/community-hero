import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Auth handled client-side via Firebase' })
}
