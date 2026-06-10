import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/auth/callback',
    '/api/stripe/webhook',
  ]

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith('/api/stripe/webhook')
  )

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    isPublicRoute
  ) {
    return NextResponse.next()
  }

  const supabaseCookie = request.cookies.get('sb-vsnxctnhpgrcquavyfge-auth-token')
  const hasSession = !!supabaseCookie?.value

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
