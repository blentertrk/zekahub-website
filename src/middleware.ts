import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isPanel = req.nextUrl.pathname.startsWith('/admin/panel')
  if (isPanel) {
    const cookie = req.cookies.get('zh_admin')?.value
    if (cookie !== 'zekahub_admin_ok') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/panel/:path*'],
}
