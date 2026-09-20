import { NextRequest, NextResponse } from 'next/server'
import { generateReply } from '@/lib/whatsapp/ai'
import { sendTextMessage } from '@/lib/whatsapp/evolution'
import { aiAnahtariniOku, kuralOku } from '@/lib/whatsapp/depo'

/**
 * Evolution API'nin gelen mesajlari bildirdigi uc.
 *
 * Tarayici oturumu yok (middleware bu yolu disarida birakiyor); bunun yerine
 * URL'deki gizli jeton dogrulanir:
 *   https://zekahub.com/api/whatsapp/webhook?jeton=<WHATSAPP_WEBHOOK_JETONU>
 * Bu adres Evolution tarafinda instance webhook'u olarak tanimlanir.
 */

function sabitSuredeEsit(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let fark = 0
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return fark === 0
}

export async function POST(req: NextRequest) {
  const beklenen = process.env.WHATSAPP_WEBHOOK_JETONU
  const gelen = req.nextUrl.searchParams.get('jeton') ?? ''
  if (!beklenen || !sabitSuredeEsit(gelen, beklenen)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const body = await req.json()

    if (body.event !== 'messages.upsert') return NextResponse.json({ ok: true })

    const data = body.data
    const key = data?.key
    const message = data?.message

    // Kendi gonderdigimiz mesajlari tekrar islemeyelim (echo guard)
    if (key?.fromMe) return NextResponse.json({ ok: true })

    const instanceId: string = body.instance
    const senderPhone: string = key?.remoteJid?.replace('@s.whatsapp.net', '') ?? ''
    const text: string = message?.conversation ?? message?.extendedTextMessage?.text ?? ''

    if (!text || !senderPhone || !instanceId) return NextResponse.json({ ok: true })

    // Bu instance icin kural tanimlanmamissa cevap verme
    const sistemPrompt = await kuralOku(instanceId)
    if (!sistemPrompt) return NextResponse.json({ ok: true })

    const aiAnahtari = await aiAnahtariniOku()
    if (!aiAnahtari) return NextResponse.json({ ok: true })

    const cevap = await generateReply(aiAnahtari, sistemPrompt, text)
    await sendTextMessage(instanceId, senderPhone, cevap)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
