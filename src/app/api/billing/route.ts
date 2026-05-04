import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json')

function isAdmin(req: NextRequest) {
  return req.cookies.get('zh_admin')?.value === 'zekahub_admin_ok'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })

  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))

  if (config.provider !== 'openai' && config.provider !== 'openai-compatible') {
    return NextResponse.json({ desteklenmiyor: true, mesaj: 'Bakiye sorgulama sadece OpenAI için desteklenmektedir.' })
  }

  if (!config.apiKey) {
    return NextResponse.json({ hata: true, mesaj: 'API anahtarı tanımlanmamış.' })
  }

  try {
    const res = await fetch('https://api.openai.com/dashboard/billing/credit_grants', {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json({ hata: true, mesaj: err?.error?.message || `HTTP ${res.status}` })
    }

    const data = await res.json()
    return NextResponse.json({
      toplam: data.total_granted,
      kullanilan: data.total_used,
      kalan: data.total_available,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Bağlantı hatası'
    return NextResponse.json({ hata: true, mesaj: msg })
  }
}
