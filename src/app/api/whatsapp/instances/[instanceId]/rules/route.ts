import { NextRequest, NextResponse } from 'next/server'
import { kuralOku, kuralYaz } from '@/lib/whatsapp/depo'

// Yetki kontrolu middleware'de (imzali oturum cerezi).

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ instanceId: string }> },
) {
  try {
    const { instanceId } = await params
    return NextResponse.json({ rule: await kuralOku(instanceId) })
  } catch (err) {
    console.error('[whatsapp/rules GET]', err)
    return NextResponse.json({ ok: false, mesaj: 'Kural okunamadi' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ instanceId: string }> },
) {
  try {
    const { instanceId } = await params
    const { rule } = await req.json()
    await kuralYaz(instanceId, typeof rule === 'string' ? rule : '')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[whatsapp/rules POST]', err)
    return NextResponse.json({ ok: false, mesaj: 'Kural kaydedilemedi' }, { status: 500 })
  }
}
