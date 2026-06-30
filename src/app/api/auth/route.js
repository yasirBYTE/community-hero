import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Auth endpoints handled client-side via Firebase SDK' })
}
