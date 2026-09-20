import { NextRequest, NextResponse } from 'next/server'
import { CEREZ_ADI, jetonDogrula } from '@/lib/oturum'

/**
 * Korunan yollar:
 *   /admin/panel/**      -> panel arayuzu
 *   /admin/whatsapp/**   -> WhatsApp yonetim arayuzu
 *   /api/whatsapp/**     -> WhatsApp API uclari (webhook HARIC)
 *
 * Webhook disarida: onu Evolution API cagiriyor, tarayici oturumu yok.
 * Kendi korumasi var (URL'deki gizli jeton) - bkz. api/whatsapp/webhook.
 */
const KORUNAN_SAYFALAR = ['/admin/panel', '/admin/whatsapp']
const KORUNAN_API = '/api/whatsapp'
const WEBHOOK = '/api/whatsapp/webhook'

export async function middleware(req: NextRequest) {
  const yol = req.nextUrl.pathname

  /**
   * WhatsApp beyni yalnizca Hetzner'deki kopyada calisir (Evolution ile ayni
   * Docker agi, kendi Postgres'i). Vercel'deki pazarlama sitesi ayni depodan
   * deploy edildigi icin bu yollar orada da var olurdu; WHATSAPP_AKTIF
   * tanimli degilse yok sayiliyor ki iki panel/iki adres karisikligi olmasin.
   */
  const whatsappYolu = yol.startsWith(KORUNAN_API) || yol.startsWith('/admin/whatsapp')
  if (whatsappYolu && process.env.WHATSAPP_AKTIF !== '1') {
    return NextResponse.rewrite(new URL('/404', req.url))
  }

  if (yol.startsWith(WEBHOOK)) return NextResponse.next()

  const sayfaKorunuyor = KORUNAN_SAYFALAR.some(p => yol.startsWith(p))
  const apiKorunuyor = yol.startsWith(KORUNAN_API)
  if (!sayfaKorunuyor && !apiKorunuyor) return NextResponse.next()

  const yuk = await jetonDogrula(
    req.cookies.get(CEREZ_ADI)?.value,
    process.env.ADMIN_OTURUM_SIRRI ?? '',
  )
  if (yuk) return NextResponse.next()

  // API'de yonlendirme anlamsiz; net bir 401 don.
  if (apiKorunuyor) {
    return NextResponse.json({ ok: false, mesaj: 'Oturum gerekli' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin', req.url))
}

export const config = {
  matcher: ['/admin/panel/:path*', '/admin/whatsapp/:path*', '/api/whatsapp/:path*'],
}
