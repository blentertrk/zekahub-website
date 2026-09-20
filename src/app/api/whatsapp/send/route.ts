import { NextRequest, NextResponse } from 'next/server'
import { sendTextMessage } from '@/lib/whatsapp/evolution'

// Yetki kontrolu middleware'de (imzali oturum cerezi).

export async function POST(req: NextRequest) {
  try {
    const { instanceId, phone, text } = await req.json()
    if (!instanceId || !phone || !text) {
      return NextResponse.json(
        { ok: false, mesaj: 'instanceId, phone ve text gerekli' },
        { status: 400 },
      )
    }
    return NextResponse.json(await sendTextMessage(instanceId, phone, text))
  } catch (err) {
    console.error('[whatsapp/send]', err)
    return NextResponse.json({ ok: false, mesaj: 'Mesaj gonderilemedi' }, { status: 502 })
  }
}
