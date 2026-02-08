import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')
    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ['/dashboard', '/onboarding', '/invite']
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtected && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth routes (redirect to dashboard if already logged in)
    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
