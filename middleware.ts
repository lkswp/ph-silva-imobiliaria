import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAdmin = token?.role === 'admin'
    const path = req.nextUrl.pathname

    if (path.startsWith('/admin')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/conta', req.url))
      }
    }

    if (path.startsWith('/conta')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Se usuário já está logado, não deixa ir pro login/cadastro
    if (path === '/login' || path === '/cadastro') {
      if (isAuth) {
        return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/conta', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: () => true // Permite que a função principal do middleware lide com os redirecionamentos
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/conta/:path*', '/login', '/cadastro'],
}
