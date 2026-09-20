import { NextRequest, NextResponse } from 'next/server'
import { listInstances, createInstance } from '@/lib/whatsapp/evolution'

// Yetki kontrolu middleware'de yapiliyor (imzali oturum cerezi).

export async function GET() {
  try {
    return NextResponse.json(await listInstances())
  } catch (err) {
    console.error('[whatsapp/instances GET]', err)
    return NextResponse.json({ ok: false, mesaj: 'Instance listesi alinamadi' }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ ok: false, mesaj: 'Instance adi gerekli' }, { status: 400 })
    }
    return NextResponse.json(await createInstance(name))
  } catch (err) {
    console.error('[whatsapp/instances POST]', err)
    return NextResponse.json({ ok: false, mesaj: 'Instance olusturulamadi' }, { status: 502 })
  }
}
