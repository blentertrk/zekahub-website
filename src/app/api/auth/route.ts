import { NextRequest, NextResponse } from 'next/server'

const USERNAME = 'bülent'
const PASSWORD = 'bülent'
const COOKIE_NAME = 'zh_admin'
const COOKIE_VALUE = 'zekahub_admin_ok'

export async function POST(req: NextRequest) {
  const { kullanici, sifre } = await req.json()
  if (kullanici === USERNAME && sifre === PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return res
  }
  return NextResponse.json({ ok: false, mesaj: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
