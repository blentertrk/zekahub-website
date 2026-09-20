import { NextRequest, NextResponse } from 'next/server'
import { aiAnahtariniOku, aiAnahtariniYaz } from '@/lib/whatsapp/depo'

// Yetki kontrolu middleware'de (imzali oturum cerezi).
// AI anahtarinin kendisi ASLA geri donmez; sadece maskeli hali gosterilir.

function maskele(anahtar: string): string {
  if (!anahtar) return ''
  if (anahtar.length <= 8) return '••••'
  return `${anahtar.slice(0, 4)}••••${anahtar.slice(-4)}`
}

export async function GET() {
  try {
    const anahtar = await aiAnahtariniOku()
    return NextResponse.json({ aiApiKeyMasked: maskele(anahtar), hasKey: Boolean(anahtar) })
  } catch (err) {
    console.error('[whatsapp/settings GET]', err)
    return NextResponse.json({ ok: false, mesaj: 'Ayarlar okunamadi' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { aiApiKey } = await req.json()
    if (typeof aiApiKey !== 'string') {
      return NextResponse.json({ ok: false, mesaj: 'aiApiKey gerekli' }, { status: 400 })
    }
    await aiAnahtariniYaz(aiApiKey.trim())
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[whatsapp/settings POST]', err)
    return NextResponse.json({ ok: false, mesaj: 'Ayar kaydedilemedi' }, { status: 500 })
  }
}
