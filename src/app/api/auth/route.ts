import { NextRequest, NextResponse } from 'next/server'
import { CEREZ_ADI, OTURUM_SURESI_SN, jetonUret } from '@/lib/oturum'

/**
 * Admin girisi.
 *
 * Kullanici adi/sifre artik koda gomulu degil, ortam degiskeninden geliyor:
 *   ADMIN_KULLANICI, ADMIN_SIFRE, ADMIN_OTURUM_SIRRI
 * Basarili giriste imzali, sureli bir oturum cerezi konur.
 */

function sabitSuredeEsit(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let fark = 0
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return fark === 0
}

export async function POST(req: NextRequest) {
  const kullaniciAdi = process.env.ADMIN_KULLANICI
  const sifre = process.env.ADMIN_SIFRE
  const sir = process.env.ADMIN_OTURUM_SIRRI

  if (!kullaniciAdi || !sifre || !sir) {
    console.error('[auth] ADMIN_KULLANICI / ADMIN_SIFRE / ADMIN_OTURUM_SIRRI tanimli degil')
    return NextResponse.json(
      { ok: false, mesaj: 'Sunucu yapilandirmasi eksik' },
      { status: 500 },
    )
  }

  const { kullanici, sifre: gelenSifre } = await req.json()

  const dogru =
    typeof kullanici === 'string' &&
    typeof gelenSifre === 'string' &&
    sabitSuredeEsit(kullanici, kullaniciAdi) &&
    sabitSuredeEsit(gelenSifre, sifre)

  if (!dogru) {
    return NextResponse.json(
      { ok: false, mesaj: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 },
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(CEREZ_ADI, await jetonUret(kullanici, sir), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTURUM_SURESI_SN,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(CEREZ_ADI)
  return res
}
