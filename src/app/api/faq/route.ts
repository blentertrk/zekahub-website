import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const FAQ_PATH = path.join(process.cwd(), 'data', 'faq.json')

type FaqItem = { id: string; soru: string; cevap: string }

function readFaq(): FaqItem[] {
  return JSON.parse(readFileSync(FAQ_PATH, 'utf-8'))
}

function writeFaq(data: FaqItem[]) {
  writeFileSync(FAQ_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function isAdmin(req: NextRequest) {
  return req.cookies.get('zh_admin')?.value === 'zekahub_admin_ok'
}

export async function GET() {
  return NextResponse.json(readFaq())
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })
  const { soru, cevap } = await req.json()
  if (!soru || !cevap) return NextResponse.json({ mesaj: 'Soru ve cevap zorunlu' }, { status: 400 })
  const list = readFaq()
  const id = Date.now().toString()
  list.push({ id, soru, cevap })
  writeFaq(list)
  return NextResponse.json({ ok: true, id })
}
