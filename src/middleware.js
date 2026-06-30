import { NextResponse } from 'next/server'

const publicPaths = ['/', '/login', '/api/']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p))
  if (isPublic) return NextResponse.next()
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
