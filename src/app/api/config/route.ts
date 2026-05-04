import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json')

type Config = {
  provider: string
  apiKey: string
  model: string
  baseUrl: string
  sistemPrompt: string
}

function readConfig(): Config {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
}

function isAdmin(req: NextRequest) {
  return req.cookies.get('zh_admin')?.value === 'zekahub_admin_ok'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })
  const config = readConfig()
  // API key'i maskele
  return NextResponse.json({ ...config, apiKey: config.apiKey ? '••••••••' + config.apiKey.slice(-4) : '' })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })
  const body = await req.json()
  const current = readConfig()
  const updated: Config = {
    provider: body.provider ?? current.provider,
    apiKey: body.apiKey && !body.apiKey.startsWith('••••') ? body.apiKey : current.apiKey,
    model: body.model ?? current.model,
    baseUrl: body.baseUrl ?? current.baseUrl,
    sistemPrompt: body.sistemPrompt ?? current.sistemPrompt,
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return NextResponse.json({ ok: true })
}
