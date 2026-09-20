import { NextResponse } from 'next/server'
import { getQrCode } from '@/lib/whatsapp/evolution'

// Yetki kontrolu middleware'de (imzali oturum cerezi).

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ instanceId: string }> },
) {
  try {
    const { instanceId } = await params
    return NextResponse.json(await getQrCode(instanceId))
  } catch (err) {
    console.error('[whatsapp/qr]', err)
    return NextResponse.json({ ok: false, mesaj: 'QR alinamadi' }, { status: 502 })
  }
}
