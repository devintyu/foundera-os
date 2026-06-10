import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查 cookie 判断是否登录（不调用任何外部服务）
  const token = request.cookies.get('sb-vsnxctnhpgrcquavyfge-auth-token')?.value
  const hasSession = !!token

  // 需要登录的路由
  const protectedRoutes = [
    '/dashboard',
    '/onboarding',
    '/market',
    '/offers',
    '/audience',
    '/funnels',
    '/strategy',
    '/copy',
    '/history',
    '/settings',
    '/billing',
    '/credits',
    '/workforce',
  ]

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // 未登录访问受保护页面 → 跳转 login
  if (!hasSession && isProtected) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 已登录访问 login/signup → 跳转 dashboard
  if (hasSession && isAuthPage) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
